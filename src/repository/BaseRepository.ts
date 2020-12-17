import HttpException from "../exception/HttpException";
import database from "../config/database";
import {
  DeepPartial,
  FindConditions,
  FindManyOptions,
  FindOneOptions,
} from "typeorm";

export type ObjectType<T> = { new (): T } | Function;
export class BaseRepository<T, PK> {
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
  find(query?: FindManyOptions<T>) {
    return this.getRepository().find(query);
  }
  findById(id: PK) {
    return this.getRepository().findOne({ where: { id } });
  }
  findOne(options?: FindOneOptions<T>) {
    return this.getRepository().findOne(options);
  }
  findByUserId(userId: number) {
    return this.getRepository().find({ where: { userId } });
  }
  save(entity: T) {
    return this.getRepository().save(entity);
  }
  bulkSave(entitys: T[]) {
    return this.getRepository().save(entitys);
  }
  deleteById(id: PK) {
    return this.getRepository().delete(id);
  }
  delete(condition: FindConditions<T>) {
    return this.getRepository().delete(condition);
  }
  create(entity: DeepPartial<T>) {
    return this.getRepository().create(entity);
  }
}
