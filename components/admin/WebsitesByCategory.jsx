"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ExternalLink, Globe, FolderOpen, Plus, Edit, Trash2, LayoutGrid } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useConfirmation } from "@/hooks/use-confirmation";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";

export default function WebsitesByCategory() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCategories: 0,
    totalWebsites: 0,
    categoriesWithWebsites: 0,
    emptyCategories: 0
  });
  const { toast } = useToast();
  const { isOpen, confirmationData, showDeleteConfirmation, setIsOpen } = useConfirmation();

  useEffect(() => {
    fetchCategoriesWithWebsites();
  }, []);

  const fetchCategoriesWithWebsites = async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      
      if (data.status === "success") {
        const categoriesData = data.data;
        setCategories(categoriesData);
        
        // Calculate statistics
        const totalWebsites = categoriesData.reduce((sum, cat) => sum + (cat.websites?.length || 0), 0);
        const categoriesWithWebsites = categoriesData.filter(cat => cat.websites?.length > 0).length;
        const emptyCategories = categoriesData.length - categoriesWithWebsites;
        
        setStats({
          totalCategories: categoriesData.length,
          totalWebsites,
          categoriesWithWebsites,
          emptyCategories
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch categories",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch categories",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteWebsite = async (websiteId, websiteName) => {
    const confirmed = await showDeleteConfirmation(websiteName, "website");
    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/website?id=${websiteId}&password=Murshed@@@k5`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();
      
      if (data.status === "success") {
        toast({
          title: "Success",
          description: "Website deleted successfully",
        });
        fetchCategoriesWithWebsites(); // Refresh data
      } else {
        toast({
          title: "Error",
          description: data.data || "Failed to delete website",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete website",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading overview...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold">{stats.totalCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Websites</p>
                <p className="text-2xl font-bold">{stats.totalWebsites}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Plus className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Categories</p>
                <p className="text-2xl font-bold">{stats.categoriesWithWebsites}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Empty Categories</p>
                <p className="text-2xl font-bold">{stats.emptyCategories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Categories with Websites */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <LayoutGrid className="h-5 w-5" />
            Websites by Category
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No categories found. Create your first category to get started.
            </div>
          ) : (
            <Accordion type="multiple" className="w-full">
              {categories.map((category) => (
                <AccordionItem key={category.id} value={category.id}>
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center justify-between w-full pr-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                          {category.icon ? (
                            category.icon.startsWith('http') ? (
                              <img 
                                src={category.icon} 
                                alt={category.name}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                  e.target.nextSibling.style.display = 'flex';
                                }}
                              />
                            ) : (
                              <span className="text-lg">{category.icon}</span>
                            )
                          ) : null}
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400" style={{display: category.icon && category.icon.startsWith('http') ? 'none' : 'flex'}}>
                            <FolderOpen className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-left">
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-muted-foreground">{category.path}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={category.websites?.length > 0 ? "default" : "secondary"}>
                          {category.websites?.length || 0} websites
                        </Badge>
                        {category.websites?.length === 0 && (
                          <Badge variant="outline" className="text-orange-600 border-orange-200">
                            Empty
                          </Badge>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    {category.websites?.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground bg-gray-50 rounded-lg">
                        <FolderOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p>No websites in this category yet.</p>
                        <p className="text-sm">Add some websites to get started!</p>
                      </div>
                    ) : (
                      <div className="grid gap-3">
                        {category.websites.map((website) => (
                          <div
                            key={website.id}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center gap-3 flex-1">
                              <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
                                {website.icon ? (
                                  website.icon.startsWith('http') ? (
                                    <img 
                                      src={website.icon} 
                                      alt={website.name}
                                      className="w-full h-full object-cover"
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'flex';
                                      }}
                                    />
                                  ) : (
                                    <span className="text-xl">{website.icon}</span>
                                  )
                                ) : null}
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400" style={{display: website.icon && website.icon.startsWith('http') ? 'none' : 'flex'}}>
                                  <Globe className="w-5 h-5" />
                                </div>
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <h4 className="font-medium truncate">{website.name}</h4>
                                  <a
                                    href={website.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                                  >
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                </div>
                                {website.useFor && (
                                  <p className="text-sm text-muted-foreground truncate">
                                    {website.useFor}
                                  </p>
                                )}
                                <p className="text-xs text-muted-foreground">
                                  Added: {new Date(website.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1 ml-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteWebsite(website.id, website.name)}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        title={confirmationData?.title}
        description={confirmationData?.description}
        confirmText={confirmationData?.confirmText}
        cancelText={confirmationData?.cancelText}
        variant={confirmationData?.variant}
        onConfirm={confirmationData?.onConfirm}
        onCancel={confirmationData?.onCancel}
      />
    </div>
  );
}
