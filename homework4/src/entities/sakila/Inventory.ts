import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Film } from "./index";

@Entity("inventory")
export class Inventory {
    @PrimaryColumn()
    inventory_id: number;

    @Column()
    film_id: number;

    @Column()
    store_id: number;

    @Column()
    last_update: Date;

    @ManyToOne(() => Film)
    @JoinColumn({ name: "film_id"})
    film: Film;
}