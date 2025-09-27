const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mapping of existing Bengali categories to proper English categories
const categoryUpdates = [
  {
    id: "671a952e25826f59e665609f",
    name: "Travel & Immigration",
    path: "travel-immigration",
    icon: "🛂",
    description: "Visa applications, immigration services, and travel documentation"
  },
  {
    id: "673c1a08cbc8e7dc41032f18",
    name: "Online Payments",
    path: "online-payments",
    icon: "💳",
    description: "Online bill payments, challans, and payment gateways"
  },
  {
    id: "673c1a08cbc8e7dc41032f19",
    name: "Government Services",
    path: "government-services",
    icon: "🏛️",
    description: "Birth registration, government documents, and official services"
  },
  {
    id: "673c1a08cbc8e7dc41032f1a",
    name: "PDF & Document Tools",
    path: "pdf-document-tools",
    icon: "📄",
    description: "PDF converters, document editors, and file management tools"
  },
  {
    id: "673c1a08cbc8e7dc41032f1b",
    name: "Education Results",
    path: "education-results",
    icon: "📊",
    description: "Exam results, academic scores, and educational assessments"
  },
  {
    id: "673c1a08cbc8e7dc41032f1c",
    name: "Identity Documents",
    path: "identity-documents",
    icon: "🆔",
    description: "ID cards, identity verification, and personal documentation"
  }
];

async function updateBengaliCategories() {
  try {
    console.log('Updating Bengali categories to English...');
    
    const password = "Murshed@@@k5";
    let updatedCount = 0;
    
    for (const update of categoryUpdates) {
      try {
        // Check if category exists
        const existingCategory = await prisma.category.findUnique({
          where: { id: update.id },
          include: { websites: true }
        });
        
        if (existingCategory) {
          // Update the category
          await prisma.category.update({
            where: { id: update.id },
            data: {
              name: update.name,
              path: update.path,
              icon: update.icon,
              description: update.description,
              password: password
            }
          });
          
          console.log(`✓ Updated: "${existingCategory.name}" → "${update.name}" (${existingCategory.websites.length} websites)`);
          updatedCount++;
        } else {
          console.log(`⚠ Category not found with ID: ${update.id}`);
        }
      } catch (error) {
        console.error(`Error updating category ${update.id}:`, error.message);
      }
    }
    
    console.log(`\n🎉 Successfully updated ${updatedCount} categories!`);
    
    // Show final summary
    const finalCategories = await prisma.category.findMany({
      include: { websites: true },
      orderBy: { name: 'asc' }
    });
    
    console.log(`\n📊 Final Summary:`);
    console.log(`   Total categories: ${finalCategories.length}`);
    console.log(`   Total websites: ${finalCategories.reduce((sum, cat) => sum + cat.websites.length, 0)}`);
    
    // Check for any remaining non-English categories
    const nonEnglishCategories = finalCategories.filter(cat => 
      /[\u0980-\u09FF]/.test(cat.name)
    );
    
    if (nonEnglishCategories.length > 0) {
      console.log(`\n⚠ Remaining non-English categories:`);
      nonEnglishCategories.forEach(cat => {
        console.log(`   - "${cat.name}" (${cat.websites.length} websites)`);
      });
    } else {
      console.log(`\n✅ All categories are now in English!`);
    }
    
  } catch (error) {
    console.error('Error updating categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateBengaliCategories();
