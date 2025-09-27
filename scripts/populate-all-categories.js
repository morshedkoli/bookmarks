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

async function populateAllCategories() {
  try {
    console.log('🚀 Starting comprehensive website population...\n');
    
    // Get all categories
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
    console.log(`Found ${categories.length} categories\n`);

    // Comprehensive website database organized by category
    const websiteDatabase = {
      'Development Tools': [
        {
          name: 'GitHub',
          nameEn: 'GitHub',
          nameBn: 'গিটহাব',
          link: 'https://github.com',
          useFor: 'Code hosting and version control',
          useForEn: 'Code hosting, version control, and collaboration platform',
          useForBn: 'কোড হোস্টিং, ভার্সন কন্ট্রোল এবং সহযোগিতা প্ল্যাটফর্ম',
          icon: '🐙',
          featured: true
        },
        {
          name: 'Stack Overflow',
          nameEn: 'Stack Overflow',
          nameBn: 'স্ট্যাক ওভারফ্লো',
          link: 'https://stackoverflow.com',
          useFor: 'Programming Q&A community',
          useForEn: 'Programming questions and answers community',
          useForBn: 'প্রোগ্রামিং প্রশ্ন এবং উত্তর সম্প্রদায়',
          icon: '💻',
          featured: false
        },
        {
          name: 'Visual Studio Code',
          nameEn: 'Visual Studio Code',
          nameBn: 'ভিজুয়াল স্টুডিও কোড',
          link: 'https://code.visualstudio.com',
          useFor: 'Code editor',
          useForEn: 'Free source code editor with debugging support',
          useForBn: 'ডিবাগিং সাপোর্ট সহ বিনামূল্যে সোর্স কোড এডিটর',
          icon: '📝',
          featured: false
        }
      ],

      'Social Media': [
        {
          name: 'Facebook',
          nameEn: 'Facebook',
          nameBn: 'ফেসবুক',
          link: 'https://www.facebook.com',
          useFor: 'Social networking',
          useForEn: 'Connect with friends, family, and communities worldwide',
          useForBn: 'বিশ্বব্যাপী বন্ধু, পরিবার এবং সম্প্রদায়ের সাথে যোগাযোগ',
          icon: '📘',
          featured: true
        },
        {
          name: 'Instagram',
          nameEn: 'Instagram',
          nameBn: 'ইনস্টাগ্রাম',
          link: 'https://www.instagram.com',
          useFor: 'Photo and video sharing',
          useForEn: 'Share photos and videos with friends and followers',
          useForBn: 'বন্ধু এবং অনুসরণকারীদের সাথে ছবি এবং ভিডিও শেয়ার করুন',
          icon: '📸',
          featured: false
        }
      ],

      'Education & Learning': [
        {
          name: 'Khan Academy',
          nameEn: 'Khan Academy',
          nameBn: 'খান একাডেমি',
          link: 'https://www.khanacademy.org',
          useFor: 'Free online education',
          useForEn: 'Free online courses covering math, science, and more',
          useForBn: 'গণিত, বিজ্ঞান এবং আরও অনেক বিষয়ে বিনামূল্যে অনলাইন কোর্স',
          icon: '📚',
          featured: true
        },
        {
          name: 'Coursera',
          nameEn: 'Coursera',
          nameBn: 'কোর্সেরা',
          link: 'https://www.coursera.org',
          useFor: 'Online university courses',
          useForEn: 'University-level online courses and certificates',
          useForBn: 'বিশ্ববিদ্যালয় পর্যায়ের অনলাইন কোর্স এবং সার্টিফিকেট',
          icon: '🎓',
          featured: false
        }
      ],

      'News & Media': [
        {
          name: 'BBC News',
          nameEn: 'BBC News',
          nameBn: 'বিবিসি নিউজ',
          link: 'https://www.bbc.com/news',
          useFor: 'International news',
          useForEn: 'Global news and current affairs coverage',
          useForBn: 'বিশ্বব্যাপী সংবাদ এবং সাম্প্রতিক বিষয়াবলী',
          icon: '📰',
          featured: true
        },
        {
          name: 'CNN',
          nameEn: 'CNN',
          nameBn: 'সিএনএন',
          link: 'https://www.cnn.com',
          useFor: 'Breaking news',
          useForEn: 'Breaking news, analysis, and global coverage',
          useForBn: 'ব্রেকিং নিউজ, বিশ্লেষণ এবং বিশ্বব্যাপী কভারেজ',
          icon: '📺',
          featured: false
        }
      ],

      'E-commerce & Shopping': [
        {
          name: 'Amazon',
          nameEn: 'Amazon',
          nameBn: 'অ্যামাজন',
          link: 'https://www.amazon.com',
          useFor: 'Online shopping',
          useForEn: 'Global e-commerce platform for books, electronics, and more',
          useForBn: 'বই, ইলেকট্রনিক্স এবং আরও অনেক কিছুর জন্য বিশ্বব্যাপী ই-কমার্স প্ল্যাটফর্ম',
          icon: '📦',
          featured: true
        },
        {
          name: 'eBay',
          nameEn: 'eBay',
          nameBn: 'ইবে',
          link: 'https://www.ebay.com',
          useFor: 'Online marketplace',
          useForEn: 'Online marketplace for buying and selling goods',
          useForBn: 'পণ্য কেনাবেচার জন্য অনলাইন মার্কেটপ্লেস',
          icon: '🛒',
          featured: false
        }
      ]
    };

    let totalAdded = 0;
    let categoriesProcessed = 0;

    // Process each category
    for (const category of categories) {
      const categoryName = category.nameEn || category.name;
      const websites = websiteDatabase[categoryName];
      
      if (!websites) {
        console.log(`⚠️  No websites defined for category: ${categoryName}`);
        continue;
      }

      console.log(`\n📂 Processing: ${categoryName}`);
      console.log(`   Adding ${websites.length} websites...`);

      let addedCount = 0;
      
      for (const website of websites) {
        const websiteData = {
          ...website,
          categoriesId: category.id,
          password: 'Murshed@@@k5'
        };
        
        const postOptions = {
          hostname: 'localhost',
          port: 3000,
          path: '/api/website',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          }
        };
        
        const addResponse = await makeRequest(postOptions, websiteData);
        
        if (addResponse.statusCode === 200) {
          console.log(`   ✅ ${website.nameEn}`);
          addedCount++;
          totalAdded++;
        } else {
          console.log(`   ❌ Failed: ${website.name}`);
        }
      }
      
      console.log(`   📊 Added ${addedCount}/${websites.length} websites`);
      categoriesProcessed++;
    }
    
    console.log(`\n🎉 Population Complete!`);
    console.log(`📊 Total websites added: ${totalAdded}`);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

populateAllCategories();
