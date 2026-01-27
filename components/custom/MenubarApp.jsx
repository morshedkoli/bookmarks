"use client";

import { useState } from "react";
import { Menu, X, Phone } from "lucide-react";
import { LanguageToggleIcon } from "@/components/ui/language-toggle";
import Logo from "@/components/ui/logo";
import Link from "next/link";
import Sidebar from "./Sidebar";
import { Button } from "../ui/button";

const MenubarApp = ({ onToggleSidebar, isSidebarOpen }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 h-16 sticky top-0 z-30 w-full">
      <div className="h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Toggle button (Visible on Desktop now too for sidebar toggle) */}
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar || (() => setIsMobileMenuOpen(!isMobileMenuOpen))}
            className="text-gray-500 mr-2"
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="md:hidden">
            {/* Mobile specific logic if needed, but the main button serves both if handled by parent */}
          </div>
        </div>

        <div className="flex items-center space-x-2 ml-auto">
          <LanguageToggleIcon />

          <a
            href="tel:01781981486"
            className="flex items-center px-3 py-2 rounded-full bg-green-50 text-green-700 hover:bg-green-100 transition-colors text-sm font-medium"
          >
            <Phone className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">01781981486</span>
          </a>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-[300px] max-w-[85vw] h-full bg-white shadow-xl animate-in slide-in-from-left duration-300">
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 z-50 text-gray-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
            <div className="h-full overflow-y-auto">
              <Sidebar className="border-none w-full min-h-full" />
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default MenubarApp;
