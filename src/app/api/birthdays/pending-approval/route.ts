import { BirthdayService } from "@/services/birthday.service";
import { NextResponse } from "next/server";

export async function GET() {
  const events = await BirthdayService.getReadyForApproval();

  return NextResponse.json(events);
}
