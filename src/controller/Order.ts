import { Request, Response } from "express";
import { Rout } from "type/Rout";
import BaseController from "./BaseController";
import auth from "../middleware/auth";
import { OrderStatus } from "../enum/OrderStatus";
import orderService from "../service/orderService";
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
      activityId: activityIdStr,
      machineId: machineIdStr,
      status,
    }: QueryProps = req.query;
    let activityId: number | undefined;
    let machineId: number | undefined;
    if (activityIdStr) {
      activityId = parseInt(activityIdStr);
    }
    if (machineIdStr) {
      machineId = parseInt(machineIdStr);
    }
    let list = await orderService.find(userId, {
      activityId,
      machineId,
      status,
    });
    res.json({ list });
  }
  private async create(req: Request, res: Response) {
    let { email, preCount, publishId }: CreateProps = req.body;
    let order = await orderService.create({ email, publishId, preCount });
    res.json(order);
  }
}
export default OrderController;
