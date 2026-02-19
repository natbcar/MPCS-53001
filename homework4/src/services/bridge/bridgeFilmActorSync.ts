import { FilmActor } from "../../entities/sakila/index";
import { DimActor, DimFilm, BridgeFilmActor } from "../../entities/sqlite/index";
import { AnalyticsSource, SakilaSource } from "../../data-sources";

export async function createFilmActorBridge() {
    try {
        const sakilaRepo = SakilaSource.getRepository(FilmActor);
        const filmActor = await sakilaRepo.find();
        console.log(`Extracted ${filmActor.length} rows from Sakila FilmActor table.`);

        const bridgeFilmActorRepo = AnalyticsSource.getRepository(BridgeFilmActor);
        const dimActorRepo = AnalyticsSource.getRepository(DimActor);
        const dimFilmRepo = AnalyticsSource.getRepository(DimFilm);

        for (const r of filmActor) {
            const bridge = new BridgeFilmActor();

            const actor = await dimActorRepo.findOneBy({
                actor_id: r.actor_id
            })
            const film = await dimFilmRepo.findOneBy({
                film_id: r.film_id
            })

            bridge.actor_key = actor.actor_key;
            bridge.film_key = film.film_key;

            await bridgeFilmActorRepo.save(bridge);
        }
        
        console.log("Creation of BridgeFilmActor complete!");
    } catch (err) {
        console.error("Generation Failed:", err);
    }
}