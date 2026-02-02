"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import CategoryManagement from "@/components/admin/CategoryManagement";
import WebsiteManagement from "@/components/admin/WebsiteManagement";
import WebsitesByCategory from "@/components/admin/WebsitesByCategory";
import PinAuth from "@/components/admin/PinAuth";
import Logo from "@/components/ui/logo";
import { Settings, FolderPlus, Globe, LayoutGrid, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

import { Search } from "lucide-react";
export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [globalSearch, setGlobalSearch] = useState("");

  const handleLogout = () => {
    sessionStorage.removeItem('admin-authenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <PinAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Logo size="large" variant="icon" />
          <div>
            <h1 className="text-2xl md:text-3xl font-semibold flex items-center gap-2">
              <Settings className="h-7 w-7 text-slate-700" />
              Admin Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage categories, websites and site settings
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Input
            value={globalSearch}
            onChange={(e) => setGlobalSearch(e.target.value)}
            placeholder="Search admin..."
            className="max-w-xs"
            icon={<Search className="h-4 w-4 text-gray-400" />}
          />

          <Button size="sm" variant="ghost" onClick={() => setActiveTab('categories')}>Add Category</Button>
          <Button size="sm" variant="ghost" onClick={() => setActiveTab('websites')}>Add Website</Button>
          <Button size="sm" variant="outline" onClick={async () => {
            try {
              const res = await fetch('/api/website');
              const data = await res.json();
              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'websites-export.json';
              a.click();
              URL.revokeObjectURL(url);
            } catch (e) {
              console.error(e);
            }
          }}>Export</Button>

          <Button
            variant="ghost"
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-600 hover:text-red-700"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 rounded-lg bg-white/40 p-1 shadow-sm">
          <TabsTrigger value="overview" className="flex items-center gap-2 rounded-md px-3 py-2">
            <LayoutGrid className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2 rounded-md px-3 py-2">
            <FolderPlus className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="websites" className="flex items-center gap-2 rounded-md px-3 py-2">
            <Globe className="h-4 w-4" />
            Websites
          </TabsTrigger>
          <div />
        </TabsList>

        <TabsContent value="overview">
          <Card className="rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle>Websites by Category</CardTitle>
              <CardDescription>
                Overview of all websites organized by their categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WebsitesByCategory />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories">
          <Card className="rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle>Category Management</CardTitle>
              <CardDescription>
                Add, edit, and manage bookmark categories
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CategoryManagement />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="websites">
          <Card className="rounded-lg shadow-sm">
            <CardHeader>
              <CardTitle>Website Management</CardTitle>
              <CardDescription>
                Add, edit, and manage bookmarked websites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <WebsiteManagement />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
