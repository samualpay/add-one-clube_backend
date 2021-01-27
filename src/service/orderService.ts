import orderRepository from "../repository/Order";
import customerRepository from "../repository/Customer";
import publishRepository from "../repository/publishRepository";
import { ActivityStatus } from "../enum/ActivityStatus";
import HttpException from "../exception/HttpException";
import publishService from "./publishService";
import { OrderStatus } from "../enum/OrderStatus";
import sendEmailService from "./sendEmailService";
import { Order } from "../entity/Order";
import sendSMSService from "./sendSMSService";
const ORDER_MOBILE_PAGE =
  process.env.ORDER_MOBILE_PAGE || "http://localhost:3000/mobile/order";
type CreateProps = {
  phone: string;
  publishId: number;
  preCount: number;
};
type QueryProps = {
  activityId?: number;
  machineId?: number;
  status?: OrderStatus;
};
class OrderService {
  onCreateValid({ phone, publishId, preCount }: CreateProps) {
    if (!/^09[0-9]{8}$/.test(phone)) {
      throw new HttpException(400, "電話號碼格式錯誤");
    }
    if (!preCount || preCount <= 0) {
      throw new HttpException(400, "預約數量錯誤");
    }
  }
  async find(userId: number, { activityId, machineId, status }: QueryProps) {
    let list = await orderRepository.query({
      userId,
      activityId,
      machineId,
      status,
    });
    return list;
  }
  async create({ phone, publishId, preCount }: CreateProps) {
    this.onCreateValid({ phone, publishId, preCount });
    let customer = await customerRepository.findOne({ where: { phone } });
    if (!customer) {
      customer = customerRepository.create({ phone });
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
    sendSMSService.sendPreorderSMS(publish.activity.code, phone);
    return order;
  }
  async sendSMSToCustomerByActivityId(activityId: number) {
    let orders = await orderRepository.findByActivityId(activityId);
    orders.forEach((order) => {
      sendSMSService.sendBuyLink(
        order.publish.activity.code,
        order.publish.activity.name,
        order.publish.activity.finalPrice,
        `${ORDER_MOBILE_PAGE}/${order.id}`,
        order.customer.phone
      );
    });
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
  private checkOrderCanBuy(order?: Order): Order {
    if (
      !order ||
      order.status !== OrderStatus.PREORDER ||
      order.publish.activity.status !== ActivityStatus.END
    ) {
      throw new HttpException(400, "訂單異常");
    } else {
      return order;
    }
  }
  async findByIdForMobile(id: number) {
    let order = await orderRepository.findByIdWithRelation(id);
    // this.checkOrderCanBuy(order);
    return order;
  }
  async buyForMobile(
    id: number,
    name: string,
    email: string,
    address: string,
    buyCount: number
  ) {
    let order = this.checkOrderCanBuy(
      await orderRepository.findByIdWithRelation(id)
    );
    let customer = order.customer;
    customer.name = name;
    customer.email = email;
    customer.address = address;
    order.buyCount = buyCount;
    order.totalPrice = buyCount * order.publish.activity.finalPrice;
    //todo need change when payment implement
    order.status = OrderStatus.PAID;
    order.customer = customer;
    order = await orderRepository.save(order);
    customer = await customerRepository.save(customer);
    sendSMSService.sendAfterBuySMS(
      customer.phone,
      order.publish.activity.code,
      order.publish.activity.name,
      order.buyCount,
      order.totalPrice,
      customer.address,
      `${ORDER_MOBILE_PAGE}/finish/${order.id}`
    );
    sendEmailService.sendAfterBuyEmail(
      customer.email,
      order.publish.activity.code,
      order.publish.activity.name,
      order.buyCount,
      order.totalPrice,
      customer.address,
      `${ORDER_MOBILE_PAGE}/finish/${order.id}`
    );
  }
}
export default new OrderService();
