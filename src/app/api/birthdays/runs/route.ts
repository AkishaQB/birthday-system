import { NextResponse } from "next/server";
import { BirthdayService } from "@/services/birthday.service";
import { BirthdayGenerationService } from "@/services/birthday-generation.service";

export async function POST() {
  const events = await BirthdayService.createUpcomingEvents();
  const generationResult =
    await BirthdayGenerationService.generateBirthdayCards();
  return NextResponse.json({ events, generationResult });
}
