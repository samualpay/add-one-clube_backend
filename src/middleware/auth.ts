import HttpException from "../exception/HttpException";
import { NextFunction, Request, Response } from "express";
import common from "../common";
declare global {
  namespace Express {
    export interface Request {
      userId: number;
    }
  }
}
function auth(req: Request, res: Response, next: NextFunction) {
  try {
    let token: string | undefined = req.headers["authorization"];
    if (token) {
      let data = common.verifyToken(token);
      let userId = data.id;
      req.userId = userId;
      next();
    } else {
      throw new HttpException(401, "token 驗證失敗");
    }
  } catch (err) {
    next(new HttpException(401, "token 驗證失敗"));
  }
}

export default auth;
