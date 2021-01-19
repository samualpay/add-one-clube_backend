// { id: '111', city: 'Zhejiang', dist: 'Zhejiang', address: '111', area: '百貨公司', machineType: '戶外大型廣告面板', storeAttribute: '都會型商圈' }]
import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
} from "typeorm";
import { LogLevel } from "../enum/LogLevel";
@Entity("log")
export class Log {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({
    type: "enum",
    enum: LogLevel,
  })
  level!: LogLevel;
  @Column({
    length: 128,
    nullable: true,
  })
  key!: string;
  @Column({
    type: "text",
    nullable: true,
  })
  content!: string;
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updateAt!: Date;
}
