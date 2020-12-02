import { Machine } from "../entity/Machine";
import { BaseRepository } from "./BaseRepository";
import { MachineDTO } from "../dto/MachineDTO";
import HttpException from "../exception/HttpException";

class MachineRepository extends BaseRepository {
  private getRepository() {
    return this.getConnection().getRepository(Machine);
  }
  public async findById(id: number): Promise<Machine | undefined> {
    return this.getRepository().findOne({ id });
  }
  public async findByUserId(userId: number) {
    return this.getRepository().find({
      //   relations: ["user"],
      where: {
        userId,
      },
    });
  }
  public async insert({
    code,
    city,
    dist,
    address,
    area,
    machineType,
    storeAttribute,
    userId,
  }: MachineDTO) {
    await this.getRepository().insert({
      code,
      city,
      dist,
      address,
      area,
      machineType,
      storeAttribute,
      userId,
    });
  }
  async update({
    id,
    city,
    dist,
    address,
    area,
    machineType,
    storeAttribute,
  }: MachineDTO) {
    let machine = await this.findById(id);
    if (machine) {
      machine.city = city;
      machine.dist = dist;
      machine.address = address;
      machine.area = area;
      machine.machineType = machineType;
      machine.storeAttribute = storeAttribute;
      await this.getRepository().save(machine);
    } else {
      throw new HttpException(400, "machine not found");
    }
  }
  async delete(id: number) {
    let machine = await this.findById(id);
    if (machine) {
      await this.getRepository().delete(id);
    } else {
      throw new HttpException(400, "machine not found");
    }
  }
}

export default new MachineRepository();
