import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const showAll = searchParams.get("all") === "true";

  const categories = await prisma.requestCategory.findMany({
    where: showAll ? {} : { isActive: true },
    orderBy: showAll ? { createdAt: "desc" } : { name: "asc" },
    include: {
      _count: {
        select: { requests: true }
      }
    }
  });

  return NextResponse.json({
    success: true,
    data: categories,
  });
}
