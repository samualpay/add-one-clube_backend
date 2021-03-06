/**
 *   id: number;
  activity: ActivityApiDto;
  machine: MachineApiDto;
  linkCount: number;
  registeredCount: number;
  url: string;
  publish: boolean;
 */
import { ActivityStatus } from "../enum/ActivityStatus";
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
  OneToMany,
  Unique,
} from "typeorm";
import { User } from "./User";
import { Machine } from "./Machine";
import { Activity } from "./Activity";
import { Order } from "./Order";
@Entity("publish")
@Unique("machineId_activityId", ["machineId", "activityId"])
export class Publish {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    type: "int",
    default: 0,
    nullable: false,
  })
  linkCount!: number;

  @Column({
    type: "int",
    default: 0,
    nullable: false,
  })
  registeredCount!: number;

  @Column({
    type: "int",
    default: 0,
    nullable: false,
  })
  buyCount!: number;
  @Column({
    type: "bool",
    default: false,
    nullable: false,
  })
  publish!: boolean;
  // user
  @ManyToOne((type) => User, (user) => user.publishs, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: User;
  @Column({
    nullable: true,
  })
  userId!: number;

  // machine
  @ManyToOne((type) => Machine, (machine) => machine.publishs, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "machineId" })
  machine!: Machine;
  @Column({
    nullable: true,
  })
  machineId!: number;
  // activity
  @ManyToOne((type) => Activity, (activity) => activity.publishs, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "activityId" })
  activity!: Activity;
  @Column({
    nullable: true,
  })
  activityId!: number;
  @OneToMany((type) => Order, (order) => order.publish, {
    cascade: true,
  })
  orders!: Order[];
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updateAt!: Date;
}
