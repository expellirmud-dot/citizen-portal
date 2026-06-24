import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/db";
import { uploadRequestAttachment } from "@/lib/supabase-storage";

const requestSchema = z.object({
  citizen_name: z.string().min(2),
  citizen_phone: z.string().min(8),
  citizen_email: z.string().email().optional().or(z.literal("")),
  category_id: z.string().min(1),
  title: z.string().min(3),
  description: z.string().min(10),
});

const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

async function generateTrackingNumber() {
  const year = new Date().getFullYear();
  const count = await prisma.request.count();
  const running = String(count + 1).padStart(6, "0");
  return `REQ-${year}-${running}`;
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const raw = {
      citizen_name: String(formData.get("citizen_name") ?? ""),
      citizen_phone: String(formData.get("citizen_phone") ?? ""),
      citizen_email: String(formData.get("citizen_email") ?? ""),
      category_id: String(formData.get("category_id") ?? ""),
      title: String(formData.get("title") ?? ""),
      description: String(formData.get("description") ?? ""),
    };

    const parsed = requestSchema.safeParse(raw);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: "ข้อมูลไม่ครบถ้วนหรือรูปแบบไม่ถูกต้อง",
          },
        },
        { status: 400 }
      );
    }

    const category = await prisma.requestCategory.findFirst({
      where: {
        id: parsed.data.category_id,
        isActive: true,
      },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "CATEGORY_NOT_FOUND",
            message: "ไม่พบประเภทคำร้อง",
          },
        },
        { status: 404 }
      );
    }

    const trackingNumber = await generateTrackingNumber();

    let attachmentPath = null;
    const file = formData.get("attachment") as File | null;

    if (file && file.size > 0) {
      if (!ALLOWED_MIME_TYPES.includes(file.type)) {
        return NextResponse.json(
          { success: false, error: { code: "INVALID_FILE_TYPE", message: "รองรับเฉพาะไฟล์รูปภาพ (JPG, PNG, WEBP)" } },
          { status: 400 }
        );
      }
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json(
          { success: false, error: { code: "FILE_TOO_LARGE", message: "ขนาดไฟล์ต้องไม่เกิน 5MB" } },
          { status: 400 }
        );
      }

      attachmentPath = await uploadRequestAttachment(file, trackingNumber);
    }

    const created = await prisma.request.create({
      data: {
        trackingNumber,
        citizenName: parsed.data.citizen_name,
        citizenPhone: parsed.data.citizen_phone,
        citizenEmail: parsed.data.citizen_email || null,
        categoryId: parsed.data.category_id,
        title: parsed.data.title,
        description: parsed.data.description,
        attachmentPath,
        currentStatus: "NEW",
        statusHistory: {
          create: {
            previousStatus: null,
            newStatus: "NEW",
            note: "ระบบรับคำร้องแล้ว",
          },
        },
      },
      select: {
        trackingNumber: true,
        currentStatus: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        tracking_number: created.trackingNumber,
        status: created.currentStatus,
        message: "ส่งคำร้องเรียบร้อยแล้ว",
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: {
          code: "SERVER_ERROR",
          message: "เกิดข้อผิดพลาดในระบบ",
        },
      },
      { status: 500 }
    );
  }
}
