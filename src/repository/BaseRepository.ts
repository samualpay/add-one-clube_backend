import HttpException from "../exception/HttpException";
import database from "../config/database";

export type ObjectType<T> = { new (): T } | Function;
export class BaseRepository<T> {
  private type: ObjectType<T>;
  constructor(type: ObjectType<T>) {
    this.type = type;
  }
  getConnection() {
    if (database.connection) {
      return database.connection;
    } else {
      throw new HttpException(500, "db connect failed");
    }
  }
  getRepository() {
    return this.getConnection().getRepository(this.type);
  }
}
