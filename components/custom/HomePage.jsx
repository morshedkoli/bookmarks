"use client";
import React, { useState, useEffect } from "react"; // Explicit React import
import useSWR from "swr";
import { useSearchParams } from "next/navigation";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import {
  ExternalLink,
  Globe,
  Star,
  TrendingUp,
  LayoutGrid,
  Search,
  ArrowRight,
  ChevronDown,
  Heart
} from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

// Helper: flatten all websites from categories
function flattenWebsites(categories) {
  const all = [];
  categories.forEach(cat => {
    if (cat.websites) all.push(...cat.websites);
    if (cat.children) cat.children.forEach(sub => {
      if (sub.websites) all.push(...sub.websites);
    });
    if (cat.countries) cat.countries.forEach(country => {
      if (country.websites) all.push(...country.websites);
    });
  });
  return all;
}
export default function HomePage() {
  const searchParams = useSearchParams();
  const showPopular = searchParams.get('popular') === 'true';
  const showFeatured = searchParams.get('featured') === 'true';
  const { isEnglish, getCategoryName, getWebsiteName, getWebsiteDescription } = useLanguage();

  const fetcher = (url) => fetch(url, { cache: 'no-store' }).then((res) => res.json());

  // Main Categories Fetch
  const { data: categoryData, isLoading: isCategoryLoading } = useSWR(
    ["/api/category", "main"],
    () => fetcher("/api/category?include=country"), // Support future API expansion
    { revalidateOnFocus: false }
  );

  // Always fetch featured websites for the top section
  const { data: featuredData, isLoading: isFeaturedLoading } = useSWR(
    ["/api/website/featured", "featured-top"],
    () => fetcher("/api/website/featured")
  );

  // Conditional Fetch for Popular if specifically requested page
  const { data: popularData, isLoading: isPopularLoading } = useSWR(
    showPopular ? ["/api/website?popular=true", "popular"] : null,
    () => fetcher("/api/website?popular=true")
  );

  const isLoading = isCategoryLoading || isFeaturedLoading || (showPopular && isPopularLoading);
  const [search, setSearch] = useState("");

  // Sync search state with URL `q` parameter (so top menubar search works)
  useEffect(() => {
    const q = searchParams.get('q') || "";
    setSearch(q);
  }, [searchParams]);

  // --- FAVORITES LOGIC ---
  const [favorites, setFavorites] = useState([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, []);

  const toggleFavorite = (websiteId) => {
    let newFavorites;
    if (favorites.includes(websiteId)) {
      newFavorites = favorites.filter(id => id !== websiteId);
    } else {
      newFavorites = [...favorites, websiteId];
    }
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
  };

  // Fetch Favorite Websites Data
  const { data: favoritesData } = useSWR(
    favorites.length > 0 ? `/api/website?ids=${favorites.join(',')}` : null,
    fetcher
  );

  // --- RENDER LOGIC ---

  // 1. POPULAR WEBSITES VIEW
  if (showPopular) {
    if (isLoading) return <LoadingSpinner />;
    return (
      <div className="min-h-screen pb-12">
        <Header
          icon={<TrendingUp className="h-8 w-8 text-purple-600" />}
          title={isEnglish ? "Most Popular" : "সবচেয়ে জনপ্রিয়"}
          subtitle={isEnglish ? "Top rated and most visited websites" : "সর্বাধিক রেট দেওয়া এবং পরিদর্শন করা ওয়েবসাইট"}
        />
        <div className="max-w-7xl mx-auto px-6">
          <WebsiteGrid
            websites={popularData?.data || []}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
          />
        </div>
      </div>
    );
  }

  // 2. MAIN DASHBOARD VIEW
  if (isLoading) return <div className="p-8 flex justify-center"><LoadingSpinner /></div>;

  const featuredWebsites = featuredData?.data || [];
  const categories = categoryData?.data || [];
  const allWebsites = flattenWebsites(categories);
  // Quick access: featured + most popular + favorites (unique)
  // Put favorites first so they appear on top
  let quickWebsites = [
    ...(favoritesData?.data || []),
    ...featuredWebsites,
    ...allWebsites.filter(w => w.popular)
  ];
  // Remove duplicates by id
  quickWebsites = quickWebsites.filter((w, i, arr) => arr.findIndex(x => x.id === w.id) === i);
  // Search filter
  const searchLower = search.trim().toLowerCase();
  const filteredQuick = searchLower
    ? quickWebsites.filter(w => w.name?.toLowerCase().includes(searchLower) || w.link?.toLowerCase().includes(searchLower))
    : quickWebsites;

  // Separate favorites to display at top
  const favoriteIds = favorites || [];
  const filteredQuickNonFavorites = filteredQuick.filter(w => !favoriteIds.includes(w.id));

  return (
    <div className="min-h-screen pb-12 space-y-6">
      {/* Favorites Section - show at very top */}
      {isClient && favorites.length > 0 && (
        <div className="px-4 pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
              <h2 className="text-2xl font-bold text-gray-900">{isEnglish ? "Your Favorites" : "আপনার পছন্দসমূহ"}</h2>
            </div>
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isEnglish ? "Search websites..." : "ওয়েবসাইট খুঁজুন..."}
              className="max-w-xs"
            />
          </div>
              <WebsiteGrid
                websites={favoritesData?.data || []}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                large={true}
                showFavoriteButton={false}
              />
        </div>
      )}

      {/* Quick Access (excluding favorites already shown above) */}
      <div className="px-4 pt-2">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            {isEnglish ? "Quick Access" : "দ্রুত প্রবেশাধিকার"}
          </h1>
        </div>
        <WebsiteGrid
          websites={filteredQuickNonFavorites.slice(0, 12)}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
      </div>

      {/* Categories Accordion Section */}
      <div className="px-4">
        <h2 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-gray-700" />
          {isEnglish ? "Categories" : "বিভাগসমূহ"}
        </h2>

        <Accordion type="multiple" className="space-y-4">
          {categories.map((category) => (
            <AccordionItem
              key={category.id}
              value={category.id}
              className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden px-0"
            >
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline group">
                <div className="flex items-center gap-3 w-full text-left">
                  <div className="w-10 h-10 rounded-md bg-blue-50 flex items-center justify-center text-xl shrink-0 text-blue-600 transition-transform group-hover:scale-105">
                    {category.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-base text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                      {getCategoryName(category)}
                    </h3>
                    <p className="text-xs text-gray-500 truncate font-normal">
                      {category.websites?.length || 0} {isEnglish ? 'websites' : 'ওয়েবসাইট'}
                    </p>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-gray-50/30 border-t border-gray-100 p-4">
                <CategoryContent
                  category={category}
                  isEnglish={isEnglish}
                  getCategoryName={getCategoryName}
                  favorites={favorites}
                  onToggleFavorite={toggleFavorite}
                />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
}


// Helper component to render the content of a category based on its type
function CategoryContent({ category, isEnglish, getCategoryName, favorites, onToggleFavorite }) {
  // 1. COUNTRIES VIEW (e.g. Travel)
  if (category.countries && category.countries.length > 0) {
    return (
      <div className="space-y-4">
        {category.countries.map(country => (
          <Accordion key={country.id} type="single" collapsible className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <AccordionItem value={country.id} className="border-none">
              <AccordionTrigger className="px-4 py-3 hover:bg-gray-50 hover:no-underline">
                <div className="flex items-center gap-3 text-left w-full">
                  <span className="text-2xl shrink-0">{country.icon || '🏳️'}</span>
                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900">
                      {isEnglish ? country.name : (country.nameBn || country.name)}
                    </h3>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionContent className="bg-gray-50 border-t border-gray-100">
                <div className="p-4">
                  <CountryContent
                    country={country}
                    websites={category.websites || []}
                    favorites={favorites}
                    onToggleFavorite={onToggleFavorite}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        ))}

        {/* Fallback for Global websites in this category */}
        {category.websites && category.websites.some(w => !w.countryId) && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">
              {isEnglish ? "Other Services" : "অন্যান্য সেবা"}
            </h4>
            <WebsiteGrid
              websites={category.websites.filter(w => !w.countryId)}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        )}
      </div>
    );
  }

  // 2. SUB-CATEGORIES VIEW
  if (category.children && category.children.length > 0) {
    return (
      <div className="space-y-8">
        {category.children.map(subCat => (
          <div key={subCat.id}>
            <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-200 flex items-center gap-2">
              <span className="text-lg">{subCat.icon}</span>
              {getCategoryName(subCat)}
            </h3>
            {subCat.websites && subCat.websites.length > 0 ? (
              <WebsiteGrid
                websites={subCat.websites}
                favorites={favorites}
                onToggleFavorite={onToggleFavorite}
              />
            ) : (
              <div className="text-gray-400 italic text-xs">No websites yet.</div>
            )}
          </div>
        ))}

        {category.websites && category.websites.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-200">
              {isEnglish ? "General Resources" : "সাধারণ রিসোর্স"}
            </h3>
            <WebsiteGrid
              websites={category.websites}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        )}
      </div>
    );
  }

  // 3. GROUPS VIEW (Legacy)
  const groupedWebsites = {};
  const ungroupedWebsites = [];

  if (category.websites) {
    category.websites.forEach(site => {
      if (site.group) {
        const groupName = isEnglish ? site.group : (site.groupBn || site.group);
        if (!groupedWebsites[groupName]) groupedWebsites[groupName] = [];
        groupedWebsites[groupName].push(site);
      } else {
        ungroupedWebsites.push(site);
      }
    });
  }

  const hasGroups = Object.keys(groupedWebsites).length > 0;

  if (hasGroups) {
    return (
      <div className="space-y-6">
        {Object.entries(groupedWebsites).map(([groupName, sites]) => (
          <div key={groupName}>
            <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-200 flex items-center gap-2">
              <span className="w-1.5 h-4 bg-blue-500 rounded-full"></span>
              {groupName}
            </h3>
            <WebsiteGrid
              websites={sites}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
        {ungroupedWebsites.length > 0 && (
          <div>
            <h3 className="text-sm font-bold text-gray-700 mb-3 pb-2 border-b border-gray-200">
              {isEnglish ? "Other Services" : "অন্যান্য সেবা"}
            </h3>
            <WebsiteGrid
              websites={ungroupedWebsites}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        )}
      </div>
    );
  }

  // 4. STANDARD GRID VIEW
  return (
    <WebsiteGrid
      websites={category.websites || []}
      favorites={favorites}
      onToggleFavorite={onToggleFavorite}
    />
  );
}

// Sub-components
function Header({ icon, title, subtitle }) {
  return (
    <div className="bg-white border-b border-gray-200 px-4 py-6 mb-4">
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          {icon}
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">{title}</h1>
        </div>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

function WebsiteGrid({ websites, limit, favorites = [], onToggleFavorite, large = false, showFavoriteButton = true }) {
  const { isEnglish, getWebsiteName, getWebsiteDescription } = useLanguage();
  const displayWebsites = limit ? websites.slice(0, limit) : websites;

  if (!websites || websites.length === 0) return null;

  const gridClass = large ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3";

  return (
    <div className={gridClass}>
      {displayWebsites.map((website) => (
        <Card
          key={website.id}
          className={`group transition-all duration-300 h-full ${large ? 'hover:shadow-lg' : 'hover:shadow-md'} border-gray-200 ${large && favorites.includes(website.id) ? 'bg-red-50 border-red-100' : ''}`}
        >
          <CardContent className={`${large ? 'p-4' : 'p-3'} flex flex-col h-full`}>
            <div className="flex items-start justify-between mb-2 gap-2">
              <div className={`${large ? 'w-12 h-12 rounded-lg' : 'w-8 h-8 rounded-md'} bg-gray-50 flex items-center justify-center border border-gray-100 ${large ? 'group-hover:scale-105' : 'group-hover:scale-105'} transition-transform shrink-0 overflow-hidden`}>
                {website.icon && website.icon.startsWith('http') ? (
                  <img src={website.icon} alt={getWebsiteName(website)} className="w-full h-full object-cover" />
                ) : (
                  <span className={`${large ? 'text-xl' : 'text-base'}`}>{website.icon || <Globe className={`${large ? 'w-5 h-5' : 'w-4 h-4'} text-gray-400`} />}</span>
                )}
              </div>
              <div className="flex-1 min-w-0 pt-0.5">
                <a href={website.link} target="_blank" rel="noopener noreferrer" className="block focus:outline-none">
                  <h3 className={`font-semibold ${large ? 'text-base' : 'text-sm'} text-gray-900 group-hover:text-blue-600 transition-colors truncate`}>
                    {getWebsiteName(website)}
                  </h3>
                </a>
                {website.popular && (
                  <div className="flex items-center gap-1 mt-0.5">
                    <TrendingUp className="w-2.5 h-2.5 text-purple-600" />
                    <span className="text-[9px] uppercase font-bold text-purple-600 tracking-wide">Popular</span>
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-1 shrink-0">
                {showFavoriteButton && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (onToggleFavorite) onToggleFavorite(website.id);
                    }}
                    className={`${large ? 'p-2.5' : 'p-1.5'} text-gray-400 hover:text-red-500 transition-colors ${large ? 'bg-red-50 hover:bg-red-100' : 'bg-gray-50 hover:bg-red-50'} rounded-full`}
                    title={favorites.includes(website.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={` ${large ? 'w-5 h-5' : 'w-3.5 h-3.5'} ${favorites.includes(website.id) ? "fill-red-500 text-red-500" : ""}`} />
                  </button>
                )}
                <a href={website.link} target="_blank" rel="noopener noreferrer" className="p-1.5 text-gray-400 hover:text-blue-600 transition-colors bg-gray-50 hover:bg-blue-50 rounded-full">
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <p className="text-xs text-gray-500 line-clamp-1 flex-1">
              {getWebsiteDescription(website) || (isEnglish ? "No description available." : "কোন বিবরণ উপলব্ধ নেই।")}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Helper to render websites inside a country card
function CountryContent({ country, websites, favorites, onToggleFavorite }) {
  // Filter sites for this country
  const countrySites = websites.filter(w => w.countryId === country.id);

  if (countrySites.length === 0) {
    return <div className="text-gray-500 italic text-center">No links available yet.</div>;
  }

  // Group by subGroup (Embassy, Visa, etc.)
  const sections = {};
  const others = [];

  countrySites.forEach(site => {
    if (site.subGroup) {
      if (!sections[site.subGroup]) sections[site.subGroup] = [];
      sections[site.subGroup].push(site);
    } else {
      others.push(site);
    }
  });

  return (
    <div className="space-y-6">
      {Object.entries(sections).map(([sectionName, sites]) => (
        <div key={sectionName}>
          <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">
            {sectionName}
          </h4>
          <WebsiteGrid
            websites={sites}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      ))}

      {others.length > 0 && (
        <div>
          {Object.keys(sections).length > 0 && (
            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 border-b border-gray-200 pb-1">
              General
            </h4>
          )}
          <WebsiteGrid
            websites={others}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      )}
    </div>
  );
}
