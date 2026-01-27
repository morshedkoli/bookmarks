import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get('categoryId');

        let whereClause = { isActive: true };
        if (categoryId) {
            whereClause.categoryId = categoryId;
        }

        const result = await prisma.country.findMany({
            where: whereClause,
            include: {
                websites: true
            },
            orderBy: {
                order: 'asc'
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

export async function POST(req) {
    try {
        const reqBody = await req.json();

        if (!reqBody.name || !reqBody.slug || !reqBody.categoryId) {
            return NextResponse.json({
                status: "fail",
                data: "Name, slug, and categoryId are required"
            }, {
                headers: { 'Cache-Control': 'no-store' }
            });
        }

        const result = await prisma.country.create({
            data: {
                name: reqBody.name,
                nameBn: reqBody.nameBn,
                slug: reqBody.slug,
                code: reqBody.code,
                icon: reqBody.icon,
                description: reqBody.description,
                descriptionBn: reqBody.descriptionBn,
                order: reqBody.order || 0,
                isActive: reqBody.isActive !== undefined ? reqBody.isActive : true,
                categoryId: reqBody.categoryId
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
