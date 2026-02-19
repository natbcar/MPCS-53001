// import { Payment } from "../../entities/sakila/index";
// import { FactPayment, DimCustomer, DimStore } from "../../entities/sqlite/index";
// import { AnalyticsSource, SakilaSource } from "../../data-sources";

// function getDateKey(date: Date): number {
//     const yyyy = date.getFullYear();
//     const mm = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
//     const dd = String(date.getDate()).padStart(2, '0');
//     return parseInt(`${yyyy}${mm}${dd}`);
// }

// export async function createPaymentFact() {

//     try {
//         const payment = await SakilaSource.getRepository(Payment).find({
//             relations: ["staff"]
//         });
//         console.log(`Extracted ${payment.length} rows from Sakila Payment table.`);

//         const dimCustomerRepo = AnalyticsSource.getRepository(DimCustomer);
//         const dimStoreRepo = AnalyticsSource.getRepository(DimStore);
//         const dimFactPaymentRepo = AnalyticsSource.getRepository(FactPayment);

//         for (const p of payment) {
//             const fact = new FactPayment();

//             const dimCustomer = await dimCustomerRepo.findOneBy({
//                 customer_id: p.customer_id
//             })
//             const dimStore = await dimStoreRepo.findOneBy({
//                 store_id: p.staff.store_id
//             })

//             fact.payment_id = p.payment_id;
//             fact.date_key_paid = getDateKey(p.payment_date);
//             fact.customer_key = dimCustomer.customer_key;
//             fact.store_key = dimStore.store_key;
//             fact.staff_id = p.staff_id;
//             fact.amount = p.amount;

//             await dimFactPaymentRepo.save(fact);
//         }
//         console.log("Creation of FactPayment complete!");

//     } catch (err) {
//         console.error("Sync failed:", err);
//     }

// }

// -------
import { Payment } from "../../entities/sakila/index";
import { FactPayment, DimCustomer, DimStore, SyncState } from "../../entities/sqlite/index";
import { AnalyticsSource, SakilaSource } from "../../data-sources";

function getDateKey(date: Date): number {
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return parseInt(`${yyyy}${mm}${dd}`);
}

export async function syncPaymentFact(isIncremental: boolean = false) {
    try {
        const syncRepo = AnalyticsSource.getRepository(SyncState);
        const sakilaPaymentRepo = SakilaSource.getRepository(Payment);
        
        // determine cutoff
        let cutoffDate = new Date(0);
        if (isIncremental) {
            const lastSync = await syncRepo.findOneBy({ table_name: "fact_payment" });
            if (lastSync) {
                cutoffDate = lastSync.last_sync_time;
                console.log(`Incremental Payment: Fetching after ${cutoffDate.toISOString()}`);
            }
        }

        // extract data to be loaded
        const payments = await sakilaPaymentRepo.createQueryBuilder("payment")
            .leftJoinAndSelect("payment.staff", "staff")
            .where("payment.last_update > :cutoff", { cutoff: cutoffDate })
            .getMany();

        console.log(`Extracted ${payments.length} rows from Sakila Payment.`);

        if (payments.length === 0) return;

        const dimCustomerRepo = AnalyticsSource.getRepository(DimCustomer);
        const dimStoreRepo = AnalyticsSource.getRepository(DimStore);
        const dimFactPaymentRepo = AnalyticsSource.getRepository(FactPayment);

        // transform and save
        for (const p of payments) {
            const fact = new FactPayment();

            const dimCustomer = await dimCustomerRepo.findOneBy({ customer_id: p.customer_id });
            const dimStore = await dimStoreRepo.findOneBy({ store_id: p.staff.store_id });

            fact.payment_id = p.payment_id;
            fact.date_key_paid = getDateKey(p.payment_date);
            fact.customer_key = dimCustomer?.customer_key || -1;
            fact.store_key = dimStore?.store_key || -1;
            fact.staff_id = p.staff_id;
            fact.amount = p.amount;

            await dimFactPaymentRepo.save(fact);
        }

        // update the sync state
        const latestUpdate = payments.reduce((max, p) => 
            p.last_update > max ? p.last_update : max, payments[0].last_update);
            
        await syncRepo.save({ 
            table_name: "fact_payment", 
            last_sync_time: latestUpdate 
        });

        console.log("FactPayment sync complete!");

    } catch (err) {
        console.error("Payment Sync failed:", err);
    }
}