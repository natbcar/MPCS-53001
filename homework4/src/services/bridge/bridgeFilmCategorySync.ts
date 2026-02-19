import { FilmCategory } from "../../entities/sakila/index";
import { DimCategory, DimFilm, BridgeFilmCategory } from "../../entities/sqlite/index";
import { AnalyticsSource, SakilaSource } from "../../data-sources";

export async function createFilmCategoryBridge() {
    try {
        const sakilaRepo = SakilaSource.getRepository(FilmCategory);
        const filmCategory = await sakilaRepo.find();
        console.log(`Extracted ${filmCategory.length} rows from Sakila FilmCategory table.`);

        const bridgeFilmCategoryRepo = AnalyticsSource.getRepository(BridgeFilmCategory);
        const dimCategoryRepo = AnalyticsSource.getRepository(DimCategory);
        const dimFilmRepo = AnalyticsSource.getRepository(DimFilm);

        for (const r of filmCategory) {
            const bridge = new BridgeFilmCategory();

            const category = await dimCategoryRepo.findOneBy({
                category_id: r.category_id
            })
            const film = await dimFilmRepo.findOneBy({
                film_id: r.film_id
            })

            bridge.category_key = category.category_key;
            bridge.film_key = film.film_key;

            await bridgeFilmCategoryRepo.save(bridge);

            // const finalCount = await bridgeFilmCategoryRepo.count();
            // console.log(`Verified: ${finalCount} rows now exist in SQLite.`);
        }
        
        console.log("Creation of BridgeFilmCategory complete!");
    } catch (err) {
        console.error("Generation Failed:", err);
    }
}