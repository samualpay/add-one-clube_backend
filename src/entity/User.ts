import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Machine } from "./Machine";
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
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updateAt!: Date;
}
