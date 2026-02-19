import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from "typeorm";

@Entity("fact_rental")
export class FactRental {
    @PrimaryGeneratedColumn()
    fact_rental_key: number;

    @Column()
    rental_id: number;

    @Column()
    date_key_rented: number;

    @Column()
    date_key_returned: number;

    @Column()
    film_key: number;

    @Column()
    store_key: number;

    @Column()
    customer_key: number;

    @Column()
    staff_id: number;

    @Column()
    rental_duration_days: number;
}