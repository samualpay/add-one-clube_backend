import express, {
  NextFunction,
  Request,
  Response,
  RequestHandler,
  Router,
} from "express";
import { Rout } from "type/Rout";

abstract class BaseController {
  public router: Router;
  public abstract path: string;
  constructor() {
    this.router = express.Router();
    const routs = this.initRoutes();
    routs.forEach(({ action, method, middleware, runner }) => {
      middleware = middleware || [];
      const runnerHandle = async (
        req: Request,
        res: Response,
        next: NextFunction
      ) => {
        try {
          await runner(req, res);
        } catch (err) {
          next(err);
        }
      };
      switch (method) {
        case "get":
          this.router.get(action, ...middleware, runnerHandle);
          break;
        case "post":
          this.router.post(action, ...middleware, runnerHandle);
          break;
        case "put":
          this.router.put(action, ...middleware, runnerHandle);
          break;
        case "patch":
          this.router.patch(action, ...middleware, runnerHandle);
          break;
        case "delete":
          this.router.delete(action, ...middleware, runnerHandle);
          break;
      }
    });
  }
  abstract initRoutes(): Rout[];
}

export default BaseController;
