import { Request, Response } from "express";
import { Rout } from "type/Rout";
import BaseController from "./BaseController";
import HttpException from "../exception/HttpException";
import auth from "../middleware/auth";
import { MachineDTO } from "../dto/MachineDTO";
// import machineRepository from "../repository/machineRepository";
import { Machine } from "../entity/Machine";
import machineService from "../service/machineService";

class MachineController extends BaseController {
  public path = "/api/machines";
  initRoutes(): Rout[] {
    return [
      {
        action: "/",
        method: "post",
        middleware: [auth],
        runner: this.createMachine,
      },
      {
        action: "/",
        method: "get",
        middleware: [auth],
        runner: this.findAll,
      },
      {
        action: "/:id",
        method: "delete",
        middleware: [auth],
        runner: this.delete,
      },
      {
        action: "/",
        method: "put",
        middleware: [auth],
        runner: this.update,
      },
    ];
  }
  private async createMachine(req: Request, res: Response) {
    let userId = req.userId;
    let machine: MachineDTO = req.body;
    let result = await machineService.createMachine({ ...machine, userId });
    res.json(result);
  }
  private async findAll(req: Request, res: Response) {
    let userId = req.userId;
    let machines: Machine[] = await machineService.findByUserid(userId);
    res.json({ machines });
  }
  private async delete(req: Request, res: Response) {
    let id: number = parseInt(req.params.id);
    await machineService.deleteById(id);
    res.json({});
  }
  private async update(req: Request, res: Response) {
    let machine: MachineDTO = req.body;
    let result = await machineService.updateMachine(machine);
    res.json(result);
  }
}
export default MachineController;
