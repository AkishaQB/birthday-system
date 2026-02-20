import { startSendScheduler } from "@/scheduler/sendScheduler";

export async function GET() {
  await startSendScheduler();
  return Response.json({ success: true });
}
