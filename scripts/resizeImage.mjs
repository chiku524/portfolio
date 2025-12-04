import sharp from 'sharp'
import { readFileSync, writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Get input and output paths from command line args
const inputPath = process.argv[2]
const outputPath = process.argv[3] || inputPath.replace(/(\.[^.]+)$/, '-1024x1024$1')

if (!inputPath) {
  console.error('Usage: node scripts/resizeImage.mjs <input-image> [output-image]')
  process.exit(1)
}

try {
  console.log(`Resizing ${inputPath} to 1024x1024...`)
  
  await sharp(inputPath)
    .resize(1024, 1024, {
      fit: 'contain',
      background: { r: 255, g: 255, b: 255, alpha: 1 }
    })
    .toFile(outputPath)
  
  console.log(`✓ Successfully created ${outputPath} (1024x1024)`)
} catch (error) {
  console.error('Error resizing image:', error.message)
  process.exit(1)
}

