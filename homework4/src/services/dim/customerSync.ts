import { Customer } from "../../entities/sakila/Customer";
import { DimCustomer } from "../../entities/sqlite/DimCustomer";
import { AnalyticsSource, SakilaSource } from "../../data-sources";


export async function loadCustomer() {
    
    try {
        const sakilaRepo = SakilaSource.getRepository(Customer);

        const customers = await sakilaRepo.createQueryBuilder("customer")
            .leftJoinAndSelect("customer.address", "address")
            .leftJoinAndSelect("address.city", "city")
            .leftJoinAndSelect("city.country", "country")
            .getMany();

        console.log(`Extracted ${customers.length} categories from Sakila.`);

        const dimCustomerRepo = AnalyticsSource.getRepository(DimCustomer);
        for (const c of customers) {
            const dim = new DimCustomer();

            dim.customer_id = c.customer_id;
            dim.first_name = c.first_name;
            dim.last_name = c.last_name;
            dim.active = c.active;
            dim.city = c.address.city.city;
            dim.country = c.address.city.country.country;
            dim.last_update = c.last_update;

 
            await dimCustomerRepo.save(dim);
        }

        console.log("Sync Complete: Actors moved to SQLite!");

    } catch (err) {
        console.error("Sync failed:", err);
    } 
}