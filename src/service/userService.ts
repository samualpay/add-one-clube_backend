import common from "../common";
import HttpException from "../exception/HttpException";
import userRepository from "../repository/userRepository";
import machineService from "./machineService";

type LoginProps = {
  username: string;
  password: string;
};
type RegisterProps = {
  username: string;
  password: string;
};
type MachineLoginProps = {
  username: string;
  password: string;
  code: string;
};
class UserService {
  async checkUsernamePassword({ username, password }: LoginProps) {
    let user = await userRepository.findByUsername(username);
    if (!user || user.password !== password) {
      throw new HttpException(400, "帳號或密碼錯誤");
    }
    return user;
  }
  async login({ username, password }: LoginProps) {
    let user = await this.checkUsernamePassword({ username, password });
    const { token, expireTime } = common.createToken({ id: user.id });
    return {
      username: user.username,
      token,
      expireTime,
    };
  }
  async machineLogin({ username, password, code }: MachineLoginProps) {
    let user = await this.checkUsernamePassword({ username, password });
    let machine = await machineService.findByUserIdAndCode(user.id, code);
    if (!machine) {
      throw new HttpException(400, "code不存在");
    }
    const { token } = common.createToken({
      userId: user.id,
      machineId: machine.id,
    });
    return token;
  }
  async register({ username, password }: RegisterProps) {
    let user = await userRepository.findByUsername(username);
    if (user) {
      throw new HttpException(400, "帳號已存在");
    } else {
      let entity = userRepository.create({ username, password });
      await userRepository.save(entity);
      return { isSuccess: true, message: null };
    }
  }
}
export default new UserService();
