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
    let entity = machineRepository.create({
      code: machine.code,
      city: machine.city,
      dist: machine.dist,
      address: machine.address,
      area: machine.area,
      machineType: machine.machineType,
      storeAttribute: machine.storeAttribute,
      userId: userId,
    });
    let result = await machineRepository.save(entity);
    res.json(result);
  }
  private async findAll(req: Request, res: Response) {
    let userId = req.userId;
    let machines: Machine[] = await machineRepository.findByUserId(userId);
    res.json({ machines });
  }
  private async delete(req: Request, res: Response) {
    let id: number = parseInt(req.params.id);
    await machineRepository.deleteById(id);
    res.json({});
  }
  private async update(req: Request, res: Response) {
    let machine: MachineDTO = req.body;
    let entity = await machineRepository.findById(machine.id);
    if (entity) {
      entity.code = machine.code;
      entity.city = machine.city;
      entity.dist = machine.dist;
      entity.address = machine.address;
      entity.area = machine.area;
      entity.machineType = machine.machineType;
      entity.storeAttribute = machine.storeAttribute;
      let result = await machineRepository.save(entity);
      res.json(result);
    } else {
      throw new HttpException(400, "machine not found");
    }
  }
}
export default MachineController;
