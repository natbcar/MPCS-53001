import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from "typeorm";

@Entity("dim_category")
export class DimCategory {
    @PrimaryGeneratedColumn() // This creates the auto-incrementing actor_key
    category_key: number;

    @Column() // This is the ID from the MySQL Sakila DB
    category_id: number;

    @Column()
    name: string;

    @UpdateDateColumn() // This handles the last_update timestamp automatically
    last_update: Date;
}