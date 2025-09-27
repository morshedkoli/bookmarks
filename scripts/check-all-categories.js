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

async function checkAllCategories() {
  try {
    console.log('Fetching all categories...');
    
    const getOptions = {
      hostname: 'localhost',
      port: 3000,
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
    console.log(`\nFound ${categories.length} categories:\n`);
    
    categories.forEach((cat, index) => {
      const websiteCount = cat.websites ? cat.websites.length : 0;
      console.log(`${index + 1}. ${cat.nameEn || cat.name} (${cat.nameBn || 'No Bengali name'})`);
      console.log(`   Icon: ${cat.icon} | Websites: ${websiteCount} | ID: ${cat.id}`);
      if (cat.websites && cat.websites.length > 0) {
        console.log(`   Existing websites: ${cat.websites.map(w => w.name).join(', ')}`);
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkAllCategories();
