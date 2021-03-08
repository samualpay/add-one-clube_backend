import { Request, Response } from "express";
import { Rout } from "type/Rout";
import BaseController from "./BaseController";
import auth from "../middleware/auth";
import { OrderStatus } from "../enum/OrderStatus";
import orderService from "../service/orderService";
type CreateProps = {
  phone: string;
  publishId: number;
  preCount: number;
};
type QueryProps = {
  activityId?: string;
  machineId?: string;
  status?: OrderStatus;
};
type BuyProps = {
  id: number;
  name: string;
  address: string;
  phone: string;
  buyCount: number;
};
type PatchProps = {
  id: number;
  status: OrderStatus;
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
      {
        action: "/buy",
        method: "patch",
        middleware: [],
        runner: this.buyForMobile,
      },
      {
        action: "/",
        method: "patch",
        middleware: [auth],
        runner: this.patch,
      },
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
    let { phone, preCount, publishId }: CreateProps = req.body;
    let order = await orderService.create({ phone, publishId, preCount });
    res.json(order);
  }
  private async buyForMobile(req: Request, res: Response) {
    let { id, name, address, phone, buyCount }: BuyProps = req.body;
    let order = await orderService.buyForMobile(
      id,
      name,
      phone,
      address,
      buyCount
    );
    res.json(order);
  }
  private async patch(req: Request, res: Response) {
    let { id, status }: PatchProps = req.body;
    let order = await orderService.setOrderStatus(id, status);
    res.json(order);
  }
}
export default OrderController;
