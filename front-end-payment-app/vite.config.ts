import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.ts',
    coverage: {
      exclude: [
        'src/App.tsx',
        'src/main.tsx',
        'src/invoices/InvoicesPage.tsx',
        'src/invoices/components/**',
      ],
    },
  },
})