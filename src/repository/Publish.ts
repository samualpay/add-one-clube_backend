import { Publish } from "../entity/Publish";
import { BaseRepository } from "./BaseRepository";

class PublishRepository extends BaseRepository<Publish, number> {
  constructor() {
    super(Publish);
  }
  findWithRelation(query: { activityId?: number; machineId?: number }) {
    return this.getRepository().find({
      relations: ["machine", "activity", "activity.discounts"],
      where: query,
    });
  }
  findByActivityIdAndMachineId(machineId: number, activityId: number) {
    return this.getRepository().findOne({
      where: { machineId, activityId },
    });
  }
}

export default new PublishRepository();
