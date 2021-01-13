import { OrderStatus } from "enum/OrderStatus";
import { FindConditions } from "typeorm";
import { Order } from "../entity/Order";
import { BaseRepository } from "./BaseRepository";

class OrderRepository extends BaseRepository<Order, number> {
  constructor() {
    super(Order);
  }
  async findByIdWithRelation(id: number) {
    let result = await this.getRepository().findOne({
      relations: [
        "publish",
        "publish.activity",
        "customer",
        "publish.machine",
        "publish.activity.images",
        "publish.activity.videos",
      ],
      where: { id },
    });
    return result;
  }
  findByActivityId(activityId: number) {
    let query = this.getRepository()
      .createQueryBuilder("order")
      .innerJoinAndSelect("order.publish", "publish")
      .innerJoinAndSelect("order.customer", "customer")
      .innerJoinAndSelect("publish.activity", "activity")
      .where("publish.activityId = :activityId", { activityId });
    return query.getMany();
  }
  query({
    userId,
    activityId,
    machineId,
    status,
  }: {
    userId: number;
    activityId?: number;
    machineId?: number;
    status?: OrderStatus;
  }) {
    let query = this.getRepository()
      .createQueryBuilder("order")
      .innerJoinAndSelect("order.publish", "publish")
      .innerJoinAndSelect("order.customer", "customer")
      .innerJoinAndSelect("publish.machine", "machine")
      .innerJoinAndSelect("publish.activity", "activity")
      .where("publish.userId = :userId", { userId });
    if (activityId) {
      query = query.andWhere("publish.activityId = :activityId", {
        activityId,
      });
    }
    if (machineId) {
      query = query.andWhere("publish.machineId = :machineId", { machineId });
    }
    if (status) {
      query = query.andWhere("order.status = :status", { status });
    }
    return query.getMany();
  }
}

export default new OrderRepository();
