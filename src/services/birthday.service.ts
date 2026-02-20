import { prisma } from "@/lib/prisma";
import { BirthdayStatus, CreateEventsResponse } from "@/utils/types";
import { BirthdayEvent, PrismaClient } from "@prisma/client";

export class BirthdayService {
  static async createUpcomingEvents() {
    const currentDate = new Date();
    const targetDate = new Date(
      currentDate.getTime() + 2 * 24 * 60 * 60 * 1000,
    );
    console.log("Target date for birthday events:", targetDate.getMonth());
    const upcomingBirthdays = await prisma.employee.findMany({
      where: {
        birthdayMonth: targetDate.getMonth() + 1, // getMonth is 0-indexed
        birthdayDay: targetDate.getDate(),
      },
    });
    const eventPromise: Promise<BirthdayEvent>[] = [];
    console.log("upcomingBirthdays", upcomingBirthdays);

    for (const birthday of upcomingBirthdays) {
      eventPromise.push(
        prisma.birthdayEvent.create({
          data: {
            employeeId: birthday.id,
            status: "PENDING_GENERATION",
            year: targetDate.getFullYear(),
          },
        }),
      );
    }
    return Promise.allSettled(eventPromise);
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
    return prisma.birthdayEvent.findMany({
      where: {
        status: "APPROVED",
        employee: {
          birthdayMonth: new Date().getMonth() + 1,
          birthdayDay: new Date().getDate(),
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
