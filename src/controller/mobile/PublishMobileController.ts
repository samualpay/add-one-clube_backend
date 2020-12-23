import { Request, Response } from "express";
import { Rout } from "type/Rout";
import BaseController from "../BaseController";
import { Publish } from "../../entity/Publish";
import publishService from "../../service/publishService";
const publishMobilePage =
  process.env.PUBLISH_MOBILE_PAGE || "http://localhost:3000/mobile/publish";
type CreateProps = {
  activityId: number;
  machineId: number;
};

function addUrlForPublish(publish: Publish) {
  let url = `${publishMobilePage}/${publish.id}`;
  return { url, ...publish };
}
function addUrlForPublishs(publishs: Publish[]) {
  return publishs.map((publish) => addUrlForPublish(publish));
}
class PublishMobileController extends BaseController {
  public path = "/api/mobile/publishs";
  initRoutes(): Rout[] {
    return [
      {
        action: "/:id",
        method: "get",
        middleware: [],
        runner: this.findById,
      },
    ];
  }

  private async findById(req: Request, res: Response) {
    let id: number = parseInt(req.params.id);
    let result = await publishService.findByIdForMobile(id);
    res.json(result);
  }
}
export default PublishMobileController;
