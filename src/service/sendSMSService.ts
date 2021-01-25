import axios, { Method } from "axios";
import qs from "qs";
import { LogLevel } from "../enum/LogLevel";
import logService from "./logService";

class SendEmailService {
  send(phone: string, content: string) {
    const data = qs.stringify({
      username: "85129581",
      password: "addoneclub",
      dstaddr: phone,
      smbody: content,
    });
    const config: {
      method: Method;
      url: string;
      headers: { "Content-Type": string };
      data: any;
    } = {
      method: "post",
      url: "https://smsapi.mitake.com.tw/api/mtk/SmSend?CharsetURL=UTF-8",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: data,
    };
    return axios(config)
      .then((result) => {
        let msgid: string = result.data.match(/msgid=([#]?\w+)\r/)[1];
        let statusCode: string = result.data.match(/statuscode=([0-9]+)/)[1];
        let accountPoint: string = result.data.match(
          /AccountPoint=([0-9]+)/
        )[1];
        const response = { msgid, statusCode, accountPoint };
        logService.log({
          level: LogLevel.INFO,
          key: "SMS",
          content: JSON.stringify(response),
        });
        return response;
      })
      .catch((err) => {
        logService.log({
          level: LogLevel.ERROR,
          key: "SMS",
          content: JSON.stringify(err),
        });
      });
  }
  sendPreorderSMS(activityCode: string, phone: string) {
    const content = `感謝您參與本公司(${activityCode})。\n有任何問題可撥打(02)16881688，會有專人與您聯繫。`;
    return this.send(phone, content);
  }
  sendBuyLink(
    activityCode: string,
    activityName: string,
    finalPrice: number,
    link: string,
    phone: string
  ) {
    const content = `感謝您的等候，（${activityCode}）（${activityName}）最終價格為（${finalPrice}），如果您確定要購買，請到下方網址（${link}），完成送貨資料及付款設定。\n再次感謝您的參與～有任何問題可撥打(02)16881688，會有專人與您聯繫。`;
    return this.send(phone, content);
  }
  sendAfterBuySMS(
    phone: string,
    activityCode: string,
    activityName: string,
    buyCount: number,
    totalPrice: number,
    address: string
  ) {
    const content = `感謝您購買(${activityCode})的(品名:${activityName} 數量：${buyCount})，消費總金額為(${totalPrice})，我們會盡快將產品派送到(${address})，敬請期待。\n有任何問題可撥打(02)16881688，會有專人與您聯繫。`;
    return this.send(phone, content);
  }
}
export default new SendEmailService();
