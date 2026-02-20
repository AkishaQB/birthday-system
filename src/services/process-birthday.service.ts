import { sendBirthdayEmail } from "@/lib/emailService";
import { prisma } from "@/lib/prisma";
import { renderHtmlToImage } from "@/lib/renderHtmlToImage";
import { EmailLogService } from "@/services/email-log.service";

export async function processTodaysBirthdays() {
  const today = new Date();

  const events = await prisma.birthdayEvent.findMany({
    where: {
      status: "APPROVED",
      employee: {
        birthdayMonth: today.getMonth() + 1,
        birthdayDay: today.getDate(),
      },
    },
    include: {
      employee: true,
    },
  });
  console.log(`Found ${events.length} birthday events to process.`);
  for (const event of events) {
    try {
      const imageBuffer = await renderHtmlToImage(event.htmlContent || "");
      console.log(`imageBuffer size: ${imageBuffer.length}`);

      if (!event.employee?.email) {
        throw new Error(`No recipient email for event ${event.id}`);
      }

      await sendBirthdayEmail({
        to: event.employee.email,
        imageBuffer,
      });

      await prisma.birthdayEvent.update({
        where: { id: event.id },
        data: { status: "SENT" },
      });
      await EmailLogService.logEmailSent(event.id);
    } catch (error) {
      console.error("Error processing birthday event ID " + event.id, error);
      await prisma.birthdayEvent.update({
        where: { id: event.id },
        data: { status: "FAILED" },
      });
    }
  }
}
