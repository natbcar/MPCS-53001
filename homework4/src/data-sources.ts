import "reflect-metadata";
import { DataSource } from "typeorm";

// Sakila Entities
import { Actor } from "./entities/sakila/Actor";
import { Address } from "./entities/sakila/Address";
import { Category } from "./entities/sakila/Category";
import { City } from "./entities/sakila/City";
import { Country } from "./entities/sakila/Country";
import { Customer } from "./entities/sakila/Customer";
import { Film } from "./entities/sakila/Film";
import { FilmActor } from "./entities/sakila/FilmActor";
import { FilmCategory } from "./entities/sakila/FilmCategory";
import { Inventory } from "./entities/sakila/Inventory";
import { Language } from "./entities/sakila/Language";
import { Payment } from "./entities/sakila/Payment";
import { Rental } from "./entities/sakila/Rental";
import { Staff } from "./entities/sakila/Staff";
import { Store } from "./entities/sakila/Store";

// SQLite Entities
import { BridgeFilmActor } from "./entities/sqlite/BridgeFilmActor";
import { BridgeFilmCategory } from "./entities/sqlite/BridgeFilmCategory";
import { DimActor } from "./entities/sqlite/DimActor";
import { DimCategory } from "./entities/sqlite/DimCategory";
import { DimCustomer } from "./entities/sqlite/DimCustomer";
import { DimDate } from "./entities/sqlite/DimDate";
import { DimFilm } from "./entities/sqlite/DimFilm";
import { DimStore } from "./entities/sqlite/DimStore";
import { FactPayment } from "./entities/sqlite/FactPayment";
import { FactRental } from "./entities/sqlite/FactRental";
import { SyncState } from "./entities/sqlite/SyncState";

export const SakilaSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "1935723Nbc!",
    database: "sakila",
    entities: [Actor, Address, Category, City, Country, Customer, Film, FilmActor, FilmCategory, Inventory, Language, Payment, Rental, Staff, Store], // We will add MySQL entities here
    synchronize: false, // NEVER set this to true for an existing DB like Sakila
});

export const AnalyticsSource = new DataSource({
    type: "sqlite",
    database: "analytics.sqlite",
    entities: [BridgeFilmActor, BridgeFilmCategory, DimActor, DimCategory, DimCustomer, DimDate, DimFilm, DimStore, FactPayment, FactRental, SyncState], // We will add SQLite entities here
    synchronize: true, // This will automatically create the tables for you!
    logging: false,
});