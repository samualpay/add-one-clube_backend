import { join } from "path";
import { User } from "../entity/User";
import { BaseRepository } from "./BaseRepository";

class UserRepository extends BaseRepository<User, number> {
  constructor() {
    super(User);
  }
  // private getRepository() {
  //     return this.getConnection().getRepository(User)
  // }
  // async findById(id: number): Promise<User | undefined> {
  //   return this.getRepository().findOne({ id });
  // }
  async findByUsername(username: string) {
    return this.getRepository().findOne({ username });
  }
  // async insert(username: string, password: string) {
  //   await this.getRepository().insert({ username, password });
  // }
}
export default new UserRepository();
