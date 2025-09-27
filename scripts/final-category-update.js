const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function finalCategoryUpdate() {
  try {
    console.log('Getting remaining Bengali categories...');
    
    // Get all categories with Bengali characters
    const categories = await prisma.category.findMany({
      include: { websites: true }
    });
    
    const bengaliCategories = categories.filter(cat => 
      /[\u0980-\u09FF]/.test(cat.name) || 
      cat.name.includes('পিডিএফ') ||
      cat.name.includes('Tools (')
    );
    
    console.log('Found Bengali categories:');
    bengaliCategories.forEach(cat => {
      console.log(`- ID: ${cat.id}, Name: "${cat.name}", Websites: ${cat.websites.length}`);
    });
    
    const password = "Murshed@@@k5";
    let updatedCount = 0;
    
    // Update each Bengali category
    for (const cat of bengaliCategories) {
      let newData = {};
      
      if (cat.name.includes('PDF Tools') || cat.name.includes('পিডিএফ')) {
        newData = {
          name: "PDF & Document Tools",
          path: "pdf-document-tools",
          icon: "📄",
          description: "PDF converters, document editors, and file management tools"
        };
      } else if (cat.name.includes('আইডি কার্ড')) {
        newData = {
          name: "Identity Documents",
          path: "identity-documents",
          icon: "🆔",
          description: "ID cards, identity verification, and personal documentation"
        };
      } else if (cat.name.includes('জন্ম নিবন্ধন')) {
        newData = {
          name: "Birth Registration",
          path: "birth-registration",
          icon: "👶",
          description: "Birth certificates, registration services, and vital records"
        };
      } else if (cat.name.includes('পরিক্ষার রেজাল্ট')) {
        newData = {
          name: "Education Results",
          path: "education-results",
          icon: "📊",
          description: "Exam results, academic scores, and educational assessments"
        };
      }
      
      if (Object.keys(newData).length > 0) {
        await prisma.category.update({
          where: { id: cat.id },
          data: {
            ...newData,
            password: password
          }
        });
        
        console.log(`✓ Updated: "${cat.name}" → "${newData.name}" (${cat.websites.length} websites)`);
        updatedCount++;
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} categories!`);
    
    // Final verification
    const finalCategories = await prisma.category.findMany({
      include: { websites: true },
      orderBy: { name: 'asc' }
    });
    
    const stillBengali = finalCategories.filter(cat => /[\u0980-\u09FF]/.test(cat.name));
    
    if (stillBengali.length === 0) {
      console.log(`\n✅ All categories are now in English!`);
      console.log(`📊 Total categories: ${finalCategories.length}`);
      console.log(`📊 Total websites: ${finalCategories.reduce((sum, cat) => sum + cat.websites.length, 0)}`);
      
      console.log(`\n📋 All categories:`);
      finalCategories.forEach((cat, index) => {
        if (cat.websites.length > 0) {
          console.log(`${index + 1}. ${cat.icon} ${cat.name} (${cat.websites.length} websites)`);
        }
      });
    } else {
      console.log(`\n⚠ Still have Bengali categories:`);
      stillBengali.forEach(cat => {
        console.log(`   - "${cat.name}"`);
      });
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

finalCategoryUpdate();
