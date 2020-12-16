import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Activity } from "./Activity";
import { Machine } from "./Machine";
import { Publish } from "./Publish";
@Entity("user")
export class User {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({
    length: 128,
    nullable: false,
  })
  @Index({ unique: true })
  username!: string;
  @Column({
    length: 128,
    nullable: false,
  })
  password!: string;
  @OneToMany((type) => Machine, (machine) => machine.user)
  machines!: Machine[];
  @OneToMany((type) => Activity, (activity) => activity.user)
  activitys!: Activity[];
  @OneToMany((type) => Publish, (publish) => publish.user)
  publishs!: Publish[];
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updateAt!: Date;
}
