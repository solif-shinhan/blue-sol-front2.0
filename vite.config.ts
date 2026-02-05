import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@api': path.resolve(__dirname, './src/api'),
      '@types': path.resolve(__dirname, './src/types'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@features': path.resolve(__dirname, './src/features'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'https://api.bluesol.site',
        changeOrigin: true,
        secure: true,
      },
    },
    // HMR 최적화
    hmr: {
      overlay: true,
    },
    watch: {
      usePolling: false,
      ignored: [
        '**/node_modules/**',
        '**/dist/**',
        '**/.git/**',
        '**/tsconfig.tsbuildinfo',
        '**/*.tsbuildinfo',
      ],
    },
  },
  // 의존성 사전 번들링
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    exclude: [],
  },
  // CSS 최적화
  css: {
    devSourcemap: false,
  },
  // 빌드 최적화
  build: {
    sourcemap: false,
    cssCodeSplit: true,
    // 청크 크기 경고 제한 증가 (이미지가 많아서)
    chunkSizeWarningLimit: 1000,
    // 롤업 옵션 최적화
    rollupOptions: {
      output: {
        // 청크를 더 세밀하게 분리
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
        },
        // 청크 파일명 최적화
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
  },
  // 캐시 활성화
  cacheDir: 'node_modules/.vite',
})
