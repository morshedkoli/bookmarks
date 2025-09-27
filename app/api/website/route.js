import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');
    
    let whereClause = {};
    if (categoryId) {
      whereClause.categoriesId = categoryId;
    }

    const result = await prisma.website.findMany({
      where: whereClause,
      include: {
        categorie: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    return NextResponse.json({ status: "success", data: result });
  } catch (e) {
    return NextResponse.json({ status: "fail", data: e.message });
  }
}

export async function POST(req, res) {
  try {
    const reqBody = await req.json();
    
    // Validate required fields
    if (!reqBody.name || !reqBody.link || !reqBody.categoriesId) {
      return NextResponse.json({ 
        status: "fail", 
        data: "Name, link, and category are required" 
      });
    }

    if (reqBody.password !== "Murshed@@@k5") {
      return NextResponse.json({ status: "fail", data: "Password Incorrect" });
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: reqBody.categoriesId }
    });

    if (!category) {
      return NextResponse.json({ 
        status: "fail", 
        data: "Category not found" 
      });
    }

    // Set default values for bilingual fields
    const nameEn = reqBody.nameEn || reqBody.name;
    const nameBn = reqBody.nameBn || reqBody.name;
    const useForEn = reqBody.useForEn || reqBody.useFor;
    const useForBn = reqBody.useForBn || reqBody.useFor;

    const result = await prisma.website.create({
      data: {
        name: reqBody.name,
        nameEn: nameEn,
        nameBn: nameBn,
        link: reqBody.link,
        useFor: reqBody.useFor || "",
        useForEn: useForEn || "",
        useForBn: useForBn || "",
        icon: reqBody.icon || "",
        featured: reqBody.featured || false,
        password: reqBody.password,
        categoriesId: reqBody.categoriesId
      },
      include: {
        categorie: true
      }
    });
    
    return NextResponse.json({ status: "success", data: result });
  } catch (e) {
    if (e.code === 'P2002') {
      return NextResponse.json({ 
        status: "fail", 
        data: "Website name or link already exists" 
      });
    }
    return NextResponse.json({ status: "fail", data: e.message });
  }
}

export async function PUT(req, res) {
  try {
    const reqBody = await req.json();
    const { id, password, ...updateData } = reqBody;
    
    if (!id) {
      return NextResponse.json({ 
        status: "fail", 
        data: "Website ID is required" 
      });
    }

    if (password !== "Murshed@@@k5") {
      return NextResponse.json({ status: "fail", data: "Password Incorrect" });
    }

    // If categoriesId is being updated, verify it exists
    if (updateData.categoriesId) {
      const category = await prisma.category.findUnique({
        where: { id: updateData.categoriesId }
      });

      if (!category) {
        return NextResponse.json({ 
          status: "fail", 
          data: "Category not found" 
        });
      }
    }

    const result = await prisma.website.update({
      where: { id },
      data: updateData,
      include: {
        categorie: true
      }
    });
    
    return NextResponse.json({ status: "success", data: result });
  } catch (e) {
    if (e.code === 'P2025') {
      return NextResponse.json({ 
        status: "fail", 
        data: "Website not found" 
      });
    }
    if (e.code === 'P2002') {
      return NextResponse.json({ 
        status: "fail", 
        data: "Website name or link already exists" 
      });
    }
    return NextResponse.json({ status: "fail", data: e.message });
  }
}

export async function DELETE(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const password = searchParams.get('password');
    
    if (!id) {
      return NextResponse.json({ 
        status: "fail", 
        data: "Website ID is required" 
      });
    }

    if (password !== "Murshed@@@k5") {
      return NextResponse.json({ status: "fail", data: "Password Incorrect" });
    }

    const result = await prisma.website.delete({
      where: { id },
    });
    
    return NextResponse.json({ status: "success", data: result });
  } catch (e) {
    if (e.code === 'P2025') {
      return NextResponse.json({ 
        status: "fail", 
        data: "Website not found" 
      });
    }
    return NextResponse.json({ status: "fail", data: e.message });
  }
}
