import { Activity } from "../entity/Activity";
import { BaseRepository } from "./BaseRepository";

class ActivityRepository extends BaseRepository<Activity, number> {
  constructor() {
    super(Activity);
  }
  findByUserIdWithDiscount(userId: number) {
    return this.getRepository().find({
      relations: ["discounts"],
      where: { userId },
    });
  }
}

export default new ActivityRepository();
