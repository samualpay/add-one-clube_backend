import { Request, Response } from "express";
import { Rout } from "type/Rout";
import BaseController from "./BaseController";
import HttpException from "../exception/HttpException";
import auth from "../middleware/auth";
import { ActivityDto } from "../dto/ActivityDTO";
import activityRepository from "../repository/Activity";
import discountRepository from "../repository/Discount";
import { Activity } from "../entity/Activity";
import { ActivityStatus } from "enum/ActivityStatus";
function validTimes(activity: ActivityDto) {
  let now = new Date().getTime() / 1000;
  if (now > activity.start_at) {
    throw new HttpException(400, "開始時間錯誤");
  }
  if (activity.end_at < activity.start_at) {
    throw new HttpException(400, "結束時間須晚於開始時間");
  }
}
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
    validTimes(activity);
    let entity = activityRepository.create({
      code: activity.code,
      imgUrl: activity.imgUrl,
      videoUrl: activity.videoUrl,
      description: activity.description,
      start_at: activity.start_at,
      end_at: activity.end_at,
      price: activity.price,
      userId: userId,
    });
    let discountEntitys = activity.discounts.map((elem, index) => {
      let level = index + 1;
      let item = discountRepository.create({
        level,
        peopleCount: elem.peopleCount,
        percent: elem.percent,
      });
      return item;
    });
    // discountEntitys = await discountRepository.bulkSave(discountEntitys);
    entity.discounts = discountEntitys;
    let result = await activityRepository.save(entity);
    res.json(result);
  }
  private async findAll(req: Request, res: Response) {
    let userId = req.userId;
    let query: { status?: ActivityStatus } = req.query;
    let list: Activity[] = await activityRepository.findByUserIdWithDiscount(
      userId,
      query
    );
    res.json({ list });
  }
  private async findAllWithoutStatus(req: Request, res: Response) {
    let userId = req.userId;
    let query: { status?: ActivityStatus } = req.query;
    if (query.status) {
      let list: Activity[] = await activityRepository.findByUserIdWithDiscountExcludeStatus(
        userId,
        query.status
      );
      res.json({ list });
    } else {
      throw new HttpException(400, "status is required");
    }
  }
  private async delete(req: Request, res: Response) {
    let id: number = parseInt(req.params.id);
    await activityRepository.deleteById(id);
    res.json({});
  }
  private async update(req: Request, res: Response) {
    let activity: ActivityDto = req.body;
    validTimes(activity);
    let entity = await activityRepository.findById(activity.id);
    if (entity) {
      entity.code = activity.code;
      entity.imgUrl = activity.imgUrl;
      entity.videoUrl = activity.videoUrl;
      entity.description = activity.description;
      entity.start_at = activity.start_at;
      entity.end_at = activity.end_at;
      entity.price = activity.price;
      let discountEntitys = activity.discounts.map((elem, index) => {
        let level = index + 1;
        return discountRepository.create({
          level,
          peopleCount: elem.peopleCount,
          percent: elem.percent,
        });
      });
      // discountEntitys = await discountRepository.bulkSave(discountEntitys);
      entity.discounts = discountEntitys;
      let result = await activityRepository.save(entity);
      res.json(result);
    } else {
      throw new HttpException(400, "machine not found");
    }
  }
}
export default ActivityController;