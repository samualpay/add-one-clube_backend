import { Publish } from "../entity/Publish";
import { ActivityStatus } from "../enum/ActivityStatus";
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
  findByMachineIdAndActivityStatusAndPublish(
    machineId: number,
    status: ActivityStatus
  ) {
    let query = this.getRepository()
      .createQueryBuilder("publish")
      .innerJoinAndSelect("publish.activity", "activity")
      .leftJoinAndSelect("activity.discounts", "discounts")
      .leftJoinAndSelect("activity.images", "images")
      .leftJoinAndSelect("activity.videos", "videos")
      .where("publish.publish = :publish")
      .andWhere(`publish.machineId = :machineId`)
      .andWhere(`activity.status = :status`)
      .setParameters({ publish: true, machineId, status });
    return query.getMany();
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
  findByActivityIdWithOrders(activityId: number) {
    return this.getRepository().find({
      relations: ["orders"],
      where: { activityId },
    });
  }
  findByActivityIdAndMachineId(machineId: number, activityId: number) {
    return this.getRepository().findOne({
      where: { machineId, activityId },
    });
  }
  findCountByActivityId(activityId: number) {
    return this.getRepository().count({
      where: { activityId },
    });
  }
}

export default new PublishRepository();
