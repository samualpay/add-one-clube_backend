import { Request, Response } from "express";
import { Rout } from "type/Rout";
import BaseController from "./BaseController";
import HttpException from "../exception/HttpException";
import auth from "../middleware/auth";
import { ActivityDto } from "../dto/ActivityDTO";
import { ActivityStatus } from "../enum/ActivityStatus";
import activityService from "../service/activityService";
class ActivityController extends BaseController {
  public path = "/api/activitys";
  initRoutes(): Rout[] {
    return [
      {
        action: "/",
        method: "post",
        middleware: [auth],
        runner: this.create,
      },
      {
        action: "/",
        method: "get",
        middleware: [auth],
        runner: this.findAll,
      },
      {
        action: "/withoutStatus",
        method: "get",
        middleware: [auth],
        runner: this.findAllWithoutStatus,
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
  private async create(req: Request, res: Response) {
    let userId = req.userId;
    let activity: ActivityDto = req.body;
    let result = await activityService.create(userId, activity);
    res.json(result);
  }
  private async findAll(req: Request, res: Response) {
    let userId = req.userId;
    let query: { status?: ActivityStatus } = req.query;
    let list = await activityService.findAll({ userId, ...query });
    res.json({ list });
  }
  private async findAllWithoutStatus(req: Request, res: Response) {
    let userId = req.userId;
    let query: { status?: ActivityStatus } = req.query;
    if (!query.status) {
      throw new HttpException(400, "status is required");
    }
    let list = await activityService.findAllWithoutStatus(userId, query.status);
    res.json({ list });
  }
  private async delete(req: Request, res: Response) {
    let id: number = parseInt(req.params.id);
    await activityService.delete(id);
    res.json({});
  }
  private async update(req: Request, res: Response) {
    let userId = req.userId;
    let activity: ActivityDto = req.body;
    let result = await activityService.update(userId, activity);
    res.json(result);
  }
}
export default ActivityController;
