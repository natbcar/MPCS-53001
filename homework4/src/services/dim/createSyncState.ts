import { DimDate } from "../../entities/sqlite/DimDate";
import { AnalyticsSource, SakilaSource } from "../../data-sources";

export async function populateSyncState() {
    const repo = AnalyticsSource.getRepository(DimDate);
    const dates: DimDate[] = [];

    // Start from the earliest Sakila date (roughly 2005) 
    // and go to the future (2026+)
    let startDate = new Date(2005, 0, 1);
    const endDate = new Date(2026, 11, 31);

    while (startDate <= endDate) {
        const d = new DimDate();
        const yyyy = startDate.getFullYear();
        const mm = String(startDate.getMonth() + 1).padStart(2, '0');
        const dd = String(startDate.getDate()).padStart(2, '0');

        d.date_key = parseInt(`${yyyy}${mm}${dd}`);
        d.date = startDate;
        d.day_of_week = startDate.getDay();
        d.month = startDate.getMonth() + 1;
        d.quarter = Math.floor(startDate.getMonth() / 3) + 1;
        d.year = yyyy;
        d.day_of_month = startDate.getDate();
        d.is_weekend = [0, 6].includes(startDate.getDay());

        dates.push(d);
        startDate.setDate(startDate.getDate() + 1);
        
        // Save in chunks of 500 to avoid SQLite memory issues
        if (dates.length >= 500) {
            await repo.save(dates);
            dates.length = 0; 
        }
    }
    await repo.save(dates); // Save remaining
}