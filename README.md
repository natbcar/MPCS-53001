Run these commands from the homework4 directory of the project:

`npx ts-node src/index.ts init` — Creates the SQLite schema and populates the static DimDate table.

`npx ts-node src/index.ts full-load` — Wipes all SQLite tables and performs a complete migration from Sakila.

`npx ts-node src/index.ts validate`  — Generates a report comparing row counts between Sakila and Analytics.

`npx ts-node src/index.ts incremental` incremental — Syncs only new or updated records since the last successful load.
