import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ success: false, error: { message: "Unauthorized" } }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { name, description } = await request.json();

    if (!name) {
      return NextResponse.json({ success: false, error: { message: "กรุณาระบุชื่อหมวดหมู่" } }, { status: 400 });
    }

    const existing = await prisma.requestCategory.findFirst({
      where: { 
        name,
        id: { not: id }
      },
    });

    if (existing) {
      return NextResponse.json({ success: false, error: { message: "ชื่อหมวดหมู่นี้มีอยู่ในระบบแล้ว" } }, { status: 400 });
    }

    const category = await prisma.requestCategory.update({
      where: { id },
      data: {
        name,
        description: description || null,
      },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, error: { message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล" } }, { status: 500 });
  }
}
