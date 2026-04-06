import { Readable } from 'node:stream'
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { filename } = req.query

  if (!filename || typeof filename !== 'string') {
    return res.status(400).json({ error: 'Filename is required' })
  }

  const r2Url = `https://pub-6f5ba7aac9c745d3ac681827814ac01a.r2.dev/musics/${encodeURIComponent(filename)}`

  try {
    const upstreamHeaders: HeadersInit = {}
    if (req.headers.range) {
      upstreamHeaders['Range'] = req.headers.range
    }

    const response = await fetch(r2Url, { headers: upstreamHeaders })
    if (!response.ok && response.status !== 206) {
      throw new Error(`Failed to fetch audio: ${response.statusText}`)
    }

    // Set headers
    res.setHeader(
      'Access-Control-Allow-Origin',
      'https://prome-game.netlify.app'
    )
    res.setHeader('Content-Type', 'audio/mpeg')
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')

    if (response.status === 206) {
      const contentRange = response.headers.get('Content-Range')
      const contentLength = response.headers.get('Content-Length')
      if (contentRange) res.setHeader('Content-Range', contentRange)
      if (contentLength) res.setHeader('Content-Length', contentLength)
      res.status(206)
    }

    // Convert the response body to a Node.js stream
    const readableStream = Readable.fromWeb(response.body as any)

    // Pipe the stream to the response
    readableStream.pipe(res)
  } catch (error) {
    console.error('Proxy error:', error)
    res.status(500).json({ error: 'Failed to proxy audio' })
  }
}
