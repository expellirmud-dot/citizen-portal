import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "UNAUTHENTICATED",
          message: "กรุณาเข้าสู่ระบบ",
        },
      },
      { status: 401 }
    );
  }

  const requests = await prisma.request.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      category: true,
      assignedDepartment: true,
    },
  });

  return NextResponse.json({
    success: true,
    data: requests.map((item) => ({
      id: item.id,
      tracking_number: item.trackingNumber,
      title: item.title,
      category: item.category.name,
      current_status: item.currentStatus,
      assigned_department: item.assignedDepartment?.name ?? "-",
      created_at: item.createdAt,
    })),
  });
}
