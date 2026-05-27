import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const categories = await prisma.requestCategory.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
    },
  });

  return NextResponse.json({
    success: true,
    data: categories,
  });
}
