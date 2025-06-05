import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  // Multi-page application configuration
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        home: resolve(__dirname, 'src/features/HomePage/index.html'),
        videos: resolve(__dirname, 'src/features/VideoGalleryPage/page-videos.html'),
        profile: resolve(__dirname, 'src/features/ProfilePage/page-profile-finley.html'),
        vergleich: resolve(__dirname, 'src/features/ComparisonPage/page-Vergleich.html'),
      },
    },
  },

  // Development server configuration
  server: {
    open: {
      target: 'chrome',
      app: {
        name: 'chrome',
        arguments: ['--auto-open-devtools-for-tabs']
      }
    }
  },

  // Resolve configuration for better module resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@components': resolve(__dirname, 'src/components'),
      '@features': resolve(__dirname, 'src/features'),
      '@services': resolve(__dirname, 'src/services'),
      '@plugins': resolve(__dirname, 'src/plugins'),
    }
  },

  // CSS configuration
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/assets/styles/_variables.scss";`,
        // Enable modern CSS features
        api: 'modern-compiler'
      }
    }
  },

  // Optimize dependencies
  optimizeDeps: {
    // include: ['@supabase/supabase-js'] // Uncomment when Supabase is installed
  }
})
