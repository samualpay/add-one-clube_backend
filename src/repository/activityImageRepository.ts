import { ActivityImage } from "../entity/ActivityImage";
import { BaseRepository } from "./BaseRepository";

class ActivityImageRepository extends BaseRepository<ActivityImage, number> {
  constructor() {
    super(ActivityImage);
  }
}
export default new ActivityImageRepository();
