import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trackingNumber = searchParams.get("tracking_number");

  if (!trackingNumber) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INVALID_TRACKING_NUMBER",
          message: "กรุณาระบุเลขคำร้อง",
        },
      },
      { status: 400 }
    );
  }

  const item = await prisma.request.findUnique({
    where: {
      trackingNumber,
    },
    include: {
      category: true,
      statusHistory: {
        orderBy: {
          changedAt: "asc",
        },
        select: {
          newStatus: true,
          note: true,
          changedAt: true,
        },
      },
    },
  });

  if (!item) {
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "REQUEST_NOT_FOUND",
          message: "ไม่พบคำร้องตามเลขที่ระบุ",
        },
      },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: {
      tracking_number: item.trackingNumber,
      title: item.title,
      category: item.category.name,
      current_status: item.currentStatus,
      created_at: item.createdAt,
      closed_at: item.closedAt,
      history: item.statusHistory.map((h) => ({
        status: h.newStatus,
        note: h.note,
        changed_at: h.changedAt,
      })),
    },
  });
}
