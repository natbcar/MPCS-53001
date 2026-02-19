import { AnalyticsSource, SakilaSource } from "./data-sources";

import { 
    // dim
    DimActor, 
    DimCategory, 
    DimCustomer, 
    DimDate,
    DimFilm, 
    DimStore,

    // bridge
    BridgeFilmActor,
    BridgeFilmCategory,

    // fact
    FactPayment,
    FactRental 
} from "./entities/sqlite";

import {
    Customer, 
    Actor, 
    Rental, 
    Payment, 
    Category, 
    Film, 
    Store, 
    FilmActor, 
    FilmCategory
} from "./entities/sakila";

import {
    loadActors,
    loadCategory,
    loadCustomer,
    loadFilm,
    loadStore,
    createFilmActorBridge,
    createFilmCategoryBridge,
    syncPaymentFact,
    syncRentalFact,
    populateDimDate
    // incrementalRentalSync
    // validateMigration
} from "./services";

async function initializeConnection() {
    console.log("Initializing connections...");
    await SakilaSource.initialize();   // Connect to MySQL
    await AnalyticsSource.initialize(); // Connect to SQLite
}


async function clearTargetTables() {
    console.log("Emptying target tables...");

    // dim tables
    await AnalyticsSource.getRepository(DimActor).clear();
    await AnalyticsSource.getRepository(DimCategory).clear(); 
    await AnalyticsSource.getRepository(DimCustomer).clear();
    await AnalyticsSource.getRepository(DimDate).clear(); 
    await AnalyticsSource.getRepository(DimFilm).clear();
    await AnalyticsSource.getRepository(DimStore).clear();

    // bridge tables
    await AnalyticsSource.getRepository(BridgeFilmActor).clear();
    await AnalyticsSource.getRepository(BridgeFilmCategory).clear();

    // fact tables
    await AnalyticsSource.getRepository(FactPayment).clear();
    await AnalyticsSource.getRepository(FactRental).clear();
}

export async function validateMigration() {
    const checkList = [
        { name: "Actors", source: Actor, target: DimActor },
        { name: "Customers", source: Customer, target: DimCustomer },
        { name: "Category", source: Category, target: DimCategory },
        { name: "Film", source: Film, target: DimFilm },
        { name: "Store", source: Store, target: DimStore },
        { name: "FilmActor", source: FilmActor, target: BridgeFilmActor },
        { name: "FilmCategory", source: FilmCategory, target: BridgeFilmCategory },
        { name: "Rentals", source: Rental, target: FactRental },
        { name: "Payments", source: Payment, target: FactPayment }
    ];

    console.log("\n=== DATA VALIDATION REPORT ===");
    console.log("Table Name      | Sakila | Analytics | Status");
    console.log("----------------------------------------------");

    for (const item of checkList) {
        const sourceCount = await SakilaSource.getRepository(item.source).count();
        const targetCount = await AnalyticsSource.getRepository(item.target).count();
        const icon = sourceCount === targetCount ? "Passed" : "Failed";
        
        console.log(
            `${item.name.padEnd(15)} | ${sourceCount.toString().padEnd(6)} | ${targetCount.toString().padEnd(9)} | ${icon}`
        );
    }
}


async function runSync(isIncremental: boolean = false) {
    
    if (!isIncremental) {
        // create dim tables
        await loadCategory();
        await loadCustomer();
        await loadFilm();
        await loadStore();

        // create bridge tables
        await createFilmActorBridge();
        await createFilmCategoryBridge();
    }
    await loadActors(isIncremental);

    

    // create fact tables
    await syncPaymentFact(isIncremental);
    await syncRentalFact(isIncremental);
}

async function startApp() {
    try {
        console.log("Starting System...");
        
        await SakilaSource.initialize();
        await AnalyticsSource.initialize();

        console.log("Sakila Entities Loaded:", SakilaSource.entityMetadatas.map(m => m.name));
        console.log("Analytics Entities Loaded:", AnalyticsSource.entityMetadatas.map(m => m.name));

        const command = process.argv[2];

        switch (command) {
            case "init":
                await AnalyticsSource.synchronize(true);
                await populateDimDate();
                console.log("Analytics Database Initialized.");
                break;

            case "full-load":
                await clearTargetTables();
                await runSync(); 
                console.log("Full Load Complete.");
                break;

            case "validate":
                await validateMigration();
                console.log("Validation complete");
                break;

            case "incremental":
                const beforeCount = await AnalyticsSource.getRepository(FactRental).count();
                await runSync(true);
                const afterCount = await AnalyticsSource.getRepository(FactRental).count();
                console.log(`Before: ${beforeCount} : After ${afterCount}`);
                break;
                
            default:
                console.log("Please provide a command: init, full-load");
        }

    } catch (err) {
        console.error("Critical Error during startup:", err);
    } finally {
        await SakilaSource.destroy();
        await AnalyticsSource.destroy();
        console.log("Connections closed.");
    }
}

startApp();
