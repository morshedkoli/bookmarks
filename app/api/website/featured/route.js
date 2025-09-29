import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req, res) {
  try {
    const result = await prisma.website.findMany({
      where: {
        featured: true
      },
      include: {
        categorie: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ status: "success", data: result }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (e) {
    return NextResponse.json({ status: "fail", data: e.message }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  }
}
