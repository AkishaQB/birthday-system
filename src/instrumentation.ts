export async function register() {
  console.log(
    "Instrumentation register called. Runtime:",
    process.env.NEXT_RUNTIME,
  );
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startCreateScheduler } =
      await import("@/scheduler/createScheduler");
    const { startSendScheduler } = await import("@/scheduler/sendScheduler");

    startCreateScheduler();
    startSendScheduler();
  }
}
