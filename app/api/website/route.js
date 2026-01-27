import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req, res) {
  try {
    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get('categoryId');

    let whereClause = {};
    if (categoryId) {
      whereClause.categoriesId = categoryId;
    }

    // Support filtering by IDs (comma separated)
    const ids = searchParams.get('ids');
    if (ids) {
      const idList = ids.split(',').filter(Boolean);
      whereClause.id = { in: idList };
    }

    // Support filtering by popular
    const popular = searchParams.get('popular');
    if (popular === 'true') {
      whereClause.popular = true;
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
    if (!reqBody.name || !reqBody.link || !reqBody.categoriesId) {
      return NextResponse.json({
        status: "fail",
        data: "Name, link, and category are required"
      }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    if (reqBody.password !== "Murshed@@@k5") {
      return NextResponse.json({ status: "fail", data: "Password Incorrect" }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    // Verify category exists
    const category = await prisma.category.findUnique({
      where: { id: reqBody.categoriesId }
    });

    if (!category) {
      return NextResponse.json({
        status: "fail",
        data: "Category not found"
      }, {
        headers: { 'Cache-Control': 'no-store' }
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
        popular: reqBody.popular || false,
        password: reqBody.password,
        group: reqBody.group || null,
        groupBn: reqBody.groupBn || null,
        // Advanced Travel Directory Fields
        countryId: reqBody.countryId || null,
        subGroup: reqBody.subGroup || null,
        isOfficial: reqBody.isOfficial || false,
        categoriesId: reqBody.categoriesId
      },
      include: {
        categorie: true,
        country: true
      }
    });

    return NextResponse.json({ status: "success", data: result }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (e) {
    if (e.code === 'P2002') {
      return NextResponse.json({
        status: "fail",
        data: "Website name or link already exists"
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
        data: "Website ID is required"
      }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    if (password !== "Murshed@@@k5") {
      return NextResponse.json({ status: "fail", data: "Password Incorrect" }, {
        headers: { 'Cache-Control': 'no-store' }
      });
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
        }, {
          headers: { 'Cache-Control': 'no-store' }
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

    return NextResponse.json({ status: "success", data: result }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (e) {
    if (e.code === 'P2025') {
      return NextResponse.json({
        status: "fail",
        data: "Website not found"
      }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }
    if (e.code === 'P2002') {
      return NextResponse.json({
        status: "fail",
        data: "Website name or link already exists"
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
        data: "Website ID is required"
      }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    if (password !== "Murshed@@@k5") {
      return NextResponse.json({ status: "fail", data: "Password Incorrect" }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }

    const result = await prisma.website.delete({
      where: { id },
    });

    return NextResponse.json({ status: "success", data: result }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  } catch (e) {
    if (e.code === 'P2025') {
      return NextResponse.json({
        status: "fail",
        data: "Website not found"
      }, {
        headers: { 'Cache-Control': 'no-store' }
      });
    }
    return NextResponse.json({ status: "fail", data: e.message }, {
      headers: { 'Cache-Control': 'no-store' }
    });
  }
}
