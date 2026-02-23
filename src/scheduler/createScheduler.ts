import cron from "node-cron";
import { BirthdayService } from "@/services/birthday.service";
import { BirthdayGenerationService } from "@/services/birthday-generation.service";

let started = false;

export function startCreateScheduler() {
  if (started) return; // prevent duplicates
  started = true;

  console.log("Starting scheduler...");

  cron.schedule("* * * * *", async () => {
    console.log("Running birthday cron...");

    const events = await BirthdayService.createUpcomingEvents();
    console.log("Events created:", events);
    await BirthdayGenerationService.generateBirthdayCards();
  });
}
