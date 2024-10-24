import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req, res) {
  try {
    const prisma = new PrismaClient();

    let reqBody = await req.json();

    if (reqBody.password === "Murshed@@@k5") {
      const result = await prisma.category.create({
        data: reqBody,
      });
      return NextResponse.json({ status: "success", data: result });
    }

    return NextResponse.json({ status: "fail", data: "Password Incorrect" });
  } catch (e) {
    return NextResponse.json({ status: "fail", data: e });
  }
}
