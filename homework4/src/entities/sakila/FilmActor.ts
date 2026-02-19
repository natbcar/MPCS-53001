import { Entity, Column, PrimaryColumn, ManyToOne, JoinColumn } from "typeorm";
import { Actor } from "./Actor";
import { Film } from "./Film";

@Entity("film_actor")
export class FilmActor {
    
    // fields
    @PrimaryColumn()
    actor_id: number;

    @PrimaryColumn()
    film_id: number;

    @Column()
    last_update: Date;

    // relationships
    // film: many to one
    @ManyToOne(() => Film)
    @JoinColumn({ name: "film_id" })
    film: Film;

    // category: many to one
    @ManyToOne(() => Actor)
    @JoinColumn({ name: "actor_id" })
    actor: Actor;
}