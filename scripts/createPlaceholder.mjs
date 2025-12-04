import sharp from 'sharp'
import { writeFileSync } from 'fs'

// Create a simple placeholder image (1024x1024) with a gradient background
const width = 1024
const height = 1024

const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f172a;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#1e293b;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#0f172a;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${width}" height="${height}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="48" fill="#12f6ff" text-anchor="middle" dominant-baseline="middle" opacity="0.5">
    Profile Picture
  </text>
</svg>
`

const outputPath = 'src/assets/blockchain-circus/profile-1024x1024.png'

try {
  await sharp(Buffer.from(svg))
    .resize(width, height)
    .png()
    .toFile(outputPath)
  
  console.log(`✓ Created placeholder image at ${outputPath}`)
  console.log('Replace this with your actual pug profile picture!')
} catch (error) {
  console.error('Error creating placeholder:', error.message)
  process.exit(1)
}

