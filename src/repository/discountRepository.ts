import { Discount } from "../entity/Discount";
import { BaseRepository } from "./BaseRepository";

class DiscountRepository extends BaseRepository<Discount, number> {
  constructor() {
    super(Discount);
  }
}

export default new DiscountRepository();
