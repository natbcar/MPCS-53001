import { Film } from "../../entities/sakila/index";
import { DimFilm } from "../../entities/sqlite/index";
import { AnalyticsSource, SakilaSource } from "../../data-sources";


export async function loadFilm() {
    
    try {
        const sakilaRepo = SakilaSource.getRepository(Film);

        const films = await sakilaRepo.createQueryBuilder("film")
            .leftJoinAndSelect("film.language", "language")
            .getMany();

        console.log(`Extracted ${films.length} categories from Sakila.`);

        const dimFilmRepo = AnalyticsSource.getRepository(DimFilm);
        for (const f of films) {
            const dim = new DimFilm();

            dim.film_id = f.film_id;
            dim.title = f.title;
            dim.rating = f.rating;
            dim.length = f.length;
            dim.language = f.language.name;
            dim.release_year = f.release_year;
            dim.last_update = f.last_update;

            await dimFilmRepo.save(dim);
        }

        console.log("Sync Complete: Films moved to SQLite!");

    } catch (err) {
        console.error("Sync failed:", err);
    } 
}