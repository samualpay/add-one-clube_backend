// { id: '111', city: 'Zhejiang', dist: 'Zhejiang', address: '111', area: '百貨公司', machineType: '戶外大型廣告面板', storeAttribute: '都會型商圈' }]
import { ActivityStatus } from "../enum/ActivityStatus";
import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToMany,
  Unique,
} from "typeorm";
import { Discount } from "./Discount";
import { User } from "./User";
import { Publish } from "./Publish";
import { ActivityImage } from "./ActivityImage";
import { ActivityVideo } from "./ActivityVideo";
@Entity("activity")
@Unique("userId_code", ["code", "userId"])
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
    default: "",
  })
  name!: string;
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
  pay_end_at!: number;
  @Column({
    type: "int",
  })
  price!: number;
  @Column({
    type: "int",
    nullable: true,
  })
  total_count!: number;
  @OneToMany(
    (type) => ActivityImage,
    (activityImage) => activityImage.activity,
    {
      cascade: true,
    }
  )
  images!: ActivityImage[];
  @OneToMany(
    (type) => ActivityVideo,
    (activityVideo) => activityVideo.activity,
    {
      cascade: true,
    }
  )
  videos!: ActivityVideo[];
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
  preorderProductItem!: number;

  @Column({
    type: "int",
    default: 0,
    nullable: false,
  })
  buyCount!: number;
  @ManyToOne((type) => User, (user) => user.machines, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn({ name: "userId" })
  user!: User;
  @Column({
    nullable: true,
  })
  userId!: number;

  @OneToMany((type) => Publish, (publish) => publish.activity, {
    cascade: true,
  })
  publishs!: Publish[];
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updateAt!: Date;
}
