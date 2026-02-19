import { Entity, PrimaryColumn, Column, JoinColumn, ManyToOne } from "typeorm";
import { Country } from "./Country";

@Entity("city")
export class City {
    @PrimaryColumn()
    city_id: number;

    @Column()
    city: string;

    @Column()
    country_id: number;

    @Column()
    last_update: Date;

    // relationships: many to one with country table
    @ManyToOne(() => Country)
    @JoinColumn({ name: "country_id"})
    country: Country;

}