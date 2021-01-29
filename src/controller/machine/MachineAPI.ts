import { Request, Response } from "express";
import authForMachine from "../../middleware/authForMachine";
import activityService from "../../service/activityService";
import machineService from "../../service/machineService";
import orderService from "../../service/orderService";
import userService from "../../service/userService";
import { Rout } from "../../type/Rout";
import BaseController from "../BaseController";
type LoginProps = {
  username: string;
  password: string;
  code: string;
};
type activitysProps = {
  userId: number;
  machineId: number;
};
class MachineApiController extends BaseController {
  public path = "/machineApi";
  initRoutes(): Rout[] {
    return [
      {
        action: "/login",
        method: "post",
        middleware: [],
        runner: this.login,
      },
      {
        action: "/activitys",
        method: "get",
        middleware: [authForMachine],
        runner: this.activitys,
      },
    ];
  }
  private async login(req: Request, res: Response) {
    let { username, password, code }: LoginProps = req.body;
    let token = await userService.machineLogin({ username, password, code });
    res.json({ token });
  }
  private async activitys(req: Request, res: Response) {
    let { machineId }: activitysProps = req.meta;
    let result = await activityService.findPublishActivitysForMachine(
      machineId
    );
    res.json(result);
  }
}
export default MachineApiController;
