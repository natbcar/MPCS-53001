import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("category")
export class Category {
    @PrimaryColumn()
    category_id: number;

    @Column()
    name: string;

    @Column()
    last_update: Date;
}