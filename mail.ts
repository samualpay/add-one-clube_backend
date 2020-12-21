import nodeMailer from "nodemailer";
const transporter = nodeMailer.createTransport({
  service: "gmail",
  auth: {
    user: "samualpay@gmail.com",
    pass: "Aa3558562",
  },
});
const mailOptions = {
  from: "samualpay@gmail.com",
  to: "samualpay@yahoo.com.tw",
  subject: `Add one club XXXX預購成功`,
  html: `<h1>恭喜你預購<b>XXXX</b>成功</h1><p>請於以下連結輸入購買資訊<a href="http://google.com">http://google.com</a></p>`,
};

transporter.sendMail(mailOptions, (err, info) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Email send: " + info.response);
  }
});
