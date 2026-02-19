import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("staff")
export class Staff {
    @PrimaryColumn()
    staff_id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    address_id: number;

    @Column()
    email: string;

    @Column()
    store_id: number;

    @Column()
    active: boolean;

    @Column()
    username: string;

    @Column()
    password: string;

    @Column()
    last_update: Date;
}