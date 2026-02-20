import { parentPort, workerData } from "worker_threads";
import puppeteer from "puppeteer";

async function run() {
  const html = workerData.html;

  const browser = await puppeteer.launch({ headless: true });

  try {
    const page = await browser.newPage();

    await page.setViewport({ width: 1080, height: 1080 });
    await page.setContent(html);

    const image = await page.screenshot({ type: "png" });

    parentPort?.postMessage(image);
  } finally {
    await browser.close();
  }
}

run();
