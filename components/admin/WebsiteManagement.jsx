"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, Edit, Trash2, Globe, ExternalLink, Search, Filter, BarChart3, FolderOpen, Image, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useConfirmation } from "@/hooks/use-confirmation";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import IconFinder from "./IconFinder";

export default function WebsiteManagement() {
  const [websites, setWebsites] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingWebsite, setEditingWebsite] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    nameBn: "",
    link: "",
    useFor: "",
    useForEn: "",
    useForBn: "",
    icon: "",
    categoriesId: "",
    featured: false,
    password: "Murshed@@@k5"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const { toast } = useToast();
  const { isOpen, confirmationData, showDeleteConfirmation, showBulkActionConfirmation, setIsOpen } = useConfirmation();

  // Filter and search websites
  const filteredWebsites = websites.filter(website => {
    const matchesSearch = website.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         website.link.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (website.useFor && website.useFor.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterCategory === "all") {
      return matchesSearch;
    }
    
    return matchesSearch && website.categoriesId === filterCategory;
  });

  // Calculate statistics
  const stats = {
    total: websites.length,
    categories: [...new Set(websites.map(w => w.categoriesId))].length,
    featured: websites.filter(w => w.featured).length,
    withDescription: websites.filter(w => w.useFor && w.useFor.trim()).length,
    withoutDescription: websites.filter(w => !w.useFor || !w.useFor.trim()).length
  };

  useEffect(() => {
    fetchWebsites();
    fetchCategories();
  }, []);

  const fetchWebsites = async () => {
    try {
      const response = await fetch("/api/website");
      const data = await response.json();
      if (data.status === "success") {
        setWebsites(data.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch websites",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch websites",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category");
      const data = await response.json();
      if (data.status === "success") {
        setCategories(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.link || !formData.categoriesId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = "/api/website";
      const method = editingWebsite ? "PUT" : "POST";
      const body = editingWebsite 
        ? { ...formData, id: editingWebsite.id }
        : formData;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (data.status === "success") {
        toast({
          title: "Success",
          description: `Website ${editingWebsite ? "updated" : "created"} successfully`,
        });
        fetchWebsites();
        resetForm();
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: data.data || "Failed to save website",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save website",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (website) => {
    setEditingWebsite(website);
    setFormData({
      name: website.name,
      nameEn: website.nameEn || website.name,
      nameBn: website.nameBn || website.name,
      link: website.link,
      useFor: website.useFor,
      useForEn: website.useForEn || website.useFor,
      useForBn: website.useForBn || website.useFor,
      icon: website.icon,
      categoriesId: website.categoriesId,
      featured: website.featured || false,
      password: "Murshed@@@k5"
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (website) => {
    const confirmed = await showDeleteConfirmation(website.name, "website");
    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/website?id=${website.id}&password=Murshed@@@k5`,
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
        fetchWebsites();
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

  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      nameBn: "",
      link: "",
      useFor: "",
      useForEn: "",
      useForBn: "",
      icon: "",
      categoriesId: "",
      featured: false,
      password: "Murshed@@@k5"
    });
    setEditingWebsite(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  const handleIconUpdate = (websiteId, newIcon) => {
    // Update the website in the local state
    setWebsites(prevWebsites => 
      prevWebsites.map(website => 
        website.id === websiteId 
          ? { ...website, icon: newIcon }
          : website
      )
    );
  };

  const handleBulkIconUpdate = async () => {
    const confirmed = await showBulkActionConfirmation(
      "Update Icons for", 
      websites.length, 
      "websites"
    );
    if (!confirmed) return;

    toast({
      title: "Starting bulk icon update",
      description: "This may take a few moments...",
    });

    // This would need to be implemented as a batch operation
    // For now, we'll refresh the data
    fetchWebsites();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading websites...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Websites</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Featured Websites</p>
                <p className="text-2xl font-bold">{stats.featured}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Categories Used</p>
                <p className="text-2xl font-bold">{stats.categories}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">With Description</p>
                <p className="text-2xl font-bold">{stats.withDescription}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Edit className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">No Description</p>
                <p className="text-2xl font-bold">{stats.withoutDescription}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search websites..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Category Filter */}
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories ({websites.length})</SelectItem>
              {categories.map((category) => {
                const count = websites.filter(w => w.categoriesId === category.id).length;
                return (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name} ({count})
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>
        
        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleBulkIconUpdate}
            disabled={websites.length === 0}
          >
            <Image className="h-4 w-4 mr-2" />
            Update All Icons
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Website
              </Button>
            </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingWebsite ? "Edit Website" : "Add New Website"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Website name"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nameEn">English Name</Label>
                  <Input
                    id="nameEn"
                    value={formData.nameEn}
                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                    placeholder="English name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nameBn">Bengali Name (বাংলা নাম)</Label>
                  <Input
                    id="nameBn"
                    value={formData.nameBn}
                    onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                    placeholder="বাংলা নাম"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="link">Link *</Label>
                <Input
                  id="link"
                  type="url"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="https://example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="useFor">Use For</Label>
                <Input
                  id="useFor"
                  value={formData.useFor}
                  onChange={(e) => setFormData({ ...formData, useFor: e.target.value })}
                  placeholder="What is this website used for?"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="useForEn">English Description</Label>
                  <Input
                    id="useForEn"
                    value={formData.useForEn}
                    onChange={(e) => setFormData({ ...formData, useForEn: e.target.value })}
                    placeholder="English description"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="useForBn">Bengali Description (বাংলা বিবরণ)</Label>
                  <Input
                    id="useForBn"
                    value={formData.useForBn}
                    onChange={(e) => setFormData({ ...formData, useForBn: e.target.value })}
                    placeholder="বাংলা বিবরণ"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Icon URL or emoji"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.categoriesId}
                  onValueChange={(value) => setFormData({ ...formData, categoriesId: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.icon} {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                />
                <Label htmlFor="featured" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Mark as Featured Website
                </Label>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingWebsite ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Websites Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Websites ({filteredWebsites.length})
            </div>
            {(searchTerm || filterCategory !== "all") && (
              <Badge variant="outline">
                Showing {filteredWebsites.length} of {websites.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredWebsites.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {websites.length === 0 ? (
                <div>
                  <Globe className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No websites yet</h3>
                  <p>Create your first website bookmark to get started.</p>
                </div>
              ) : (
                <div>
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No websites found</h3>
                  <p>Try adjusting your search or filter criteria.</p>
                </div>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Icon</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Featured</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredWebsites.map((website) => (
                  <TableRow key={website.id}>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{website.name}</span>
                        <a
                          href={website.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 flex-shrink-0"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </div>
                      <div className="text-xs text-muted-foreground font-mono truncate max-w-xs">
                        {website.link}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {website.categorie?.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="max-w-xs">
                      {website.useFor ? (
                        <span className="text-sm">{website.useFor}</span>
                      ) : (
                        <span className="text-muted-foreground text-sm italic">No description</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {website.featured ? (
                        <Badge variant="default" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          <Star className="h-3 w-3 mr-1" />
                          Featured
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-sm">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {website.useFor && website.useFor.trim() ? (
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Complete
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                          Incomplete
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(website.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-1">
                        <IconFinder
                          website={website}
                          onIconUpdate={(newIcon) => handleIconUpdate(website.id, newIcon)}
                          trigger={
                            <Button
                              variant="outline"
                              size="sm"
                              className="hover:bg-purple-50 hover:text-purple-600"
                            >
                              <Image className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(website)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(website)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
