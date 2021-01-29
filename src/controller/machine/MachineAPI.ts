import { Request, Response } from "express";
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
        middleware: [],
        runner: this.activitys,
      },
    ];
  }
  private async login(req: Request, res: Response) {
    let { username, password, code }: LoginProps = req.body;
    let token = await userService.machineLogin({ username, password, code });
    res.json({ token });
  }
  private async activitys(req: Request, res: Response) {}
}
export default MachineApiController;
