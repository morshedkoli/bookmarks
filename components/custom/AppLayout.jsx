"use client";

import { useState } from "react";
import Sidebar from "@/components/custom/Sidebar";
import MenubarApp from "@/components/custom/MenubarApp";

export default function AppLayout({ children }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Desktop Sidebar: Conditionally render or hide via CSS width */}
            <div
                className={`hidden md:block shrink-0 transition-all duration-300 ease-in-out border-r border-gray-200 bg-white ${isSidebarOpen ? 'w-72 opacity-100' : 'w-0 opacity-0 overflow-hidden'
                    }`}
            >
                <Sidebar className="h-full" />
            </div>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
                <MenubarApp
                    onToggleSidebar={() => setSidebarOpen(!isSidebarOpen)}
                    isSidebarOpen={isSidebarOpen}
                />
                <div className="w-full">
                    {children}
                </div>
            </div>
        </div>
    );
}
