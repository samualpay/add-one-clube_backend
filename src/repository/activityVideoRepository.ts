import { ActivityVideo } from "../entity/ActivityVideo";
import { BaseRepository } from "./BaseRepository";

class ActivityVideoRepository extends BaseRepository<ActivityVideo, number> {
  constructor() {
    super(ActivityVideo);
  }
}
export default new ActivityVideoRepository();
