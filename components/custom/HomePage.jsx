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

      {/* Popular Sites Section */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="h-6 w-6 text-blue-500" />
          <h2 className="text-2xl font-bold text-gray-900">{isEnglish ? 'Most Popular Sites' : 'সবচেয়ে জনপ্রিয় সাইট'}</h2>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
          {[
            { name: 'Google', icon: 'https://www.google.com/favicon.ico', url: 'https://www.google.com' },
            { name: 'YouTube', icon: 'https://www.youtube.com/favicon.ico', url: 'https://www.youtube.com' },
            { name: 'Facebook', icon: 'https://www.facebook.com/favicon.ico', url: 'https://www.facebook.com' },
            { name: 'Twitter', icon: 'https://twitter.com/favicon.ico', url: 'https://twitter.com' },
            { name: 'Instagram', icon: 'https://www.instagram.com/favicon.ico', url: 'https://www.instagram.com' },
            { name: 'LinkedIn', icon: 'https://www.linkedin.com/favicon.ico', url: 'https://www.linkedin.com' },
            { name: 'GitHub', icon: 'https://github.com/favicon.ico', url: 'https://github.com' },
            { name: 'Amazon', icon: 'https://www.amazon.com/favicon.ico', url: 'https://www.amazon.com' },
            { name: 'Netflix', icon: 'https://www.netflix.com/favicon.ico', url: 'https://www.netflix.com' },
            { name: 'Wikipedia', icon: 'https://www.wikipedia.org/favicon.ico', url: 'https://www.wikipedia.org' },
            { name: 'Reddit', icon: 'https://www.reddit.com/favicon.ico', url: 'https://www.reddit.com' },
            { name: 'Stack Overflow', icon: 'https://stackoverflow.com/favicon.ico', url: 'https://stackoverflow.com' }
          ].map((site) => (
            <a
              key={site.name}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center gap-2 p-3 rounded-lg hover:bg-white/70 transition-all duration-200 hover:shadow-md hover:scale-105"
            >
              <div className="w-8 h-8 rounded-lg overflow-hidden bg-white shadow-sm flex items-center justify-center">
                <img 
                  src={site.icon} 
                  alt={site.name}
                  className="w-6 h-6 object-contain"
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-6 h-6 bg-gray-200 flex items-center justify-center text-gray-400 text-xs" style={{display: 'none'}}>
                  <Globe className="w-4 h-4" />
                </div>
              </div>
              <span className="text-xs font-medium text-gray-700 group-hover:text-blue-600 transition-colors text-center">
                {site.name}
              </span>
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
