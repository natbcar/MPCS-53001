import { Category } from "../../entities/sakila/Category";
import { DimCategory } from "../../entities/sqlite/DimCategory";
import { AnalyticsSource, SakilaSource } from "../../data-sources";

export async function loadCategory() {
    
    try {
        const sakilaCategoryRepo = SakilaSource.getRepository(Category);
        const sakilaCategories = await sakilaCategoryRepo.find();
        console.log(`Extracted ${sakilaCategories.length} categories from Sakila.`);

        const dimCategoryRepo = AnalyticsSource.getRepository(DimCategory);
        for (const sakilaCategory of sakilaCategories) {
            const dimCategory = new DimCategory();

            dimCategory.category_id = sakilaCategory.category_id;
            dimCategory.name = sakilaCategory.name;
            dimCategory.last_update = sakilaCategory.last_update;
 
            await dimCategoryRepo.save(dimCategory);
        }
 
        console.log("Sync Complete: Actors moved to SQLite!");

    } catch (err) {
        console.error("Sync failed:", err);
    } 
}