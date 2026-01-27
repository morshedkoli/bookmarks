const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Identity Documents...');

    // 1. Identity Documents Category
    const category = await prisma.category.upsert({
        where: { name: 'Identity Documents' },
        update: {},
        create: {
            name: 'Identity Documents',
            nameEn: 'Identity Documents',
            nameBn: 'পরিচয়পত্র ও সনদ',
            path: '/identity',
            icon: '🪪',
            description: 'Passport, NID, Birth Certificate and other identity records',
            descriptionEn: 'Passport, NID, Birth Certificate and other identity records',
            descriptionBn: 'পাসপোর্ট, এনআইডি, জন্ম নিবন্ধন এবং অন্যান্য পরিচয়পত্র',
            password: 'Murshed@@@k5'
        },
    });

    const sites = [
        {
            name: 'E-Passport Portal',
            nameEn: 'E-Passport Portal',
            nameBn: 'ই-পাসপোর্ট পোর্টাল',
            link: 'https://www.epassport.gov.bd/landing',
            useFor: 'New Passport/Re-issue',
            useForEn: 'New Passport/Re-issue',
            useForBn: 'নতুন পাসপোর্ট/রি-ইস্যু',
            icon: 'https://www.epassport.gov.bd/favicon.ico',
            featured: true,
            popular: true,
        },
        {
            name: 'E-Passport Check',
            nameEn: 'E-Passport Check',
            nameBn: 'ই-পাসপোর্ট চেক',
            link: 'https://www.epassport.gov.bd/authorization/application-status',
            useFor: 'Check Application Status',
            useForEn: 'Check Application Status',
            useForBn: 'আবেদন স্ট্যাটাস চেক',
            icon: '✅',
            featured: true,
            popular: true,
        },
        {
            name: 'NID Service (Wing)',
            nameEn: 'NID Service (Wing)',
            nameBn: 'এনআইডি সেবা (উইং)',
            link: 'https://services.nidw.gov.bd/nid-pub/',
            useFor: 'New NID/Correction',
            useForEn: 'New NID/Correction',
            useForBn: 'নতুন এনআইডি/সংশোধন',
            icon: 'https://services.nidw.gov.bd/nid-pub/favicon.ico',
            featured: true,
            popular: true,
        },
        {
            name: 'Birth & Death Registration',
            nameEn: 'Birth & Death Registration',
            nameBn: 'জন্ম ও মৃত্যু নিবন্ধন',
            link: 'https://bdris.gov.bd/br/application',
            useFor: 'New Registration',
            useForEn: 'New Registration',
            useForBn: 'নতুন নিবন্ধন আবেদন',
            icon: '👶',
            featured: true,
            popular: true,
        },
        {
            name: 'Birth Certificate Verify',
            nameEn: 'Birth Certificate Verify',
            nameBn: 'জন্ম নিবন্ধন যাচাই',
            link: 'https://everify.bdris.gov.bd/',
            useFor: 'Verify Certificate',
            useForEn: 'Verify Certificate',
            useForBn: 'সনদ যাচাই করুন',
            icon: '🔍',
            featured: true,
            popular: true,
        },
        {
            name: 'BRTA Service Portal (BSP)',
            nameEn: 'BRTA Service Portal (BSP)',
            nameBn: 'বিআরটিএ সেবা পোর্টাল',
            link: 'https://bsp.brta.gov.bd/',
            useFor: 'Driving License/Reg',
            useForEn: 'Driving License/Reg',
            useForBn: 'ড্রাইভিং লাইসেন্স/রেজিস্ট্রেশন',
            icon: '🚗',
            featured: true,
            popular: true,
        },
        {
            name: 'E-TIN Registration',
            nameEn: 'E-TIN Registration',
            nameBn: 'ই-টিন নিবন্ধন',
            link: 'https://secure.incometax.gov.bd/TIN_Home',
            useFor: 'Tax ID Registration',
            useForEn: 'Tax ID Registration',
            useForBn: 'ট্যাক্স আইডি নিবন্ধন',
            icon: '📝',
            featured: false,
            popular: true,
        },
        {
            name: 'Police Clearance',
            nameEn: 'Police Clearance',
            nameBn: 'পুলিশ ক্লিয়ারেন্স',
            link: 'https://pcc.police.gov.bd/',
            useFor: 'Clearance Certificate',
            useForEn: 'Clearance Certificate',
            useForBn: 'ক্লিয়ারেন্স সনদ',
            icon: '👮',
            featured: true,
            popular: true,
        },
        {
            name: 'MRP Passport Status',
            nameEn: 'MRP Passport Status',
            nameBn: 'এমআরপি পাসপোর্ট স্ট্যাটাস',
            link: 'http://passport.gov.bd/OnlineStatus.aspx',
            useFor: 'Check MRP Status',
            useForEn: 'Check MRP Status',
            useForBn: 'এমআরপি স্ট্যাটাস চেক',
            icon: '📘',
            featured: false,
            popular: false,
        }
    ];

    for (const site of sites) {
        // We strictly want these in this category, so we update the category connection
        await prisma.website.upsert({
            where: { link: site.link },
            update: {
                categoriesId: category.id,
                popular: site.popular,
                featured: site.featured,
                name: site.name,
                nameEn: site.nameEn,
                nameBn: site.nameBn,
                useFor: site.useFor,
                useForEn: site.useForEn,
                useForBn: site.useForBn,
            },
            create: {
                ...site,
                password: 'Murshed@@@k5',
                categoriesId: category.id,
            },
        });
    }

    console.log('Seeding Identity Documents finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
