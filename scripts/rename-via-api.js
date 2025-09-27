const https = require('https');
const http = require('http');

async function makeRequest(options, data) {
  return new Promise((resolve, reject) => {
    const protocol = options.port === 443 ? https : http;
    const req = protocol.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          resolve({
            statusCode: res.statusCode,
            data: JSON.parse(body)
          });
        } catch (e) {
          resolve({
            statusCode: res.statusCode,
            data: body
          });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function renameEntertainmentToAI() {
  try {
    console.log('Fetching categories...');
    
    // Get all categories
    const getOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/category',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(getOptions);
    
    if (response.statusCode !== 200) {
      console.error('Failed to fetch categories:', response.data);
      return;
    }
    
    const categories = response.data.data || response.data;
    console.log(`Found ${categories.length} categories`);
    
    // Find entertainment category
    const entertainmentCategory = categories.find(cat => 
      (cat.nameEn && cat.nameEn.toLowerCase().includes('entertainment')) ||
      (cat.nameBn && cat.nameBn.includes('বিনোদন')) ||
      (cat.name && cat.name.toLowerCase().includes('entertainment'))
    );
    
    if (!entertainmentCategory) {
      console.log('Entertainment category not found');
      console.log('Available categories:');
      categories.forEach(cat => {
        console.log(`- ${cat.nameEn || cat.name} (${cat.nameBn || 'No Bengali name'}) - ID: ${cat.id}`);
      });
      return;
    }
    
    console.log(`Found Entertainment category: ${entertainmentCategory.nameEn || entertainmentCategory.name}`);
    console.log(`Category ID: ${entertainmentCategory.id}`);
    
    // Update the category
    const updateData = {
      id: entertainmentCategory.id,
      name: 'Artificial Intelligence',
      nameEn: 'Artificial Intelligence',
      nameBn: 'কৃত্রিম বুদ্ধিমত্তা',
      descriptionEn: 'AI tools, chatbots, and artificial intelligence platforms',
      descriptionBn: 'এআই টুলস, চ্যাটবট এবং কৃত্রিম বুদ্ধিমত্তা প্ল্যাটফর্ম',
      icon: '🤖',
      path: entertainmentCategory.path || 'ai',
      password: 'Murshed@@@k5'
    };
    
    const putOptions = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/category',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    console.log('Updating category...');
    const updateResponse = await makeRequest(putOptions, updateData);
    
    if (updateResponse.statusCode === 200) {
      console.log('✅ Successfully renamed Entertainment category to AI!');
      console.log('New details:');
      console.log(`- English: ${updateData.nameEn}`);
      console.log(`- Bengali: ${updateData.nameBn}`);
      console.log(`- Icon: ${updateData.icon}`);
      console.log(`- Description: ${updateData.descriptionEn}`);
    } else {
      console.error('❌ Failed to update category:', updateResponse.data);
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

renameEntertainmentToAI();
