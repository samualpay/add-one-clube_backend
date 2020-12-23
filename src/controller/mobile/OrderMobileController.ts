import { Request, Response } from "express";
import { Rout } from "type/Rout";
import BaseController from "../BaseController";
import { OrderStatus } from "../../enum/OrderStatus";
import orderService from "../../service/orderService";
type CreateProps = {
  email: string;
  publishId: number;
  preCount: number;
};
type BuyProps = {
  id: number;
  buyCount: number;
  name: string;
  phone: string;
  address: string;
};
class OrderMobileController extends BaseController {
  public path = "/api/mobile/orders";
  initRoutes(): Rout[] {
    return [
      {
        action: "/",
        method: "post",
        middleware: [],
        runner: this.create,
      },
      {
        action: "/:id",
        method: "get",
        middleware: [],
        runner: this.findById,
      },
      {
        action: "/buy",
        method: "patch",
        middleware: [],
        runner: this.buy,
      },
      // {
      //   action: "/activity/:id",
      //   method: "patch",
      //   middleware: [auth],
      //   runner: this.publishByActivityId,
      // },
    ];
  }
  private async create(req: Request, res: Response) {
    let { email, preCount, publishId }: CreateProps = req.body;
    let order = await orderService.create({ email, publishId, preCount });
    res.json(order);
  }
  private async findById(req: Request, res: Response) {
    let id: number = parseInt(req.params.id);
    let order = await orderService.findByIdForMobile(id);
    res.json(order);
  }
  private async buy(req: Request, res: Response) {
    let body: BuyProps = req.body;
    await orderService.buyForMobile(
      body.id,
      body.name,
      body.phone,
      body.address,
      body.buyCount
    );
    res.json({});
  }
}
export default OrderMobileController;
