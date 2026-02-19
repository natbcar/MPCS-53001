import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from "typeorm";

@Entity("fact_payment")
export class FactPayment {
    @PrimaryGeneratedColumn()
    fact_payment_key: number;

    @Column()
    payment_id: number;

    @Column()
    date_key_paid: number;

    @Column()
    customer_key: number;

    @Column()
    store_key: number;

    @Column()
    staff_id: number;

    @Column()
    amount: number;
}