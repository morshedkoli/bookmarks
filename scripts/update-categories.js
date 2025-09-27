const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Comprehensive list of categories with proper English names and descriptions
const categories = [
  {
    name: "Development Tools",
    path: "development-tools",
    icon: "💻",
    description: "Code editors, IDEs, development environments, and programming tools"
  },
  {
    name: "Social Media",
    path: "social-media",
    icon: "📱",
    description: "Social networking platforms, messaging apps, and community sites"
  },
  {
    name: "Entertainment",
    path: "entertainment",
    icon: "🎬",
    description: "Streaming services, gaming platforms, movies, music, and fun content"
  },
  {
    name: "Education & Learning",
    path: "education-learning",
    icon: "📚",
    description: "Online courses, tutorials, educational resources, and learning platforms"
  },
  {
    name: "News & Media",
    path: "news-media",
    icon: "📰",
    description: "News websites, blogs, magazines, and media outlets"
  },
  {
    name: "E-commerce & Shopping",
    path: "ecommerce-shopping",
    icon: "🛒",
    description: "Online stores, marketplaces, deals, and shopping platforms"
  },
  {
    name: "Finance & Banking",
    path: "finance-banking",
    icon: "💰",
    description: "Banking, investment platforms, cryptocurrency, and financial tools"
  },
  {
    name: "Health & Fitness",
    path: "health-fitness",
    icon: "🏥",
    description: "Healthcare resources, fitness apps, wellness platforms, and medical information"
  },
  {
    name: "Travel & Tourism",
    path: "travel-tourism",
    icon: "✈️",
    description: "Travel booking sites, destination guides, maps, and tourism resources"
  },
  {
    name: "Food & Recipes",
    path: "food-recipes",
    icon: "🍳",
    description: "Recipe websites, cooking tutorials, restaurant reviews, and food delivery"
  },
  {
    name: "Business & Professional",
    path: "business-professional",
    icon: "💼",
    description: "Business tools, professional networking, productivity apps, and corporate resources"
  },
  {
    name: "Technology & Gadgets",
    path: "technology-gadgets",
    icon: "🔧",
    description: "Tech news, gadget reviews, software downloads, and technology resources"
  },
  {
    name: "Design & Creative",
    path: "design-creative",
    icon: "🎨",
    description: "Design tools, creative resources, inspiration galleries, and artistic platforms"
  },
  {
    name: "Sports & Recreation",
    path: "sports-recreation",
    icon: "⚽",
    description: "Sports news, team websites, recreational activities, and fitness tracking"
  },
  {
    name: "Government & Legal",
    path: "government-legal",
    icon: "🏛️",
    description: "Government websites, legal resources, official documents, and public services"
  },
  {
    name: "Science & Research",
    path: "science-research",
    icon: "🔬",
    description: "Scientific journals, research papers, academic resources, and educational content"
  },
  {
    name: "Photography & Media",
    path: "photography-media",
    icon: "📸",
    description: "Photo sharing, image editing tools, stock photos, and multimedia resources"
  },
  {
    name: "Gaming",
    path: "gaming",
    icon: "🎮",
    description: "Gaming platforms, game reviews, esports, and gaming communities"
  },
  {
    name: "Music & Audio",
    path: "music-audio",
    icon: "🎵",
    description: "Music streaming, audio tools, podcasts, and sound resources"
  },
  {
    name: "Real Estate",
    path: "real-estate",
    icon: "🏠",
    description: "Property listings, real estate platforms, home buying/selling resources"
  },
  {
    name: "Automotive",
    path: "automotive",
    icon: "🚗",
    description: "Car reviews, automotive news, vehicle marketplaces, and transportation"
  },
  {
    name: "Fashion & Beauty",
    path: "fashion-beauty",
    icon: "👗",
    description: "Fashion brands, beauty products, style guides, and lifestyle content"
  },
  {
    name: "Home & Garden",
    path: "home-garden",
    icon: "🏡",
    description: "Home improvement, gardening tips, interior design, and DIY projects"
  },
  {
    name: "Utilities & Tools",
    path: "utilities-tools",
    icon: "🛠️",
    description: "Online utilities, converters, calculators, and helpful web tools"
  },
  {
    name: "Cloud Services",
    path: "cloud-services",
    icon: "☁️",
    description: "Cloud storage, hosting services, SaaS platforms, and online services"
  },
  {
    name: "Communication",
    path: "communication",
    icon: "💬",
    description: "Email services, messaging platforms, video conferencing, and communication tools"
  },
  {
    name: "Reference & Documentation",
    path: "reference-documentation",
    icon: "📖",
    description: "Dictionaries, encyclopedias, documentation sites, and reference materials"
  },
  {
    name: "Job Search & Career",
    path: "job-search-career",
    icon: "💼",
    description: "Job boards, career advice, professional development, and recruitment platforms"
  },
  {
    name: "Nonprofit & Charity",
    path: "nonprofit-charity",
    icon: "❤️",
    description: "Charitable organizations, donation platforms, and social causes"
  },
  {
    name: "Miscellaneous",
    path: "miscellaneous",
    icon: "📦",
    description: "Other websites and resources that don't fit into specific categories"
  }
];

async function updateCategories() {
  try {
    console.log('Starting category update process...');
    
    // Get existing categories
    const existingCategories = await prisma.category.findMany();
    console.log(`Found ${existingCategories.length} existing categories`);
    
    // Delete all existing categories (this will also delete associated websites due to cascade)
    console.log('Clearing existing categories...');
    await prisma.website.deleteMany(); // Delete websites first due to foreign key constraint
    await prisma.category.deleteMany();
    
    // Create new categories
    console.log('Creating new categories...');
    const password = "Murshed@@@k5";
    
    for (const category of categories) {
      await prisma.category.create({
        data: {
          name: category.name,
          path: category.path,
          icon: category.icon,
          description: category.description,
          password: password
        }
      });
      console.log(`✓ Created category: ${category.name}`);
    }
    
    console.log(`\n🎉 Successfully created ${categories.length} categories!`);
    console.log('\nCategories created:');
    categories.forEach((cat, index) => {
      console.log(`${index + 1}. ${cat.icon} ${cat.name} - ${cat.description}`);
    });
    
  } catch (error) {
    console.error('Error updating categories:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the update
updateCategories();
