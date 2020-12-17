/**
 * id: number;
  publish: PublishApiDto;
  customer: CustomerDto;
  preCount: number | null;
  buyCount: number | null;
  totalPrice: number | null;
  status: "preorder" | "paid" | "finish";
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
  Unique,
} from "typeorm";
import { Publish } from "./Publish";
import { User } from "./User";
import { OrderStatus } from "../enum/OrderStatus";
import { Customer } from "./Customer";
@Entity("order")
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;
  @Column({
    type: "int",
    nullable: false,
  })
  preCount!: number;
  @Column({
    type: "int",
    nullable: true,
  })
  buyCount!: number;
  @Column({
    type: "int",
    nullable: true,
  })
  totalPrice!: number;
  @Column({
    type: "enum",
    enum: OrderStatus,
    default: OrderStatus.PREORDER,
  })
  status!: OrderStatus;
  //publish
  @ManyToOne((type) => Publish, (publish) => publish.orders, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "publishId" })
  publish!: Publish;
  @Column({
    nullable: false,
  })
  publishId!: number;
  //customer
  @ManyToOne((type) => Customer, (customer) => customer.orders, {
    onDelete: "CASCADE",
  })
  @JoinColumn({ name: "customerId" })
  customer!: Customer;
  @Column({
    nullable: false,
  })
  customerId!: number;
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: Date;
  @UpdateDateColumn({ type: "timestamp" })
  updateAt!: Date;
}
