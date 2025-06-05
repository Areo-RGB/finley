// Cache Manager Service - Handles PWA caching and storage management
// Extracted from custom.js cache management section

export function initCacheManager(config) {
  console.log("💾 Initializing Cache Manager...");

  // Create the cache manager object
  window.cacheManager = {
    async getStorageInfo() {
      if ("storage" in navigator && "estimate" in navigator.storage) {
        const estimate = await navigator.storage.estimate();
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        const fallbackStorage = isIOS ? 50 * 1024 * 1024 : 100 * 1024 * 1024;
        const actualQuota = estimate.quota || fallbackStorage;

        return {
          used: estimate.usage || 0,
          available: actualQuota,
          percentage: estimate.usage ? estimate.usage / actualQuota : 0,
          usedMB: Math.round((estimate.usage || 0) / 1024 / 1024),
          availableMB: Math.round(actualQuota / 1024 / 1024),
          isIOS: isIOS,
          actualQuotaMB: Math.round((estimate.quota || 0) / 1024 / 1024),
          usingFallback: !estimate.quota,
        };
      }
      return null;
    },

    async clearCache() {
      try {
        const cacheNames = await caches.keys();
        await Promise.all(
          cacheNames.map((cacheName) => caches.delete(cacheName))
        );
        console.log("🗑️ Cache cleared successfully");
        return true;
      } catch (error) {
        console.error("❌ Failed to clear cache:", error);
        return false;
      }
    },

    async logStorageUsage() {
      const info = await this.getStorageInfo();
      if (info) {
        console.log("📊 Storage Usage:", {
          used: info.usedMB + "MB",
          available: info.availableMB + "MB",
          actualQuota: info.actualQuotaMB + "MB",
          usingFallback: info.usingFallback,
          percentage: Math.round(info.percentage * 100) + "%",
          platform: info.isIOS ? "iOS" : "Other",
          cacheThreshold: "95%",
        });

        // Also log cache breakdown
        try {
          const cacheNames = await caches.keys();
          console.log("📁 Cache Status:", {
            caches: cacheNames.length,
            thumbnailCachingEnabled: true,
            videosCached: true,
            videoCacheThreshold: "70%",
            storageUtilization: Math.round(info.percentage * 100) + "% of available quota",
          });
        } catch (error) {
          console.log("Could not get cache details:", error);
        }
      }
    },

    async listCachedFiles() {
      const cacheNames = await caches.keys();
      for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const requests = await cache.keys();
        console.log(`📁 Cache: ${cacheName} (${requests.length} files)`);
        requests.forEach((req) => console.log(`  - ${req.url}`));
      }
    },

    async getDetailedStorageInfo() {
      const info = await this.getStorageInfo();
      if (info) {
        const percentageText = Math.round(info.percentage * 100) + "%";
        console.log(`💾 Cache Usage: ${info.usedMB}MB / ${info.availableMB}MB (${percentageText})`);
        return {
          ...info,
          percentageText
        };
      }
      return null;
    }
  };

  // Log storage usage on page load (if PWA is enabled)
  if (config.isPWA) {
    setTimeout(() => {
      window.cacheManager.logStorageUsage();
    }, 2000);

    // Auto-log storage usage every 30 seconds for monitoring
    setInterval(async () => {
      if (window.cacheManager) {
        await window.cacheManager.logStorageUsage();
      }
    }, 30000);
  }

  console.log("✅ Cache Manager initialized");
  console.log("🚀 Use window.cacheManager.getStorageInfo() to check usage");
}
