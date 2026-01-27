const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding...');

    // 1. Bangladesh Government Services
    const govCategory = await prisma.category.upsert({
        where: { name: 'Government Services (BD)' },
        update: {},
        create: {
            name: 'Government Services (BD)',
            nameEn: 'Government Services (BD)',
            nameBn: 'সরকারি সেবা (বাংলাদেশ)',
            path: '/gov-bd',
            icon: '🏛️',
            description: 'All essential Bangladesh government online services',
            descriptionEn: 'All essential Bangladesh government online services',
            descriptionBn: 'সকল প্রয়োজনীয় বাংলাদেশ সরকারি অনলাইন সেবা',
            password: 'Murshed@@@k5'
        },
    });

    const govSites = [
        {
            name: 'E-Passport',
            nameEn: 'E-Passport',
            nameBn: 'ই-পাসপোর্ট',
            link: 'https://www.epassport.gov.bd/landing',
            useFor: 'Passport Application',
            useForEn: 'Passport Application',
            useForBn: 'পাসপোর্ট আবেদন',
            icon: 'https://www.epassport.gov.bd/favicon.ico',
            featured: true,
            popular: true,
        },
        {
            name: 'Birth Registration (BDRIS)',
            nameEn: 'Birth Registration (BDRIS)',
            nameBn: 'জন্ম নিবন্ধন',
            link: 'https://bdris.gov.bd/br/application',
            useFor: 'Birth Certificate',
            useForEn: 'Birth Certificate',
            useForBn: 'জন্ম নিবন্ধন সনদ',
            icon: 'https://bdris.gov.bd/favicon.ico',
            featured: true,
            popular: true,
        },
        {
            name: 'NID Service',
            nameEn: 'NID Service',
            nameBn: 'এনআইডি সেবা',
            link: 'https://services.nidw.gov.bd/nid-pub/',
            useFor: 'National ID Card',
            useForEn: 'National ID Card',
            useForBn: 'জাতীয় পরিচয়পত্র',
            icon: '🪪',
            featured: true,
            popular: true,
        },
        {
            name: 'Police Clearance',
            nameEn: 'Police Clearance',
            nameBn: 'পুলিশ ক্লিয়ারেন্স',
            link: 'https://pcc.police.gov.bd/',
            useFor: 'Police Certificate',
            useForEn: 'Police Certificate',
            useForBn: 'পুলিশ ক্লিয়ারেন্স সনদ',
            icon: '👮',
            featured: false,
            popular: false,
        },
        {
            name: 'Land Record (Khatiyan)',
            nameEn: 'Land Record (Khatiyan)',
            nameBn: 'ভূমি সেবা (খতিয়ান)',
            link: 'https://www.eporcha.gov.bd/',
            useFor: 'Land Records',
            useForEn: 'Land Records',
            useForBn: 'জমির খতিয়ান',
            icon: '🗺️',
            featured: false,
            popular: false,
        },
        {
            name: 'Eticket (Train)',
            nameEn: 'Eticket (Train)',
            nameBn: 'ই-টিকিট (রেলওয়ে)',
            link: 'https://eticket.railway.gov.bd/',
            useFor: 'Train Ticket',
            useForEn: 'Train Ticket',
            useForBn: 'ট্রেনের টিকিট',
            icon: '🚆',
            featured: true,
            popular: true,
        },
    ];

    for (const site of govSites) {
        await prisma.website.upsert({
            where: { link: site.link },
            update: {
                categoriesId: govCategory.id,
                popular: site.popular,
                featured: site.featured
            },
            create: {
                ...site,
                password: 'Murshed@@@k5',
                categoriesId: govCategory.id,
            },
        });
    }

    // 2. Middle East Visa & Manpower
    const visaCategory = await prisma.category.upsert({
        where: { name: 'Visa & Immigration' },
        update: {},
        create: {
            name: 'Visa & Immigration',
            nameEn: 'Visa & Immigration',
            nameBn: 'ভিসা ও ইমিগ্রেশন',
            path: '/visa',
            icon: '✈️',
            description: 'Visa checking and processing services',
            descriptionEn: 'Visa checking and processing services',
            descriptionBn: 'ভিসা চেক এবং প্রসেসিং সেবা',
            password: 'Murshed@@@k5'
        },
    });

    const visaSites = [
        {
            name: 'BMET (Manpower)',
            nameEn: 'BMET (Manpower)',
            nameBn: 'বিএমইটি (জনশক্তি)',
            link: 'https://bmet.gov.bd/',
            useFor: 'Manpower Clearance',
            useForEn: 'Manpower Clearance',
            useForBn: 'জনশক্তি ছাড়পত্র',
            icon: '👷',
            featured: true,
            popular: true,
        },
        {
            name: 'Ami Probashi',
            nameEn: 'Ami Probashi',
            nameBn: 'আমি প্রবাসী',
            link: 'https://www.amiprobashi.com/',
            useFor: 'Expat Services',
            useForEn: 'Expat Services',
            useForBn: 'প্রবাসী সেবা',
            icon: '🌐',
            featured: true,
            popular: false,
        },
        {
            name: 'Saudi Visa Check (Muqeem)',
            nameEn: 'Saudi Visa Check (Muqeem)',
            nameBn: 'সৌদি ভিসা চেক (মুকিম)',
            link: 'https://muqeem.sa/#/visa-validity/check',
            useFor: 'KSA Visa Invalidity',
            useForEn: 'KSA Visa Invalidity',
            useForBn: 'সৌদি ভিসা চেক',
            icon: '🇸🇦',
            featured: true,
            popular: true,
        },
        {
            name: 'MOFA Visa Platform',
            nameEn: 'MOFA Visa Platform',
            nameBn: 'মোফা ভিসা প্ল্যাটফর্ম',
            link: 'https://visa.mofa.gov.sa/',
            useFor: 'Saudi Visa Application',
            useForEn: 'Saudi Visa Application',
            useForBn: 'সৌদি ভিসা আবেদন',
            icon: '🇸🇦',
            featured: false,
            popular: true,
        },
        {
            name: 'Qatar Visa Portal',
            nameEn: 'Qatar Visa Portal',
            nameBn: 'কাতার ভিসা পোর্টাল',
            link: 'https://portal.moi.gov.qa/wps/portal/MOIInternet/services/inquiries/visaservices/visaapprovaltracking',
            useFor: 'Qatar Visa Check',
            useForEn: 'Qatar Visa Check',
            useForBn: 'কাতার ভিসা চেক',
            icon: '🇶🇦',
            featured: false,
            popular: true,
        },
        {
            name: 'UAE ICP (Smart Services)',
            nameEn: 'UAE ICP (Smart Services)',
            nameBn: 'ইউএই আইসিপি (স্মার্ট সার্ভিস)',
            link: 'https://smartservices.icp.gov.ae/echannels/web/client/default.html#/fileValidity',
            useFor: 'UAE Visa Status',
            useForEn: 'UAE Visa Status',
            useForBn: 'আরব আমিরাত ভিসা',
            icon: '🇦🇪',
            featured: false,
            popular: true,
        },
    ];

    for (const site of visaSites) {
        await prisma.website.upsert({
            where: { link: site.link },
            update: {
                categoriesId: visaCategory.id,
                popular: site.popular,
                featured: site.featured
            },
            create: {
                ...site,
                password: 'Murshed@@@k5',
                categoriesId: visaCategory.id,
            },
        });
    }

    // 3. Online Cafe & Business Tools
    const toolsCategory = await prisma.category.upsert({
        where: { name: 'Online Business Tools' },
        update: {},
        create: {
            name: 'Online Business Tools',
            nameEn: 'Online Business Tools',
            nameBn: 'অনলাইন ব্যবসার টুলস',
            path: '/tools',
            icon: '🛠️',
            description: 'Daily tools for online shop/cafe business',
            descriptionEn: 'Daily tools for online shop/cafe business',
            descriptionBn: 'অনলাইন দোকান/ক্যাফের নিত্যপ্রয়োজনীয় টুলস',
            password: 'Murshed@@@k5'
        },
    });

    const toolSites = [
        {
            name: 'I Love PDF',
            nameEn: 'I Love PDF',
            nameBn: 'আই লাভ পিডিএফ',
            link: 'https://www.ilovepdf.com/',
            useFor: 'PDF Editor',
            useForEn: 'PDF Editor',
            useForBn: 'পিডিএফ এডিটর',
            icon: '📄',
            featured: true,
            popular: true,
        },
        {
            name: 'Remove.bg',
            nameEn: 'Remove.bg',
            nameBn: 'ব্যাকগ্রাউন্ড রিমুভার',
            link: 'https://www.remove.bg/',
            useFor: 'Image Background Remove',
            useForEn: 'Image Background Remove',
            useForBn: 'ছবির ব্যাকগ্রাউন্ড রিমুভ',
            icon: '🖼️',
            featured: true,
            popular: true,
        },
        {
            name: 'Teletalk All Jobs',
            nameEn: 'Teletalk All Jobs',
            nameBn: 'টেলিটক অল জবস',
            link: 'http://alljobs.teletalk.com.bd/',
            useFor: 'Job Application',
            useForEn: 'Job Application',
            useForBn: 'চাকরির আবেদন',
            icon: '💼',
            featured: true,
            popular: false,
        },
        {
            name: 'Sonali e-Sheba',
            nameEn: 'Sonali e-Sheba',
            nameBn: 'সোনালী ই-সেবা',
            link: 'https://sbl.com.bd:7070/',
            useFor: 'Banking Challan',
            useForEn: 'Banking Challan',
            useForBn: 'ব্যাংকিং চালান',
            icon: '🏦',
            featured: false,
            popular: true,
        },
        {
            name: 'Photo Resizer',
            nameEn: 'Photo Resizer',
            nameBn: 'ফটো রিসাইজার',
            link: 'https://imageresizer.com/',
            useFor: 'Photo Crop/Resize',
            useForEn: 'Photo Crop/Resize',
            useForBn: 'ফটো ক্রপ/রিসাইজ',
            icon: '✂️',
            featured: false,
            popular: false,
        }
    ];

    for (const site of toolSites) {
        await prisma.website.upsert({
            where: { link: site.link },
            update: {
                categoriesId: toolsCategory.id,
                popular: site.popular,
                featured: site.featured
            },
            create: {
                ...site,
                password: 'Murshed@@@k5',
                categoriesId: toolsCategory.id,
            },
        });
    }

    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
