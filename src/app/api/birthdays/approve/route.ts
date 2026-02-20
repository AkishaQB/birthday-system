import { NextResponse } from "next/server";
import { BirthdayService } from "@/services/birthday.service";

export async function POST(req: Request) {
  const body = await req.json();

  const event = await BirthdayService.approveEvent(body.eventId);

  return NextResponse.json(event);
}
