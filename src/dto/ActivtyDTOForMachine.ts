import { Activity } from "../entity/Activity";
const imageDomain = process.env.IMAGE_DOMAIN || "http://localhost:5000/images";
const videoDomain = process.env.VIDEO_DOMAIN || "http://localhost:8080/videos";
export type DiscountDto = {
  level: number;
  peopleCount: number;
  percent: number;
};
export type ActivityForMachineDto = {
  id: number;
  code: string;
  images: string[];
  videos: string[];
  name: string;
  description: string;
  start_at: number;
  end_at: number;
  price: number;
  discounts: DiscountDto[];
  discountPrice: number;
  linkCount: number;
  registeredCount: number;
};

export function transfer(activity: Activity): ActivityForMachineDto {
  let price = activity.price;
  let discountPrice = activity.price;
  let discounts = activity.discounts.sort((a, b) => a.level - b.level);
  discounts.forEach((discount) => {
    if (activity.registeredCount > discount.peopleCount) {
      discountPrice = (price / 100) * discount.percent;
    }
  });
  let images = activity.images.map((elem) => `${imageDomain}/${elem.fileName}`);
  let videos = activity.videos.map((elem) => `${videoDomain}/${elem.fileName}`);
  return {
    id: activity.id,
    code: activity.code,
    name: activity.name,
    images,
    videos,
    description: activity.description,
    start_at: activity.start_at,
    end_at: activity.end_at,
    price,
    discounts,
    discountPrice,
    linkCount: activity.linkCount,
    registeredCount: activity.registeredCount,
  };
}
