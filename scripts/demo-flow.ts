import { chromium } from "playwright";

async function main() {
  const browser = await chromium.launch({ headless: false, slowMo: 500 });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  await page.goto("http://localhost:3000");
  await page.screenshot({ path: "demo-01-home.png", fullPage: true });

  await page.click("text=ยื่นคำร้องออนไลน์");
  await page.screenshot({ path: "demo-02-request-form.png", fullPage: true });

  await page.fill('input[name="citizen_name"]', "สมชาย ใจดี");
  await page.fill('input[name="citizen_phone"]', "0812345678");
  await page.selectOption('select[name="category_id"]', { index: 1 });
  await page.fill('input[name="title"]', "ตัดต้นไม้แนวสายไฟฟ้า");
  await page.fill('textarea[name="description"]', "มีต้นไม้ใกล้แนวสายไฟฟ้า ต้องการให้เจ้าหน้าที่ตรวจสอบ");

  await page.click("text=ส่งคำร้อง");
  await page.waitForURL(/request\/success/);
  await page.screenshot({ path: "demo-03-success.png", fullPage: true });

  await page.goto("http://localhost:3000/login");
  await page.fill('input[type="email"]', "admin@danthaptako.local");
  await page.fill('input[type="password"]', "Admin123!");
  await page.click("text=เข้าสู่ระบบ");
  await page.waitForURL(/admin\/dashboard/);
  await page.screenshot({ path: "demo-04-admin-dashboard.png", fullPage: true });

  await page.goto("http://localhost:3000/staff/requests");
  await page.screenshot({ path: "demo-05-staff-requests.png", fullPage: true });

  await browser.close();
}

main();