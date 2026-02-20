import { Worker } from "worker_threads";
import path from "path";

export class RenderingService {
  static htmlToImage(html: string): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(
        path.resolve("src/workers/html-render.worker.ts"),
        {
          workerData: { html },
        },
      );

      worker.on("message", (data) => {
        resolve(data);
      });

      worker.on("error", reject);

      worker.on("exit", (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with code ${code}`));
        }
      });
    });
  }
}
