import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

const statusSchema = z.object({
  status: z.enum([
    "RECEIVED",
    "UNDER_REVIEW",
    "IN_PROGRESS",
    "COMPLETED",
    "CLOSED",
    "REJECTED",
  ]),
  note: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { success: false, error: { code: "UNAUTHENTICATED", message: "กรุณาเข้าสู่ระบบ" } },
      { status: 401 }
    );
  }

  const { id } = await context.params;
  const formData = await request.formData();

  const parsed = statusSchema.safeParse({
    status: String(formData.get("status") ?? ""),
    note: String(formData.get("note") ?? ""),
  });

  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: { code: "INVALID_INPUT", message: "ข้อมูลสถานะไม่ถูกต้อง" } },
      { status: 400 }
    );
  }

  const existing = await prisma.request.findUnique({
    where: { id },
    select: { id: true, currentStatus: true },
  });

  if (!existing) {
    return NextResponse.json(
      { success: false, error: { code: "REQUEST_NOT_FOUND", message: "ไม่พบคำร้อง" } },
      { status: 404 }
    );
  }

  const userId = (session.user as any).id;

  await prisma.$transaction([
    prisma.request.update({
      where: { id },
      data: {
        currentStatus: parsed.data.status,
        closedAt:
          parsed.data.status === "CLOSED" || parsed.data.status === "COMPLETED"
            ? new Date()
            : null,
      },
    }),
    prisma.requestStatusHistory.create({
      data: {
        requestId: id,
        previousStatus: existing.currentStatus,
        newStatus: parsed.data.status,
        changedByUserId: userId,
        note: parsed.data.note || null,
      },
    }),
  ]);

  redirect(`/staff/requests/${id}`);
}
