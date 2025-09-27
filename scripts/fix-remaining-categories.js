const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Mapping of existing Bengali categories to proper English categories
const categoryMappings = [
  {
    oldName: "visa ভিসা",
    newName: "Travel & Immigration",
    newPath: "travel-immigration",
    newIcon: "🛂",
    newDescription: "Visa applications, immigration services, and travel documentation"
  },
  {
    oldName: "nai জন্ম নিবন্ধন",
    newName: "Government Services",
    newPath: "government-services",
    newIcon: "🏛️",
    newDescription: "Birth registration, government documents, and official services"
  },
  {
    oldName: "pdf PDF Tools (পিডিএফ)",
    newName: "PDF & Document Tools",
    newPath: "pdf-document-tools",
    newIcon: "📄",
    newDescription: "PDF converters, document editors, and file management tools"
  },
  {
    oldName: "result পরিক্ষার রেজাল্ট",
    newName: "Education Results",
    newPath: "education-results",
    newIcon: "📊",
    newDescription: "Exam results, academic scores, and educational assessments"
  },
  {
    oldName: "challan চালান/ অনলাইন চালান",
    newName: "Online Payments",
    newPath: "online-payments",
    newIcon: "💳",
    newDescription: "Online bill payments, challans, and payment gateways"
  }
];

async function fixRemainingCategories() {
  try {
    console.log('Starting to fix remaining Bengali categories...');
    
    const password = "Murshed@@@k5";
    
    for (const mapping of categoryMappings) {
      try {
        // Find the category by old name
        const existingCategory = await prisma.category.findFirst({
          where: {
            name: mapping.oldName
          },
          include: {
            websites: true
          }
        });
        
        if (existingCategory) {
          // Update the category
          await prisma.category.update({
            where: { id: existingCategory.id },
            data: {
              name: mapping.newName,
              path: mapping.newPath,
              icon: mapping.newIcon,
              description: mapping.newDescription,
              password: password
            }
          });
          
          console.log(`✓ Updated: "${mapping.oldName}" → "${mapping.newName}" (${existingCategory.websites.length} websites)`);
        } else {
          console.log(`⚠ Category not found: "${mapping.oldName}"`);
        }
      } catch (error) {
        console.error(`Error updating category "${mapping.oldName}":`, error.message);
      }
    }
    
    // Show final category list
    console.log('\n📋 Final category summary:');
    const finalCategories = await prisma.category.findMany({
      include: {
        websites: true
      },
      orderBy: {
        name: 'asc'
      }
    });
    
    finalCategories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.icon} ${cat.name} (${cat.websites.length} websites)`);
    });
    
    console.log(`\n🎉 Successfully updated ${categoryMappings.length} categories!`);
    console.log(`📊 Total categories: ${finalCategories.length}`);
    console.log(`📊 Total websites: ${finalCategories.reduce((sum, cat) => sum + cat.websites.length, 0)}`);
    
  } catch (error) {
    console.error('Error fixing categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the fix
fixRemainingCategories();
