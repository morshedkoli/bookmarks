import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req, res) {
  try {
    const result = await prisma.category.findMany({
      include: {
        websites: true,
      },
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

export async function POST(req, res) {
  try {
    const reqBody = await req.json();
    
    // Validate required fields
    if (!reqBody.name || !reqBody.path || !reqBody.icon) {
      return NextResponse.json({ 
        status: "fail", 
        data: "Name, path, and icon are required" 
      }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    // Set default values for bilingual fields
    const nameEn = reqBody.nameEn || reqBody.name;
    const nameBn = reqBody.nameBn || reqBody.name;
    const descriptionEn = reqBody.descriptionEn || reqBody.description;
    const descriptionBn = reqBody.descriptionBn || reqBody.description;

    if (reqBody.password !== "Murshed@@@k5") {
      return NextResponse.json({ status: "fail", data: "Password Incorrect" }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    const result = await prisma.category.create({
      data: {
        name: reqBody.name,
        nameEn: nameEn,
        nameBn: nameBn,
        path: reqBody.path,
        icon: reqBody.icon,
        description: reqBody.description || null,
        descriptionEn: descriptionEn || null,
        descriptionBn: descriptionBn || null,
        password: reqBody.password
      },
    });
    
    return NextResponse.json({ status: "success", data: result }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (e) {
    if (e.code === 'P2002') {
      return NextResponse.json({ 
        status: "fail", 
        data: "Category name already exists" 
      }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }
    return NextResponse.json({ status: "fail", data: e.message }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  }
}

export async function PUT(req, res) {
  try {
    const reqBody = await req.json();
    const { id, password, ...updateData } = reqBody;
    
    if (!id) {
      return NextResponse.json({ 
        status: "fail", 
        data: "Category ID is required" 
      }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    if (password !== "Murshed@@@k5") {
      return NextResponse.json({ status: "fail", data: "Password Incorrect" }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    const result = await prisma.category.update({
      where: { id },
      data: updateData,
    });
    
    return NextResponse.json({ status: "success", data: result }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (e) {
    if (e.code === 'P2025') {
      return NextResponse.json({ 
        status: "fail", 
        data: "Category not found" 
      }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }
    return NextResponse.json({ status: "fail", data: e.message }, {
      headers: { 'Cache-Control': 'no-store' }
    });
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
        data: "Category ID is required" 
      }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    if (password !== "Murshed@@@k5") {
      return NextResponse.json({ status: "fail", data: "Password Incorrect" }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    // Check if category has websites
    const category = await prisma.category.findUnique({
      where: { id },
      include: { websites: true }
    });

    if (category && category.websites.length > 0) {
      return NextResponse.json({ 
        status: "fail", 
        data: "Cannot delete category with existing websites" 
      }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    const result = await prisma.category.delete({
      where: { id },
    });
    
    return NextResponse.json({ status: "success", data: result }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (e) {
    if (e.code === 'P2025') {
      return NextResponse.json({ 
        status: "fail", 
        data: "Category not found" 
      }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }
    return NextResponse.json({ status: "fail", data: e.message }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  }
}
