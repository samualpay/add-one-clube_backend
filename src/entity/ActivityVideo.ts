import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  JoinColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";
import { Activity } from "./Activity";
@Entity("activity_video")
export class ActivityVideo {
  @PrimaryColumn({
    length: 128,
  })
  fileName!: string;
  @ManyToOne((type) => Activity, (activity) => activity.videos, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "activityId" })
  activity!: Activity;
  @PrimaryColumn()
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
