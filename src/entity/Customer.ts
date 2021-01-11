/**
 * id: number;
  email: string | null;
  name: string | null;
  phone: string | null;
  address: string | null;
 */
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
import { Order } from "./Order";
@Entity("customer")
export class Customer {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({
    length: 128,
    nullable: false,
    unique: true,
  })
  phone!: string;
  @Column({
    length: 128,
    nullable: true,
  })
  email!: string;
  @Column({
    length: 128,
    nullable: true,
  })
  name!: string;
  @Column({
    length: 128,
    nullable: true,
  })
  address!: string;
  @OneToMany((type) => Order, (order) => order.customer, {
    cascade: true,
  })
  orders!: Order[];
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updateAt!: Date;
}
