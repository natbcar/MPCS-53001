import { Entity, PrimaryGeneratedColumn, Column, UpdateDateColumn } from "typeorm";

@Entity("dim_store")
export class DimStore {
    @PrimaryGeneratedColumn() 
    store_key: number;

    @Column() 
    store_id: number;

    @Column()
    city: string;

    @Column()
    country: string;

    @UpdateDateColumn() 
    last_update: Date;
}