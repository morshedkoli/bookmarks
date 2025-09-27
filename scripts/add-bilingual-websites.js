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

async function addBilingualWebsites() {
  try {
    console.log('Fetching categories...');
    
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
    console.log(`Found ${categories.length} categories`);

    // Define websites to add for different categories
    const websitesToAdd = [
      // AI / Artificial Intelligence websites
      {
        categoryName: 'Artificial Intelligence',
        websites: [
          {
            name: 'ChatGPT',
            nameEn: 'ChatGPT',
            nameBn: 'চ্যাটজিপিটি',
            link: 'https://chat.openai.com',
            useFor: 'AI-powered conversational assistant',
            useForEn: 'AI-powered conversational assistant for various tasks',
            useForBn: 'বিভিন্ন কাজের জন্য এআই-চালিত কথোপকথন সহায়ক',
            icon: '🤖',
            featured: true
          },
          {
            name: 'Claude',
            nameEn: 'Claude',
            nameBn: 'ক্লড',
            link: 'https://claude.ai',
            useFor: 'Anthropic AI assistant',
            useForEn: 'Advanced AI assistant by Anthropic',
            useForBn: 'অ্যানথ্রোপিক এর উন্নত এআই সহায়ক',
            icon: '🧠',
            featured: false
          },
          {
            name: 'Google Gemini',
            nameEn: 'Google Gemini',
            nameBn: 'গুগল জেমিনি',
            link: 'https://gemini.google.com',
            useFor: 'Google AI assistant',
            useForEn: 'Google\'s multimodal AI assistant',
            useForBn: 'গুগলের মাল্টিমোডাল এআই সহায়ক',
            icon: '✨',
            featured: false
          },
          {
            name: 'GitHub Copilot',
            nameEn: 'GitHub Copilot',
            nameBn: 'গিটহাব কোপাইলট',
            link: 'https://github.com/features/copilot',
            useFor: 'AI code assistant',
            useForEn: 'AI-powered code completion and assistance',
            useForBn: 'এআই-চালিত কোড সম্পূর্ণকরণ এবং সহায়তা',
            icon: '👨‍💻',
            featured: false
          }
        ]
      },
      // Education websites
      {
        categoryName: 'Education',
        websites: [
          {
            name: 'Khan Academy',
            nameEn: 'Khan Academy',
            nameBn: 'খান একাডেমি',
            link: 'https://www.khanacademy.org',
            useFor: 'Free online education',
            useForEn: 'Free online courses and educational content',
            useForBn: 'বিনামূল্যে অনলাইন কোর্স এবং শিক্ষামূলক কন্টেন্ট',
            icon: '📚',
            featured: true
          },
          {
            name: 'Coursera',
            nameEn: 'Coursera',
            nameBn: 'কোর্সেরা',
            link: 'https://www.coursera.org',
            useFor: 'Online courses',
            useForEn: 'University-level online courses and certificates',
            useForBn: 'বিশ্ববিদ্যালয় পর্যায়ের অনলাইন কোর্স এবং সার্টিফিকেট',
            icon: '🎓',
            featured: false
          },
          {
            name: 'edX',
            nameEn: 'edX',
            nameBn: 'এডএক্স',
            link: 'https://www.edx.org',
            useFor: 'University courses online',
            useForEn: 'Free university courses from top institutions',
            useForBn: 'শীর্ষ প্রতিষ্ঠানের বিনামূল্যে বিশ্ববিদ্যালয় কোর্স',
            icon: '🏛️',
            featured: false
          }
        ]
      },
      // Social Media websites
      {
        categoryName: 'Social Media',
        websites: [
          {
            name: 'Facebook',
            nameEn: 'Facebook',
            nameBn: 'ফেসবুক',
            link: 'https://www.facebook.com',
            useFor: 'Social networking',
            useForEn: 'Connect with friends and family',
            useForBn: 'বন্ধু এবং পরিবারের সাথে যোগাযোগ',
            icon: '📘',
            featured: true
          },
          {
            name: 'Twitter/X',
            nameEn: 'Twitter/X',
            nameBn: 'টুইটার/এক্স',
            link: 'https://twitter.com',
            useFor: 'Microblogging platform',
            useForEn: 'Share thoughts and follow news',
            useForBn: 'চিন্তাভাবনা শেয়ার করুন এবং সংবাদ অনুসরণ করুন',
            icon: '🐦',
            featured: false
          },
          {
            name: 'Instagram',
            nameEn: 'Instagram',
            nameBn: 'ইনস্টাগ্রাম',
            link: 'https://www.instagram.com',
            useFor: 'Photo and video sharing',
            useForEn: 'Share photos and videos with friends',
            useForBn: 'বন্ধুদের সাথে ছবি এবং ভিডিও শেয়ার করুন',
            icon: '📸',
            featured: false
          }
        ]
      },
      // Programming websites
      {
        categoryName: 'Programming',
        websites: [
          {
            name: 'GitHub',
            nameEn: 'GitHub',
            nameBn: 'গিটহাব',
            link: 'https://github.com',
            useFor: 'Code hosting and collaboration',
            useForEn: 'Version control and code collaboration platform',
            useForBn: 'ভার্সন কন্ট্রোল এবং কোড সহযোগিতা প্ল্যাটফর্ম',
            icon: '🐙',
            featured: true
          },
          {
            name: 'Stack Overflow',
            nameEn: 'Stack Overflow',
            nameBn: 'স্ট্যাক ওভারফ্লো',
            link: 'https://stackoverflow.com',
            useFor: 'Programming Q&A',
            useForEn: 'Programming questions and answers community',
            useForBn: 'প্রোগ্রামিং প্রশ্ন এবং উত্তর সম্প্রদায়',
            icon: '💻',
            featured: false
          },
          {
            name: 'CodePen',
            nameEn: 'CodePen',
            nameBn: 'কোডপেন',
            link: 'https://codepen.io',
            useFor: 'Online code editor',
            useForEn: 'Online code editor and sharing platform',
            useForBn: 'অনলাইন কোড এডিটর এবং শেয়ারিং প্ল্যাটফর্ম',
            icon: '✏️',
            featured: false
          }
        ]
      },
      // News websites
      {
        categoryName: 'News',
        websites: [
          {
            name: 'BBC News',
            nameEn: 'BBC News',
            nameBn: 'বিবিসি নিউজ',
            link: 'https://www.bbc.com/news',
            useFor: 'International news',
            useForEn: 'Global news and current affairs',
            useForBn: 'বিশ্বব্যাপী সংবাদ এবং সাম্প্রতিক বিষয়',
            icon: '📰',
            featured: true
          },
          {
            name: 'CNN',
            nameEn: 'CNN',
            nameBn: 'সিএনএন',
            link: 'https://www.cnn.com',
            useFor: 'Breaking news',
            useForEn: 'Breaking news and analysis',
            useForBn: 'ব্রেকিং নিউজ এবং বিশ্লেষণ',
            icon: '📺',
            featured: false
          },
          {
            name: 'Prothom Alo',
            nameEn: 'Prothom Alo',
            nameBn: 'প্রথম আলো',
            link: 'https://www.prothomalo.com',
            useFor: 'Bangladeshi news',
            useForEn: 'Leading Bangladeshi newspaper',
            useForBn: 'বাংলাদেশের শীর্ষস্থানীয় সংবাদপত্র',
            icon: '🇧🇩',
            featured: false
          }
        ]
      }
    ];

    // Add websites for each category
    for (const categoryGroup of websitesToAdd) {
      console.log(`\nProcessing category: ${categoryGroup.categoryName}`);
      
      // Find the category
      const category = categories.find(cat => 
        (cat.nameEn && cat.nameEn.toLowerCase().includes(categoryGroup.categoryName.toLowerCase())) ||
        (cat.name && cat.name.toLowerCase().includes(categoryGroup.categoryName.toLowerCase()))
      );
      
      if (!category) {
        console.log(`❌ Category "${categoryGroup.categoryName}" not found`);
        continue;
      }
      
      console.log(`✅ Found category: ${category.nameEn || category.name} (ID: ${category.id})`);
      
      // Add each website
      for (const website of categoryGroup.websites) {
        console.log(`  Adding: ${website.name}...`);
        
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
          console.log(`    ✅ Added: ${website.name}`);
        } else {
          console.log(`    ❌ Failed to add ${website.name}:`, addResponse.data);
        }
      }
    }
    
    console.log('\n🎉 Finished adding bilingual websites!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

addBilingualWebsites();
