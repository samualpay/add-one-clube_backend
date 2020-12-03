// { id: '111', city: 'Zhejiang', dist: 'Zhejiang', address: '111', area: '百貨公司', machineType: '戶外大型廣告面板', storeAttribute: '都會型商圈' }]
import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  PrimaryColumn,
  ManyToOne,
  RelationId,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";
import { Activity } from "./Activity";
import { User } from "./User";
@Entity("discount")
export class Discount {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({
    type: "int",
  })
  level!: number;
  @Column({
    type: "int",
  })
  peapleCount!: number;
  @Column({
    type: "int",
  })
  percent!: number;
  @ManyToOne((type) => Activity, (activity) => activity.discounts, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn({ name: "activityId" })
  activity!: Activity;
  @Column({
    nullable: true,
  })
  activityId!: number;
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updateAt!: Date;
}
