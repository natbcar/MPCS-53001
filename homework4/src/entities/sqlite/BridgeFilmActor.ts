import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, PrimaryColumn } from "typeorm";

@Entity("bridge_film_actor")
export class BridgeFilmActor {
    @PrimaryColumn() 
    film_key: number;

    @PrimaryColumn() 
    actor_key: number;
}