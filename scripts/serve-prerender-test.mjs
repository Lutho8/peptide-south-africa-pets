// Local-only regression server: serve the exact clean-URL prerendered document.
import { createServer } from 'node:http'
import { readFile, stat } from 'node:fs/promises'
import { resolve, sep, extname } from 'node:path'

const root = resolve('dist')
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' }
createServer(async (request, response) => {
  try {
    let path = resolve(root, '.' + decodeURIComponent(new URL(request.url, 'http://localhost').pathname))
    if (path !== root && !path.startsWith(root + sep)) {
      response.writeHead(403).end()
      return
    }
    const info = await stat(path).catch(() => null)
    if (info?.isDirectory()) path = resolve(path, 'index.html')
    else if (!info) {
      if (extname(path)) { response.writeHead(404).end(); return }
      path = resolve(root, 'index.html')
    }
    const data = await readFile(path)
    response.writeHead(200, { 'Content-Type': types[extname(path)] ?? 'application/octet-stream' })
    response.end(data)
  } catch {
    response.writeHead(404).end()
  }
}).listen(3000, '127.0.0.1')
