import react from '@vitejs/plugin-react'
import { PluginOption, defineConfig } from 'vite'

function publicReload(): PluginOption {
  return {
    name: 'public-reload',
    handleHotUpdate({ file, server }) {
      if (file.includes('/public/')) {
        server.ws.send({ type: 'full-reload' })
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), publicReload()],
  server: { port: 4000, proxy: { '/api': 'http://localhost:3000' } },
})
