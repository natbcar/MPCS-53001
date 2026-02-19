import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("sync_state")
export class SyncState {
    @PrimaryColumn()
    table_name: string;

    @Column()
    last_sync_time: Date;
}