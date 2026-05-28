import { chromium, Page } from "playwright";
import fs from "fs";

const BASE_URL = "http://localhost:3000";
const OUT_DIR = "docs/screenshots";

async function shot(page: Page, name: string) {
  await page.screenshot({
    path: `${OUT_DIR}/${name}.png`,
    fullPage: true,
  });

  console.log(`saved ${OUT_DIR}/${name}.png`);
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const browser = await chromium.launch({
    headless: false,
    slowMo: 500,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  await page.goto(BASE_URL);
  await shot(page, "01-home");

  await page.goto(`${BASE_URL}/request/new`);
  await shot(page, "02-request-form");

  await page.fill('input[name="citizen_name"]', "สมชาย ใจดี");
  await page.fill('input[name="citizen_phone"]', "0812345678");
  await page.selectOption('select[name="category_id"]', { index: 1 });
  await page.fill('input[name="title"]', "ตัดต้นไม้แนวสายไฟฟ้า");
  await page.fill(
    'textarea[name="description"]',
    "มีต้นไม้ใกล้แนวสายไฟฟ้า ต้องการให้เจ้าหน้าที่ตรวจสอบ"
  );

  await page.click("text=ส่งคำร้อง");
  await page.waitForURL(/request\/success/);
  await shot(page, "03-success");

  await page.goto(`${BASE_URL}/request/track`);
  await shot(page, "04-track-page");

  await page.goto(`${BASE_URL}/login`);
  await shot(page, "05-login");

  await page.fill('input[type="email"]', "admin@danthaptako.local");
  await page.fill('input[type="password"]', "Admin123!");
  await page.click("text=เข้าสู่ระบบ");
  await page.waitForURL(/admin\/dashboard/);
  await shot(page, "06-admin-dashboard");

  await page.goto(`${BASE_URL}/staff/requests`);
  await shot(page, "07-staff-requests");

  await page.goto(`${BASE_URL}/admin/categories`);
  await shot(page, "08-admin-categories");

  await page.goto(`${BASE_URL}/admin/users`);
  await shot(page, "09-admin-users");

  await browser.close();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
