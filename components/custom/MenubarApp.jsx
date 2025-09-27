"use client";

import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { LanguageToggleIcon } from "@/components/ui/language-toggle";
import Logo from "@/components/ui/logo";
import Link from "next/link";

const MenubarApp = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <a
                href="https://facebook.com/murshedkoli"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <Logo size="small" variant="full" />
              </a>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Toggle */}
            <LanguageToggleIcon />
            
            {/* Contact Info */}
            <a
              href="tel:01781981486"
              className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
            >
              <Phone className="h-4 w-4 mr-2" />
              <span className="hidden lg:inline">যে কোন প্রয়োজনে:</span>
              <span className="lg:ml-1">01781981486</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-colors duration-200"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Contact */}
            <a
              href="tel:01781981486"
              className="flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-green-600 hover:bg-green-50 transition-colors duration-200"
              onClick={() => setIsOpen(false)}
            >
              <Phone className="h-5 w-5 mr-3" />
              <div className="flex flex-col">
                <span className="text-sm">যে কোন প্রয়োজনে</span>
                <span className="font-semibold">01781981486</span>
              </div>
            </a>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MenubarApp;
