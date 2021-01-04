import { Publish } from "../entity/Publish";
import { BaseRepository } from "./BaseRepository";

class PublishRepository extends BaseRepository<Publish, number> {
  constructor() {
    super(Publish);
  }
  findWithRelation(query: { activityId?: number; machineId?: number }) {
    return this.getRepository().find({
      relations: [
        "machine",
        "activity",
        "activity.discounts",
        "activity.images",
        "activity.videos",
      ],
      where: query,
    });
  }
  findByIdWithRelation(id: number) {
    return this.getRepository().findOne({
      relations: [
        "machine",
        "activity",
        "activity.discounts",
        "activity.images",
        "activity.videos",
      ],
      where: { id },
    });
  }
  findByIdWithOrders(id: number) {
    return this.getRepository().findOne({
      relations: ["orders"],
      where: { id },
    });
  }
  findByActivityIdAndMachineId(machineId: number, activityId: number) {
    return this.getRepository().findOne({
      where: { machineId, activityId },
    });
  }
}

export default new PublishRepository();
