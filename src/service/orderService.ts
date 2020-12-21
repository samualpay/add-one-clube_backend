import orderRepository from "../repository/Order";
import customerRepository from "../repository/Customer";
import publishRepository from "../repository/publishRepository";
import { ActivityStatus } from "../enum/ActivityStatus";
import HttpException from "../exception/HttpException";
import publishService from "./publishService";
import { OrderStatus } from "../enum/OrderStatus";
type CreateProps = {
  email: string;
  publishId: number;
  preCount: number;
};
type QueryProps = {
  activityId?: number;
  machineId?: number;
  status?: OrderStatus;
};
class OrderService {
  async find(userId: number, { activityId, machineId, status }: QueryProps) {
    let list = await orderRepository.query({
      userId,
      activityId,
      machineId,
      status,
    });
    return list;
  }
  async create({ email, publishId, preCount }: CreateProps) {
    let customer = await customerRepository.findOne({ where: { email } });
    if (!customer) {
      customer = customerRepository.create({ email });
      customer = await customerRepository.save(customer);
    }
    let publish = await publishRepository.findByIdWithRelation(publishId);
    if (!publish || publish.activity.status !== ActivityStatus.START) {
      throw new HttpException(400, "活動不存在");
    }
    let order = orderRepository.create({
      preCount,
      publish,
      customerId: customer.id,
    });
    order = await orderRepository.save(order);
    await publishService.updateCount({ publishId });
    return order;
  }
  async updateOrderPriceByActivityId(activityId: number, finalPrice?: number) {
    let orders = await orderRepository.findByActivityId(activityId);
    orders = orders.map((order) => {
      if (finalPrice) {
        order.totalPrice = order.buyCount * finalPrice;
      } else {
        order.totalPrice = order.buyCount * order.publish.activity.finalPrice;
      }
      return order;
    });

    orders = await orderRepository.bulkSave(orders);
    return orders;
  }
}
export default new OrderService();
