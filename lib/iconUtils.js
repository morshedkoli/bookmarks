/**
 * Utility functions for fetching and managing website icons
 */

/**
 * Get favicon URL for a website
 * @param {string} url - The website URL
 * @returns {string} - The favicon URL
 */
export function getFaviconUrl(url) {
  try {
    const domain = new URL(url).origin;
    return `${domain}/favicon.ico`;
  } catch (error) {
    return null;
  }
}

/**
 * Get high-quality favicon using Google's favicon service
 * @param {string} url - The website URL
 * @returns {string} - The Google favicon URL
 */
export function getGoogleFaviconUrl(url) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch (error) {
    return null;
  }
}

/**
 * Get multiple favicon options for a website
 * @param {string} url - The website URL
 * @returns {Array} - Array of favicon URLs to try
 */
export function getFaviconOptions(url) {
  try {
    const urlObj = new URL(url);
    const domain = urlObj.hostname;
    const origin = urlObj.origin;
    
    return [
      `https://www.google.com/s2/favicons?domain=${domain}&sz=64`,
      `${origin}/favicon.ico`,
      `${origin}/favicon.png`,
      `${origin}/apple-touch-icon.png`,
      `https://icons.duckduckgo.com/ip3/${domain}.ico`,
      `https://favicons.githubusercontent.com/${domain}`,
    ];
  } catch (error) {
    return [];
  }
}

/**
 * Test if an image URL is valid
 * @param {string} url - The image URL to test
 * @returns {Promise<boolean>} - Whether the image loads successfully
 */
export function testImageUrl(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
    
    // Timeout after 5 seconds
    setTimeout(() => resolve(false), 5000);
  });
}

/**
 * Find the best working favicon for a website
 * @param {string} url - The website URL
 * @returns {Promise<string|null>} - The best working favicon URL or null
 */
export async function findBestFavicon(url) {
  const options = getFaviconOptions(url);
  
  for (const faviconUrl of options) {
    const isValid = await testImageUrl(faviconUrl);
    if (isValid) {
      return faviconUrl;
    }
  }
  
  return null;
}

/**
 * Extract domain name from URL for display
 * @param {string} url - The website URL
 * @returns {string} - The domain name
 */
export function extractDomain(url) {
  try {
    return new URL(url).hostname.replace('www.', '');
  } catch (error) {
    return url;
  }
}
