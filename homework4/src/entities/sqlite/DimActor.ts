import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from "typeorm";

@Entity("dim_actor")
export class DimActor {
    @PrimaryGeneratedColumn() // This creates the auto-incrementing actor_key
    actor_key: number;

    @Column() // This is the ID from the MySQL Sakila DB
    actor_id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @UpdateDateColumn() // This handles the last_update timestamp automatically
    last_update: Date;
}