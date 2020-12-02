import { Request, Response } from "express";
import { Rout } from "type/Rout";
import BaseController from "./BaseController";
import userRepository from "../repository/User";
import { LoginResult } from "../dto/LoginResult";
import { RegisterResult } from "../dto/RegisterResult";
import common from "../common";
import HttpException from "../exception/HttpException";
import auth from "../middleware/auth";
import { MachineDTO } from "../dto/MachineDTO";
import machineRepository from "../repository/Machine";
import { Machine } from "../entity/Machine";

class MachineController extends BaseController {
  public path = "/api";
  initRoutes(): Rout[] {
    return [
      {
        action: "/machines",
        method: "post",
        middleware: [auth],
        runner: this.createMachine,
      },
      {
        action: "/machines",
        method: "get",
        middleware: [auth],
        runner: this.findAll,
      },
      {
        action: "/machines/:id",
        method: "delete",
        middleware: [auth],
        runner: this.delete,
      },
      {
        action: "/machines",
        method: "put",
        middleware: [auth],
        runner: this.update,
      },
    ];
  }
  private async createMachine(req: Request, res: Response) {
    let userId = req.userId;
    let machine: MachineDTO = req.body;
    machine.userId = userId;
    await machineRepository.insert(machine);
    res.json({});
  }
  private async findAll(req: Request, res: Response) {
    let userId = req.userId;
    let machines: Machine[] = await machineRepository.findByUserId(userId);
    res.json({ machines });
  }
  private async delete(req: Request, res: Response) {
    let id: number = parseInt(req.params.id);
    await machineRepository.delete(id);
    res.json({});
  }
  private async update(req: Request, res: Response) {
    let machine: MachineDTO = req.body;
    await machineRepository.update(machine);
    res.json({});
  }
}
export default MachineController;
