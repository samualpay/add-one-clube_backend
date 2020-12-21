import nodeMailer from "nodemailer";
import { Activity } from "../entity/Activity";
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: "samualpay@gmail.com",
    pass: "Aa3558562",
  },
});
class SendEmailService {
  sendBuyLink(activityName: string, link: string, recevier: string) {
    const mailOptions = {
      from: "samualpay@gmail.com",
      to: recevier,
      subject: `Add one club ${activityName}預購成功`,
      html: `<h1>恭喜你預購<b>${activityName}</b>成功</h1><p>請於以下連結輸入購買資訊<a href="${link}">${link}</a></p>`,
    };
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error(err);
      } else {
        console.log("Email send: " + info.response);
      }
    });
  }
}
export default new SendEmailService();
