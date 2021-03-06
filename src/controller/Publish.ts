import { Request, Response } from "express";
import { Rout } from "type/Rout";
import BaseController from "./BaseController";
import auth from "../middleware/auth";
import machineRepository from "../repository/machineRepository";
import activityRepository from "../repository/activityRepository";
import publishRepository from "../repository/publishRepository";
import { Publish } from "../entity/Publish";
import HttpException from "../exception/HttpException";
import { ActivityStatus } from "../enum/ActivityStatus";
import publishService from "../service/publishService";
const publishMobilePage =
  process.env.PUBLISH_MOBILE_PAGE || "http://localhost:3000/mobile/publish";
type CreateProps = {
  activityId: number;
  machineId: number;
};

function addUrlForPublish(publish: Publish) {
  let url = `${publishMobilePage}/${publish.id}`;
  return { url, ...publish };
}
function addUrlForPublishs(publishs: Publish[]) {
  return publishs.map((publish) => addUrlForPublish(publish));
}
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
        action: "/activity/:id/count",
        method: "get",
        middleware: [],
        runner: this.findCountByActivityId,
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
      {
        action: "/activity/:id",
        method: "patch",
        middleware: [auth],
        runner: this.publishByActivityId,
      },
    ];
  }

  private async findByActivityId(req: Request, res: Response) {
    let activityId: number = parseInt(req.params.id);
    let list = await publishService.findByActivityIdWithRelation(activityId);
    res.json({ list });
  }
  private async findCountByActivityId(req: Request, res: Response) {
    let activityId: number = parseInt(req.params.id);
    let result = await publishService.findCountByActivityId(activityId);
    res.json(result);
  }

  private async findByMachineId(req: Request, res: Response) {
    let machineId: number = parseInt(req.params.id);
    let list = await publishService.findByMachineIdWithRelation(machineId);
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
    publish = await publishRepository.save(entity);
    let result = addUrlForPublish(publish);
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
    publishEntity = await publishRepository.save(publishEntity);
    let result = addUrlForPublish(publishEntity);
    res.json(result);
  }
  private async publishByActivityId(req: Request, res: Response) {
    let userId = req.userId;
    let activityId: number = parseInt(req.params.id);
    let activity = await activityRepository.findById(activityId);
    if (!activity || activity.userId !== userId) {
      throw new HttpException(403, "Permission denied");
    }
    let publishEntitys = await publishRepository.find({
      where: { activityId },
    });
    publishEntitys = publishEntitys.map((elem) => {
      elem.publish = true;
      return elem;
    });
    publishEntitys = await publishRepository.bulkSave(publishEntitys);
    let list = addUrlForPublishs(publishEntitys);
    res.json({ list });
  }
}
export default PublishController;
