import { Request, Response } from "express";
import { Rout } from "type/Rout";
import BaseController from "./BaseController";
import multer from "multer";
import fs from "fs";
const imageDirPath = `${__dirname}/../public/images`;
const videoDirPath = `${__dirname}/../public/videos`;
function getExtension(fileName: string) {
  return fileName.substr(fileName.lastIndexOf(".") + 1);
}
function getFilenameWithoutExtension(fileName: string) {
  let name = fileName.substring(0, fileName.lastIndexOf("."));
  return Buffer.from(name).toString("base64");
}
const storageImage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(imageDirPath)) {
      fs.mkdirSync(imageDirPath, { recursive: true });
    }
    cb(null, imageDirPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      getFilenameWithoutExtension(file.originalname) +
        "-" +
        Date.now() +
        `.${getExtension(file.originalname)}`
    );
  },
});
const storageVideo = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!fs.existsSync(videoDirPath)) {
      fs.mkdirSync(videoDirPath, { recursive: true });
    }
    cb(null, videoDirPath);
  },
  filename: function (req, file, cb) {
    cb(
      null,
      getFilenameWithoutExtension(file.originalname) +
        "-" +
        Date.now() +
        `.${getExtension(file.originalname)}`
    );
  },
});
const uploadImage = multer({ storage: storageImage });
const uploadVideo = multer({ storage: storageVideo });

class UploadController extends BaseController {
  public path = "/api/upload";
  initRoutes(): Rout[] {
    return [
      {
        action: "/image",
        method: "post",
        middleware: [uploadImage.single("image")],
        runner: this.uploadImage,
      },
      {
        action: "/video",
        method: "post",
        middleware: [uploadVideo.single("video")],
        runner: this.uploadVideo,
      },
    ];
  }
  private async uploadImage(req: Request, res: Response) {
    res.json({ filename: req.file.filename });
  }
  private async uploadVideo(req: Request, res: Response) {
    res.json({ filename: req.file.filename });
  }
}
export default UploadController;
