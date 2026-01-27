const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Advanced Travel Directory...');

    // 1. Get Travel Category
    const category = await prisma.category.findFirst({
        where: {
            OR: [
                { name: 'Travel & Immigration' },
                { path: '/visa' }
            ]
        }
    });

    if (!category) {
        console.error("Travel category not found!");
        return;
    }

    // 2. Define Countries with metadata
    const countries = [
        { name: 'Saudi Arabia', nameBn: 'সৌদি আরব', slug: 'saudi-arabia', code: 'SA', icon: '🇸🇦', order: 1 },
        { name: 'United Arab Emirates', nameBn: 'সংযুক্ত আরব আমিরাত', slug: 'uae', code: 'AE', icon: '🇦🇪', order: 2 },
        { name: 'Malaysia', nameBn: 'মালয়েশিয়া', slug: 'malaysia', code: 'MY', icon: '🇲🇾', order: 3 },
        { name: 'India', nameBn: 'ভারত', slug: 'india', code: 'IN', icon: '🇮🇳', order: 4 },
        { name: 'Qatar', nameBn: 'কাতার', slug: 'qatar', code: 'QA', icon: '🇶🇦', order: 5 },
        { name: 'Kuwait', nameBn: 'কুয়েত', slug: 'kuwait', code: 'KW', icon: '🇰🇼', order: 6 },
        { name: 'Oman', nameBn: 'ওমান', slug: 'oman', code: 'OM', icon: '🇴🇲', order: 7 },
        { name: 'Singapore', nameBn: 'সিঙ্গাপুর', slug: 'singapore', code: 'SG', icon: '🇸🇬', order: 8 },
        { name: 'Italy', nameBn: 'ইতালি', slug: 'italy', code: 'IT', icon: '🇮🇹', order: 9 },
        { name: 'Portugal', nameBn: 'পর্তুগাল', slug: 'portugal', code: 'PT', icon: '🇵🇹', order: 10 },
        { name: 'Japan', nameBn: 'জাপান', slug: 'japan', code: 'JP', icon: '🇯🇵', order: 11 },
        { name: 'South Korea', nameBn: 'দক্ষিণ কোরিয়া', slug: 'south-korea', code: 'KR', icon: '🇰🇷', order: 12 },
        { name: 'United Kingdom', nameBn: 'যুক্তরাজ্য', slug: 'united-kingdom', code: 'GB', icon: '🇬🇧', order: 13 },
        { name: 'Canada', nameBn: 'কানাডা', slug: 'canada', code: 'CA', icon: '🇨🇦', order: 14 },
        { name: 'Australia', nameBn: 'অস্ট্রেলিয়া', slug: 'australia', code: 'AU', icon: '🇦🇺', order: 15 },
    ];

    // 3. Upsert Countries and store IDs
    const countryMap = {};

    for (const c of countries) {
        const country = await prisma.country.upsert({
            where: { slug: c.slug },
            update: {
                name: c.name,
                nameBn: c.nameBn,
                code: c.code,
                icon: c.icon,
                order: c.order,
                categoryId: category.id
            },
            create: {
                ...c,
                categoryId: category.id
            }
        });
        countryMap[c.slug] = country.id;
    }

    // 4. Seed/Update Websites for Saudi Arabia (Example)
    const saudiId = countryMap['saudi-arabia'];
    const saudiSites = [
        {
            link: 'https://dhaka.mofa.gov.sa/',
            name: 'Saudi Embassy in Bangladesh',
            nameEn: 'Saudi Embassy in Bangladesh',
            nameBn: 'সৌদি দূতাবাস (বাংলাদেশ)',
            subGroup: 'Embassy / High Commission',
            isOfficial: true,
            popular: true,
            icon: '🏛️'
        },
        {
            link: 'https://visa.mofa.gov.sa/',
            name: 'MOFA Visa Platform',
            nameEn: 'MOFA Visa Platform',
            nameBn: 'মোফা ভিসা প্ল্যাটফর্ম',
            subGroup: 'Visa Application & Status',
            isOfficial: true,
            popular: true,
            icon: '🇸🇦'
        },
        {
            link: 'https://muqeem.sa/#/visa-validity/check',
            name: 'Muqeem Visa Check',
            nameEn: 'Muqeem Visa Check',
            nameBn: 'মুকিম ভিসা চেক',
            subGroup: 'Immigration Authority',
            isOfficial: true,
            popular: true,
            icon: '✅'
        },
        {
            link: 'https://www.haj.gov.sa/bu',
            name: 'Hajj & Umrah Portal',
            nameEn: 'Hajj & Umrah Portal',
            nameBn: 'হজ ও উমরাহ পোর্টাল',
            subGroup: 'Official Government Portals',
            isOfficial: true,
            popular: true,
            icon: '🕋'
        }
    ];

    for (const site of saudiSites) {
        await prisma.website.upsert({
            where: { link: site.link },
            update: {
                countryId: saudiId,
                subGroup: site.subGroup,
                isOfficial: site.isOfficial,
                popular: site.popular,
                categoriesId: category.id,
                group: 'Saudi Arabia', // Legacy support
            },
            create: {
                ...site,
                password: 'Murshed@@@k5',
                countryId: saudiId,
                categoriesId: category.id,
                group: 'Saudi Arabia',
            }
        });
    }

    // 5. Seed/Update Websites for Malaysia (Example)
    const malaysiaId = countryMap['malaysia'];
    const malaysiaSites = [
        {
            link: 'https://imigresen-online.imi.gov.my/',
            name: 'Malaysia Immigration',
            nameEn: 'Malaysia Immigration',
            nameBn: 'মালয়েশিয়া ইমিগ্রেশন',
            subGroup: 'Immigration Authority',
            isOfficial: true,
            popular: true,
            icon: '🇲🇾'
        },
        {
            link: 'https://educationmalaysia.gov.my/',
            name: 'Education Malaysia',
            nameEn: 'Education Malaysia',
            nameBn: 'এডুকেশন মালয়েশিয়া',
            subGroup: 'Student Visa / Education Portal',
            isOfficial: true,
            popular: true,
            icon: '🎓'
        }
    ];

    for (const site of malaysiaSites) {
        await prisma.website.upsert({
            where: { link: site.link },
            update: {
                countryId: malaysiaId,
                subGroup: site.subGroup,
                isOfficial: site.isOfficial,
                popular: site.popular,
                categoriesId: category.id,
                group: 'Malaysia',
            },
            create: {
                ...site,
                password: 'Murshed@@@k5',
                countryId: malaysiaId,
                categoriesId: category.id,
                group: 'Malaysia',
            }
        });
    }

    // 6. Migrate existing sites based on group field to Country relation if needed
    // This is a simplified migration attempt for existing known groups
    const groupMigration = {
        'UAE (United Arab Emirates)': 'uae',
        'Qatar': 'qatar',
        'Kuwait': 'kuwait',
        'Oman': 'oman',
        'Bahrain': 'bahrain',
        'Singapore': 'singapore',
        'USA & Europe': null, // No specific country mapped for this generic group yet
        'Global Services': null
    };

    for (const [groupName, slug] of Object.entries(groupMigration)) {
        if (!slug) continue;
        const cId = countryMap[slug];
        if (cId) {
            await prisma.website.updateMany({
                where: { group: groupName },
                data: { countryId: cId }
            });
        }
    }

    console.log('Seeding Advanced Travel Directory finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
