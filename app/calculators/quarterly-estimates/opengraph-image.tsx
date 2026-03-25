import { ImageResponse } from 'next/og'
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'

export const alt = 'Quarterly tax calculator for W-2 employees with an LLC'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function Image() {
  const fontData = await readFile(join(process.cwd(), 'assets/JetBrainsMono-Bold.ttf'))

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#111',
        padding: '40px',
        fontFamily: 'JetBrains Mono',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#faf9f6',
          color: '#1a1a1a',
          borderRadius: '8px',
          padding: '48px 56px',
          width: '1000px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        }}
      >
        <div
          style={{
            fontSize: 16,
            letterSpacing: '4px',
            color: '#888',
            marginBottom: '24px',
          }}
        >
          QUARTERLY ESTIMATES
        </div>
        <div
          style={{
            fontSize: 44,
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '8px',
          }}
        >
          How Much Should You
        </div>
        <div
          style={{
            fontSize: 44,
            textAlign: 'center',
            color: '#15803d',
            lineHeight: 1.2,
            marginBottom: '32px',
          }}
        >
          Set Aside Each Quarter?
        </div>
        <div
          style={{
            fontSize: 18,
            color: '#888',
            borderTop: '2px dashed #ccc',
            paddingTop: '20px',
            width: '100%',
            textAlign: 'center',
          }}
        >
          For W-2 + LLC Owners · Free · No signup
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        {
          name: 'JetBrains Mono',
          data: fontData,
          style: 'normal' as const,
          weight: 700,
        },
      ],
    },
  )
}
