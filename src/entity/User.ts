import { Column, CreateDateColumn, Entity, Index, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;
    @Column({
        length: 128,
        nullable: false
    })
    @Index({ unique: true })
    username!: string;
    @Column({
        length: 128,
        nullable: false,
    })
    password!: string;
    @CreateDateColumn({ type: "timestamp" })
    createdAt!: Date;
    @UpdateDateColumn({ type: "timestamp" })
    updateAt!: Date

}