const { MongoClient } = require('mongodb');

async function updateEntertainmentCategory() {
  const client = new MongoClient(process.env.DATABASE_URL || 'mongodb://localhost:27017/bookmark');
  
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db();
    const collection = db.collection('Category');
    
    // Find entertainment category
    const entertainmentCategory = await collection.findOne({
      $or: [
        { nameEn: /entertainment/i },
        { nameBn: /বিনোদন/i },
        { name: /entertainment/i }
      ]
    });
    
    if (!entertainmentCategory) {
      console.log('Entertainment category not found');
      
      // List all categories to see what exists
      const allCategories = await collection.find({}).toArray();
      console.log('\nAll categories:');
      allCategories.forEach(cat => {
        console.log(`- ${cat.name || cat.nameEn} (${cat.nameBn || 'No Bengali name'}) - ID: ${cat._id}`);
      });
      return;
    }
    
    console.log(`Found category: ${entertainmentCategory.name || entertainmentCategory.nameEn}`);
    
    // Update the category
    const result = await collection.updateOne(
      { _id: entertainmentCategory._id },
      {
        $set: {
          name: 'Artificial Intelligence',
          nameEn: 'Artificial Intelligence',
          nameBn: 'কৃত্রিম বুদ্ধিমত্তা',
          descriptionEn: 'AI tools, chatbots, and artificial intelligence platforms',
          descriptionBn: 'এআই টুলস, চ্যাটবট এবং কৃত্রিম বুদ্ধিমত্তা প্ল্যাটফর্ম',
          icon: '🤖',
          updatedAt: new Date()
        }
      }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Successfully updated Entertainment category to AI!');
      
      // Verify the update
      const updatedCategory = await collection.findOne({ _id: entertainmentCategory._id });
      console.log(`New name: ${updatedCategory.nameEn} (${updatedCategory.nameBn})`);
      console.log(`New icon: ${updatedCategory.icon}`);
    } else {
      console.log('❌ Failed to update category');
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await client.close();
  }
}

updateEntertainmentCategory();
