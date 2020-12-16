// { id: '111', city: 'Zhejiang', dist: 'Zhejiang', address: '111', area: '百貨公司', machineType: '戶外大型廣告面板', storeAttribute: '都會型商圈' }]
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
} from "typeorm";
import { Discount } from "./Discount";
import { User } from "./User";
@Entity("activity")
export class Activity {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({
    length: 128,
    nullable: false,
  })
  code!: string;
  @Column({
    length: 128,
    nullable: false,
  })
  imgUrl!: string;
  @Column({
    length: 128,
    nullable: true,
  })
  videoUrl!: string;
  @Column({
    length: 128,
    nullable: false,
  })
  description!: string;
  @Column({
    type: "int",
  })
  start_at!: number;
  @Column({
    type: "int",
  })
  end_at!: number;
  @Column({
    type: "int",
  })
  price!: number;
  @OneToMany((type) => Discount, (discount) => discount.activity, {
    cascade: true,
  })
  discounts!: Discount[];
  @Column({
    type: "int",
    nullable: true,
  })
  finalPrice!: number;
  @Column({
    type: "enum",
    enum: ActivityStatus,
    default: ActivityStatus.NOT_STARTED,
  })
  status!: ActivityStatus;

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
  @ManyToOne((type) => User, (user) => user.machines, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: User;
  @Column({
    nullable: true,
  })
  userId!: number;
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updateAt!: Date;
}
