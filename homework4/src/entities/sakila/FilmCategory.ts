import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Category } from "./Category";
import { Film } from "./Film";

@Entity("film_category")
export class FilmCategory {

    // fields
    @PrimaryColumn()
    film_id: number;

    @PrimaryColumn()
    category_id: number;

    @Column()
    last_update: Date;

    // relationships

    // film: many to one
    @ManyToOne(() => Film)
    @JoinColumn({ name: "film_id" })
    film: Film;

    // category: many to one
    @ManyToOne(() => Category)
    @JoinColumn({ name: "category_id" })
    category: Category;
}