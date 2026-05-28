import { chromium, Page } from "playwright";
import fs from "fs";
import { PrismaClient } from "@prisma/client";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const OUT_DIR = "docs/screenshots";

async function shot(page: Page, name: string) {
  // Wait a bit for any animations to finish
  await page.waitForTimeout(1000);
  await page.screenshot({
    path: `${OUT_DIR}/${name}.png`,
    fullPage: false, // User requested viewport 1440x900, usually non-fullPage is better for "polished" look unless specified
  });

  console.log(`✅ Saved ${OUT_DIR}/${name}.png`);
}

async function main() {
  console.log("📸 Starting Screenshot Capture Flow...");
  
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }

  const browser = await chromium.launch({
    headless: true,
  });

  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  // 01-home
  console.log("Capturing 01-home...");
  await page.goto(BASE_URL);
  await shot(page, "01-home");

  // 02-request-form
  console.log("Capturing 02-request-form...");
  await page.goto(`${BASE_URL}/request/new`);
  await shot(page, "02-request-form");

  // 03-request-success
  console.log("Capturing 03-request-success...");
  await page.fill('input[name="citizen_name"]', "สมชาย ใจดี");
  await page.fill('input[name="citizen_phone"]', "0812345678");
  await page.selectOption('select[name="category_id"]', { index: 1 });
  await page.fill('input[name="title"]', "ทดสอบยื่นคำร้องผ่านระบบ Automation");
  await page.fill(
    'textarea[name="description"]',
    "นี่คือการทดสอบเพื่อบันทึกภาพหน้าจอความสำเร็จของระบบ"
  );
  await page.click('button:has-text("ส่งคำร้อง")');
  await page.waitForURL(/request\/success/);
  await shot(page, "03-request-success");

  // 04-track-request
  console.log("Capturing 04-track-request...");
  await page.goto(`${BASE_URL}/request/track`);
  await shot(page, "04-track-request");

  // 05-login
  console.log("Capturing 05-login...");
  await page.goto(`${BASE_URL}/login`);
  await shot(page, "05-login");

  // 06-admin-dashboard
  console.log("Capturing 06-admin-dashboard...");
  await page.fill('input[type="email"]', "admin@danthaptako.local");
  await page.fill('input[type="password"]', "Admin123!");
  await page.click('button:has-text("เข้าสู่ระบบ")');
  await page.waitForURL(/admin\/dashboard/);
  await shot(page, "06-admin-dashboard");

  // 07-staff-requests
  console.log("Capturing 07-staff-requests...");
  await page.goto(`${BASE_URL}/staff/requests`);
  await shot(page, "07-staff-requests");

  // 08-staff-request-detail
  console.log("Capturing 08-staff-request-detail...");
  // Click the first tracking number link
  await page.click('a[href^="/staff/requests/"]:first-child');
  await page.waitForURL(/\/staff\/requests\/[a-z0-9]+/);
  await shot(page, "08-staff-request-detail");

  // 09-admin-categories
  console.log("Capturing 09-admin-categories...");
  await page.goto(`${BASE_URL}/admin/categories`);
  await shot(page, "09-admin-categories");

  // 10-admin-users
  console.log("Capturing 10-admin-users...");
  await page.goto(`${BASE_URL}/admin/users`);
  await shot(page, "10-admin-users");

  await browser.close();
  console.log("\n✨ All screenshots captured in " + OUT_DIR);
}

main().catch((error) => {
  console.error("❌ Error during screenshot capture:", error);
  process.exit(1);
});
