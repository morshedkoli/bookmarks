"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Search, Download, RefreshCw, Check, X, Globe, Image } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getFaviconOptions, testImageUrl, extractDomain } from "@/lib/iconUtils";

export default function IconFinder({ website, onIconUpdate, trigger }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [iconOptions, setIconOptions] = useState([]);
  const [selectedIcon, setSelectedIcon] = useState("");
  const [customIcon, setCustomIcon] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen && website?.link) {
      findIcons();
    }
  }, [isOpen, website]);

  const findIcons = async () => {
    setLoading(true);
    try {
      const options = getFaviconOptions(website.link);
      const validIcons = [];

      // Test each icon option
      for (const iconUrl of options) {
        const isValid = await testImageUrl(iconUrl);
        validIcons.push({
          url: iconUrl,
          isValid,
          source: getIconSource(iconUrl)
        });
      }

      setIconOptions(validIcons);
      
      // Auto-select the first valid icon
      const firstValid = validIcons.find(icon => icon.isValid);
      if (firstValid) {
        setSelectedIcon(firstValid.url);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to find icons",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getIconSource = (url) => {
    if (url.includes('google.com')) return 'Google';
    if (url.includes('duckduckgo.com')) return 'DuckDuckGo';
    if (url.includes('github.com')) return 'GitHub';
    if (url.includes('favicon.ico')) return 'Direct';
    if (url.includes('favicon.png')) return 'PNG';
    if (url.includes('apple-touch-icon')) return 'Apple';
    return 'Other';
  };

  const handleUpdateIcon = async () => {
    const iconToUse = selectedIcon || customIcon;
    
    if (!iconToUse) {
      toast({
        title: "Error",
        description: "Please select an icon or enter a custom URL",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/website", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: website.id,
          icon: iconToUse,
          password: "Murshed@@@k5"
        }),
      });

      const data = await response.json();
      
      if (data.status === "success") {
        toast({
          title: "Success",
          description: "Icon updated successfully",
        });
        onIconUpdate?.(iconToUse);
        setIsOpen(false);
      } else {
        toast({
          title: "Error",
          description: data.data || "Failed to update icon",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update icon",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm">
            <Image className="h-4 w-4 mr-2" />
            Find Icon
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Find Icon for {website?.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Website Info */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <Globe className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">{website?.name}</p>
                  <p className="text-sm text-muted-foreground">{extractDomain(website?.link || "")}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Auto-found Icons */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Available Icons</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={findIcons}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            {loading ? (
              <div className="flex justify-center py-8">
                <RefreshCw className="h-6 w-6 animate-spin" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {iconOptions.map((icon, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer transition-all ${
                      selectedIcon === icon.url
                        ? 'ring-2 ring-blue-500 bg-blue-50'
                        : 'hover:bg-gray-50'
                    } ${!icon.isValid ? 'opacity-50' : ''}`}
                    onClick={() => icon.isValid && setSelectedIcon(icon.url)}
                  >
                    <CardContent className="p-3">
                      <div className="flex flex-col items-center gap-2">
                        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
                          {icon.isValid ? (
                            <img
                              src={icon.url}
                              alt="Icon"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                            <X className="w-4 h-4" />
                          </div>
                        </div>
                        <div className="text-center">
                          <Badge variant={icon.isValid ? "default" : "secondary"} className="text-xs">
                            {icon.source}
                          </Badge>
                          {selectedIcon === icon.url && (
                            <Check className="h-4 w-4 text-blue-500 mx-auto mt-1" />
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Custom Icon URL */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Custom Icon URL</h3>
            <div className="space-y-2">
              <Label htmlFor="customIcon">Icon URL</Label>
              <Input
                id="customIcon"
                value={customIcon}
                onChange={(e) => {
                  setCustomIcon(e.target.value);
                  setSelectedIcon(""); // Clear selected when typing custom
                }}
                placeholder="https://example.com/icon.png"
              />
              {customIcon && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-8 h-8 rounded overflow-hidden bg-gray-100 flex items-center justify-center">
                    <img
                      src={customIcon}
                      alt="Custom icon"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                      <X className="w-3 h-3" />
                    </div>
                  </div>
                  <span className="text-sm text-muted-foreground">Preview</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdateIcon} disabled={!selectedIcon && !customIcon}>
              <Download className="h-4 w-4 mr-2" />
              Update Icon
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
