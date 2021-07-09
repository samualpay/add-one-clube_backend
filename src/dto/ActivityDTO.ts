export type ActivityImageDto = {
  fileName: string;
  order: number;
};
export type DiscountDto = {
  peopleCount: number;
  percent: number;
};
export type ActivityDto = {
  id: number;
  code: string;
  images: ActivityImageDto[];
  videos: ActivityImageDto[];
  name: string;
  description: string;
  start_at: number;
  end_at: number;
  pay_end_at: number;
  price: number;
  total_count: number;
  discounts: DiscountDto[];
  finalPrice: number | null;
  status?: "not_started" | "start" | "end";
};
