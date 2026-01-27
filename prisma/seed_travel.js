const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Travel & Immigration...');

    // 1. Get or Create "Travel & Immigration" Category
    const category = await prisma.category.upsert({
        where: { name: 'Travel & Immigration' },
        update: {},
        create: {
            name: 'Travel & Immigration',
            nameEn: 'Travel & Immigration',
            nameBn: 'ভ্রমণ ও ইমিগ্রেশন',
            path: '/visa',
            icon: '✈️',
            description: 'Visa checks, immigration services, and travel tools',
            descriptionEn: 'Visa checks, immigration services, and travel tools',
            descriptionBn: 'ভিসা চেক, ইমিগ্রেশন সেবা এবং ভ্রমণ টুলস',
            password: 'Murshed@@@k5'
        },
    });

    // 2. Define Countries and their websites
    const countriesData = [
        {
            name: 'Global / Multi-Country',
            nameBn: 'গ্লোবাল / মাল্টি-কান্ট্রি',
            slug: 'global',
            icon: '🌍',
            code: 'GLOBAL',
            description: 'International travel & immigration resources',
            websites: [
                { name: 'IOM', link: 'https://www.iom.int', useFor: 'Immigration Info', subGroup: 'Immigration Info', icon: '🌍' },
                { name: 'UNHCR', link: 'https://www.unhcr.org', useFor: 'Refugee Info', subGroup: 'Immigration Info', icon: '🇺🇳' },
                { name: 'LinkedIn Jobs', link: 'https://www.linkedin.com/jobs', useFor: 'Global Job Search', subGroup: 'Jobs', icon: '💼', popular: true },
                { name: 'Indeed Global', link: 'https://www.indeed.com/worldwide', useFor: 'Global Job Search', subGroup: 'Jobs', icon: '🔍' },
                { name: 'Glassdoor', link: 'https://www.glassdoor.com', useFor: 'Company Reviews & Jobs', subGroup: 'Jobs', icon: '🏢' },
                { name: 'Jooble', link: 'https://jooble.org', useFor: 'Job Aggregator', subGroup: 'Jobs', icon: '🔎' },
                { name: 'VFS Global', link: 'https://www.vfsglobal.com/en/individuals/index.html', useFor: 'Visa Application Centre', subGroup: 'Visa & Immigration', icon: '🌐', popular: true }
            ]
        },
        {
            name: 'United States',
            nameBn: 'যুক্তরাষ্ট্র',
            slug: 'usa',
            icon: '🇺🇸',
            code: 'US',
            description: 'USA Visa, Immigration & Jobs',
            websites: [
                { name: 'USCIS', link: 'https://www.uscis.gov', useFor: 'Official Immigration Info', subGroup: 'Visa & Immigration', icon: '🏛️', isOfficial: true },
                { name: 'US Visa Info', link: 'https://travel.state.gov', useFor: 'Visa Information', subGroup: 'Visa & Immigration', icon: 'ℹ️', isOfficial: true },
                { name: 'Visa Appointment', link: 'https://ais.usvisa-info.com', useFor: 'Schedule Appointment', subGroup: 'Visa & Immigration', icon: '📅' },
                { name: 'USA Visa Status (CEAC)', link: 'https://ceac.state.gov/CEACStatTracker/Status.aspx', useFor: 'Check Status', subGroup: 'Visa & Immigration', icon: '✅', popular: true },
                { name: 'Indeed USA', link: 'https://www.indeed.com', useFor: 'Job Search', subGroup: 'Jobs', icon: '💼' },
                { name: 'USAJobs (Govt)', link: 'https://www.usajobs.gov', useFor: 'Government Jobs', subGroup: 'Jobs', icon: '🇺🇸' },
                // LinkedIn and Glassdoor are global but listed here for country context if user prefers specific links 
                // Using global links if specific ones aren't distinct enough or sticking to main
            ]
        },
        {
            name: 'Canada',
            nameBn: 'কানাডা',
            slug: 'canada',
            icon: '🇨🇦',
            code: 'CA',
            description: 'Canada Immigration & Work',
            websites: [
                { name: 'IRCC (Official)', link: 'https://www.canada.ca/immigration', useFor: 'Immigration & Citizenship', subGroup: 'Visa & Immigration', icon: '🍁', isOfficial: true },
                { name: 'Express Entry', link: 'https://www.canada.ca/express-entry', useFor: 'Immigration Program', subGroup: 'Visa & Immigration', icon: '🚀' },
                { name: 'Study Permit', link: 'https://www.canada.ca/study', useFor: 'Student Visa Info', subGroup: 'Visa & Immigration', icon: '🎓' },
                { name: 'Job Bank Canada', link: 'https://www.jobbank.gc.ca', useFor: 'Official Job Board', subGroup: 'Jobs', icon: '🇨🇦' },
                { name: 'Indeed Canada', link: 'https://ca.indeed.com', useFor: 'Job Search', subGroup: 'Jobs', icon: '💼' },
                { name: 'Workopolis', link: 'https://www.workopolis.com', useFor: 'Job Search', subGroup: 'Jobs', icon: '🏢' }
            ]
        },
        {
            name: 'United Kingdom',
            nameBn: 'যুক্তরাজ্য',
            slug: 'uk',
            icon: '🇬🇧',
            code: 'GB',
            description: 'UK Visas & Employment',
            websites: [
                { name: 'UK Visas & Immigration', link: 'https://www.gov.uk/browse/visas-immigration', useFor: 'Official Visa Info', subGroup: 'Visa & Immigration', icon: '👑', isOfficial: true },
                { name: 'Skilled Worker Visa', link: 'https://www.gov.uk/skilled-worker-visa', useFor: 'Work Visa Info', subGroup: 'Visa & Immigration', icon: '👷' },
                { name: 'Indeed UK', link: 'https://uk.indeed.com', useFor: 'Job Search', subGroup: 'Jobs', icon: '💼' },
                { name: 'Reed', link: 'https://www.reed.co.uk', useFor: 'Job Search', subGroup: 'Jobs', icon: '📄' },
                { name: 'TotalJobs', link: 'https://www.totaljobs.com', useFor: 'Job Search', subGroup: 'Jobs', icon: '📊' },
                { name: 'NHS Jobs', link: 'https://www.jobs.nhs.uk', useFor: 'Healthcare Jobs', subGroup: 'Jobs', icon: '🏥' }
            ]
        },
        {
            name: 'Australia',
            nameBn: 'অস্ট্রেলিয়া',
            slug: 'australia',
            icon: '🇦🇺',
            code: 'AU',
            description: 'Australia Immigration & Jobs',
            websites: [
                { name: 'Home Affairs', link: 'https://immi.homeaffairs.gov.au', useFor: 'Immigration & Citizenship', subGroup: 'Visa & Immigration', icon: '🐨', isOfficial: true },
                { name: 'SkillSelect', link: 'https://immi.homeaffairs.gov.au/visas/working-in-australia', useFor: 'Work Visa Info', subGroup: 'Visa & Immigration', icon: '✅' },
                { name: 'Seek', link: 'https://www.seek.com.au', useFor: 'Popular Job Board', subGroup: 'Jobs', icon: '🔎' },
                { name: 'Indeed Australia', link: 'https://au.indeed.com', useFor: 'Job Search', subGroup: 'Jobs', icon: '💼' }
            ]
        },
        {
            name: 'Germany',
            nameBn: 'জার্মানি',
            slug: 'germany',
            icon: '🇩🇪',
            code: 'DE',
            description: 'Work & Live in Germany',
            websites: [
                { name: 'Make it in Germany', link: 'https://www.make-it-in-germany.com', useFor: 'Official Info Portal', subGroup: 'Visa & Immigration', icon: '🇩🇪', isOfficial: true },
                { name: 'Federal Foreign Office', link: 'https://www.auswaertiges-amt.de', useFor: 'Visa Regulations', subGroup: 'Visa & Immigration', icon: '🏛️' },
                { name: 'Make it in Germany Jobs', link: 'https://www.make-it-in-germany.com/en/working-in-germany/job-listings', useFor: 'Official Job Listings', subGroup: 'Jobs', icon: '💼' },
                { name: 'StepStone', link: 'https://www.stepstone.de', useFor: 'Job Board', subGroup: 'Jobs', icon: '🪜' },
                { name: 'Indeed Germany', link: 'https://de.indeed.com', useFor: 'Job Search', subGroup: 'Jobs', icon: '🔎' }
            ]
        },
        {
            name: 'France',
            nameBn: 'ফ্রান্স',
            slug: 'france',
            icon: '🇫🇷',
            code: 'FR',
            description: 'France Visas & Jobs',
            websites: [
                { name: 'France Visas', link: 'https://france-visas.gouv.fr', useFor: 'Official Visa Portal', subGroup: 'Visa & Immigration', icon: '🇫🇷', isOfficial: true },
                { name: 'Campus France', link: 'https://www.campusfrance.org', useFor: 'Study in France', subGroup: 'Visa & Immigration', icon: '🎓' },
                { name: 'Pole Emploi', link: 'https://www.pole-emploi.fr', useFor: 'Employment Service', subGroup: 'Jobs', icon: '🏢' },
                { name: 'Indeed France', link: 'https://fr.indeed.com', useFor: 'Job Search', subGroup: 'Jobs', icon: '💼' },
                { name: 'Welcome to the Jungle', link: 'https://www.welcometothejungle.com', useFor: 'Tech/Startup Jobs', subGroup: 'Jobs', icon: '🌴' }
            ]
        },
        {
            name: 'Portugal',
            nameBn: 'পর্তুগাল',
            slug: 'portugal',
            icon: '🇵🇹',
            code: 'PT',
            description: 'Portugal Residency & Work',
            websites: [
                { name: 'SEF (Immigration)', link: 'https://www.sef.pt', useFor: 'Immigration & Borders', subGroup: 'Visa & Immigration', icon: '🛂', isOfficial: true },
                { name: 'Portugal Visa Portal', link: 'https://vistos.mne.gov.pt', useFor: 'Visa Information', subGroup: 'Visa & Immigration', icon: '🇵🇹' },
                { name: 'IEFP Jobs', link: 'https://iefponline.iefp.pt', useFor: 'Employment Institute', subGroup: 'Jobs', icon: '💼' },
                { name: 'Indeed Portugal', link: 'https://pt.indeed.com', useFor: 'Job Search', subGroup: 'Jobs', icon: '🔎' },
                { name: 'Net-Empregos', link: 'https://www.net-empregos.com', useFor: 'Job Board', subGroup: 'Jobs', icon: '🕸️' }
            ]
        },
        {
            name: 'Italy',
            nameBn: 'ইতালি',
            slug: 'italy',
            icon: '🇮🇹',
            code: 'IT',
            description: 'Italy Visa & Work',
            websites: [
                { name: 'Italian Visa', link: 'https://vistoperitalia.esteri.it', useFor: 'Visa Guided Procedure', subGroup: 'Visa & Immigration', icon: '🇮🇹', isOfficial: true },
                { name: 'Interior Ministry', link: 'https://www.interno.gov.it', useFor: 'Immigration Info', subGroup: 'Visa & Immigration', icon: '🏛️' },
                { name: 'Indeed Italy', link: 'https://it.indeed.com', useFor: 'Job Search', subGroup: 'Jobs', icon: '💼' },
                { name: 'InfoJobs', link: 'https://www.infojobs.it', useFor: 'Job Board', subGroup: 'Jobs', icon: 'ℹ️' }
            ]
        },
        {
            name: 'Japan',
            nameBn: 'জাপান',
            slug: 'japan',
            icon: '🇯🇵',
            code: 'JP',
            description: 'Japan Work & Stay',
            websites: [
                { name: 'Immigration Services Agency', link: 'https://www.moj.go.jp/isa', useFor: 'Immigration Control', subGroup: 'Visa & Immigration', icon: '🌸', isOfficial: true },
                { name: 'Japan Visa Info', link: 'https://www.mofa.go.jp', useFor: 'Ministry of Foreign Affairs', subGroup: 'Visa & Immigration', icon: '🇯🇵' },
                { name: 'GaijinPot Jobs', link: 'https://jobs.gaijinpot.com', useFor: 'Jobs for Foreigners', subGroup: 'Jobs', icon: '🍜' },
                { name: 'Daijob', link: 'https://www.daijob.com', useFor: 'Bilingual Jobs', subGroup: 'Jobs', icon: '💼' },
                { name: 'Indeed Japan', link: 'https://jp.indeed.com', useFor: 'Job Search', subGroup: 'Jobs', icon: '🔎' }
            ]
        },
        {
            name: 'Singapore',
            nameBn: 'সিঙ্গাপুর',
            slug: 'singapore',
            icon: '🇸🇬',
            code: 'SG',
            description: 'Singapore Manpower & Visa',
            websites: [
                { name: 'ICA Singapore', link: 'https://www.ica.gov.sg', useFor: 'Immigration & Checkpoints', subGroup: 'Visa & Immigration', icon: '🇸🇬', isOfficial: true },
                { name: 'Ministry of Manpower', link: 'https://www.mom.gov.sg', useFor: 'Work Passes', subGroup: 'Visa & Immigration', icon: '👷' },
                { name: 'MyCareersFuture', link: 'https://www.mycareersfuture.gov.sg', useFor: 'Jobs for Locals/PR', subGroup: 'Jobs', icon: '💼' },
                { name: 'JobStreet SG', link: 'https://www.jobstreet.com.sg', useFor: 'Job Search', subGroup: 'Jobs', icon: '🏢' }
            ]
        },
        {
            name: 'Malaysia',
            nameBn: 'মালয়েশিয়া',
            slug: 'malaysia',
            icon: '🇲🇾',
            code: 'MY',
            description: 'Malaysia Visa & Jobs',
            websites: [
                { name: 'Immigration Malaysia', link: 'https://www.imi.gov.my', useFor: 'Department of Immigration', subGroup: 'Visa & Immigration', icon: '🇲🇾', isOfficial: true },
                { name: 'Malaysia Visa', link: 'https://www.malaysiavisa.gov.my', useFor: 'Visa Applications', subGroup: 'Visa & Immigration', icon: '🛂' },
                { name: 'JobStreet Malaysia', link: 'https://www.jobstreet.com.my', useFor: 'Job Search', subGroup: 'Jobs', icon: '💼' },
                { name: 'Maukerja', link: 'https://www.maukerja.my', useFor: 'Job Portal', subGroup: 'Jobs', icon: '🔎' }
            ]
        },
        {
            name: 'Saudi Arabia',
            nameBn: 'সৌদি আরব',
            slug: 'saudi-arabia',
            icon: '🇸🇦',
            code: 'SA',
            description: 'KSA Visas & Employment',
            websites: [
                { name: 'MOFA Visa Authorization', link: 'https://www.mofa.gov.sa/en/eservices/Pages/svc4.aspx', useFor: 'Work Visa Services', subGroup: 'Visa & Immigration', icon: '🇸🇦', isOfficial: true },
                { name: 'MOFA Work Visa Request', link: 'https://www.mofa.gov.sa/en/eservices/Pages/svc87.aspx', useFor: 'Org/Mission Visa', subGroup: 'Visa & Immigration', icon: '🏢', isOfficial: true },
                { name: 'HRSD Work Visa Services', link: 'https://www.hrsd.gov.sa/en/ministry-services/services/%D8%A7%D9%84%D8%AA%D8%A3%D8%B4%D9%8A%D8%B1%D8%A7%D8%AA-%D8%A7%D9%84%D9%85%D9%87%D9%86%D9%8A%D8%A9-%D8%A7%D9%84%D9%81%D9%88%D8%B1%D9%8A%D8%A9', useFor: 'Official Work Permit', subGroup: 'Visa & Immigration', icon: '🏗️', isOfficial: true },
                { name: 'Saudi Visa (Tourist)', link: 'https://visa.visitsaudi.com', useFor: 'Tourist Visa', subGroup: 'Visa & Immigration', icon: '🌴', isOfficial: true },
                { name: 'Absher', link: 'https://www.absher.sa', useFor: 'Govt Services', subGroup: 'Visa & Immigration', icon: '📱', isOfficial: true },
                { name: 'Muqeem (Visa Validity)', link: 'https://muqeem.sa/#/visa-validity/check', useFor: 'Check Visa Status', subGroup: 'Visa & Immigration', icon: '✅', popular: true },
                // Guides
                { name: 'Work Visa Overview', link: 'https://www.usemultiplier.com/saudi-arabia/work-visa', useFor: 'Guide (Multiplier)', subGroup: 'Visa & Immigration', icon: 'ℹ️' },
                { name: 'Work Visa Application', link: 'https://saudivisa.com/saudi-work-visa/', useFor: 'Guide (SaudiVisa)', subGroup: 'Visa & Immigration', icon: '📝' },
                // Jobs
                { name: 'Bayt (Saudi)', link: 'https://www.bayt.com/en/saudi-arabia/jobs/', useFor: 'Job Search', subGroup: 'Jobs', icon: '💼' },
                { name: 'GulfTalent (Saudi)', link: 'https://www.gulftalent.com/saudi-arabia/jobs', useFor: 'Job Search', subGroup: 'Jobs', icon: '👔' },
                { name: 'Naukrigulf (Saudi)', link: 'https://www.naukrigulf.com/jobs-in-saudi-arabia', useFor: 'Job Search', subGroup: 'Jobs', icon: '🏜️' },
                { name: 'Indeed Saudi Arabia', link: 'https://ae.indeed.com/q-vacancy-saudi-arabia-visa-jobs-jobs.html', useFor: 'Visa Jobs', subGroup: 'Jobs', icon: '🔎' },
                { name: 'Jooble Saudi', link: 'https://sa.jooble.org/jobs-visa/Saudi-Arabia', useFor: 'Visa Jobs Filter', subGroup: 'Jobs', icon: '🏷️' }
            ]
        },
        {
            name: 'United Arab Emirates',
            nameBn: 'সংযুক্ত আরব আমিরাত',
            slug: 'uae',
            icon: '🇦🇪',
            code: 'AE',
            description: 'UAE Smart Services & Jobs',
            websites: [
                { name: 'ICP UAE', link: 'https://icp.gov.ae', useFor: 'Federal Identity & Citizenship', subGroup: 'Visa & Immigration', icon: '🇦🇪', isOfficial: true },
                { name: 'GDRFA Dubai', link: 'https://www.gdrfad.gov.ae', useFor: 'Dubai Residency', subGroup: 'Visa & Immigration', icon: '🏙️' },
                { name: 'GulfTalent', link: 'https://www.gulftalent.com', useFor: 'Professional Jobs', subGroup: 'Jobs', icon: '👔' },
                { name: 'Dubizzle Jobs', link: 'https://dubizzle.com/jobs', useFor: 'Local Jobs', subGroup: 'Jobs', icon: '🏷️' }
            ]
        },
        // Old BMET/Ami Probashi can be under Bangladesh if we created it, or Global/Others.
        // For now, let's keep them in 'Bangladesh' if we had a country for it, 
        // or just Global but marked as BD specific?
        // Let's create a Bangladesh country entry here too for consistency with new structure
        {
            name: 'Bangladesh',
            nameBn: 'বাংলাদেশ',
            slug: 'bangladesh',
            icon: '🇧🇩',
            code: 'BD',
            description: 'Expat Services & Manpower',
            websites: [
                { name: 'BMET', link: 'https://bmet.gov.bd/', useFor: 'Manpower & Training', subGroup: 'Visa & Immigration', icon: '🏗️', isOfficial: true },
                { name: 'Ami Probashi', link: 'https://www.amiprobashi.com/', useFor: 'Expat App', subGroup: 'Visa & Immigration', icon: '📱' }
            ]
        }
    ];

    for (const countryData of countriesData) {
        console.log(`Processing Country: ${countryData.name}`);

        // 3. Upsert Country
        const country = await prisma.country.upsert({
            where: { slug: countryData.slug },
            update: {
                categoryId: category.id,
                name: countryData.name,
                nameBn: countryData.nameBn,
                icon: countryData.icon,
                code: countryData.code,
                description: countryData.description
            },
            create: {
                name: countryData.name,
                nameBn: countryData.nameBn,
                slug: countryData.slug,
                icon: countryData.icon,
                code: countryData.code,
                description: countryData.description,
                categoryId: category.id
            }
        });

        // 4. Upsert Websites linked to this Country
        for (const site of countryData.websites) {
            await prisma.website.upsert({
                where: { link: site.link },
                update: {
                    name: site.name,
                    // If simple names, just copy to en/bn where needed or leave optional? 
                    // Schema has nameEn/nameBn. Let's act smart.
                    nameEn: site.name,
                    nameBn: site.name,
                    useFor: site.useFor,
                    useForEn: site.useFor,
                    useForBn: site.useFor,
                    icon: site.icon,

                    popular: site.popular || false,
                    isOfficial: site.isOfficial || false,
                    subGroup: site.subGroup,

                    categoriesId: category.id,
                    countryId: country.id // LINKING TO COUNTRY!
                },
                create: {
                    name: site.name,
                    nameEn: site.name,
                    nameBn: site.name,
                    link: site.link,
                    useFor: site.useFor,
                    useForEn: site.useFor,
                    useForBn: site.useFor,
                    icon: site.icon,

                    popular: site.popular || false,
                    isOfficial: site.isOfficial || false,
                    subGroup: site.subGroup,
                    password: 'Murshed@@@k5',

                    categoriesId: category.id,
                    countryId: country.id
                }
            });
        }
    }

    console.log('Seeding Travel & Immigration finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

