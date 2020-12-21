import orderRepository from "../repository/Order";
class OrderService {
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
