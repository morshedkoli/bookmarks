"use client";

import { useLanguage } from "@/contexts/LanguageContext";
import { cn } from "@/lib/utils";
import {
    LayoutGrid,
    Star,
    TrendingUp,
    Search,
    ChevronRight,
    Menu,
    Briefcase,
    Plane,
    Settings,
    Shield,
    ExternalLink,
    Heart,
    ChevronDown,
    Globe
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { useState, useEffect } from "react";
import Logo from "../ui/logo";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";

export default function Sidebar({ className }) {
    const { language, isEnglish, getCategoryName, getWebsiteName } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState("");
    const [favorites, setFavorites] = useState([]);
    const currentCategory = searchParams.get("category");
    const isPopular = searchParams.get("popular") === "true";
    const isFeatured = searchParams.get("featured") === "true";

    const fetcher = (url) => fetch(url).then((res) => res.json());

    // Fetch categories with websites included
    const { data } = useSWR(["/api/category", language], () => fetcher("/api/category"), {
        revalidateOnFocus: false,
    });

    const categories = data?.data && Array.isArray(data.data) ? data.data : [];

    // Load favorites from localStorage
    useEffect(() => {
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

    const handleNavigation = (key, value) => {
        const params = new URLSearchParams(searchParams);
        if (key === 'clear') {
            params.delete('category');
            params.delete('popular');
            params.delete('featured');
        } else {
            // Clear conflicting filters
            params.delete('category');
            params.delete('popular');
            params.delete('featured');

            params.set(key, value);
        }
        router.push(`${pathname}?${params.toString()}`);
    };

    const filteredCategories = categories.filter(cat =>
        getCategoryName(cat).toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className={cn("pb-12 min-h-screen bg-white border-r border-gray-100", className)}>
            <div className="space-y-4 py-6">
                <div className="px-6 py-2">
                    <Link href="/" className="flex items-center gap-2 mb-8 px-2">
                        <Logo size="small" variant="icon" />
                        <span className="text-xl font-semibold text-gray-900 tracking-tight">
                            BookmarkHub
                        </span>
                    </Link>

                    <div className="relative">
                        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                            placeholder={isEnglish ? "Search categories..." : "বিভাগ খুঁজুন..."}
                            className="pl-10 bg-gray-50 border-gray-200 rounded-xl h-10 focus:border-gray-900 focus:ring-0"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="mt-4 px-2">
                        <Link href="/admin">
                            <Button variant="outline" className="w-full justify-start font-medium rounded-xl border-gray-200 hover:bg-gray-50">
                                <Shield className="mr-2 h-4 w-4" />
                                Admin
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="px-4 py-2">
                    <h2 className="mb-3 px-4 text-xs font-medium tracking-wide text-gray-500 uppercase">
                        {isEnglish ? "Discover" : "আবিষ্কার করুন"}
                    </h2>
                    <div className="space-y-1">
                        <Button
                            variant={!currentCategory && !isPopular && !isFeatured ? "secondary" : "ghost"}
                            className="w-full justify-start font-medium rounded-xl"
                            onClick={() => handleNavigation('clear')}
                        >
                            <LayoutGrid className="mr-3 h-4 w-4" />
                            {isEnglish ? "All Websites" : "সমস্ত ওয়েবসাইট"}
                        </Button>
                        <Button
                            variant={isFeatured ? "secondary" : "ghost"}
                            className="w-full justify-start font-medium rounded-xl"
                            onClick={() => handleNavigation('featured', 'true')}
                        >
                            <Star className="mr-3 h-4 w-4 text-gray-600" />
                            {isEnglish ? "Featured" : "নির্বাচিত"}
                        </Button>
                        <Button
                            variant={isPopular ? "secondary" : "ghost"}
                            className="w-full justify-start font-medium rounded-xl"
                            onClick={() => handleNavigation('popular', 'true')}
                        >
                            <TrendingUp className="mr-3 h-4 w-4 text-gray-600" />
                            {isEnglish ? "Most Popular" : "সবচেয়ে জনপ্রিয়"}
                        </Button>
                    </div>
                </div>

                <div className="px-4 py-2">
                    <h2 className="mb-3 px-4 text-xs font-medium tracking-wide text-gray-500 uppercase">
                        {isEnglish ? "Categories" : "বিভাগসমূহ"}
                    </h2>
                    <ScrollArea className="h-[calc(100vh-500px)] px-1">
                        <Accordion type="multiple" className="space-y-2">
                            {filteredCategories.map((category) => {
                                const websites = category.websites || [];
                                const displayWebsites = websites.slice(0, 10); // Show first 10 websites
                                
                                return (
                                    <AccordionItem
                                        key={category.id}
                                        value={category.id}
                                        className="border border-gray-100 rounded-xl overflow-hidden bg-white"
                                    >
                                        <AccordionTrigger className="px-3 py-2.5 hover:bg-gray-50/50 hover:no-underline [&[data-state=open]]:bg-gray-50">
                                            <div className="flex items-center gap-2 w-full text-left">
                                                <span className="text-base shrink-0">{category.icon}</span>
                                                <span className="flex-1 text-sm font-medium text-gray-900 truncate">
                                                    {getCategoryName(category)}
                                                </span>
                                                <span className="text-xs text-gray-400 shrink-0">
                                                    {websites.length}
                                                </span>
                                                <ChevronDown className="h-3.5 w-3.5 text-gray-400 shrink-0 transition-transform duration-200" />
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="bg-gray-50/30 border-t border-gray-100 px-2 py-2">
                                            {displayWebsites.length > 0 ? (
                                                <div className="space-y-1">
                                                    {displayWebsites.map((website) => (
                                                        <div
                                                            key={website.id}
                                                            className="group flex items-center gap-2 p-2 rounded-lg hover:bg-white transition-colors"
                                                        >
                                                            <div className="w-7 h-7 rounded-md bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                                                                {website.icon && website.icon.startsWith('http') ? (
                                                                    <img src={website.icon} alt={getWebsiteName(website)} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <span className="text-xs">{website.icon || <Globe className="w-3 h-3 text-gray-300" />}</span>
                                                                )}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <a 
                                                                    href={website.link} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer"
                                                                    className="block text-xs font-medium text-gray-900 hover:text-gray-600 truncate"
                                                                >
                                                                    {getWebsiteName(website)}
                                                                </a>
                                                            </div>
                                                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        toggleFavorite(website.id);
                                                                    }}
                                                                    className="p-1 hover:bg-gray-100 rounded"
                                                                    title={favorites.includes(website.id) ? "Remove from favorites" : "Add to favorites"}
                                                                >
                                                                    <Heart className={`w-3 h-3 ${favorites.includes(website.id) ? "fill-black text-black" : "text-gray-400"}`} />
                                                                </button>
                                                                <a
                                                                    href={website.link}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="p-1 hover:bg-gray-100 rounded"
                                                                >
                                                                    <ExternalLink className="w-3 h-3 text-gray-400" />
                                                                </a>
                                                            </div>
                                                        </div>
                                                    ))}
                                                    {websites.length > 10 && (
                                                        <div className="text-xs text-gray-400 text-center py-2">
                                                            +{websites.length - 10} more
                                                        </div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="text-xs text-gray-400 text-center py-3">
                                                    {isEnglish ? "No websites yet" : "এখনো কোন ওয়েবসাইট নেই"}
                                                </div>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                );
                            })}
                            {filteredCategories.length === 0 && (
                                <div className="px-4 py-3 text-sm text-gray-400">
                                    {isEnglish ? "No categories found" : "কোন বিভাগ বা পাওয়া যায়নি"}
                                </div>
                            )}
                        </Accordion>
                    </ScrollArea>
                </div>

                <div className="px-4 py-2 mt-auto">
                    <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                        <h3 className="font-medium text-gray-900 mb-1">
                            {isEnglish ? "Need Help?" : "সাহায্য প্রয়োজন?"}
                        </h3>
                        <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                            {isEnglish
                                ? "Contact us for support or to add your website."
                                : "সহায়তার জন্য অথবা আপনার ওয়েবসাইট যোগ করতে আমাদের সাথে যোগাযোগ করুন।"
                            }
                        </p>
                        <Button size="sm" className="w-full bg-black hover:bg-gray-900 text-white shadow-sm rounded-xl">
                            {isEnglish ? "Contact Support" : "যোগাযোগ করুন"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
