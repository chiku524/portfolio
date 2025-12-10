#!/usr/bin/env node
import sharp from 'sharp'
import { existsSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const ROOT_DIR = resolve(__dirname, '..')

// Input logo path - check for the new logo file
const INPUT_LOGO = process.argv[2] || join(ROOT_DIR, 'brand-kit', 'logos', 'nico.builds logo.jpg')
const BRAND_KIT_OUTPUT = join(ROOT_DIR, 'brand-kit', 'logos', 'logo-primary.png')
const ASSETS_OUTPUT = join(ROOT_DIR, 'src', 'assets', 'generated-image.png')

if (!existsSync(INPUT_LOGO)) {
  console.error(`Error: Logo file not found at ${INPUT_LOGO}`)
  console.error(`Please provide the path to your logo file:`)
  console.error(`  node scripts/processLogo.mjs <path-to-logo>`)
  process.exit(1)
}

// Advanced background removal for white backgrounds
async function removeWhiteBackground(inputPath) {
  const image = sharp(inputPath)
  const { data, info } = await image
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  
  const width = info.width
  const height = info.height
  
  // More aggressive background removal
  // Calculate "whiteness" as distance from pure white (255, 255, 255)
  // This handles off-white, cream, and vignette effects better
  const whiteThreshold = 220 // Minimum RGB value to consider as "white" (lowered for vignettes)
  const maxDistance = 60 // Maximum distance from pure white to remove (increased for vignettes)
  const edgeThreshold = 0.15 // Percentage from edge to apply more aggressive removal
  
  // Calculate edge boundaries
  const edgeX = Math.floor(width * edgeThreshold)
  const edgeY = Math.floor(height * edgeThreshold)
  const edgeXEnd = width - edgeX
  const edgeYEnd = height - edgeY
  
  // First pass: identify background pixels
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      
      // Check if pixel is in edge/corner area (where vignettes typically are)
      const isInEdge = x < edgeX || x > edgeXEnd || y < edgeY || y > edgeYEnd
      
      // Calculate distance from pure white
      const distanceFromWhite = Math.sqrt(
        Math.pow(255 - r, 2) + 
        Math.pow(255 - g, 2) + 
        Math.pow(255 - b, 2)
      )
      
      // More aggressive thresholds for edge areas (vignettes)
      const localWhiteThreshold = isInEdge ? whiteThreshold - 15 : whiteThreshold
      const localMaxDistance = isInEdge ? maxDistance + 20 : maxDistance
      
      // Check if pixel is light enough and close enough to white
      const isLight = r > localWhiteThreshold && g > localWhiteThreshold && b > localWhiteThreshold
      const isNearWhite = distanceFromWhite < localMaxDistance
      
      // Also check for very light grays (vignette handling)
      // Vignettes often have slight color variations but are still very light
      const colorVariance = Math.max(
        Math.abs(r - g),
        Math.abs(g - b),
        Math.abs(r - b)
      )
      const avgBrightness = (r + g + b) / 3
      const isLightGray = colorVariance < 20 && 
                          avgBrightness > localWhiteThreshold - 25 &&
                          distanceFromWhite < localMaxDistance
      
      // If pixel is white/light enough, make it fully transparent
      if ((isLight && isNearWhite) || isLightGray) {
        data[i + 3] = 0 // Fully transparent
      }
    }
  }
  
  // Second pass: clean up any remaining light pixels that are isolated (likely background)
  // This helps catch any missed background pixels
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = (y * width + x) * 4
      
      // Skip if already transparent
      if (data[i + 3] === 0) continue
      
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]
      const avgBrightness = (r + g + b) / 3
      
      // Check surrounding pixels - if most are transparent and this is very light, remove it
      let transparentNeighbors = 0
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          if (dx === 0 && dy === 0) continue
          const ni = ((y + dy) * width + (x + dx)) * 4
          if (data[ni + 3] === 0) transparentNeighbors++
        }
      }
      
      // If surrounded by transparent pixels and this pixel is very light, remove it
      if (transparentNeighbors >= 6 && avgBrightness > 200) {
        data[i + 3] = 0
      }
    }
  }
  
  return sharp(data, {
    raw: {
      width: info.width,
      height: info.height,
      channels: 4
    }
  })
}

async function processLogo() {
  try {
    console.log(`\n▶ Processing logo from: ${INPUT_LOGO}`)
    
    // Read the image metadata
    const metadata = await sharp(INPUT_LOGO).metadata()
    console.log(`  Original size: ${metadata.width}x${metadata.height}, format: ${metadata.format}`)
    
    // Process the logo with transparent background
    let processedImage
    
    // If it's a JPG or has a white background, remove it
    if (metadata.format === 'jpeg' || metadata.format === 'jpg') {
      console.log(`  Removing white background...`)
      processedImage = await removeWhiteBackground(INPUT_LOGO)
    } else {
      // For PNG, ensure alpha channel exists
      processedImage = sharp(INPUT_LOGO).ensureAlpha()
    }
    
    // Process for brand-kit (high quality, full size)
    console.log(`  Creating brand-kit version...`)
    await processedImage
      .clone()
      .png({
        quality: 100,
        compressionLevel: 9,
        adaptiveFiltering: true
      })
      .resize(metadata.width, metadata.height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .toFile(BRAND_KIT_OUTPUT)
    console.log(`  ✓ Created brand-kit logo: ${BRAND_KIT_OUTPUT}`)
    
    // Process for app assets (optimized, reasonable size - max 512px)
    console.log(`  Creating app version...`)
    const appImage = processedImage
      .clone()
      .png({
        quality: 90,
        compressionLevel: 9,
        adaptiveFiltering: true
      })
      .resize(512, 512, {
        fit: 'inside',
        withoutEnlargement: true,
        background: { r: 0, g: 0, b: 0, alpha: 0 }
      })
    
    await appImage.toFile(ASSETS_OUTPUT)
    console.log(`  ✓ Created app logo: ${ASSETS_OUTPUT}`)
    
    // Get final metadata
    const finalMetadata = await sharp(ASSETS_OUTPUT).metadata()
    console.log(`  Final app logo size: ${finalMetadata.width}x${finalMetadata.height}`)
    
    console.log(`\n✔ Logo processing complete!`)
    console.log(`  The logo is now ready to use in your app.`)
    
  } catch (error) {
    console.error('\n✗ Error processing logo:', error.message)
    if (error.message.includes('Input file is missing')) {
      console.error(`  Make sure the logo file exists at: ${INPUT_LOGO}`)
    }
    console.error(error.stack)
    process.exit(1)
  }
}

processLogo()

