const http = require('http');

async function makeRequest(options) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
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
    req.end();
  });
}

async function verifyAICategory() {
  try {
    console.log('Verifying AI category changes...');
    
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
    
    // Find AI category
    const aiCategory = categories.find(cat => 
      (cat.nameEn && cat.nameEn.toLowerCase().includes('artificial')) ||
      (cat.nameEn && cat.nameEn.toLowerCase().includes('intelligence')) ||
      (cat.icon === '🤖')
    );
    
    if (aiCategory) {
      console.log('✅ AI Category found successfully!');
      console.log(`- English Name: ${aiCategory.nameEn}`);
      console.log(`- Bengali Name: ${aiCategory.nameBn}`);
      console.log(`- Icon: ${aiCategory.icon}`);
      console.log(`- Description (EN): ${aiCategory.descriptionEn}`);
      console.log(`- Description (BN): ${aiCategory.descriptionBn}`);
      console.log(`- Number of websites: ${aiCategory.websites ? aiCategory.websites.length : 'Unknown'}`);
      
      if (aiCategory.websites && aiCategory.websites.length > 0) {
        console.log('\nWebsites in AI category:');
        aiCategory.websites.forEach(site => {
          console.log(`  - ${site.name}: ${site.link}`);
        });
      }
    } else {
      console.log('❌ AI category not found');
    }
    
    // Check if Entertainment category still exists
    const entertainmentCategory = categories.find(cat => 
      (cat.nameEn && cat.nameEn.toLowerCase().includes('entertainment')) ||
      (cat.nameBn && cat.nameBn.includes('বিনোদন'))
    );
    
    if (entertainmentCategory) {
      console.log('\n⚠️  Entertainment category still exists:');
      console.log(`- Name: ${entertainmentCategory.nameEn}`);
      console.log(`- ID: ${entertainmentCategory.id}`);
    } else {
      console.log('\n✅ Entertainment category successfully renamed - no longer exists');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

verifyAICategory();
