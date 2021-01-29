import { Machine } from "../entity/Machine";
import { BaseRepository } from "./BaseRepository";

class MachineRepository extends BaseRepository<Machine, number> {
  constructor() {
    super(Machine);
  }
  findByUserIdAndCode(userId: number, code: string) {
    return this.findOne({
      where: {
        userId,
        code,
      },
    });
  }
}

export default new MachineRepository();
