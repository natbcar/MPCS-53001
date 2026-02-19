import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Staff } from "./Staff";

@Entity("payment")
export class Payment {
    @PrimaryColumn()
    payment_id: number;

    @Column()
    customer_id: number;

    @Column()
    staff_id: number;

    @Column()
    rental_id: number;

    @Column()
    amount: number;

    @Column()
    payment_date: Date;

    @Column()
    last_update: Date;

    @ManyToOne(() => Staff)
    @JoinColumn({ name: "staff_id" })
    staff: Staff;
}