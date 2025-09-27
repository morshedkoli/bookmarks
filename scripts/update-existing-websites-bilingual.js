const http = require('http');

async function makeRequest(options, data) {
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
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function updateExistingWebsitesBilingual() {
  try {
    console.log('Fetching existing websites...');
    
    // Get all websites
    const getOptions = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/website',
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    };
    
    const response = await makeRequest(getOptions);
    
    if (response.statusCode !== 200) {
      console.error('Failed to fetch websites:', response.data);
      return;
    }
    
    const websites = response.data.data || response.data;
    console.log(`Found ${websites.length} websites`);

    // Define bilingual translations for common websites
    const translations = {
      'Google': {
        nameEn: 'Google',
        nameBn: 'গুগল',
        useForEn: 'Search engine and web services',
        useForBn: 'সার্চ ইঞ্জিন এবং ওয়েব সেবা'
      },
      'YouTube': {
        nameEn: 'YouTube',
        nameBn: 'ইউটিউব',
        useForEn: 'Video sharing and streaming platform',
        useForBn: 'ভিডিও শেয়ারিং এবং স্ট্রিমিং প্ল্যাটফর্ম'
      },
      'Facebook': {
        nameEn: 'Facebook',
        nameBn: 'ফেসবুক',
        useForEn: 'Social networking platform',
        useForBn: 'সামাজিক নেটওয়ার্কিং প্ল্যাটফর্ম'
      },
      'Twitter': {
        nameEn: 'Twitter',
        nameBn: 'টুইটার',
        useForEn: 'Microblogging and social networking',
        useForBn: 'মাইক্রোব্লগিং এবং সামাজিক নেটওয়ার্কিং'
      },
      'Instagram': {
        nameEn: 'Instagram',
        nameBn: 'ইনস্টাগ্রাম',
        useForEn: 'Photo and video sharing',
        useForBn: 'ছবি এবং ভিডিও শেয়ারিং'
      },
      'LinkedIn': {
        nameEn: 'LinkedIn',
        nameBn: 'লিঙ্কডইন',
        useForEn: 'Professional networking',
        useForBn: 'পেশাদার নেটওয়ার্কিং'
      },
      'GitHub': {
        nameEn: 'GitHub',
        nameBn: 'গিটহাব',
        useForEn: 'Code hosting and version control',
        useForBn: 'কোড হোস্টিং এবং ভার্সন কন্ট্রোল'
      },
      'Amazon': {
        nameEn: 'Amazon',
        nameBn: 'অ্যামাজন',
        useForEn: 'E-commerce and cloud services',
        useForBn: 'ই-কমার্স এবং ক্লাউড সেবা'
      },
      'Netflix': {
        nameEn: 'Netflix',
        nameBn: 'নেটফ্লিক্স',
        useForEn: 'Video streaming service',
        useForBn: 'ভিডিও স্ট্রিমিং সেবা'
      },
      'Wikipedia': {
        nameEn: 'Wikipedia',
        nameBn: 'উইকিপিডিয়া',
        useForEn: 'Free online encyclopedia',
        useForBn: 'বিনামূল্যে অনলাইন বিশ্বকোষ'
      },
      'Reddit': {
        nameEn: 'Reddit',
        nameBn: 'রেডিট',
        useForEn: 'Social news and discussion',
        useForBn: 'সামাজিক সংবাদ এবং আলোচনা'
      },
      'Stack Overflow': {
        nameEn: 'Stack Overflow',
        nameBn: 'স্ট্যাক ওভারফ্লো',
        useForEn: 'Programming Q&A community',
        useForBn: 'প্রোগ্রামিং প্রশ্ন-উত্তর সম্প্রদায়'
      },
      'ChatGPT': {
        nameEn: 'ChatGPT',
        nameBn: 'চ্যাটজিপিটি',
        useForEn: 'AI conversational assistant',
        useForBn: 'এআই কথোপকথন সহায়ক'
      },
      'Claude': {
        nameEn: 'Claude',
        nameBn: 'ক্লড',
        useForEn: 'AI assistant by Anthropic',
        useForBn: 'অ্যানথ্রোপিক এর এআই সহায়ক'
      }
    };

    let updatedCount = 0;
    
    // Update websites that need bilingual data
    for (const website of websites) {
      const translation = translations[website.name];
      
      if (translation && (!website.nameEn || !website.nameBn)) {
        console.log(`Updating: ${website.name}...`);
        
        const updateData = {
          id: website.id,
          name: website.name,
          nameEn: translation.nameEn,
          nameBn: translation.nameBn,
          link: website.link,
          useFor: website.useFor || translation.useForEn,
          useForEn: translation.useForEn,
          useForBn: translation.useForBn,
          icon: website.icon,
          categoriesId: website.categoriesId,
          featured: website.featured || false,
          password: 'Murshed@@@k5'
        };
        
        const putOptions = {
          hostname: 'localhost',
          port: 3000,
          path: '/api/website',
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        
        const updateResponse = await makeRequest(putOptions, updateData);
        
        if (updateResponse.statusCode === 200) {
          console.log(`  ✅ Updated: ${website.name}`);
          updatedCount++;
        } else {
          console.log(`  ❌ Failed to update ${website.name}:`, updateResponse.data);
        }
      }
    }
    
    console.log(`\n🎉 Updated ${updatedCount} websites with bilingual data!`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

updateExistingWebsitesBilingual();
