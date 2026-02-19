import { Entity, Column, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity("dim_film")
export class DimFilm {
    @PrimaryGeneratedColumn()
    film_key: number;

    @Column()
    film_id: number;

    @Column()
    title: string;

    @Column()
    rating: string;

    @Column()
    length: number;

    @Column()
    language: string;

    @Column()
    release_year: number;

    @UpdateDateColumn()
    last_update: Date;
}