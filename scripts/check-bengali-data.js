const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkBengaliData() {
  try {
    console.log('Checking Bengali data in categories...');
    
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        nameEn: true,
        nameBn: true,
        description: true,
        descriptionEn: true,
        descriptionBn: true,
        websites: {
          select: { id: true }
        }
      },
      orderBy: { name: 'asc' }
    });
    
    console.log(`Found ${categories.length} categories\n`);
    
    let hasEnglish = 0;
    let hasBengali = 0;
    let missingBengali = [];
    
    categories.forEach((cat, index) => {
      const hasEn = cat.nameEn || cat.name;
      const hasBn = cat.nameBn;
      
      if (hasEn) hasEnglish++;
      if (hasBn) hasBengali++;
      
      if (!hasBn) {
        missingBengali.push(cat.name);
      }
      
      console.log(`${index + 1}. "${cat.name}"`);
      console.log(`   EN: "${cat.nameEn || cat.name || 'MISSING'}"`);
      console.log(`   BN: "${cat.nameBn || 'MISSING'}"`);
      console.log(`   Websites: ${cat.websites.length}`);
      console.log('');
    });
    
    console.log(`Summary:`);
    console.log(`- Categories with English names: ${hasEnglish}`);
    console.log(`- Categories with Bengali names: ${hasBengali}`);
    console.log(`- Missing Bengali translations: ${missingBengali.length}`);
    
    if (missingBengali.length > 0) {
      console.log(`\nCategories missing Bengali names:`);
      missingBengali.forEach(name => console.log(`- ${name}`));
    }
    
  } catch (error) {
    console.error('Error checking Bengali data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkBengaliData();
