import { Publish } from "../entity/Publish";
import publishRepository from "../repository/publishRepository";
const publishMobilePage =
  process.env.PUBLISH_MOBILE_PAGE || "http://localhost:3000/mobile/publish";
class PublishService {
  private addUrlForPublish(publish: Publish) {
    let url = `${publishMobilePage}/${publish.id}`;
    return { url, ...publish };
  }
  private addUrlForPublishs(publishs: Publish[]) {
    return publishs.map((publish) => this.addUrlForPublish(publish));
  }
  async findByActivityId(activityId: number) {
    let publishs: Publish[] = await publishRepository.find({
      where: { activityId },
    });
    return publishs;
  }
  async findByActivityIdWithRelation(activityId: number) {
    let publishs: Publish[] = await publishRepository.findWithRelation({
      activityId,
    });
    let list = this.addUrlForPublishs(publishs);
    return list;
  }
  async findByMachineIdWithRelation(machineId: number) {
    let publishs: Publish[] = await publishRepository.findWithRelation({
      machineId,
    });
    let list = this.addUrlForPublishs(publishs);
    return list;
  }
}
export default new PublishService();
