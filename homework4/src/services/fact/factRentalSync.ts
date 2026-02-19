import { Rental } from "../../entities/sakila/index";
import { FactRental, DimCustomer, DimStore, DimFilm, SyncState } from "../../entities/sqlite/index";
import { AnalyticsSource, SakilaSource } from "../../data-sources";

function getDateKey(date: Date | null | undefined): number {
    if (!date) return -1; // Or any value your DimDate uses for "N/A"
    
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return parseInt(`${yyyy}${mm}${dd}`);
}

export async function syncRentalFact(isIncremental: boolean = false) {
    try {
        const syncRepo = AnalyticsSource.getRepository(SyncState);
        const rentalRepo = SakilaSource.getRepository(Rental);
        
        // choose cut off date
        let cutoffDate = new Date(0);
        if (isIncremental) {
            const lastSync = await syncRepo.findOneBy({ table_name: "fact_rental" });
            if (lastSync) {
                cutoffDate = lastSync.last_sync_time;
                console.log(`Incremental mode: Fetching rows updated after ${cutoffDate.toISOString()}`);
            }
        }

        // extract data to by loaded
        const rentalData = await rentalRepo.createQueryBuilder("rental")
            .leftJoinAndSelect("rental.inventory", "inventory")
            .leftJoinAndSelect("inventory.film", "film")
            .leftJoinAndSelect("rental.staff", "staff")
            .select([
                "rental.rental_id",
                "rental.rental_date",
                "rental.return_date",
                "rental.customer_id",
                "rental.staff_id",
                "rental.last_update", // Need this for the watermark!
                "staff.store_id",
                "inventory.inventory_id", 
                "film.film_id"             
            ])
            .where("rental.last_update > :cutoff", { cutoff: cutoffDate })
            .getMany();

        console.log(`Extracted ${rentalData.length} rows from Sakila.`);

        if (rentalData.length === 0) return;

        const dimCustomerRepo = AnalyticsSource.getRepository(DimCustomer);
        const dimStoreRepo = AnalyticsSource.getRepository(DimStore);
        const dimFilmRepo = AnalyticsSource.getRepository(DimFilm);
        const dimFactRentalRepo = AnalyticsSource.getRepository(FactRental);

        for (const r of rentalData) {
            const fact = new FactRental();

            const dimCustomer = await dimCustomerRepo.findOneBy({ customer_id: r.customer_id });
            const dimStore = await dimStoreRepo.findOneBy({ store_id: r.staff.store_id });
            const dimFilm = await dimFilmRepo.findOneBy({ film_id: r.inventory.film.film_id });

            fact.rental_id = r.rental_id;
            fact.date_key_rented = getDateKey(r.rental_date);
            fact.date_key_returned = getDateKey(r.return_date);
            fact.film_key = dimFilm?.film_key || -1;
            fact.store_key = dimStore?.store_key || -1;
            fact.customer_key = dimCustomer?.customer_key || -1;
            fact.staff_id = r.staff_id;

            if (r.return_date && r.rental_date) {
                const diffTime = Math.abs(r.return_date.getTime() - r.rental_date.getTime());
                fact.rental_duration_days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            } else {
                fact.rental_duration_days = 0;
            }

            await dimFactRentalRepo.save(fact);
        }

        // update sync state table
        const latestUpdate = rentalData.reduce((max, r) => 
            r.last_update > max ? r.last_update : max, rentalData[0].last_update);
            
        await syncRepo.save({
            table_name: "fact_rental",
            last_sync_time: latestUpdate
        });
    
        console.log("FactRental sync complete!");

    } catch (err) {
        console.error("Sync failed:", err);
    }
}