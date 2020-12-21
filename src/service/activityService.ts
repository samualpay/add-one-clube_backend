import { ActivityStatus } from "../enum/ActivityStatus";
import { Activity } from "../entity/Activity";
import activityRepository from "../repository/activityRepository";
import { ActivityDto, DiscountDto } from "../dto/ActivityDTO";
import HttpException from "../exception/HttpException";
import discountRepository from "../repository/discountRepository";
import publishService from "./publishService";
import orderService from "./orderService";
const discountError = new HttpException(400, "階層設定異常");
type activityProps = {
  activityId?: number;
  activity?: Activity;
  updateNow?: boolean;
};
class ActivityService {
  private validTimes(activity: ActivityDto) {
    let now = new Date().getTime() / 1000;
    if (now > activity.start_at) {
      throw new HttpException(400, "開始時間錯誤");
    }
    if (activity.end_at < activity.start_at) {
      throw new HttpException(400, "結束時間須晚於開始時間");
    }
  }
  private validDicounts(discounts: DiscountDto[]) {
    for (let i = 0; i < discounts.length; i++) {
      let discount = discounts[i];
      if (
        isNaN(discount.peopleCount) ||
        discount.peopleCount < 0 ||
        isNaN(discount.percent) ||
        discount.percent < 0 ||
        discount.percent > 100
      ) {
        throw discountError;
      }
      if (i > 0) {
        let bef = discounts[i - 1];
        if (
          discount.peopleCount < bef.peopleCount ||
          discount.percent > bef.percent
        ) {
          throw discountError;
        }
      }
    }
  }
  private validActivity(activity: ActivityDto) {
    this.validTimes(activity);
    this.validDicounts(activity.discounts);
  }
  async create(userId: number, activity: ActivityDto) {
    this.validActivity(activity);
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
    entity.discounts = discountEntitys;
    let result = await activityRepository.save(entity);
    return result;
  }
  async update(userId: number, activity: ActivityDto) {
    this.validActivity(activity);
    let entity = await activityRepository.findById(activity.id);
    if (!entity) {
      throw new HttpException(400, "activity not found");
    }
    if (entity.userId !== userId) {
      throw new HttpException(403, "permission deny");
    }
    if (entity.status === ActivityStatus.END) {
      throw new HttpException(400, "activity can't modify when status is end");
    }
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
    entity.discounts = discountEntitys;
    let result = await activityRepository.save(entity);
    return result;
  }
  async findAll({
    userId,
    status,
  }: {
    userId: number;
    status?: ActivityStatus;
  }) {
    let query: any = {};
    if (status) {
      query.status = status;
    }
    let list: Activity[] = await activityRepository.findByUserIdWithDiscount(
      userId,
      query
    );
    return list;
  }
  async findAllWithoutStatus(userId: number, status: ActivityStatus) {
    let list: Activity[] = await activityRepository.findByUserIdWithDiscountExcludeStatus(
      userId,
      status
    );
    return list;
  }
  async delete(id: number) {
    await activityRepository.deleteById(id);
  }
  async updateActivityCounts(activityId: number) {
    let activity = await activityRepository.findById(activityId);
    if (!activity) {
      throw new HttpException(400, "activity not found");
    }
    let publishs = await publishService.findByActivityId(activityId);
    let { buyCount, registeredCount, linkCount } = publishs.reduce(
      (acc, cur) => {
        acc.buyCount += cur.buyCount;
        acc.linkCount += cur.linkCount;
        acc.registeredCount += cur.registeredCount;
        return acc;
      },
      { buyCount: 0, registeredCount: 0, linkCount: 0 }
    );
    activity.registeredCount = registeredCount;
    activity.buyCount = buyCount;
    activity.linkCount = linkCount;
    await activityRepository.save(activity);
  }
  private async getActivity({
    activityId,
    activity,
  }: activityProps): Promise<Activity> {
    if (!activity && activityId) {
      activity = await activityRepository.findByIdWithDiscount(activityId);
      if (activity) {
        return activity;
      } else {
        throw new HttpException(400, "param not found");
      }
    } else if (activity) {
      return activity;
    } else {
      throw new HttpException(400, "param not found");
    }
  }
  async updateAllActivityStatus() {
    let activitys = await activityRepository.findAllExcludeStatus(
      ActivityStatus.END
    );
    let update: Activity[] = [];
    let now = new Date().getTime() / 1000;
    for (let i = 0; i < activitys.length; i++) {
      let elem = activitys[i];
      if (elem.status === ActivityStatus.NOT_STARTED && elem.start_at < now) {
        elem.status = ActivityStatus.START;
        update.push(elem);
      }
      if (elem.status === ActivityStatus.START && elem.end_at < now) {
        elem = await this.updateActivityStatusToEnd({
          activity: elem,
          updateNow: false,
        });
        update.push(elem);
      }
    }
    await activityRepository.bulkSave(update);
  }
  async updateFinalPrice({ activityId, activity, updateNow }: activityProps) {
    let act = await this.getActivity({ activityId, activity });
    let finalPrice = act.price;
    let price = act.price;
    let discounts = act.discounts.sort((a, b) => a.level - b.level);
    discounts.forEach((discount) => {
      if (act.registeredCount > discount.peopleCount) {
        finalPrice = (price / 100) * discount.percent;
      }
    });
    act.finalPrice = finalPrice;
    await orderService.updateOrderPriceByActivityId(act.id, finalPrice);
    if (updateNow) {
      act = await activityRepository.save(act);
    }
    return act;
  }
  async updateActivityStatusToEnd({
    activityId,
    activity,
    updateNow,
  }: activityProps) {
    let act = await this.getActivity({ activityId, activity });
    act.status = ActivityStatus.END;
    act = await this.updateFinalPrice({ activity: act, updateNow });
    return act;
    //todo send mail to user
  }
}
export default new ActivityService();
