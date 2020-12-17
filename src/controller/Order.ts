import { Request, Response } from "express";
import { Rout } from "type/Rout";
import BaseController from "./BaseController";
import auth from "../middleware/auth";
import { OrderStatus } from "../enum/OrderStatus";
import orderRepository from "../repository/Order";
import customerRepository from "../repository/Customer";
import publishRepository from "../repository/Publish";
import { ActivityStatus } from "../enum/ActivityStatus";
import HttpException from "../exception/HttpException";
type CreateProps = {
  email: string;
  publishId: number;
  preCount: number;
};
type QueryProps = {
  activityId?: string;
  machineId?: string;
  status?: OrderStatus;
};
class OrderController extends BaseController {
  public path = "/api/orders";
  initRoutes(): Rout[] {
    return [
      {
        action: "/",
        method: "get",
        middleware: [auth],
        runner: this.find,
      },
      {
        action: "/",
        method: "post",
        middleware: [],
        runner: this.create,
      },
      // {
      //   action: "/:id",
      //   method: "delete",
      //   middleware: [auth],
      //   runner: this.delete,
      // },
      // {
      //   action: "/:id",
      //   method: "patch",
      //   middleware: [auth],
      //   runner: this.publish,
      // },
      // {
      //   action: "/activity/:id",
      //   method: "patch",
      //   middleware: [auth],
      //   runner: this.publishByActivityId,
      // },
    ];
  }

  private async find(req: Request, res: Response) {
    let userId = req.userId;
    let {
      activityId: activityStr,
      machineId: machineIdStr,
      status,
    }: QueryProps = req.query;
    let publish: { userId: number; activityId?: number; machineId?: number } = {
      userId,
    };
    let activityId: number | undefined;
    let machineId: number | undefined;
    if (activityStr) {
      activityId = parseInt(activityStr);
    }
    if (machineIdStr) {
      machineId = parseInt(machineIdStr);
    }
    let list = await orderRepository.query({
      userId,
      activityId,
      machineId,
      status,
    });
    res.json({ list });
  }
  private async create(req: Request, res: Response) {
    let { email, preCount, publishId }: CreateProps = req.body;
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
    res.json(order);
  }
}
export default OrderController;
