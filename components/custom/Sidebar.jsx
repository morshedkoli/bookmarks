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
    Shield
} from "lucide-react";
import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Input } from "../ui/input";
import { useState } from "react";
import Logo from "../ui/logo";

export default function Sidebar({ className }) {
    const { language, isEnglish, getCategoryName } = useLanguage();
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [searchQuery, setSearchQuery] = useState("");
    const currentCategory = searchParams.get("category");
    const isPopular = searchParams.get("popular") === "true";
    const isFeatured = searchParams.get("featured") === "true";

    const fetcher = (url) => fetch(url).then((res) => res.json());

    const { data } = useSWR(["/api/category", language], () => fetcher("/api/category"), {
        revalidateOnFocus: false,
    });

    const categories = data?.data && Array.isArray(data.data) ? data.data : [];

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
        <div className={cn("pb-12 min-h-screen bg-white border-r border-gray-200", className)}>
            <div className="space-y-4 py-4">
                <div className="px-4 py-2">
                    <Link href="/" className="flex items-center gap-2 mb-6 px-2">
                        <Logo size="small" variant="icon" />
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            BookmarkHub
                        </span>
                    </Link>

                    <div className="relative">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder={isEnglish ? "Search categories..." : "বিভাগ খুঁজুন..."}
                            className="pl-8 bg-gray-50 border-gray-200"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div className="mt-3 px-2">
                        <Link href="/admin">
                            <Button variant="outline" className="w-full justify-start font-medium">
                                <Shield className="mr-2 h-4 w-4" />
                                Admin
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-gray-500 uppercase">
                        {isEnglish ? "Discover" : "আবিষ্কার করুন"}
                    </h2>
                    <div className="space-y-1">
                        <Button
                            variant={!currentCategory && !isPopular && !isFeatured ? "secondary" : "ghost"}
                            className="w-full justify-start font-medium"
                            onClick={() => handleNavigation('clear')}
                        >
                            <LayoutGrid className="mr-2 h-4 w-4" />
                            {isEnglish ? "All Web Sites" : "সমস্ত ওয়েবসাইট"}
                        </Button>
                        <Button
                            variant={isFeatured ? "secondary" : "ghost"}
                            className="w-full justify-start font-medium"
                            onClick={() => handleNavigation('featured', 'true')}
                        >
                            <Star className="mr-2 h-4 w-4 text-yellow-500" />
                            {isEnglish ? "Featured" : "নির্বাচিত"}
                        </Button>
                        <Button
                            variant={isPopular ? "secondary" : "ghost"}
                            className="w-full justify-start font-medium"
                            onClick={() => handleNavigation('popular', 'true')}
                        >
                            <TrendingUp className="mr-2 h-4 w-4 text-purple-500" />
                            {isEnglish ? "Most Popular" : "সবচেয়ে জনপ্রিয়"}
                        </Button>
                    </div>
                </div>

                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-gray-500 uppercase">
                        {isEnglish ? "Categories" : "বিভাগসমূহ"}
                    </h2>
                    <ScrollArea className="h-[400px] px-1">
                        <div className="space-y-1">
                            {filteredCategories.map((category) => (
                                <Button
                                    key={category.id}
                                    variant={currentCategory === category.id ? "secondary" : "ghost"}
                                    className="w-full justify-start font-normal group"
                                    onClick={() => handleNavigation('category', category.id)}
                                >
                                    <span className="mr-2 text-lg">{category.icon}</span>
                                    <span className="flex-1 text-left truncate">{getCategoryName(category)}</span>
                                    {currentCategory === category.id && (
                                        <ChevronRight className="h-4 w-4 text-gray-400" />
                                    )}
                                </Button>
                            ))}
                            {filteredCategories.length === 0 && (
                                <div className="px-4 py-2 text-sm text-gray-500">
                                    {isEnglish ? "No categories found" : "কোন বিভাগ বা পাওয়া যায়নি"}
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </div>

                <div className="px-3 py-2 mt-auto">
                    <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
                        <h3 className="font-semibold text-blue-900 mb-1">
                            {isEnglish ? "Need Help?" : "সাহায্য প্রয়োজন?"}
                        </h3>
                        <p className="text-xs text-blue-700 mb-3">
                            {isEnglish
                                ? "Contact us for support or to add your website."
                                : "সহায়তার জন্য অথবা আপনার ওয়েবসাইট যোগ করতে আমাদের সাথে যোগাযোগ করুন।"
                            }
                        </p>
                        <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                            {isEnglish ? "Contact Support" : "যোগাযোগ করুন"}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
