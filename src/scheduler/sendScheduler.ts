import { processTodaysBirthdays } from "@/services/process-birthday.service";
import cron from "node-cron";

let started = false;

export async function startSendScheduler() {
  if (started) return; // prevent duplicates
  started = true;

  console.log("Starting send scheduler...");
  cron.schedule("0 8 * * *", async () => {
    await processTodaysBirthdays();
  });
}
