import { Log } from "../entity/Log";
import { BaseRepository } from "./BaseRepository";

class LogRepository extends BaseRepository<Log, number> {
  constructor() {
    super(Log);
  }
}
export default new LogRepository();
