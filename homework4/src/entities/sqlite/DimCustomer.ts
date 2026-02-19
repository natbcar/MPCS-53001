import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from "typeorm";

@Entity("dim_customer")
export class DimCustomer {
    @PrimaryGeneratedColumn() // This creates the auto-incrementing actor_key
    customer_key: number;

    @Column() // This is the ID from the MySQL Sakila DB
    customer_id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    active: boolean;

    @Column()
    city: string;

    @Column()
    country: string;

    @UpdateDateColumn() // This handles the last_update timestamp automatically
    last_update: Date;
}