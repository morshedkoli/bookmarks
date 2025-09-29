import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req, res) {
  try {

    const result = await prisma.category.findMany({
      select: {
        name: true,
        id: true,
      },
    });
    return NextResponse.json(result, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (e) {
    return NextResponse.json({ status: "fail", data: e }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  }
}
