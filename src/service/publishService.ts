import { OrderStatus } from "../enum/OrderStatus";
import HttpException from "../exception/HttpException";
import { Publish } from "../entity/Publish";
import publishRepository from "../repository/publishRepository";
import activityService from "./activityService";
import { getRepository } from "typeorm";
import { ActivityStatus } from "../enum/ActivityStatus";
const publishMobilePage =
  process.env.PUBLISH_MOBILE_PAGE || "http://localhost:3000/mobile/publish";
type PublishProps = {
  publishId?: number;
  publish?: Publish;
  updateNow?: boolean;
};
class PublishService {
  private addUrlForPublish(publish: Publish) {
    let url = "";
    if (publish.publish && publish.activity.status === ActivityStatus.START) {
      url = `${publishMobilePage}/${publish.id}`;
    }
    return { url, ...publish };
  }
  private addUrlForPublishs(publishs: Publish[]) {
    return publishs.map((publish) => this.addUrlForPublish(publish));
  }
  async findByActivityIdWithOrders(activityId: number) {
    let publishs: Publish[] = await publishRepository.findByActivityIdWithOrders(
      activityId
    );
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
  async findByMachineIdAndActivityStatusIsStartAndPublish(machineId: number) {
    let publishs: Publish[] = await publishRepository.findByMachineIdAndActivityStatusAndPublish(
      machineId,
      ActivityStatus.START
    );
    return publishs;
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

    let registeredPeople: number[] = [];
    let buyPeople: number[] = [];
    pub.orders.forEach((order) => {
      if (!registeredPeople.includes(order.customerId)) {
        registeredPeople.push(order.customerId);
      }
      if (
        order.status !== OrderStatus.PREORDER &&
        !buyPeople.includes(order.customerId)
      ) {
        buyPeople.push(order.customerId);
      }
    });
    pub.registeredCount = registeredPeople.length;
    pub.buyCount = buyPeople.length;
    pub = await publishRepository.save(pub);
    await activityService.updateActivityCounts(pub.activityId);
    return pub;
  }
  async findByIdForMobile(id: number) {
    let pub = await publishRepository.findByIdWithRelation(id);
    if (
      !pub ||
      pub.activity.status !== ActivityStatus.START ||
      pub.publish != true
    ) {
      throw new HttpException(404, "活動不存在");
    }
    this.addLinkCountForPubilish({ publishId: id });
    return pub;
  }
}
export default new PublishService();
