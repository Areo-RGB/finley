// js/modules/cacheManager.js

// Helper to check for Cache API support more robustly
function isCacheAPISupported() {
    return typeof caches !== 'undefined' && typeof caches.keys === 'function' && typeof caches.delete === 'function' && typeof caches.open === 'function';
}

export const cacheManager = {
  async getStorageInfo() {
    if ("storage" in navigator && "estimate" in navigator.storage) {
      try {
        const estimate = await navigator.storage.estimate();
        const info = {
          used: estimate.usage || 0,
          available: estimate.quota || 0,
          usedMB: Math.round((estimate.usage || 0) / 1024 / 1024),
          availableMB: Math.round((estimate.quota || 0) / 1024 / 1024),
          percentage: estimate.quota ? (estimate.usage || 0) / estimate.quota : 0,
          percentageText: Math.round(
            (estimate.quota ? (estimate.usage || 0) / estimate.quota : 0) * 100
          ) + "%",
        };
        // console.log("📊 Storage Info:", info);
        return info;
      } catch (error) {
        console.error("Error getting storage estimate:", error);
        return null;
      }
    }
    console.warn("Storage API or estimate not available.");
    return null;
  },

  async clearCache(reloadPage = true) { // Added optional parameter
    if (!isCacheAPISupported()) {
        console.warn("Cache API not supported. Cannot clear cache.");
        return false;
    }
    try {
      const cacheNames = await caches.keys();
      await Promise.all(cacheNames.map((name) => caches.delete(name)));
      // console.log("🗑️ All caches cleared");
      if (reloadPage) {
        location.reload();
      }
      return true;
    } catch (error) {
      console.error("Error clearing cache:", error);
      return false;
    }
  },

  async logStorageUsage() {
    const info = await this.getStorageInfo();
    if (info) {
      // console.log(
      //   `💾 Cache Usage: ${info.usedMB}MB / ${info.availableMB}MB (${info.percentageText})`
      // );
    }
  },

  async listCachedFiles() {
    if (!isCacheAPISupported()) {
        console.warn("Cache API not supported. Cannot list cached files.");
        return;
    }
    try {
        const cacheNames = await caches.keys();
        // console.log(`Found ${cacheNames.length} cache(s):`);
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
        //   console.log(`📁 Cache: ${cacheName} (${requests.length} files)`);
        //   requests.forEach((req) => console.log(`  - ${req.url}`));
        }
    } catch (error) {
        console.error("Error listing cached files:", error);
    }
  },
};
