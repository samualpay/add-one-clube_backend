import { ActivityStatus } from "enum/ActivityStatus";
import { Not } from "typeorm";
import { Activity } from "../entity/Activity";
import { BaseRepository } from "./BaseRepository";

class ActivityRepository extends BaseRepository<Activity, number> {
  constructor() {
    super(Activity);
  }
  findByUserIdWithDiscount(userId: number, filter: any) {
    return this.getRepository().find({
      relations: ["discounts", "images", "videos"],
      where: { userId, ...filter },
    });
  }
  findByUserIdWithDiscountExcludeStatus(
    userId: number,
    status: ActivityStatus
  ) {
    return this.getRepository().find({
      relations: ["discounts", "images", "videos"],
      where: { userId, status: Not(status) },
    });
  }
  findByIdWithDiscount(id: number) {
    return this.getRepository().findOne({
      relations: ["discounts", "images", "videos"],
      where: { id },
    });
  }
  findAllExcludeStatus(status: ActivityStatus) {
    return this.getRepository().find({
      relations: ["discounts", "images", "videos"],
      where: { status: Not(status) },
    });
  }
  async findRegisterCountById(id: number) {
    return this.getRepository().findOne({
      where: { id },
      select: ["registeredCount"],
    });
  }
}

export default new ActivityRepository();
