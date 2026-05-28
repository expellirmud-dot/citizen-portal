import { chromium, Browser, Page } from "playwright";
import path from "path";
import fs from "fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function runTests() {
  console.log("🚀 Starting Smoke Tests...");
  console.log(`🌍 Target URL: ${BASE_URL}`);

  const browser: Browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page: Page = await context.newPage();

  try {
    // --- 1. Citizen Request Form Validation ---
    console.log("\n📝 Testing Citizen Request Form...");

    // Case: Empty fields
    await page.goto(`${BASE_URL}/request/new`);
    await page.click('button:has-text("ส่งคำร้อง")');
    let errorBox = await page.waitForSelector('.bg-red-50', { timeout: 5000 });
    let errorText = await errorBox.textContent();
    if (errorText?.includes("กรุณากรอกชื่อ-นามสกุล")) {
      console.log("✅ Empty fields validation: PASS");
    } else {
      console.log(`❌ Empty fields validation: FAIL (Found: "${errorText?.trim()}")`);
    }

    // Case: Invalid phone
    await page.goto(`${BASE_URL}/request/new`);
    await page.fill('input[name="citizen_name"]', "Test User");
    await page.fill('input[name="citizen_phone"]', "123");
    await page.click('button:has-text("ส่งคำร้อง")');
    errorBox = await page.waitForSelector('.bg-red-50', { timeout: 5000 });
    errorText = await errorBox.textContent();
    if (errorText?.includes("กรุณาระบุเบอร์โทรศัพท์ให้ถูกต้อง")) {
      console.log("✅ Invalid phone validation: PASS");
    } else {
      console.log(`❌ Invalid phone validation: FAIL (Found: "${errorText?.trim()}")`);
    }

    // Case: Invalid file type PDF
    console.log("📄 Testing Invalid File Type (PDF)...");
    await page.goto(`${BASE_URL}/request/new`);
    await page.fill('input[name="citizen_name"]', "Test User");
    await page.fill('input[name="citizen_phone"]', "0812345678");
    await page.selectOption('select[name="category_id"]', { index: 1 });
    await page.fill('input[name="title"]', "Test Title");
    await page.fill('textarea[name="description"]', "Test Description should be long enough");
    
    const testPdfPath = path.join(process.cwd(), "test-file.pdf");
    fs.writeFileSync(testPdfPath, "dummy pdf content");
    await page.setInputFiles('input[type="file"]', testPdfPath);
    
    await page.click('button:has-text("ส่งคำร้อง")');
    errorBox = await page.waitForSelector('.bg-red-50', { timeout: 5000 });
    errorText = await errorBox.textContent();
    if (errorText?.includes("รองรับเฉพาะไฟล์รูปภาพ")) {
      console.log("✅ Invalid file type validation (PDF): PASS");
    } else {
      console.log(`❌ Invalid file type validation (PDF): FAIL (Found: "${errorText?.trim()}")`);
    }
    fs.unlinkSync(testPdfPath);

    // Case: Valid submission
    console.log("📨 Testing Valid Request Submission...");
    await page.goto(`${BASE_URL}/request/new`);
    await page.fill('input[name="citizen_name"]', "นายสมชาย ทดสอบ");
    await page.fill('input[name="citizen_phone"]', "0812345678");
    await page.selectOption('select[name="category_id"]', { index: 1 });
    await page.fill('input[name="title"]', "ทดสอบยื่นคำร้องผ่านระบบ Automation");
    await page.fill('textarea[name="description"]', "นี่คือการทดสอบโดยใช้ Playwright Smoke Test เพื่อยืนยันว่าระบบทำงานได้ปกติและสามารถส่งข้อมูลได้สำเร็จ");
    
    await page.click('button:has-text("ส่งคำร้อง")');
    await page.waitForURL(/success/, { timeout: 10000 });
    console.log("✅ Valid request submission: PASS");

    // --- 2. Admin Login ---
    console.log("\n🔐 Testing Admin Login...");
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', "admin@danthaptako.local");
    await page.fill('input[type="password"]', "Admin123!");
    await page.click('button:has-text("เข้าสู่ระบบ")');
    
    await page.waitForURL(/admin\/dashboard/, { timeout: 10000 });
    console.log("✅ Admin Login: PASS");

    // --- 3. Category Duplicate Validation ---
    console.log("\n📁 Testing Category Duplicate Validation...");
    await page.goto(`${BASE_URL}/admin/categories`);
    
    await page.fill('input[placeholder="เช่น ไฟฟ้าส่องสว่าง"]', "คำร้องทั่วไป");
    await page.click('button:has-text("เพิ่มข้อมูล")');
    
    const duplicateError = await page.waitForSelector('.text-red-600', { timeout: 5000 });
    errorText = await duplicateError.textContent();
    if (errorText?.includes("ชื่อหมวดหมู่ี้มีอยู่ในระบบแล้ว") || errorText?.includes("มีอยู่ในระบบแล้ว")) {
      console.log("✅ Category duplicate validation: PASS");
    } else {
      console.log(`❌ Category duplicate validation: FAIL (Found: "${errorText?.trim()}")`);
    }

    console.log("\n✨ All smoke tests completed successfully.");
  } catch (error) {
    console.error("\n❌ Smoke tests failed with error:");
    console.error(error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runTests();
