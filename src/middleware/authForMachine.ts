import HttpException from "../exception/HttpException";
import { NextFunction, Request, Response } from "express";
import common from "../common";
declare global {
  namespace Express {
    export interface Request {
      meta: any;
    }
  }
}
function authForMachine(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string | undefined = req.headers["authorization"];
    if (token) {
      let data = common.verifyToken(token);
      let userId = data.userId;
      let machineId = data.machineId;
      req.meta = {
        userId,
        machineId,
      };
      next();
    } else {
      throw new HttpException(401, "token 驗證失敗");
    }
  } catch (err) {
    next(new HttpException(401, "token 驗證失敗"));
  }
}

export default authForMachine;
