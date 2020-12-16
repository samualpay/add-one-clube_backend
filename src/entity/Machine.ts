// { id: '111', city: 'Zhejiang', dist: 'Zhejiang', address: '111', area: '百貨公司', machineType: '戶外大型廣告面板', storeAttribute: '都會型商圈' }]
import { MachineDTO } from "dto/MachineDTO";
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
import { Publish } from "./Publish";
import { User } from "./User";
@Entity("machine")
export class Machine {
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
  city!: string;
  @Column({
    length: 128,
    nullable: false,
  })
  dist!: string;
  @Column({
    length: 128,
    nullable: false,
  })
  address!: string;
  @Column({
    length: 128,
    nullable: false,
  })
  area!: string;
  @Column({
    length: 128,
    nullable: false,
  })
  machineType!: string;
  @Column({
    length: 128,
    nullable: false,
  })
  storeAttribute!: string;
  @ManyToOne((type) => User, (user) => user.machines, {
    onDelete: "NO ACTION",
    onUpdate: "NO ACTION",
  })
  @JoinColumn({ name: "userId" })
  user!: User;
  @Column({
    nullable: true,
  })
  userId!: number;
  @OneToMany((type) => Publish, (publish) => publish.machine, {
    cascade: true,
  })
  publishs!: Publish[];
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updateAt!: Date;
}
