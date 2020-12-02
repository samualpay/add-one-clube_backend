import App from "./app";

import bodyParser from "body-parser";
import TestController from "./controller/HomeController";
import UploadController from "./controller/UploadController";
import "reflect-metadata";
import AuthController from "./controller/Auth";
import MachineController from "./controller/Machine";
const port = process.env.PORT || "5000";
const app = new App({
  port: parseInt(port),
  controllers: [
    new TestController(),
    new UploadController(),
    new AuthController(),
    new MachineController(),
  ],
  middleWares: [bodyParser.json(), bodyParser.urlencoded({ extended: true })],
});
app.listen();
