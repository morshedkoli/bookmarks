"use client";

import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";
import { Languages, Globe } from "lucide-react";

export function LanguageToggle() {
  const { language, toggleLanguage, isEnglish, isBengali } = useLanguage();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 min-w-[100px]"
      title={`Switch to ${isEnglish ? 'Bengali' : 'English'}`}
    >
      <Globe className="h-4 w-4" />
      <span className="font-medium">
        {isEnglish ? 'EN' : 'বাং'}
      </span>
      <span className="text-xs text-muted-foreground">
        {isEnglish ? '→ বাং' : '→ EN'}
      </span>
    </Button>
  );
}

export function LanguageToggleIcon() {
  const { toggleLanguage, isEnglish } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-1"
      title={`Switch to ${isEnglish ? 'Bengali' : 'English'}`}
    >
      <Languages className="h-4 w-4" />
      <span className="text-sm font-medium">
        {isEnglish ? 'EN' : 'বাং'}
      </span>
    </Button>
  );
}
