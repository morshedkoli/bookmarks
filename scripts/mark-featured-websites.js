const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function markFeaturedWebsites() {
  try {
    console.log('🌟 Marking some websites as featured...\n');
    
    // Get all websites
    const websites = await prisma.website.findMany({
      include: {
        categorie: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`Found ${websites.length} websites total\n`);
    
    // Mark the first 3-4 websites as featured for demonstration
    const websitesToFeature = websites.slice(0, Math.min(4, websites.length));
    
    let featuredCount = 0;
    
    for (const website of websitesToFeature) {
      await prisma.website.update({
        where: { id: website.id },
        data: { featured: true }
      });
      
      console.log(`✨ Marked as featured: "${website.name}" (${website.categorie?.name})`);
      featuredCount++;
    }
    
    console.log(`\n🎉 Successfully marked ${featuredCount} websites as featured!`);
    
    // Show all featured websites
    const featuredWebsites = await prisma.website.findMany({
      where: { featured: true },
      include: { categorie: true },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`\n⭐ Featured Websites (${featuredWebsites.length} total):`);
    featuredWebsites.forEach((website, index) => {
      console.log(`${index + 1}. ${website.name} - ${website.categorie?.name}`);
      console.log(`   🔗 ${website.link}`);
      console.log(`   📝 ${website.useFor || 'No description'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error marking featured websites:', error);
  } finally {
    await prisma.$disconnect();
  }
}

markFeaturedWebsites();
