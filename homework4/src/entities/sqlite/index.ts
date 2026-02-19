// Dim tables
export * from "./DimActor";
export * from "./DimCategory";
export * from "./DimCustomer";
export * from "./DimDate";
export * from "./DimFilm";
export * from "./DimStore";

// Bridge tables
export * from "./BridgeFilmActor";
export * from "./BridgeFilmCategory";

// Fact tables
export * from "./FactPayment";
export * from "./FactRental";

// Sync table
export * from "./SyncState";