import "dotenv/config";
import { PrismaClient, UserRole, RequestStatus } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  console.log("Starting database seed...");

  // --- Departments ---
  const deptNames = [
    "งานธุรการ",
    "กองช่าง",
    "กองสาธารณสุขและสิ่งแวดล้อม",
    "กองคลัง",
    "สำนักปลัด"
  ];
  const depts: Record<string, string> = {};

  for (const name of deptNames) {
    const dept = await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name, description: `หน่วยงาน ${name}` },
    });
    depts[name] = dept.id;
  }
  console.log(`Seeded ${deptNames.length} departments.`);

  // --- Categories ---
  const categoryNames = [
    "คำร้องทั่วไป",
    "แจ้งปัญหาไฟฟ้าสาธารณะ",
    "แจ้งปัญหาถนน/ทางเท้า",
    "แจ้งปัญหาขยะและสิ่งแวดล้อม",
    "แจ้งปัญหาน้ำประปา",
    "ขอรับบริการทั่วไป",
    "ข้อเสนอแนะ"
  ];
  const cats: Record<string, string> = {};

  for (const name of categoryNames) {
    const cat = await prisma.requestCategory.upsert({
      where: { name },
      update: {},
      create: { name },
    });
    cats[name] = cat.id;
  }
  console.log(`Seeded ${categoryNames.length} categories.`);

  // --- Users ---
  const adminPassword = await bcrypt.hash("Admin123!", 10);
  const staffPassword = await bcrypt.hash("Staff123!", 10);

  const adminUser = await prisma.user.upsert({
    where: { email: "admin@danthaptako.local" },
    update: {},
    create: {
      email: "admin@danthaptako.local",
      passwordHash: adminPassword,
      fullName: "ผู้ดูแลระบบ",
      role: UserRole.ADMIN,
      departmentId: depts["สำนักปลัด"],
    },
  });

  const staffUser = await prisma.user.upsert({
    where: { email: "staff@danthaptako.local" },
    update: {},
    create: {
      email: "staff@danthaptako.local",
      passwordHash: staffPassword,
      fullName: "เจ้าหน้าที่ ธุรการ",
      role: UserRole.STAFF,
      departmentId: depts["งานธุรการ"],
    },
  });

  const engineerUser = await prisma.user.upsert({
    where: { email: "engineer@danthaptako.local" },
    update: {},
    create: {
      email: "engineer@danthaptako.local",
      passwordHash: staffPassword,
      fullName: "นายช่าง โยธา",
      role: UserRole.STAFF,
      departmentId: depts["กองช่าง"],
    },
  });

  const healthUser = await prisma.user.upsert({
    where: { email: "health@danthaptako.local" },
    update: {},
    create: {
      email: "health@danthaptako.local",
      passwordHash: staffPassword,
      fullName: "นักวิชาการ สาธารณสุข",
      role: UserRole.STAFF,
      departmentId: depts["กองสาธารณสุขและสิ่งแวดล้อม"],
    },
  });
  console.log(`Seeded users.`);

  // --- Requests ---
  // Create realistic requests
  const requestsData = [
    {
      trackingNumber: "REQ-2605-0001",
      citizenName: "นายสมชาย ใจดี",
      citizenPhone: "0812345678",
      categoryId: cats["แจ้งปัญหาถนน/ทางเท้า"],
      title: "ถนนหน้าหมู่บ้านเป็นหลุมเป็นบ่อ",
      description: "ถนนทางเข้าหมู่บ้านสุขสันต์มีหลุมลึก รถสัญจรลำบากมากครับ",
      currentStatus: RequestStatus.NEW,
      assignedDepartmentId: null,
      history: [
        { status: RequestStatus.NEW, note: "Citizen submitted request" }
      ]
    },
    {
      trackingNumber: "REQ-2605-0002",
      citizenName: "นางสาวสมศรี เรียนรู้",
      citizenPhone: "0898765432",
      categoryId: cats["แจ้งปัญหาขยะและสิ่งแวดล้อม"],
      title: "รถขยะไม่มาเก็บ 3 วันแล้ว",
      description: "ซอย 4 รถขยะไม่เข้ามาเก็บขยะ ส่งกลิ่นเหม็นมาก",
      currentStatus: RequestStatus.RECEIVED,
      assignedDepartmentId: depts["งานธุรการ"],
      history: [
        { status: RequestStatus.NEW, note: "Citizen submitted request" },
        { status: RequestStatus.RECEIVED, changedByUserId: staffUser.id, note: "รับเรื่องแล้ว กำลังส่งต่อ" }
      ]
    },
    {
      trackingNumber: "REQ-2605-0003",
      citizenName: "คุณปิติ มานะ",
      citizenPhone: "0811112222",
      categoryId: cats["แจ้งปัญหาไฟฟ้าสาธารณะ"],
      title: "ไฟกิ่งหน้าปากซอยดับ",
      description: "ไฟส่องสว่างหน้าปากซอย 2 ดับมาสองคืนแล้ว อันตรายมาก",
      currentStatus: RequestStatus.UNDER_REVIEW,
      assignedDepartmentId: depts["กองช่าง"],
      history: [
        { status: RequestStatus.NEW, note: "Citizen submitted request" },
        { status: RequestStatus.RECEIVED, changedByUserId: staffUser.id, note: "รับเรื่อง" },
        { status: RequestStatus.UNDER_REVIEW, changedByUserId: engineerUser.id, note: "กองช่างกำลังตรวจสอบคิวงาน" }
      ]
    },
    {
      trackingNumber: "REQ-2605-0004",
      citizenName: "นางมาลี สวยงาม",
      citizenPhone: "0833334444",
      categoryId: cats["แจ้งปัญหาน้ำประปา"],
      title: "ท่อน้ำประปาแตก",
      description: "ท่อน้ำประปาแตกรั่วซึมหน้าบ้านเลขที่ 12/3 น้ำไหลทิ้งเยอะมาก",
      currentStatus: RequestStatus.IN_PROGRESS,
      assignedDepartmentId: depts["กองช่าง"],
      history: [
        { status: RequestStatus.NEW, note: "Citizen submitted request" },
        { status: RequestStatus.RECEIVED, changedByUserId: staffUser.id, note: "รับเรื่องส่งกองช่าง" },
        { status: RequestStatus.UNDER_REVIEW, changedByUserId: engineerUser.id, note: "ลงพื้นที่ตรวจสอบเบื้องต้น" },
        { status: RequestStatus.IN_PROGRESS, changedByUserId: engineerUser.id, note: "กำลังดำเนินการซ่อมแซมท่อที่แตก" }
      ]
    },
    {
      trackingNumber: "REQ-2605-0005",
      citizenName: "นายวิชัย รักษา",
      citizenPhone: "0855556666",
      categoryId: cats["คำร้องทั่วไป"],
      title: "ขอตัดต้นไม้ที่พาดสายไฟ",
      description: "กิ่งไม้ใหญ่พาดสายไฟหน้าบ้านเกรงว่าจะเป็นอันตรายตอนฝนตก",
      currentStatus: RequestStatus.COMPLETED,
      assignedDepartmentId: depts["กองช่าง"],
      history: [
        { status: RequestStatus.NEW, note: "Citizen submitted request" },
        { status: RequestStatus.RECEIVED, changedByUserId: staffUser.id, note: "รับเรื่อง" },
        { status: RequestStatus.IN_PROGRESS, changedByUserId: engineerUser.id, note: "กำลังดำเนินการตัดแต่งกิ่งไม้" },
        { status: RequestStatus.COMPLETED, changedByUserId: engineerUser.id, note: "ตัดต้นไม้เรียบร้อยแล้ว" }
      ]
    },
    {
      trackingNumber: "REQ-2605-0006",
      citizenName: "คุณสุดา พัฒนา",
      citizenPhone: "0877778888",
      categoryId: cats["ขอรับบริการทั่วไป"],
      title: "ขอฉีดพ่นยุงลาย",
      description: "ในหมู่บ้านมียุงเยอะมากช่วงนี้ ขอให้มาฉีดพ่นหมอกควันป้องกันไข้เลือดออก",
      currentStatus: RequestStatus.CLOSED,
      assignedDepartmentId: depts["กองสาธารณสุขและสิ่งแวดล้อม"],
      history: [
        { status: RequestStatus.NEW, note: "Citizen submitted request" },
        { status: RequestStatus.RECEIVED, changedByUserId: staffUser.id, note: "ส่งต่อกองสาธารณสุข" },
        { status: RequestStatus.IN_PROGRESS, changedByUserId: healthUser.id, note: "ออกพ่นหมอกควัน" },
        { status: RequestStatus.COMPLETED, changedByUserId: healthUser.id, note: "ดำเนินการเสร็จสิ้น" },
        { status: RequestStatus.CLOSED, changedByUserId: staffUser.id, note: "ปิดงาน" }
      ]
    },
    {
      trackingNumber: "REQ-2605-0007",
      citizenName: "นายธนา ทำดี",
      citizenPhone: "0866669999",
      categoryId: cats["ข้อเสนอแนะ"],
      title: "เสนอแนะการจัดการจราจรตลาดนัด",
      description: "วันตลาดนัดรถติดมาก อยากให้จัดระเบียบการจอดรถใหม่",
      currentStatus: RequestStatus.RECEIVED,
      assignedDepartmentId: depts["สำนักปลัด"],
      history: [
        { status: RequestStatus.NEW, note: "Citizen submitted request" },
        { status: RequestStatus.RECEIVED, changedByUserId: staffUser.id, note: "รับเรื่องเพื่อนำเสนอที่ประชุม" }
      ]
    }
  ];

  for (const rData of requestsData) {
    const existing = await prisma.request.findUnique({
      where: { trackingNumber: rData.trackingNumber }
    });

    if (!existing) {
      const createdReq = await prisma.request.create({
        data: {
          trackingNumber: rData.trackingNumber,
          citizenName: rData.citizenName,
          citizenPhone: rData.citizenPhone,
          categoryId: rData.categoryId,
          title: rData.title,
          description: rData.description,
          currentStatus: rData.currentStatus,
          assignedDepartmentId: rData.assignedDepartmentId,
        }
      });

      // Insert history
      let previousStatus: RequestStatus | null = null;
      for (const h of rData.history) {
        await prisma.requestStatusHistory.create({
          data: {
            requestId: createdReq.id,
            previousStatus: previousStatus,
            newStatus: h.status,
            changedByUserId: 'changedByUserId' in h ? h.changedByUserId as string : null,
            note: h.note
          }
        });
        previousStatus = h.status;
      }
    }
  }
  console.log(`Seeded ${requestsData.length} demo requests.`);

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
