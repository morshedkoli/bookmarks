const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAIWebsites() {
  try {
    const categories = await prisma.categorie.findMany({
      include: {
        websites: true
      }
    });
    
    console.log('=== CATEGORIES AND WEBSITES ===');
    categories.forEach(cat => {
      console.log(`\nCategory: ${cat.nameEn} (${cat.nameBn}) - ID: ${cat.id}`);
      if (cat.websites.length > 0) {
        cat.websites.forEach(site => {
          console.log(`  - ${site.name} (ID: ${site.id})`);
        });
      } else {
        console.log('  No websites');
      }
    });
    
    // Find Entertainment category
    const entertainment = categories.find(c => c.nameEn.toLowerCase().includes('entertainment'));
    if (entertainment) {
      console.log(`\n=== ENTERTAINMENT CATEGORY WEBSITES ===`);
      entertainment.websites.forEach(site => {
        console.log(`- ${site.name}: ${site.link}`);
      });
    }
    
    // Find AI category
    const aiCategory = categories.find(c => c.nameEn.toLowerCase().includes('artificial') || c.nameEn.toLowerCase().includes('intelligence'));
    if (aiCategory) {
      console.log(`\n=== AI CATEGORY WEBSITES ===`);
      aiCategory.websites.forEach(site => {
        console.log(`- ${site.name}: ${site.link}`);
      });
    }
    
    // Look for AI-related websites in wrong categories
    console.log(`\n=== POTENTIAL AI WEBSITES IN WRONG CATEGORIES ===`);
    categories.forEach(cat => {
      cat.websites.forEach(site => {
        const siteName = site.name.toLowerCase();
        const siteLink = site.link.toLowerCase();
        if ((siteName.includes('ai') || siteName.includes('artificial') || siteName.includes('intelligence') || 
             siteName.includes('chatgpt') || siteName.includes('claude') || siteName.includes('gemini') ||
             siteName.includes('copilot') || siteName.includes('openai') || siteName.includes('anthropic') ||
             siteLink.includes('openai') || siteLink.includes('anthropic') || siteLink.includes('claude') ||
             siteLink.includes('chatgpt') || siteLink.includes('gemini') || siteLink.includes('copilot')) &&
            !cat.nameEn.toLowerCase().includes('artificial') && !cat.nameEn.toLowerCase().includes('intelligence')) {
          console.log(`- ${site.name} (ID: ${site.id}) is in "${cat.nameEn}" category but seems AI-related`);
          console.log(`  Link: ${site.link}`);
        }
      });
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAIWebsites();
