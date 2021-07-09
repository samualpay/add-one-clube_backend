import {
  Column,
  CreateDateColumn,
  Entity,
  UpdateDateColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  PrimaryColumn,
} from "typeorm";
import { Activity } from "./Activity";
@Entity("activity_image")
export class ActivityImage {
  @PrimaryColumn({
    length: 128,
  })
  fileName!: string;
  @ManyToOne((type) => Activity, (activity) => activity.images, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "activityId" })
  activity!: Activity;
  @PrimaryColumn({})
  activityId!: number;
  @Column({
    nullable: false,
    default: 0,
  })
  order!: number;
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updateAt!: Date;
}
