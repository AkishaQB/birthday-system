import cron from "node-cron";
import { processTodaysBirthdays } from "@/lib/birthdayProcessor";

let started = false;

export async function startSendScheduler() {
  if (started) return; // prevent duplicates
  started = true;

  console.log("Starting send scheduler...");
  await processTodaysBirthdays();
  //   cron.schedule("9 13 * * *", async () => {
  //     console.log("Running birthday send cron...");

  //     await processTodaysBirthdays();
  //   });
}
