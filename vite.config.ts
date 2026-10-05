import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, type Plugin } from 'vite'
import handler from './api/enquiry.ts'

function apiDevPlugin(): Plugin {
  return {
    name: 'api-dev-middleware',
    configureServer(server) {
      server.middlewares.use('/api/enquiry', async (req, res) => {
        let rawBody = ''
        for await (const chunk of req) {
          rawBody += chunk
        }
        try {
          ;(req as any).body = rawBody ? JSON.parse(rawBody) : {}
        } catch {
          ;(req as any).body = {}
        }
        ;(res as any).status = (code: number) => {
          res.statusCode = code
          return res
        }
        ;(res as any).json = (data: any) => {
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(data))
          return res
        }
        try {
          await handler(req as any, res as any)
        } catch (err: any) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ ok: false, error: err?.message || 'Server error' }))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss(), apiDevPlugin()],
})
