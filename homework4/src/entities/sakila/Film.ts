import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Language } from "./Language";

@Entity("film")
export class Film {
    // fields
    @PrimaryColumn()
    film_id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @Column()
    release_year: number;

    @Column()
    language_id: number;

    @Column()
    original_language_id: number;

    @Column()
    rental_duration: number;

    @Column()
    rental_rate: number;

    @Column()
    length: number;

    @Column()
    replacement_cost: number;

    @Column()
    rating: string;

    @Column()
    special_features: string;

    @Column()
    last_update: Date;

    // relations
    @ManyToOne(() => Language)
    @JoinColumn({ name: "language_id"} )
    language: Language;
}