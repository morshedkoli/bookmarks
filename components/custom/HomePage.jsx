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
      <div className="min-h-screen pb-20">
        <Header
          icon={<TrendingUp className="h-6 w-6 text-white" />}
          title={isEnglish ? "Most Popular" : "সবচেয়ে জনপ্রিয়"}
          subtitle={isEnglish ? "Top rated and most visited websites" : "সর্বাধিক রেট দেওয়া এবং পরিদর্শন করা ওয়েবসাইট"}
        />
        <div className="max-w-[1400px] mx-auto px-6">
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
    <div className="min-h-screen pb-20 space-y-16">
      {/* Favorites Section - show at very top */}
      {isClient && favorites.length > 0 && (
        <div>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-black rounded-xl">
                <Heart className="h-5 w-5 text-white fill-white" />
              </div>
              <h2 className="text-3xl font-semibold text-gray-900 tracking-tight">{isEnglish ? "Favorites" : "পছন্দসমূহ"}</h2>
            </div>
            <Input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder={isEnglish ? "Search websites..." : "ওয়েবসাইট খুঁজুন..."}
              className="max-w-md border-gray-200 focus:border-gray-900 focus:ring-0 rounded-xl h-11"
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
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900 tracking-tight flex items-center gap-3">
            <div className="p-2 bg-black rounded-xl">
              <Globe className="h-5 w-5 text-white" />
            </div>
            {isEnglish ? "Quick Access" : "দ্রুত প্রবেশাধিকার"}
          </h1>
        </div>
        <WebsiteGrid
          websites={filteredQuickNonFavorites.slice(0, 12)}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
        />
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {category.countries.map(country => (
            <Accordion key={country.id} type="single" collapsible className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all">
              <AccordionItem value={country.id} className="border-none">
                <AccordionTrigger className="px-5 py-4 hover:bg-gray-50/50 hover:no-underline [&[data-state=open]]:bg-gray-50">
                  <div className="flex items-center gap-3 text-left w-full">
                    <span className="text-2xl shrink-0">{country.icon || '🏳️'}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-medium text-gray-900 truncate">
                        {isEnglish ? country.name : (country.nameBn || country.name)}
                      </h3>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 shrink-0 transition-transform duration-200" />
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-gray-50/40 border-t border-gray-100">
                  <div className="p-5">
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
        </div>

        {/* Fallback for Global websites in this category */}
        {category.websites && category.websites.some(w => !w.countryId) && (
          <div className="mt-8 pt-8 border-t border-gray-100">
            <h4 className="text-base font-medium text-gray-900 mb-5 flex items-center gap-2">
              <span className="w-1 h-5 bg-black rounded-full"></span>
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
      <div className="space-y-12">
        {category.children.map(subCat => (
          <div key={subCat.id} className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-xl">
                {subCat.icon}
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {getCategoryName(subCat)}
              </h3>
              <div className="flex-1 h-px bg-gray-100 ml-4"></div>
            </div>
            {subCat.websites && subCat.websites.length > 0 ? (
              <WebsiteGrid
                websites={subCat.websites}
                favorites={favorites}
                onToggleFavorite={onToggleFavorite}
              />
            ) : (
              <div className="text-gray-400 italic text-sm py-8 text-center bg-gray-50/50 rounded-xl">
                {isEnglish ? "No websites yet" : "এখনো কোন ওয়েবসাইট নেই"}
              </div>
            )}
          </div>
        ))}

        {category.websites && category.websites.length > 0 && (
          <div className="relative pt-4">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                <Globe className="w-5 h-5 text-gray-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900">
                {isEnglish ? "General Resources" : "সাধারণ রিসোর্স"}
              </h3>
              <div className="flex-1 h-px bg-gray-100 ml-4"></div>
            </div>
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
      <div className="space-y-10">
        {Object.entries(groupedWebsites).map(([groupName, sites]) => (
          <div key={groupName} className="relative">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-6 bg-black rounded-full"></span>
              <h3 className="text-base font-medium text-gray-900">
                {groupName}
              </h3>
              <div className="flex-1 h-px bg-gray-100 ml-4"></div>
            </div>
            <WebsiteGrid
              websites={sites}
              favorites={favorites}
              onToggleFavorite={onToggleFavorite}
            />
          </div>
        ))}
        {ungroupedWebsites.length > 0 && (
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <span className="w-1 h-6 bg-black rounded-full"></span>
              <h3 className="text-base font-medium text-gray-900">
                {isEnglish ? "Other Services" : "অন্যান্য সেবা"}
              </h3>
              <div className="flex-1 h-px bg-gray-100 ml-4"></div>
            </div>
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
    <div className="bg-white border-b border-gray-100 px-6 py-10 mb-8">
      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-black rounded-xl">
            {icon}
          </div>
          <h1 className="text-4xl font-semibold text-gray-900 tracking-tight">{title}</h1>
        </div>
        <p className="text-base text-gray-500 ml-16">{subtitle}</p>
      </div>
    </div>
  );
}

function WebsiteGrid({ websites, limit, favorites = [], onToggleFavorite, large = false, showFavoriteButton = true }) {
  const { isEnglish, getWebsiteName, getWebsiteDescription } = useLanguage();
  const displayWebsites = limit ? websites.slice(0, limit) : websites;

  if (!websites || websites.length === 0) return null;

  const gridClass = large ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4" : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3";

  return (
    <div className={gridClass}>
      {displayWebsites.map((website) => (
        <Card
          key={website.id}
          className={`group transition-all duration-200 h-full border-gray-100 hover:border-gray-900 hover:shadow-sm ${large ? 'rounded-2xl' : 'rounded-xl'} ${large && favorites.includes(website.id) ? 'bg-gray-50 border-gray-200' : 'bg-white'}`}
        >
          <CardContent className={`${large ? 'p-5' : 'p-4'} flex flex-col h-full`}>
            <div className="flex items-start justify-between mb-3 gap-3">
              <div className={`${large ? 'w-14 h-14 rounded-xl' : 'w-10 h-10 rounded-lg'} bg-gray-50/80 flex items-center justify-center border border-gray-100 shrink-0 overflow-hidden transition-transform group-hover:scale-105`}>
                {website.icon && website.icon.startsWith('http') ? (
                  <img src={website.icon} alt={getWebsiteName(website)} className="w-full h-full object-cover" />
                ) : (
                  <span className={`${large ? 'text-2xl' : 'text-lg'}`}>{website.icon || <Globe className={`${large ? 'w-6 h-6' : 'w-5 h-5'} text-gray-300`} />}</span>
                )}
              </div>
              
              <div className="flex gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                {showFavoriteButton && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      e.preventDefault();
                      if (onToggleFavorite) onToggleFavorite(website.id);
                    }}
                    className={`p-2 text-gray-400 hover:text-black transition-colors bg-gray-50 hover:bg-gray-100 rounded-lg`}
                    title={favorites.includes(website.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    <Heart className={`w-4 h-4 ${favorites.includes(website.id) ? "fill-black text-black" : ""}`} />
                  </button>
                )}
                <a href={website.link} target="_blank" rel="noopener noreferrer" className="p-2 text-gray-400 hover:text-black transition-colors bg-gray-50 hover:bg-gray-100 rounded-lg">
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <a href={website.link} target="_blank" rel="noopener noreferrer" className="block focus:outline-none group/link">
                <h3 className={`font-medium ${large ? 'text-base' : 'text-sm'} text-gray-900 group-hover/link:text-gray-600 transition-colors line-clamp-1 mb-1`}>
                  {getWebsiteName(website)}
                </h3>
              </a>
              {website.popular && (
                <div className="flex items-center gap-1 mb-2">
                  <span className="px-2 py-0.5 text-[10px] font-medium text-gray-600 bg-gray-100 rounded-md uppercase tracking-wide">Popular</span>
                </div>
              )}
              <p className={`${large ? 'text-sm' : 'text-xs'} text-gray-400 line-clamp-2 leading-relaxed`}>
                {getWebsiteDescription(website) || (isEnglish ? "No description" : "কোন বিবরণ নেই")}
              </p>
            </div>
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
    return (
      <div className="text-gray-400 italic text-center text-sm py-8 bg-gray-50/50 rounded-xl">
        No links available yet.
      </div>
    );
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
    <div className="space-y-10">
      {Object.entries(sections).map(([sectionName, sites]) => (
        <div key={sectionName} className="relative">
          <div className="flex items-center gap-3 mb-5">
            <span className="w-1 h-5 bg-black rounded-full"></span>
            <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wider">
              {sectionName}
            </h4>
            <div className="flex-1 h-px bg-gray-100 ml-3"></div>
          </div>
          <WebsiteGrid
            websites={sites}
            favorites={favorites}
            onToggleFavorite={onToggleFavorite}
          />
        </div>
      ))}

      {others.length > 0 && (
        <div className="relative">
          {Object.keys(sections).length > 0 && (
            <div className="flex items-center gap-3 mb-5">
              <span className="w-1 h-5 bg-black rounded-full"></span>
              <h4 className="text-sm font-medium text-gray-900 uppercase tracking-wider">
                General
              </h4>
              <div className="flex-1 h-px bg-gray-100 ml-3"></div>
            </div>
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
