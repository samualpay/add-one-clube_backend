import nodeMailer from "nodemailer";
import { Activity } from "../entity/Activity";
import logService from "./logService";
import { LogLevel } from "../enum/LogLevel";
const author = {
  user: "samualpay@gmail.com",
  pass: "Aa3558562",
};
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: author,
});
type sendProp = {
  from: string;
  to: string;
  subject: string;
  html: string;
};
class SendEmailService {
  send(mailOptions: sendProp) {
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        logService.log({
          level: LogLevel.ERROR,
          key: "EMAIL",
          content: JSON.stringify(err),
        });
      } else {
        logService.log({
          level: LogLevel.INFO,
          key: "EMAIL",
          content: JSON.stringify(info),
        });
      }
    });
  }
  sendBuyLink(activityName: string, link: string, recevier: string) {
    const mailOptions = {
      from: author.user,
      to: recevier,
      subject: `Add one club ${activityName}預購成功`,
      html: `<h1>恭喜你預購<b>${activityName}</b>成功</h1><p>請於以下連結輸入購買資訊<a href="${link}">${link}</a></p>`,
    };
    this.send(mailOptions);
  }
  sendAfterBuyEmail(
    recevier: string,
    activityCode: string,
    activityName: string,
    buyCount: number,
    totalPrice: number,
    address: string,
    link: string
  ) {
    const content = `<div>
    <h1>感謝您購買(${activityCode})</h1>
  </div>
  <div>
    <h2>訂單資訊</h2>
  </div>
  <div>
    <ul>
      <li>品名：${activityCode}</li>
      <li>數量：${buyCount}</li>
      <li>消費總金額：${totalPrice}</li>
      <li>地址：${address}</li>
    </ul>
  </div>
  <p>我們會盡快將產品派送到(${address})，敬請期待。</p>
  <p>您可於下方網址確認訂單狀態。</p>
  <p><a href="${link}">${link}</a></p>
  <p>有任何問題可撥打(02)16881688，會有專人與您聯繫。</p>`;
    const mailOptions = {
      from: author.user,
      to: recevier,
      subject: `Add one club ${activityName}購成功`,
      html: content,
    };
    this.send(mailOptions);
  }
}
export default new SendEmailService();
