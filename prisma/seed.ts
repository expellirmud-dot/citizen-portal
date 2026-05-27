import "dotenv/config";
import { PrismaClient, UserRole } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const adminPassword = await bcrypt.hash("Admin123!", 10);

  const adminDept = await prisma.department.upsert({
    where: { name: "งานธุรการ" },
    update: {},
    create: {
      name: "งานธุรการ",
      description: "หน่วยงานธุรการกลาง",
    },
  });

  await prisma.department.upsert({
    where: { name: "กองช่าง" },
    update: {},
    create: {
      name: "กองช่าง",
      description: "งานโครงสร้างพื้นฐาน",
    },
  });

  await prisma.department.upsert({
    where: { name: "กองสาธารณสุข" },
    update: {},
    create: {
      name: "กองสาธารณสุข",
      description: "งานสาธารณสุข",
    },
  });

  const categories = [
    "ร้องเรียนทั่วไป",
    "แจ้งปัญหาสาธารณูปโภค",
    "ขอรับบริการ",
    "ข้อเสนอแนะ",
  ];

  for (const name of categories) {
    await prisma.requestCategory.upsert({
      where: { name },
      update: {},
      create: {
        name,
      },
    });
  }

  await prisma.user.upsert({
    where: {
      email: "admin@danthaptako.local",
    },
    update: {},
    create: {
      email: "admin@danthaptako.local",
      passwordHash: adminPassword,
      fullName: "ผู้ดูแลระบบ",
      role: UserRole.ADMIN,
      departmentId: adminDept.id,
    },
  });

  console.log("Seed complete");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });