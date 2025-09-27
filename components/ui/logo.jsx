"use client";

import { Bookmark, Star, Globe } from "lucide-react";

const Logo = ({ size = "default", variant = "full", className = "" }) => {
  const sizes = {
    small: {
      container: "h-8 w-8",
      icon: "h-4 w-4",
      text: "text-sm",
      spacing: "gap-2"
    },
    default: {
      container: "h-10 w-10",
      icon: "h-5 w-5",
      text: "text-lg",
      spacing: "gap-3"
    },
    large: {
      container: "h-16 w-16",
      icon: "h-8 w-8",
      text: "text-2xl",
      spacing: "gap-4"
    },
    xl: {
      container: "h-20 w-20",
      icon: "h-10 w-10",
      text: "text-3xl",
      spacing: "gap-5"
    }
  };

  const currentSize = sizes[size] || sizes.default;

  // Icon-only variant
  if (variant === "icon") {
    return (
      <div className={`${currentSize.container} bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden ${className}`}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="absolute top-1 right-1 w-2 h-2 bg-white/30 rounded-full"></div>
        <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/20 rounded-full"></div>
        
        {/* Main icon */}
        <div className="relative z-10 flex items-center justify-center">
          <Bookmark className={`${currentSize.icon} text-white fill-white`} />
          <Star className="absolute top-0 right-0 h-2 w-2 text-yellow-300 fill-yellow-300 transform translate-x-1 -translate-y-1" />
        </div>
      </div>
    );
  }

  // Full logo with text
  return (
    <div className={`flex items-center ${currentSize.spacing} ${className}`}>
      {/* Logo Icon */}
      <div className={`${currentSize.container} bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
        <div className="absolute top-1 right-1 w-2 h-2 bg-white/30 rounded-full"></div>
        <div className="absolute bottom-1 left-1 w-1 h-1 bg-white/20 rounded-full"></div>
        
        {/* Main icon */}
        <div className="relative z-10 flex items-center justify-center">
          <Bookmark className={`${currentSize.icon} text-white fill-white`} />
          <Star className="absolute top-0 right-0 h-2 w-2 text-yellow-300 fill-yellow-300 transform translate-x-1 -translate-y-1" />
        </div>
      </div>

      {/* Logo Text */}
      <div className="flex flex-col">
        <span className={`font-bold text-gray-900 ${currentSize.text} leading-tight`}>
          BookmarkHub
        </span>
        <span className="text-xs text-gray-500 font-medium -mt-1">
          Your Digital Library
        </span>
      </div>
    </div>
  );
};

// Favicon component (for generating favicon)
export const FaviconLogo = ({ size = 32 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background */}
      <rect width="32" height="32" rx="8" fill="url(#gradient)" />
      
      {/* Gradient definition */}
      <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      
      {/* Bookmark icon */}
      <path
        d="M8 6C8 4.89543 8.89543 4 10 4H22C23.1046 4 24 4.89543 24 6V26L16 20L8 26V6Z"
        fill="white"
      />
      
      {/* Star accent */}
      <path
        d="M20 8L21 11H24L21.5 13L22.5 16L20 14L17.5 16L18.5 13L16 11H19L20 8Z"
        fill="#FCD34D"
      />
      
      {/* Shine effect */}
      <rect x="0" y="0" width="32" height="16" rx="8" fill="url(#shine)" opacity="0.3" />
      
      <defs>
        <linearGradient id="shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default Logo;
