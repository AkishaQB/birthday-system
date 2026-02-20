import { prisma } from "@/lib/prisma";
import { generateBirthdayHTML } from "@/templates/birthday.template";

export class BirthdayGenerationService {
  static async generateBirthdayCards() {
    const pendingBirthdays = await prisma.birthdayEvent.findMany({
      where: {
        status: "PENDING_GENERATION",
      },
    });
    for (const birthday of pendingBirthdays) {
      try {
        await prisma.birthdayEvent.update({
          where: { id: birthday.id },
          data: { status: "GENERATING" },
        });
        const htmlContent: string = await new Promise((resolve) =>
          setTimeout(
            () => resolve(generateBirthdayHTML(birthday.employeeId)),
            2000,
          ),
        );
        await prisma.birthdayEvent.update({
          where: { id: birthday.id },
          data: {
            status: "READY_FOR_APPROVAL",
            htmlContent: htmlContent,
          },
        });
      } catch (error) {
        console.error(
          `Error generating birthday card for event ID ${birthday.id}:`,
          error,
        );
        await prisma.birthdayEvent.update({
          where: { id: birthday.id },
          data: { status: "FAILED" },
        });
      }
    }
  }
}
