import HttpException from "../exception/HttpException";
import machineRepository from "../repository/machineRepository";

type CreateMachineProps = {
  code: string;
  city: string;
  dist: string;
  address: string;
  area: string;
  machineType: string;
  storeAttribute: string;
  userId: number;
};
type UpdateMachineProps = CreateMachineProps & { id: number };
class MachineService {
  async createMachine({
    code,
    city,
    dist,
    address,
    area,
    machineType,
    storeAttribute,
    userId,
  }: CreateMachineProps) {
    let entity = machineRepository.create({
      code,
      city,
      dist,
      address,
      area,
      machineType,
      storeAttribute,
      userId,
    });
    let result = await machineRepository.save(entity);
    return result;
  }
  async findByUserid(userId: number) {
    let entitys = await machineRepository.findByUserId(userId);
    return entitys;
  }
  async deleteById(id: number) {
    let result = await machineRepository.deleteById(id);
    return result;
  }
  async updateMachine({
    id,
    code,
    city,
    dist,
    address,
    area,
    machineType,
    storeAttribute,
  }: UpdateMachineProps) {
    let entity = await machineRepository.findById(id);
    if (!entity) {
      throw new HttpException(400, "machine not found");
    }
    entity.code = code;
    entity.city = city;
    entity.dist = dist;
    entity.address = address;
    entity.area = area;
    entity.machineType = machineType;
    entity.storeAttribute = storeAttribute;
    entity = await machineRepository.save(entity);
    return entity;
  }
  async findByUserIdAndCode(userId: number, code: string) {
    let machine = await machineRepository.findByUserIdAndCode(userId, code);
    return machine;
  }
}
export default new MachineService();
