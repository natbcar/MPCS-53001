import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { City } from "./City";

@Entity("address") // This MUST match the table name in Sakila exactly
export class Address {
    // ORM fields
    @PrimaryColumn()
    address_id: number;

    @Column()
    address: string;

    @Column()
    address2: string;

    @Column()
    district: string;

    @Column()
    postal_code: string;

    @Column()
    phone: string;

    @Column()
    location: string;

    @Column()
    last_update: Date;

    // relationships: many to one with city table
    @ManyToOne(() => City)
    @JoinColumn( {name: "city_id"})
    city: City;
}