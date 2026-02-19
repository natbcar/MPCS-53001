import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { Address } from "./Address";

@Entity("customer")
export class Customer {
    
    // fields
    @PrimaryColumn()
    customer_id: number;

    @Column()
    store_id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    email: string;

    @Column()
    active: boolean;

    @Column()
    create_date: Date;

    @Column()
    last_update: Date;

    // relationships:
    @ManyToOne(() => Address)
    @JoinColumn({ name: "address_id" })
    address: Address;
}