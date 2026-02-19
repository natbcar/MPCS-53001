import { Actor } from "../../entities/sakila/Actor";
import { DimActor, SyncState } from "../../entities/sqlite/index";
import { AnalyticsSource, SakilaSource } from "../../data-sources";

export async function loadActors(isIncremental: boolean = false) {
    
    try {

        const syncRepo = AnalyticsSource.getRepository(SyncState);
        
        // choose cut off date
        let cutoffDate = new Date(0);
        if (isIncremental) {
            const lastSync = await syncRepo.findOneBy({ table_name: "dim_actor" });
            if (lastSync) {
                cutoffDate = lastSync.last_sync_time;
                console.log(`Incremental mode: Fetching rows updated after ${cutoffDate.toISOString()}`);
            }
        }

        const sakilaActorRepo = SakilaSource.getRepository(Actor);
        const sakilaActors = await sakilaActorRepo.createQueryBuilder("actor")
            .where("actor.last_update > :cutoff", { cutoff: cutoffDate })
            .getMany();
        console.log(`Extracted ${sakilaActors.length} actors from Sakila.`);

        if (sakilaActors.length == 0) return;

        const dimActorRepo = AnalyticsSource.getRepository(DimActor);
        for (const sakilaActor of sakilaActors) {
            const dimActor = new DimActor();

            dimActor.actor_id = sakilaActor.actor_id; 
            dimActor.first_name = sakilaActor.first_name;
            dimActor.last_name = sakilaActor.last_name;
 
            await dimActorRepo.save(dimActor);
        }

        // update sync state table
        const latestUpdate = sakilaActors.reduce((max, a) => 
            a.last_update > max ? a.last_update : max, sakilaActors[0].last_update);
            
        
        await syncRepo.save({
            table_name: "dim_actor",
            last_sync_time: latestUpdate
        });

        console.log("Sync Complete: Actors moved to SQLite!");

    } catch (err) {
        console.error("Sync failed:", err);
    } 
}