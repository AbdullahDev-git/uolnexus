import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api/faculty-image': {
        target: 'https://faculty.uol.edu.pk',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/faculty-image/, '/Images/FacultyProfile'),
      },
    },
  },
})
