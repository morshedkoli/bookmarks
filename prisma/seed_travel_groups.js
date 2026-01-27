const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Travel Groups...');

    const category = await prisma.category.findUnique({
        where: { name: 'Travel & Immigration' }
    });

    if (!category) {
        console.log('Travel category not found, please run seed_travel.js first');
        return;
    }

    // Define groups and their sites
    // Note: We are updating existing sites based on their links or creating new ones if missing.

    const groupedSites = [
        // --- Saudi Arabia ---
        {
            link: 'https://muqeem.sa/#/visa-validity/check',
            group: 'Saudi Arabia',
            groupBn: 'সৌদি আরব'
        },
        {
            link: 'https://visa.mofa.gov.sa/',
            group: 'Saudi Arabia',
            groupBn: 'সৌদি আরব'
        },
        // --- UAE ---
        {
            link: 'https://smartservices.icp.gov.ae/echannels/web/client/default.html#/fileValidity',
            group: 'UAE (United Arab Emirates)',
            groupBn: 'সংযুক্ত আরব আমিরাত'
        },
        {
            link: 'https://smart.gdrfad.gov.ae/Public_Th/StatusInquiry_New.aspx',
            group: 'UAE (United Arab Emirates)',
            groupBn: 'সংযুক্ত আরব আমিরাত'
        },
        // --- Qatar ---
        {
            link: 'https://portal.moi.gov.qa/wps/portal/MOIInternet/services/inquiries/visaservices/visaapprovaltracking',
            group: 'Qatar',
            groupBn: 'কাতার'
        },
        // --- Kuwait ---
        {
            link: 'https://r.moi.gov.kw/PersonalEnquiry',
            group: 'Kuwait',
            groupBn: 'কুয়েত'
        },
        // --- Oman ---
        {
            link: 'https://evisa.rop.gov.om/en/track-visa-application',
            group: 'Oman',
            groupBn: 'ওমান'
        },
        // --- Bahrain ---
        {
            link: 'https://www.evisa.gov.bh/VISA/visaInput?nav=A0S&A0S=a',
            group: 'Bahrain',
            groupBn: 'বাহরাইন'
        },
        // --- Malaysia ---
        {
            link: 'https://imigresen-online.imi.gov.my/',
            group: 'Malaysia',
            groupBn: 'মালয়েশিয়া'
        },
        // --- Singapore ---
        {
            link: 'https://eservices.ica.gov.sg/esvclandingpage/save',
            group: 'Singapore',
            groupBn: 'সিঙ্গাপুর'
        },
        // --- Maldives ---
        {
            link: 'https://imuga.immigration.gov.mv/',
            group: 'Maldives',
            groupBn: 'মালদ্বীপ'
        },
        // --- USA ---
        {
            link: 'https://ceac.state.gov/CEACStatTracker/Status.aspx',
            group: 'USA & Europe',
            groupBn: 'আমেরিকা ও ইউরোপ'
        },
        // --- Global Tools ---
        {
            link: 'https://www.vfsglobal.com/en/individuals/index.html',
            group: 'Global Services',
            groupBn: 'গ্লোবাল সার্ভিস'
        },
        {
            link: 'https://bmet.gov.bd/',
            group: 'Bangladesh Services',
            groupBn: 'বাংলাদেশ সার্ভিস'
        },
        {
            link: 'https://www.amiprobashi.com/',
            group: 'Bangladesh Services',
            groupBn: 'বাংলাদেশ সার্ভিস'
        }
    ];

    for (const item of groupedSites) {
        await prisma.website.update({
            where: { link: item.link },
            data: {
                group: item.group,
                groupBn: item.groupBn
            }
        });
    }

    console.log('Seeding Travel Groups finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
