import nodeMailer from "nodemailer";
import { LogLevel } from "../enum/LogLevel";
import logRepository from "../repository/logRepository";
type LogProp = {
  level: LogLevel;
  key?: string;
  content?: string;
};
class LogService {
  log({ level, key, content }: LogProp) {
    let entity = logRepository.create({ level, key, content });
    logRepository.save(entity);
  }
}
export default new LogService();
