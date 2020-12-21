import { OrderStatus } from "../enum/OrderStatus";
import HttpException from "../exception/HttpException";
import { Publish } from "../entity/Publish";
import publishRepository from "../repository/publishRepository";
import activityService from "./activityService";
const publishMobilePage =
  process.env.PUBLISH_MOBILE_PAGE || "http://localhost:3000/mobile/publish";
type PublishProps = {
  publishId?: number;
  publish?: Publish;
  updateNow?: boolean;
};
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
  async getPublish({ publishId, publish }: PublishProps): Promise<Publish> {
    if (!publish && publishId) {
      publish = await publishRepository.findByIdWithOrders(publishId);
      if (publish) {
        return publish;
      } else {
        throw new HttpException(400, "publish not found");
      }
    } else if (publish) {
      return publish;
    } else {
      throw new HttpException(400, "publish not found");
    }
  }
  async addLinkCountForPubilish({
    publishId,
    publish,
  }: PublishProps): Promise<Publish> {
    let pub = await this.getPublish({ publishId, publish });
    pub.linkCount += 1;
    pub = await publishRepository.save(pub);
    await activityService.updateActivityCounts(pub.activityId);
    return pub;
  }
  async updateCount({ publishId, publish }: PublishProps) {
    let pub = await this.getPublish({ publishId, publish });
    let registerCount = pub.orders.length;
    let buyCount = pub.orders.filter(
      (order) => order.status !== OrderStatus.PREORDER
    ).length;
    pub.registeredCount = registerCount;
    pub.buyCount = buyCount;
    pub = await publishRepository.save(pub);
    await activityService.updateActivityCounts(pub.activityId);
    return pub;
  }
}
export default new PublishService();
