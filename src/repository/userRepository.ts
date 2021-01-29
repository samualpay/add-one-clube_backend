import { User } from "../entity/User";
import { BaseRepository } from "./BaseRepository";

class UserRepository extends BaseRepository<User, number> {
  constructor() {
    super(User);
  }
  async findByUsername(username: string) {
    return this.getRepository().findOne({ username });
  }
}
export default new UserRepository();
