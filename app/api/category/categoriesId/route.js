import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req, res) {
  try {
    const prisma = new PrismaClient();

    const result = await prisma.category.findMany({
      select: {
        name: true,
        id: true,
      },
    });
    return NextResponse.json(result);
  } catch (e) {
    return NextResponse.json({ status: "fail", data: e });
  }
}
