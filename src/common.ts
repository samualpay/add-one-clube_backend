import jwt from "jsonwebtoken";
const SECRET = "jfoawjefojeojfoweijf";
type TokenData = {
  id: number;
};
class Common {
  createToken(data: TokenData) {
    const exp = Math.floor(Date.now() / 1000) + 60 * 60;
    return { token: jwt.sign({ exp, data }, SECRET), expireTime: exp * 1000 };
  }
  verifyToken(token: string): TokenData {
    const payload: any = jwt.verify(token, SECRET);
    const data: TokenData = payload.data;
    return data;
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
