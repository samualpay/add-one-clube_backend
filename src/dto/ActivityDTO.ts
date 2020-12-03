export type DiscountDto = {
  peopleCount: number;
  percent: number;
};
export type ActivityDto = {
  id: number;
  code: string;
  imgUrl: string;
  videoUrl: string;
  description: string;
  start_at: number;
  end_at: number;
  price: number;
  discounts: DiscountDto[];
  finalPrice: number | null;
  status?: "not_started" | "start" | "end";
};
