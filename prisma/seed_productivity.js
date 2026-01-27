const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding Productivity & Tech resources...');

    const categories = [
        {
            name: 'Productivity & Time Management',
            nameEn: 'Productivity & Time Management',
            nameBn: 'প্রোডাক্টিভিটি ও টাইম ম্যানেজমেন্ট',
            path: '/productivity',
            icon: '📈',
            description: 'Useful for planning tasks, managing time, tracking goals, and team coordination.',
            descriptionEn: 'Useful for planning tasks, managing time, tracking goals, and team coordination.',
            descriptionBn: 'কাজ পরিকল্পনা, সময় ব্যবস্থাপনা এবং লক্ষ্য ট্র্যাকিং এর জন্য।',
            password: 'Murshed@@@k5',
            websites: [
                { name: 'Todoist', link: 'https://todoist.com', useFor: 'Task management & planner', icon: '✅' },
                { name: 'Calendar.com', link: 'https://calendar.com', useFor: 'Smart scheduling', icon: '📅' },
                { name: 'Asana', link: 'https://asana.com', useFor: 'Team project tracker', icon: '📊' },
                { name: 'Zapier', link: 'https://zapier.com', useFor: 'Automations between apps', icon: '⚡' },
                { name: 'RescueTime', link: 'https://rescuetime.com', useFor: 'Time analytics', icon: '⏱️' },
                { name: 'SaneBox', link: 'https://sanebox.com', useFor: 'Email prioritizer', icon: '📧' },
                { name: 'LastPass', link: 'https://lastpass.com', useFor: 'Password manager', icon: '🔒' }
            ]
        },
        {
            name: 'Development & Tech Tools',
            nameEn: 'Development & Tech Tools',
            nameBn: 'ডেভেলপমেন্ট ও টেক টুলস',
            path: '/dev-tools',
            icon: '💻',
            description: 'Dev tools to code, test, track issues, and collaborate.',
            descriptionEn: 'Dev tools to code, test, track issues, and collaborate.',
            descriptionBn: 'কোডিং, টেস্টিং এবং ইস্যু ট্র্যাকিং এর জন্য টুলস।',
            password: 'Murshed@@@k5',
            websites: [
                { name: 'Visual Studio Code', link: 'https://code.visualstudio.com', useFor: 'Code editor', icon: '📝' },
                { name: 'GitHub', link: 'https://github.com', useFor: 'Code host & version control', icon: '🐙' },
                { name: 'Jenkins', link: 'https://jenkins.io', useFor: 'CI/CD automation', icon: '🏗️' },
                { name: 'Docker', link: 'https://docker.com', useFor: 'Container platform', icon: '🐳' },
                { name: 'Sublime Text', link: 'https://sublimetext.com', useFor: 'Lightweight code editor', icon: '📄' },
                { name: 'NetBeans', link: 'https://netbeans.apache.org', useFor: 'Java IDE', icon: '☕' },
                { name: 'Postman', link: 'https://postman.com', useFor: 'API testing', icon: '🚀' },
                { name: 'Chrome DevTools', link: 'https://developer.chrome.com/docs/devtools/', useFor: 'Browser debugging', icon: '🛠️' }
            ]
        },
        {
            name: 'Design & Creative Tools',
            nameEn: 'Design & Creative Tools',
            nameBn: 'ডিজাইন ও ক্রিয়েটিভ টুলস',
            path: '/design-tools',
            icon: '🎨',
            description: 'Tools for graphics, UI/UX, and visuals.',
            descriptionEn: 'Tools for graphics, UI/UX, and visuals.',
            descriptionBn: 'গ্রাফিক্স, ইউআই/ইউএক্স এবং ভিজ্যুয়াল এর জন্য টুলস।',
            password: 'Murshed@@@k5',
            websites: [
                { name: 'Canva', link: 'https://canva.com', useFor: 'Graphic design', icon: '🖌️' },
                { name: 'Snappa', link: 'https://snappa.com', useFor: 'Quick graphic maker', icon: '🖼️' },
                { name: 'Figma', link: 'https://figma.com', useFor: 'UI/UX design & collaboration', icon: '🎨' },
                { name: 'Adobe Creative Cloud', link: 'https://adobe.com/creativecloud', useFor: 'Suite of design apps', icon: '☁️' }
            ]
        },
        {
            name: 'Marketing & SEO Tools',
            nameEn: 'Marketing & SEO Tools',
            nameBn: 'মার্কেটিং ও এসইও টুলস',
            path: '/marketing-seo',
            icon: '📣',
            description: 'For SEO, analytics, content discovery, and scheduling.',
            descriptionEn: 'For SEO, analytics, content discovery, and scheduling.',
            descriptionBn: 'এসইও, অ্যানালিটিক্স এবং কন্টেন্ট শিডিউলিং এর জন্য।',
            password: 'Murshed@@@k5',
            websites: [
                { name: 'Google Analytics', link: 'https://analytics.google.com', useFor: 'Web analytics', icon: '📈' },
                { name: 'Google Trends', link: 'https://trends.google.com', useFor: 'Search trends', icon: '📊' },
                { name: 'SEMrush', link: 'https://semrush.com', useFor: 'SEO & keyword tool', icon: '🔍' },
                { name: 'Mailchimp', link: 'https://mailchimp.com', useFor: 'Email marketing', icon: '🐒' },
                { name: 'Hootsuite', link: 'https://hootsuite.com', useFor: 'Social media scheduler', icon: '🦉' },
                { name: 'Feedly', link: 'https://feedly.com', useFor: 'Content discovery', icon: '📰' },
                { name: 'GetResponse', link: 'https://getresponse.com', useFor: 'Email & marketing suite', icon: '📧' }
            ]
        },
        {
            name: 'Collaboration & Communication',
            nameEn: 'Collaboration & Communication',
            nameBn: 'কলাবোরেশন ও কমিউনিকেশন',
            path: '/collaboration',
            icon: '🤝',
            description: 'Tools to team up, share files, and stay synced.',
            descriptionEn: 'Tools to team up, share files, and stay synced.',
            descriptionBn: 'টিম ওয়ার্ক, ফাইল শেয়ারিং এবং সিঙ্ক থাকার জন্য।',
            password: 'Murshed@@@k5',
            websites: [
                { name: 'Slack', link: 'https://slack.com', useFor: 'Team chat', icon: '💬' },
                { name: 'Google Drive', link: 'https://drive.google.com', useFor: 'Cloud docs & storage', icon: '📁' },
                { name: 'Microsoft Teams', link: 'https://microsoft.com/microsoft-teams', useFor: 'Meeting & collaboration', icon: '👥' },
                { name: 'Zoom', link: 'https://zoom.us', useFor: 'Video conferencing', icon: '📹' }
            ]
        },
        {
            name: 'AI & Content Tools',
            nameEn: 'AI & Content Tools',
            nameBn: 'এআই ও কন্টেন্ট টুলস',
            path: '/ai-tools',
            icon: '🤖',
            description: 'Modern tools for content, automation, and creative generation.',
            descriptionEn: 'Modern tools for content, automation, and creative generation.',
            descriptionBn: 'কন্টেন্ট, অটোমেশন এবং ক্রিয়েটিভ জেনারেশন এর জন্য এআই টুলস।',
            password: 'Murshed@@@k5',
            websites: [
                { name: 'HubSpot AI', link: 'https://hubspot.com/features/ai', useFor: 'Content & marketing AI', icon: '🤖' },
                { name: 'Grammarly', link: 'https://grammarly.com', useFor: 'Writing assistant', icon: '✍️' },
                { name: 'ChatGPT', link: 'https://chat.openai.com', useFor: 'AI assistant', icon: '🧠' },
                { name: 'Jasper', link: 'https://jasper.ai', useFor: 'AI content creation', icon: '📝' },
                { name: 'Copy.ai', link: 'https://copy.ai', useFor: 'AI writing help', icon: '📄' }
            ]
        },
        {
            name: 'Misc Online Utilities',
            nameEn: 'Misc Online Utilities',
            nameBn: 'বিবিধ অনলাইন ইউটিলিটিস',
            path: '/misc-tools',
            icon: '📊',
            description: 'Other useful web tools for daily tasks.',
            descriptionEn: 'Other useful web tools for daily tasks.',
            descriptionBn: 'দৈনন্দিন কাজের জন্য অন্যান্য প্রয়োজনীয় ওয়েব টুলস।',
            password: 'Murshed@@@k5',
            websites: [
                { name: 'Word Counter', link: 'https://wordcounter.net/', useFor: 'Text length counter', icon: '🔢' },
                { name: 'Age Calculator', link: 'https://www.calculator.net/age-calculator.html', useFor: 'Age from date', icon: '📅' },
                { name: 'YouTube Thumbnail Extractor', link: 'https://www.get-youtube-thumbnail.com/', useFor: 'Thumbnail grabber', icon: '🖼️' },
                { name: 'Instagram Profile Pic Saver', link: 'https://instadp.io/', useFor: 'Save IG profile', icon: '📸' },
                { name: 'Anonymous Chat', link: 'https://hack.chat/', useFor: 'Temporary chat tool', icon: '🕵️' }
            ]
        },
        {
            name: 'Web Dev/OSINT & Research Tools',
            nameEn: 'Web Dev/OSINT & Research Tools',
            nameBn: 'ওয়েব ডেভ/ওসিন্ত ও রিসার্চ',
            path: '/research-tools',
            icon: '👨‍💻',
            description: 'Advanced tools for research, investigation, and OSINT.',
            descriptionEn: 'Advanced tools for research, investigation, and OSINT.',
            descriptionBn: 'গবেষণা এবং অনুসন্ধানের জন্য উন্নত টুলস।',
            password: 'Murshed@@@k5',
            websites: [
                { name: 'OSINT Framework', link: 'https://osintframework.com/', useFor: 'Open-source intelligence links', icon: '🌐' },
                { name: 'Research Clinic', link: 'http://researchclinic.net/', useFor: 'Search tips & tools', icon: '🔍' }
            ]
        }
    ];

    for (const cat of categories) {
        console.log(`Processing category: ${cat.name}`);
        const category = await prisma.category.upsert({
            where: { name: cat.name },
            update: {},
            create: {
                name: cat.name,
                nameEn: cat.nameEn,
                nameBn: cat.nameBn,
                path: cat.path,
                icon: cat.icon,
                description: cat.description,
                descriptionEn: cat.descriptionEn,
                descriptionBn: cat.descriptionBn,
                password: cat.password
            },
        });

        for (const site of cat.websites) {
            await prisma.website.upsert({
                where: { link: site.link },
                update: {
                    categoriesId: category.id,
                    popular: false,
                    featured: false
                },
                create: {
                    name: site.name,
                    nameEn: site.name,
                    nameBn: site.name, // Simplified for now
                    link: site.link,
                    useFor: site.useFor,
                    useForEn: site.useFor,
                    useForBn: site.useFor, // Simplified
                    icon: site.icon,
                    featured: false,
                    popular: false,
                    password: 'Murshed@@@k5',
                    categoriesId: category.id,
                },
            });
        }
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
