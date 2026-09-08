/// <reference types="node" />
import { renderToPipeableStream } from 'react-dom/server'
import { Writable } from 'node:stream'
import { StaticRouter } from 'react-router'
import { HelmetProvider, type HelmetServerState } from 'react-helmet-async'
import App from './App'

export interface RenderResult {
  html: string
  head: { title: string; meta: string; link: string; script: string }
}

export function render(url: string): Promise<RenderResult> {
  const helmetContext: { helmet?: HelmetServerState } = {}
  const app = (
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>
  )

  return new Promise((resolve, reject) => {
    let html = ''
    const output = new Writable({
      write(chunk: Uint8Array | string, _encoding: NodeJS.BufferEncoding, callback: (error?: Error | null) => void) {
        html += chunk.toString()
        callback()
      },
    })

    output.on('finish', () => {
      const helmet = helmetContext.helmet
      resolve({
        html,
        head: {
          title: helmet?.title.toString() ?? '',
          meta: helmet?.meta.toString() ?? '',
          link: helmet?.link.toString() ?? '',
          script: helmet?.script.toString() ?? '',
        },
      })
    })
    output.on('error', reject)

    const { pipe } = renderToPipeableStream(app, {
      onAllReady() {
        pipe(output)
      },
      onShellError: reject,
      onError(error) {
        console.error('Prerender stream error', error)
      },
    })
  })
}
