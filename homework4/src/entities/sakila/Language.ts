import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("language")
export class Language {
    @PrimaryColumn()
    language_id: number;

    @Column()
    name: string;

    @Column()
    last_update: Date;
}