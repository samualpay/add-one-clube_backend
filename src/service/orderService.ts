import orderRepository from "../repository/Order";
import customerRepository from "../repository/Customer";
import publishRepository from "../repository/publishRepository";
import { ActivityStatus } from "../enum/ActivityStatus";
import HttpException from "../exception/HttpException";
import publishService from "./publishService";
import { OrderStatus } from "../enum/OrderStatus";
import sendEmailService from "./sendEmailService";
const ORDER_MOBILE_PAGE =
  process.env.ORDER_MOBILE_PAGE || "http://localhost:3000/mobile/order";
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
  async sendMailToCutomerByActivityId(activityId: number) {
    let orders = await orderRepository.findByActivityId(activityId);
    orders.forEach((order) => {
      sendEmailService.sendBuyLink(
        order.publish.activity.code,
        `${ORDER_MOBILE_PAGE}/${order.id}`,
        order.customer.email
      );
    });
  }
}
export default new OrderService();
