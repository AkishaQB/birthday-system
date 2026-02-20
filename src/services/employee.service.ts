import { prisma } from "@/lib/prisma";

export class EmployeeService {
  static async create(data: {
    name: string;
    email: string;
    birthdayMonth: number;
    birthdayDay: number;
  }) {
    return prisma.employee.create({
      data,
    });
  }

  static async list() {
    return prisma.employee.findMany();
  }
}
