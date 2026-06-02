import { ImageResponse } from 'next/og'

export const runtime = 'edge'

async function loadGoogleFont(font: string, weight: number) {
  const css = await (
    await fetch(
      `https://fonts.googleapis.com/css2?family=${font}:wght@${weight}&display=swap`,
      { headers: { 'User-Agent': 'Mozilla/5.0' } }
    )
  ).text()
  const match = css.match(/src:\s*url\((.+?)\)\s*format\(['"](?:truetype|opentype)['"]\)/)
  if (!match) throw new Error(`Font ${font} not found`)
  return (await fetch(match[1])).arrayBuffer()
}

export async function GET() {
  try {
    const bebasNeue = await loadGoogleFont('Bebas+Neue', 400)
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#0a0a0a',
            fontFamily: 'Bebas Neue',
            position: 'relative',
          }}
        >
          <div
            style={{
              fontSize: 140,
              letterSpacing: '10px',
              color: '#ff6b35',
              lineHeight: 1,
            }}
          >
            RALLYVERSE
          </div>
          <div
            style={{
              fontSize: 36,
              letterSpacing: '6px',
              color: '#888',
              marginTop: 16,
            }}
          >
            Rally Beyond Routine
          </div>
          <div
            style={{
              width: 80,
              height: 3,
              background: '#ff6b35',
              marginTop: 32,
              marginBottom: 32,
            }}
          />
          <div
            style={{
              fontSize: 22,
              letterSpacing: '4px',
              color: '#555',
            }}
          >
            BENGALURU, INDIA
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        fonts: [
          {
            name: 'Bebas Neue',
            data: bebasNeue,
            weight: 400,
            style: 'normal',
          },
        ],
      }
    )
  } catch {
    return new ImageResponse(
      (
        <div
          style={{
            width: 1200,
            height: 630,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            background: '#0a0a0a',
            fontFamily: 'sans-serif',
          }}
        >
          <div style={{ color: '#ff6b35', fontSize: 80, letterSpacing: '6px' }}>
            RALLYVERSE
          </div>
          <div style={{ color: '#888', fontSize: 28, letterSpacing: '4px', marginTop: 12 }}>
            Rally Beyond Routine
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  }
}
