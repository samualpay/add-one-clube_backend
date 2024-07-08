import axios, { Method } from "axios";
import qs from "qs";
import { LogLevel } from "../enum/LogLevel";
import logService from "./logService";
import moment from "moment";
class SendEmailService {
  send(phone: string, content: string) {
    const data = qs.stringify({
      username: process.env.SMS_USERNAME,
      password: process.env.SMS_PASSWORD,
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
  sendPreorderSMS(
    activityName: string,
    startAt: string,
    endAt: string,
    sendAt: string,
    phone: string,
    link: string
  ) {
    // const content = `感謝您參與本公司(${activityCode})。\n，請到下方網址確認預購資訊（${link}）\n有任何問題可撥打(02)16881688，會有專人與您聯繫。`;
    const content =
      `加1團隊感謝您參與本活動(${activityName})。\n` +
      `本活動期間為(${startAt}至${endAt})，${sendAt}依序專人送達您指定地點。\n` +
      `活動期間達到團購目標系統將發送降價簡訊，詳細資訊請到下方網址確認預購資訊（${link})\n` +
      `有任何問題可撥打0955562843，會有專人與您聯繫。`;
    return this.send(phone, content);
  }
  sendDiscountSMS(
    activityName: string,
    discountPeopleCount: number,
    finalPrice: number,
    phone: string,
    link: string
  ) {
    //const content = `${activityCode}  ${activityName}  ${finalPrice}  ${link}`;
    const content =
      `加1團隊降價通知(${activityName}) \n` +
      `團購目標達到(${discountPeopleCount}) 組 手工水餃現階段降價至 (${finalPrice}) 元\n` +
      `系統將持續發送降價簡訊，詳細資訊請到下方網址確認預購資訊（${link}）\n` +
      `有任何問題可撥打0955562843，會有專人與您聯繫。`;
    return this.send(phone, content);
  }
  sendBuyLink(
    activityName: string,
    finalPrice: number,
    payEndAt: string,
    sendAt: string,
    checkCode: string,
    link: string,
    phone: string
  ) {
    const content =
      `加1團隊再次感謝您的等候，(${activityName}) 最終價格為（${finalPrice}）元，如果您確定要購買，請於${payEndAt}前到下方網址（${link}），完成基本資料填寫。\n` +
      `有任何問題可撥打0955562843，${sendAt}之後會有專人與您聯繫安排送貨。\n` +
      `您的取貨號碼為(${checkCode})。\n` +
      `加1團隊之後也會推出更多團購商品。`;
    return this.send(phone, content);
  }
  sendAfterBuySMS(
    phone: string,
    activityName: string,
    totalPrice: number,
    checkCode: string,
    sendAt: string
  ) {
    // const content = `感謝您購買(${activityCode})的(品名:${activityName} 數量：${buyCount})，消費總金額為(${totalPrice})，我們會盡快將產品派送到(${address})，敬請期待。\n，請到下方網址確認訂單（${link}）\n有任何問題可撥打(02)16881688，會有專人與您聯繫。`;
    const content =
      `您已完成 (${activityName}) 總金額為（${totalPrice}）元。您的取貨號碼為(${checkCode})。\n` +
      `當你收到此封簡訊，代表您確認購買此商品\n` +
      `本店小本生意，疫情期間已經很慘了，請不要棄單喔~\n` +
      `若您反悔請立即來電取消 0955562843，${sendAt}之後會有專人與您聯繫安排送貨。\n` +
      `加1團隊之後也會推出更多團購商品。`;
    return this.send(phone, content);
  }
}
export default new SendEmailService();
