import { startCreateScheduler } from "@/scheduler/createScheduler";

export async function GET() {
  await startCreateScheduler();
  return Response.json({ success: true });
}
