import { Order } from "../entity/Order";
import { BaseRepository } from "./BaseRepository";

class OrderRepository extends BaseRepository<Order, number> {
  constructor() {
    super(Order);
  }
}

export default new OrderRepository();
