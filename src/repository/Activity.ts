import { ActivityStatus } from "enum/ActivityStatus";
import { Not } from "typeorm";
import { Activity } from "../entity/Activity";
import { BaseRepository } from "./BaseRepository";

class ActivityRepository extends BaseRepository<Activity, number> {
  constructor() {
    super(Activity);
  }
  findByUserIdWithDiscount(
    userId: number,
    filter: { status?: ActivityStatus }
  ) {
    return this.getRepository().find({
      relations: ["discounts"],
      where: { userId, ...filter },
    });
  }
  findByUserIdWithDiscountExcludeStatus(
    userId: number,
    status: ActivityStatus
  ) {
    return this.getRepository().find({
      relations: ["discounts"],
      where: { userId, status: Not(status) },
    });
  }
}

export default new ActivityRepository();
