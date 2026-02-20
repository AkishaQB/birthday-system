import { EmployeeService } from "@/services/employee.service";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const employee = await EmployeeService.create(body);

  return NextResponse.json(employee);
}

export async function GET() {
  const employees = await EmployeeService.list();
  return NextResponse.json(employees);
}
