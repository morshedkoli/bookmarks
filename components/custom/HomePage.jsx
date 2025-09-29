"use client";
import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "../ui/button";
import { 
  ExternalLink, 
  Globe, 
  FolderOpen, 
  Star,
  TrendingUp,
  Grid3X3,
  List,
  Filter,
  BookmarkPlus
} from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [viewMode, setViewMode] = useState("grid"); // grid or list
  const [favoriteWebsites, setFavoriteWebsites] = useState([]);
  const { getCategoryName, getCategoryDescription, getWebsiteName, getWebsiteDescription, isEnglish, language } = useLanguage();

  const fetcher = (url) => fetch(url, {
    cache: 'no-store',
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  }).then((res) => res.json());

  const { data, error, isLoading, mutate } = useSWR(["/api/category", language], () => fetcher("/api/category"), {
    revalidateOnMount: true,
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 0,
    focusThrottleInterval: 0
  });

  // Fetch featured websites
  const { data: featuredData, error: featuredError } = useSWR("/api/website/featured", fetcher, {
    revalidateOnMount: true,
    revalidateIfStale: true,
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    refreshInterval: 0,
    focusThrottleInterval: 0
  });

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favoriteWebsites');
    if (saved) {
      setFavoriteWebsites(JSON.parse(saved));
    }
  }, []);

  // Save favorites to localStorage
  const toggleFavorite = (websiteId) => {
    const newFavorites = favoriteWebsites.includes(websiteId)
      ? favoriteWebsites.filter(id => id !== websiteId)
      : [...favoriteWebsites, websiteId];
    
    setFavoriteWebsites(newFavorites);
    localStorage.setItem('favoriteWebsites', JSON.stringify(newFavorites));
  };

  // Ensure data is valid and is an array
  const categories = data?.data && Array.isArray(data.data) ? data.data : (Array.isArray(data) ? data : []);
  
  // Get featured websites
  const featuredWebsites = featuredData?.data && Array.isArray(featuredData.data) ? featuredData.data : [];

  // Filter logic
  const filteredData = categories.filter(category => {
    if (selectedCategory === "all") return category.websites && category.websites.length > 0;
    return category.id === selectedCategory && category.websites && category.websites.length > 0;
  });

  // Get all websites for quick access
  const allWebsites = categories.flatMap(category => 
    category.websites?.map(website => ({
      ...website,
      categoryName: getCategoryName(category),
      categoryIcon: category.icon
    })) || []
  );

  // Get favorite websites
  const favoriteWebsitesList = allWebsites.filter(website => 
    favoriteWebsites.includes(website.id)
  );


  const handleRefresh = () => {
    mutate(); // Revalidate data
  };

  if (isLoading) return <LoadingSpinner/>;
  if (error) return (
    <div className="text-center py-12">
      <div className="text-red-500 mb-4">
        <Globe className="h-16 w-16 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Error loading bookmarks</h3>
        <p className="text-gray-600">Please try refreshing the page</p>
      </div>
      <Button onClick={handleRefresh} variant="outline">
        Try Again
      </Button>
    </div>
  );
  if (!data || (!data.data && !Array.isArray(data))) return (
    <div className="text-center py-12">
      <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
      <h3 className="text-xl font-semibold text-gray-600 mb-2">No bookmarks found</h3>
      <p className="text-gray-500">Start by adding some categories and websites</p>
    </div>
  );

  const WebsiteCard = ({ website, categoryName, categoryIcon, showCategory = false, isFeatured = false }) => (
    <Card className="group hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
              {website.icon ? (
                website.icon.startsWith('http') ? (
                  <img 
                    src={website.icon} 
                    alt={website.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                ) : (
                  <span className="text-xl">{website.icon}</span>
                )
              ) : null}
              <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400" style={{display: website.icon && website.icon.startsWith('http') ? 'none' : 'flex'}}>
                <Globe className="w-5 h-5" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 truncate">{getWebsiteName(website)}</h3>
              </div>
              {showCategory && (
                <div className="flex items-center gap-1 mt-1">
                  <span className="text-lg">{categoryIcon}</span>
                  <span className="text-sm text-gray-500">{categoryName}</span>
                </div>
              )}
              {getWebsiteDescription(website) && (
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">{getWebsiteDescription(website)}</p>
              )}
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => toggleFavorite(website.id)}
            className="flex-shrink-0"
          >
            <Star className={`h-4 w-4 ${favoriteWebsites.includes(website.id) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400'}`} />
          </Button>
        </div>
        
        <Button
          asChild
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600"
        >
          <a target="_blank" href={website.link} className="flex items-center justify-center gap-2">
            <ExternalLink className="h-4 w-4" />
            {isEnglish ? 'Visit Website' : 'ওয়েবসাইট দেখুন'}
          </a>
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">

      {/* Featured Websites Section */}
      {featuredWebsites.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">{isEnglish ? 'Featured Websites' : 'বৈশিষ্ট্যযুক্ত ওয়েবসাইট'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredWebsites.map((website) => (
              <WebsiteCard 
                key={website.id} 
                website={website}
                categoryName={getCategoryName(website.categorie)}
                categoryIcon={website.categorie?.icon}
                showCategory={true}
                isFeatured={true}
              />
            ))}
          </div>
        </div>
      )}

      {/* Most Popular AI Section */}
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">AI</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900">{isEnglish ? 'Most Popular AI Tools' : 'সবচেয়ে জনপ্রিয় এআই টুলস'}</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {[
            { 
              name: isEnglish ? 'ChatGPT' : 'চ্যাটজিপিটি', 
              icon: 'https://chat.openai.com/favicon.ico', 
              url: 'https://chat.openai.com',
              description: isEnglish ? 'AI Conversational Assistant' : 'এআই কথোপকথন সহায়ক'
            },
            { 
              name: isEnglish ? 'Claude' : 'ক্লড', 
              icon: 'https://claude.ai/favicon.ico', 
              url: 'https://claude.ai',
              description: isEnglish ? 'Anthropic AI Assistant' : 'অ্যানথ্রোপিক এআই সহায়ক'
            },
            { 
              name: isEnglish ? 'Google Gemini' : 'গুগল জেমিনি', 
              icon: 'https://gemini.google.com/favicon.ico', 
              url: 'https://gemini.google.com',
              description: isEnglish ? 'Google AI Assistant' : 'গুগল এআই সহায়ক'
            },
            { 
              name: isEnglish ? 'GitHub Copilot' : 'গিটহাব কোপাইলট', 
              icon: 'https://github.com/favicon.ico', 
              url: 'https://github.com/features/copilot',
              description: isEnglish ? 'AI Code Assistant' : 'এআই কোড সহায়ক'
            },
            { 
              name: isEnglish ? 'Midjourney' : 'মিডজার্নি', 
              icon: 'https://www.midjourney.com/favicon.ico', 
              url: 'https://www.midjourney.com',
              description: isEnglish ? 'AI Image Generator' : 'এআই ইমেজ জেনারেটর'
            },
            { 
              name: isEnglish ? 'Perplexity' : 'পারপ্লেক্সিটি', 
              icon: 'https://www.perplexity.ai/favicon.ico', 
              url: 'https://www.perplexity.ai',
              description: isEnglish ? 'AI Search Engine' : 'এআই সার্চ ইঞ্জিন'
            },
            { 
              name: isEnglish ? 'Runway ML' : 'রানওয়ে এমএল', 
              icon: 'https://runwayml.com/favicon.ico', 
              url: 'https://runwayml.com',
              description: isEnglish ? 'AI Video Generator' : 'এআই ভিডিও জেনারেটর'
            },
            { 
              name: isEnglish ? 'Notion AI' : 'নোশন এআই', 
              icon: 'https://www.notion.so/favicon.ico', 
              url: 'https://www.notion.so',
              description: isEnglish ? 'AI-Powered Workspace' : 'এআই-চালিত কর্মক্ষেত্র'
            },
            { 
              name: isEnglish ? 'Jasper AI' : 'জ্যাসপার এআই', 
              icon: 'https://www.jasper.ai/favicon.ico', 
              url: 'https://www.jasper.ai',
              description: isEnglish ? 'AI Content Creator' : 'এআই কন্টেন্ট ক্রিয়েটর'
            },
            { 
              name: isEnglish ? 'Canva AI' : 'ক্যানভা এআই', 
              icon: 'https://www.canva.com/favicon.ico', 
              url: 'https://www.canva.com',
              description: isEnglish ? 'AI Design Tool' : 'এআই ডিজাইন টুল'
            },
            { 
              name: isEnglish ? 'Grammarly' : 'গ্রামারলি', 
              icon: 'https://www.grammarly.com/favicon.ico', 
              url: 'https://www.grammarly.com',
              description: isEnglish ? 'AI Writing Assistant' : 'এআই লেখার সহায়ক'
            },
            { 
              name: isEnglish ? 'Replicate' : 'রেপ্লিকেট', 
              icon: 'https://replicate.com/favicon.ico', 
              url: 'https://replicate.com',
              description: isEnglish ? 'AI Model Platform' : 'এআই মডেল প্ল্যাটফর্ম'
            }
          ].map((aiTool) => (
            <a
              key={aiTool.name}
              href={aiTool.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/70 transition-all duration-200 hover:shadow-md hover:scale-105"
              title={aiTool.description}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden bg-white shadow-sm flex items-center justify-center border border-purple-100">
                <img 
                  src={aiTool.icon} 
                  alt={aiTool.name}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-6 h-6 bg-gradient-to-r from-purple-100 to-indigo-100 flex items-center justify-center text-purple-500 text-xs rounded-lg" style={{display: 'none'}}>
                  <span className="font-bold">AI</span>
                </div>
              </div>
              <div className="text-center">
                <span className="text-xs font-medium text-gray-700 group-hover:text-purple-600 transition-colors block">
                  {aiTool.name}
                </span>
                <span className="text-xs text-gray-500 group-hover:text-purple-500 transition-colors block mt-1">
                  {aiTool.description}
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Favorites Section */}
      {favoriteWebsitesList.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-6 w-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">{isEnglish ? 'Your Favorites' : 'আপনার প্রিয়'}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favoriteWebsitesList.map((website) => (
              <WebsiteCard 
                key={website.id} 
                website={website} 
                categoryName={website.categoryName}
                categoryIcon={website.categoryIcon}
                showCategory={true}
              />
            ))}
          </div>
        </div>
      )}


      {/* Filter Controls */}
      <div className="flex flex-wrap items-center gap-4 py-4 border-t border-gray-200">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-500" />
          <span className="font-medium text-gray-700">{isEnglish ? 'Filter by category:' : 'বিভাগ অনুযায়ী ফিল্টার:'}</span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory("all")}
          >
{isEnglish ? 'All Categories' : 'সব বিভাগ'}
          </Button>
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={selectedCategory === category.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.id)}
              className="flex items-center gap-1"
            >
              <span>{category.icon}</span>
              {getCategoryName(category)}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="space-y-8">
        {filteredData.length === 0 ? (
          <div className="text-center py-12">
            <Globe className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No websites found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          filteredData.map((category) => (
            <div key={category.id}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl">
                  {category.icon}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{getCategoryName(category)}</h2>
                  <p className="text-gray-600">{category.websites.length} {isEnglish ? 'websites' : 'ওয়েবসাইট'}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {category.websites.map((website) => (
                  <WebsiteCard 
                    key={website.id} 
                    website={website}
                    categoryName={getCategoryName(category)}
                    categoryIcon={category.icon}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
