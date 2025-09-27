const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testBilingualData() {
  try {
    console.log('🧪 Testing Bilingual Functionality...\n');
    
    // Get categories with websites
    const categoriesWithWebsites = await prisma.category.findMany({
      where: {
        websites: {
          some: {}
        }
      },
      include: {
        websites: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    console.log(`📊 Found ${categoriesWithWebsites.length} categories with websites:\n`);
    
    categoriesWithWebsites.forEach((category, index) => {
      console.log(`${index + 1}. 🏷️  Category: "${category.name}"`);
      console.log(`   🇺🇸 English: "${category.nameEn || category.name}"`);
      console.log(`   🇧🇩 Bengali: "${category.nameBn || 'Missing'}"`);
      console.log(`   📱 Websites: ${category.websites.length}`);
      
      if (category.websites.length > 0) {
        console.log(`   📋 Website list:`);
        category.websites.forEach((website, idx) => {
          console.log(`      ${idx + 1}. ${website.name}`);
        });
      }
      console.log('');
    });
    
    // Test language switching simulation
    console.log('🔄 Language Switching Test:');
    console.log('─'.repeat(50));
    
    const testCategory = categoriesWithWebsites[0];
    if (testCategory) {
      console.log('📝 Example category display:');
      console.log(`   English Mode: "${testCategory.nameEn || testCategory.name}"`);
      console.log(`   Bengali Mode: "${testCategory.nameBn || testCategory.name}"`);
      
      if (testCategory.descriptionEn || testCategory.descriptionBn) {
        console.log(`   English Desc: "${testCategory.descriptionEn || 'No description'}"`);
        console.log(`   Bengali Desc: "${testCategory.descriptionBn || 'No description'}"`);
      }
    }
    
    console.log('\n✅ Bilingual test completed successfully!');
    console.log('\n🎯 Next steps:');
    console.log('1. Open the browser preview');
    console.log('2. Click the language toggle (EN ↔ বাং) in the navigation');
    console.log('3. Verify categories change from English to Bengali');
    console.log('4. Test the admin dashboard for bilingual editing');
    
  } catch (error) {
    console.error('❌ Error testing bilingual data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testBilingualData();
