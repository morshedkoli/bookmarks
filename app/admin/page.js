"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CategoryManagement from "@/components/admin/CategoryManagement";
import WebsiteManagement from "@/components/admin/WebsiteManagement";
import WebsitesByCategory from "@/components/admin/WebsitesByCategory";
import PinAuth from "@/components/admin/PinAuth";
import Logo from "@/components/ui/logo";
import { Settings, FolderPlus, Globe, LayoutGrid, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem('admin-authenticated');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <PinAuth onAuthenticated={() => setIsAuthenticated(true)} />;
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8 flex justify-between items-start">
        <div className="flex items-center gap-4">
          <Logo size="large" variant="icon" />
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Settings className="h-8 w-8" />
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage categories and websites for your bookmark collection
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
          Logout
        </Button>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <LayoutGrid className="h-4 w-4" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="categories" className="flex items-center gap-2">
            <FolderPlus className="h-4 w-4" />
            Categories
          </TabsTrigger>
          <TabsTrigger value="websites" className="flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Websites
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <Card>
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
          <Card>
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
          <Card>
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
