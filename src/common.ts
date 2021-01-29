import jwt from "jsonwebtoken";
const SECRET = "jfoawjefojeojfoweijf";
class Common {
  createToken(data: any, exp?: number) {
    if (!exp && exp !== 0) {
      exp = Math.floor(Date.now() / 1000) + 60 * 60;
    }
    if (exp) {
      return { token: jwt.sign({ exp, data }, SECRET), expireTime: exp * 1000 };
    } else {
      return { token: jwt.sign({ data }, SECRET), expireTime: null };
    }
  }
  verifyToken(token: string): any {
    const payload: any = jwt.verify(token, SECRET);
    return payload.data;
  }
  sleep(ms: number) {
    return new Promise<void>((reslove) => {
      setTimeout(() => {
        reslove();
      }, ms);
    });
  }
}
export default new Common();
