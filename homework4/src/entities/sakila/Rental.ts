import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Inventory, Staff } from "./index";

@Entity("rental")
export class Rental {
    @PrimaryColumn()
    rental_id: number;

    @Column()
    rental_date: Date;

    @Column()
    inventory_id: number;

    @Column()
    customer_id: number;

    @Column()
    return_date: Date;

    @Column()
    staff_id: number;

    @Column()
    last_update: Date;

    @ManyToOne(() => Staff)
    @JoinColumn({ name: "staff_id" })
    staff: Staff;

    @ManyToOne(() => Inventory)
    @JoinColumn({ name: "inventory_id"})
    inventory: Inventory;
}