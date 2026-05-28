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
    const { isActive } = await request.json();

    const category = await prisma.requestCategory.update({
      where: { id },
      data: { isActive },
    });

    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, error: { message: "เกิดข้อผิดพลาดในการเปลี่ยนสถานะ" } }, { status: 500 });
  }
}
