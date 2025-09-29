"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, FolderOpen, Search, Filter, BarChart3, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useConfirmation } from "@/hooks/use-confirmation";
import { ConfirmationDialog } from "@/components/ui/confirmation-dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { LanguageToggle } from "@/components/ui/language-toggle";

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    nameEn: "",
    nameBn: "",
    path: "",
    icon: "",
    description: "",
    descriptionEn: "",
    descriptionBn: "",
    password: "Murshed@@@k5"
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // all, active, empty
  const { toast } = useToast();
  const { isOpen, confirmationData, showDeleteConfirmation, setIsOpen } = useConfirmation();
  const { language, getCategoryName, getCategoryDescription, isEnglish, isBengali } = useLanguage();

  // Filter and search categories
  const filteredCategories = categories.filter(category => {
    const categoryName = getCategoryName(category);
    const matchesSearch = categoryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         category.path.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterType === "active") {
      return matchesSearch && category.websites?.length > 0;
    } else if (filterType === "empty") {
      return matchesSearch && (!category.websites || category.websites.length === 0);
    }
    
    return matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: categories.length,
    active: categories.filter(cat => cat.websites?.length > 0).length,
    empty: categories.filter(cat => !cat.websites || cat.websites.length === 0).length,
    totalWebsites: categories.reduce((sum, cat) => sum + (cat.websites?.length || 0), 0)
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/category", {
        cache: 'no-store'
      });
      const data = await response.json();
      if (data.status === "success") {
        setCategories(data.data);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.nameEn || !formData.nameBn || !formData.path || !formData.icon) {
      toast({
        title: "Error",
        description: "Please fill in all required fields (English name, Bengali name, path, and icon)",
        variant: "destructive",
      });
      return;
    }

    try {
      const url = editingCategory ? "/api/category" : "/api/category";
      const method = editingCategory ? "PUT" : "POST";
      const body = editingCategory 
        ? { ...formData, id: editingCategory.id }
        : formData;

      const response = await fetch(url, {
        method,
        cache: 'no-store',
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      
      if (data.status === "success") {
        toast({
          title: "Success",
          description: `Category ${editingCategory ? "updated" : "created"} successfully`,
        });
        fetchCategories();
        resetForm();
        setIsDialogOpen(false);
      } else {
        toast({
          title: "Error",
          description: data.data || "Failed to save category",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save category",
        variant: "destructive",
      });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      nameEn: category.nameEn || category.name,
      nameBn: category.nameBn || category.name,
      path: category.path,
      icon: category.icon,
      description: category.description || "",
      descriptionEn: category.descriptionEn || category.description || "",
      descriptionBn: category.descriptionBn || category.description || "",
      password: "Murshed@@@k5"
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (category) => {
    const confirmed = await showDeleteConfirmation(category.name, "category");
    if (!confirmed) return;

    try {
      const response = await fetch(
        `/api/category?id=${category.id}&password=Murshed@@@k5`,
        {
          method: "DELETE",
          cache: 'no-store'
        }
      );

      const data = await response.json();
      
      if (data.status === "success") {
        toast({
          title: "Success",
          description: "Category deleted successfully",
        });
        fetchCategories();
      } else {
        toast({
          title: "Error",
          description: data.data || "Failed to delete category",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete category",
        variant: "destructive",
      });
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      nameEn: "",
      nameBn: "",
      path: "",
      icon: "",
      description: "",
      descriptionEn: "",
      descriptionBn: "",
      password: "Murshed@@@k5"
    });
    setEditingCategory(null);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    resetForm();
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading categories...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header with Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <FolderOpen className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Categories</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Active Categories</p>
                <p className="text-2xl font-bold">{stats.active}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Globe className="h-5 w-5 text-purple-500" />
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
              <FolderOpen className="h-5 w-5 text-orange-500" />
              <div>
                <p className="text-sm font-medium text-gray-600">Empty Categories</p>
                <p className="text-2xl font-bold">{stats.empty}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls Section */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-3 flex-1">
          {/* Language Toggle */}
          <LanguageToggle />
          
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={isEnglish ? "Search categories..." : "বিভাগ খুঁজুন..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filter Buttons */}
          <div className="flex gap-2">
            <Button
              variant={filterType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("all")}
            >
              All ({stats.total})
            </Button>
            <Button
              variant={filterType === "active" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("active")}
            >
              Active ({stats.active})
            </Button>
            <Button
              variant={filterType === "empty" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterType("empty")}
            >
              Empty ({stats.empty})
            </Button>
          </div>
        </div>
        
        {/* Add Category Button */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Edit Category" : "Add New Category"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nameEn">English Name *</Label>
                <Input
                  id="nameEn"
                  value={formData.nameEn}
                  onChange={(e) => setFormData({ ...formData, nameEn: e.target.value, name: e.target.value })}
                  placeholder="Category name in English"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nameBn">Bengali Name *</Label>
                <Input
                  id="nameBn"
                  value={formData.nameBn}
                  onChange={(e) => setFormData({ ...formData, nameBn: e.target.value })}
                  placeholder="বাংলায় বিভাগের নাম"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="path">Path *</Label>
                <Input
                  id="path"
                  value={formData.path}
                  onChange={(e) => setFormData({ ...formData, path: e.target.value })}
                  placeholder="Category path"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="icon">Icon *</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="Icon URL or emoji"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionEn">English Description</Label>
                <Input
                  id="descriptionEn"
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value, description: e.target.value })}
                  placeholder="Category description in English (optional)"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="descriptionBn">Bengali Description</Label>
                <Input
                  id="descriptionBn"
                  value={formData.descriptionBn}
                  onChange={(e) => setFormData({ ...formData, descriptionBn: e.target.value })}
                  placeholder="বাংলায় বিভাগের বিবরণ (ঐচ্ছিক)"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button type="button" variant="outline" onClick={handleDialogClose}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? "Update" : "Create"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Categories ({filteredCategories.length})
            </div>
            {searchTerm && (
              <Badge variant="outline">
                Showing {filteredCategories.length} of {categories.length}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredCategories.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {categories.length === 0 ? (
                <div>
                  <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No categories yet</h3>
                  <p>Create your first category to get started organizing your bookmarks.</p>
                </div>
              ) : (
                <div>
                  <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">No categories found</h3>
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
                  <TableHead>Description</TableHead>
                  <TableHead>Path</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Websites</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCategories.map((category) => (
                  <TableRow key={category.id}>
                    <TableCell>
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center flex-shrink-0">
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
                            <span className="text-xl">{category.icon}</span>
                          )
                        ) : null}
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400" style={{display: category.icon && category.icon.startsWith('http') ? 'none' : 'flex'}}>
                          <FolderOpen className="w-5 h-5" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{getCategoryName(category)}</TableCell>
                    <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                      {getCategoryDescription(category) || (isEnglish ? "No description" : "কোন বিবরণ নেই")}
                    </TableCell>
                    <TableCell className="text-muted-foreground font-mono text-sm">{category.path}</TableCell>
                    <TableCell>
                      {category.websites?.length > 0 ? (
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                          Empty
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {category.websites?.length || 0} websites
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground text-sm">
                      {new Date(category.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(category)}
                          className="hover:bg-blue-50 hover:text-blue-600"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(category)}
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
