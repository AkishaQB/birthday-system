import { prisma } from "@/lib/prisma";

export class EmailLogService {
  static async logEmailSent(eventId: string) {
    await prisma.emailLog.create({
      data: {
        birthdayEventId: eventId,
        sentAt: new Date(),
        status: "SENT",
      },
    });
  }
}
