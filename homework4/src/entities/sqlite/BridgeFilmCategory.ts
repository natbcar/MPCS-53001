import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn, PrimaryColumn } from "typeorm";

@Entity("bridge_film_category")
export class BridgeFilmCategory {
    @PrimaryColumn() 
    film_key: number;

    @PrimaryColumn() 
    category_key: number;
}