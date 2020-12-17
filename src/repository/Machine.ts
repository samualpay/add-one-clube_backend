import { Machine } from "../entity/Machine";
import { BaseRepository } from "./BaseRepository";

class MachineRepository extends BaseRepository<Machine, number> {
  constructor() {
    super(Machine);
  }
}

export default new MachineRepository();
