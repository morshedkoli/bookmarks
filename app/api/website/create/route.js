import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const prisma = new PrismaClient();

    let reqBody = await req.json();
    if (reqBody.password === "Murshed@@@k5") {
      const result = await prisma.website.create({
        data: reqBody,
      });

      return NextResponse.json({ status: "success", data: result });
    } else {
      return NextResponse.json({ status: "fail", data: "you are not admin" });
    }
  } catch (e) {
    return NextResponse.json({ status: "fail", data: e });
  }
}
