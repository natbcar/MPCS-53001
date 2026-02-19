import { Store } from "../../entities/sakila/index";
import { DimStore } from "../../entities/sqlite/index";
import { AnalyticsSource, SakilaSource } from "../../data-sources";


export async function loadStore() {
    
    try {
        const sakilaRepo = SakilaSource.getRepository(Store);

        const stores = await sakilaRepo.createQueryBuilder("store")
            .leftJoinAndSelect("store.address", "address")
            .leftJoinAndSelect("address.city", "city")
            .leftJoinAndSelect("city.country", "country")
            .getMany();

        console.log(`Extracted ${stores.length} stores from Sakila.`);

        const dimStoreRepo = AnalyticsSource.getRepository(DimStore);
        for (const s of stores) {
            const dim = new DimStore();

            dim.store_id = s.store_id;
            dim.city = s.address.city.city;
            dim.country = s.address.city.country.country;
            dim.last_update = s.last_update;

            await dimStoreRepo.save(dim);
        }

        console.log("Sync Complete: Stores moved to SQLite!");

    } catch (err) {
        console.error("Sync failed:", err);
    } 
}