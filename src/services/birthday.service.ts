import { prisma } from "@/lib/prisma";

export class BirthdayService {
  static async createUpcomingEvents() {
    const currentDate = new Date();
    const targetDate = new Date(currentDate);
    targetDate.setDate(currentDate.getDate() + 2);
    targetDate.setHours(0, 0, 0, 0);

    const upcomingBirthdays = await prisma.employee.findMany({
      where: {
        birthdayMonth: targetDate.getMonth() + 1, // getMonth is 0-indexed
        birthdayDay: targetDate.getDate(),
      },
    });
    console.log("upcomingBirthdays", upcomingBirthdays);
    const currentYear = targetDate.getFullYear();

    // Idempotency check: Ensure we don't create duplicates for this year
    const existingEvents = await prisma.birthdayEvent.findMany({
      where: {
        year: currentYear,
        employeeId: { in: upcomingBirthdays.map((e) => e.id) },
      },
      select: { employeeId: true },
    });

    const existingEmployeeIds = new Set(
      existingEvents.map((e) => e.employeeId),
    );
    const eventsToCreate = upcomingBirthdays.filter(
      (e) => !existingEmployeeIds.has(e.id),
    );
    console.log("eventsToCreate", eventsToCreate);

    const results = await Promise.allSettled(
      eventsToCreate.map((birthday) =>
        prisma.birthdayEvent.create({
          data: {
            employeeId: birthday.id,
            status: "PENDING_GENERATION",
            dateOfBirth: new Date(
              currentYear,
              birthday.birthdayMonth - 1,
              birthday.birthdayDay,
            ),
            year: currentYear,
          },
        }),
      ),
    );

    const failed = results.filter((r) => r.status === "rejected");
    if (failed.length > 0) {
      console.error(
        `Failed to create ${failed.length} birthday events:`,
        failed.map((r) => (r as PromiseRejectedResult).reason),
      );
    }

    return results;
  }
  static async getReadyForApproval() {
    return prisma.birthdayEvent.findMany({
      where: {
        status: "READY_FOR_APPROVAL",
      },
      include: {
        employee: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
  }
  static async approveEvent(eventId: string) {
    const event = await prisma.birthdayEvent.findUnique({
      where: { id: eventId },
    });

    if (!event) throw new Error("Event not found");

    // 🔥 State validation
    if (event.status !== "READY_FOR_APPROVAL") {
      throw new Error("Invalid state transition");
    }

    return prisma.birthdayEvent.update({
      where: { id: eventId },
      data: {
        status: "APPROVED",
        approvedAt: new Date(),
      },
    });
  }
  static async markEventAsSent(eventId: string) {
    const event = await prisma.birthdayEvent.findUnique({
      where: { id: eventId },
    });
    if (!event) throw new Error("Event not found");

    // 🔥 State validation
    if (event.status !== "APPROVED") {
      throw new Error("Invalid state transition");
    }

    return prisma.birthdayEvent.update({
      where: { id: eventId },
      data: {
        status: "SENT",
        sentAt: new Date(),
      },
    });
  }
  static async getApprovedEvents() {
    const today = new Date();
    return prisma.birthdayEvent.findMany({
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
      orderBy: {
        approvedAt: "asc",
      },
    });
  }
}
