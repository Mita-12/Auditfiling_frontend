import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'https://api.auditfiling.com',
        changeOrigin: true,
        secure: true,
      },
       alias: {
      "@emotion/is-prop-valid": "@emotion/is-prop-valid",
      "@emotion/react": "@emotion/react",
      "@emotion/styled": "@emotion/styled",
    },
    },
  },
})
