import cron from "node-cron";
import activityService from "../service/activityService";

// update service status

let task = cron.schedule("0 * * * * *", async () => {
  console.log("cron start");
  await activityService.updateAllActivityStatus();
  console.log("cron end");
});

let tasks = [task];
export function start() {
  tasks.forEach((task) => {
    task.start();
  });
}
