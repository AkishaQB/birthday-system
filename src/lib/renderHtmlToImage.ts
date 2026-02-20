import puppeteer from "puppeteer";

export async function renderHtmlToImage(html: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    headless: true, // headless mode
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  try {
    const page = await browser.newPage();

    // Set fixed viewport for consistent image size
    await page.setViewport({
      width: 800,
      height: 600,
      deviceScaleFactor: 2, // higher resolution
    });

    // Load the HTML
    await page.setContent(html, {
      waitUntil: "networkidle0",
    });

    // Optional: wait for fonts
    await page.evaluateHandle("document.fonts.ready");

    // Take screenshot
    const imageBuffer = await page.screenshot({
      type: "png",
      fullPage: false,
    });

    return imageBuffer as Buffer;
  } finally {
    await browser.close();
  }
}
