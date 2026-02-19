import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("actor") // This MUST match the table name in Sakila exactly
export class Actor {
    @PrimaryColumn()
    actor_id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    last_update: Date;
}