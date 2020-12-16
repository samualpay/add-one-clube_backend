import { Request, Response } from "express";
import { Rout } from "type/Rout";
import BaseController from "./BaseController";
import auth from "../middleware/auth";
import machineRepository from "../repository/Machine";
import activityRepository from "../repository/Activity";
import publishRepository from "../repository/Publish";
import { Publish } from "../entity/Publish";
import HttpException from "../exception/HttpException";
import { ActivityStatus } from "../enum/ActivityStatus";
type CreateProps = {
  activityId: number;
  machineId: number;
};
class PublishController extends BaseController {
  public path = "/api/publishs";
  initRoutes(): Rout[] {
    return [
      {
        action: "/activity/:id",
        method: "get",
        middleware: [],
        runner: this.findByActivityId,
      },
      {
        action: "/machine/:id",
        method: "get",
        middleware: [],
        runner: this.findByMachineId,
      },
      {
        action: "/",
        method: "post",
        middleware: [auth],
        runner: this.create,
      },
      {
        action: "/:id",
        method: "delete",
        middleware: [auth],
        runner: this.delete,
      },
      {
        action: "/:id",
        method: "patch",
        middleware: [auth],
        runner: this.publish,
      },
    ];
  }

  private async findByActivityId(req: Request, res: Response) {
    let activityId: number = parseInt(req.params.id);
    let list: Publish[] = await publishRepository.findWithRelation({
      activityId,
    });
    res.json({ list });
  }

  private async findByMachineId(req: Request, res: Response) {
    let machineId: number = parseInt(req.params.id);
    let list: Publish[] = await publishRepository.findWithRelation({
      machineId,
    });
    res.json({ list });
  }
  private async create(req: Request, res: Response) {
    let userId = req.userId;
    let { activityId, machineId }: CreateProps = req.body;
    let activity = await activityRepository.findById(activityId);
    if (!activity || activity.status === ActivityStatus.END) {
      throw new HttpException(400, "activityId is wrong");
    }
    let machine = await machineRepository.findById(machineId);
    if (!machine) {
      throw new HttpException(400, "machineId is wrong");
    }
    let publish = await publishRepository.findByActivityIdAndMachineId(
      machineId,
      activityId
    );
    if (publish) {
      throw new HttpException(400, "machine was binded");
    }
    let entity = await publishRepository.create({
      userId,
      activityId,
      machineId,
    });
    let result = await publishRepository.save(entity);
    res.json(result);
  }
  private async delete(req: Request, res: Response) {
    let userId = req.userId;
    let publishId: number = parseInt(req.params.id);
    let publish = await publishRepository.findById(publishId);
    if (!publish) {
      throw new HttpException(400, "publish not found");
    }
    if (publish.userId !== userId) {
      throw new HttpException(403, "Permission denied");
    }
    await publishRepository.deleteById(publishId);
    res.json({});
  }
  private async publish(req: Request, res: Response) {
    let userId = req.userId;
    let publishId: number = parseInt(req.params.id);
    let { publish }: { publish: boolean } = req.body;
    let publishEntity = await publishRepository.findById(publishId);
    if (!publishEntity) {
      throw new HttpException(400, "publish not found");
    }
    if (publishEntity.userId !== userId) {
      throw new HttpException(403, "Permission denied");
    }
    publishEntity.publish = publish;
    let result = await publishRepository.save(publishEntity);
    res.json(result);
  }
}
export default PublishController;
