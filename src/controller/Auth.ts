import { Request, Response } from "express";
import { Rout } from "type/Rout";
import BaseController from "./BaseController";
import userService from "../service/userService";
type loginRequestBody = {
  username: string;
  password: string;
};
class AuthController extends BaseController {
  public path = "/api";
  initRoutes(): Rout[] {
    return [
      {
        action: "/login",
        method: "post",
        runner: this.login,
      },
      {
        action: "/register",
        method: "post",
        runner: this.register,
      },
    ];
  }
  private async login(req: Request, res: Response) {
    const { username, password }: loginRequestBody = req.body;
    let result = await userService.login({ username, password });
    res.json(result);
  }
  private async register(req: Request, res: Response) {
    const { username, password }: loginRequestBody = req.body;
    let result = await userService.register({ username, password });
    res.json(result);
  }
}
export default AuthController;
