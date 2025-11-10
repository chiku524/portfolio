#!/usr/bin/env node
import { readdir, stat, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { join, parse, resolve } from 'node:path'
import { spawn } from 'node:child_process'

const INPUT_DIR = resolve(process.argv[2] ?? 'src/assets')
const OUTPUT_DIR = resolve(process.argv[3] ?? 'public/media')
const THUMB_DIR = join(OUTPUT_DIR, 'thumbnails')
const MP4_DIR = join(OUTPUT_DIR, 'mp4')
const WEBM_DIR = join(OUTPUT_DIR, 'webm')
const GIF_DIR = join(OUTPUT_DIR, 'gifs')
const LOOP_DURATION = Number(process.env.CLIP_SECONDS ?? 4)
const GIF_FPS = Number(process.env.GIF_FPS ?? 20)

async function ensureFfmpegAvailable() {
  try {
    await runCommand('ffmpeg', ['-version'], { log: false })
  } catch (error) {
    throw new Error(
      'ffmpeg is required but was not found in your PATH. Install it from https://ffmpeg.org/download.html and retry.',
      { cause: error },
    )
  }
}

async function runCommand(command, args, { log = true } = {}) {
  return new Promise((resolvePromise, rejectPromise) => {
    const child = spawn(command, args, { stdio: log ? 'inherit' : 'ignore' })
    child.on('error', rejectPromise)
    child.on('exit', (code) => {
      if (code === 0) {
        resolvePromise()
      } else {
        rejectPromise(new Error(`${command} exited with code ${code}`))
      }
    })
  })
}

async function ensureDirs() {
  await Promise.all([THUMB_DIR, MP4_DIR, WEBM_DIR, GIF_DIR].map((dir) => mkdir(dir, { recursive: true })))
}

function buildOutputs(filePath) {
  const { name } = parse(filePath)
  return {
    thumb: join(THUMB_DIR, `${name}.jpg`),
    mp4: join(MP4_DIR, `${name}-1080p.mp4`),
    webm: join(WEBM_DIR, `${name}-1080p.webm`),
    gif: join(GIF_DIR, `${name}-preview.gif`),
  }
}

async function processFile(filePath) {
  const { thumb, mp4, webm, gif } = buildOutputs(filePath)

  console.log(`\n▶ Processing ${filePath}`)

  await runCommand('ffmpeg', [
    '-y',
    '-i',
    filePath,
    '-frames:v',
    '1',
    '-q:v',
    '2',
    '-vf',
    "scale='min(1920,iw)':-2",
    '-update',
    '1',
    thumb,
  ])

  await runCommand('ffmpeg', [
    '-y',
    '-i',
    filePath,
    '-vf',
    "scale='min(1920,iw)':-2",
    '-c:v',
    'libx264',
    '-preset',
    process.env.H264_PRESET ?? 'medium',
    '-crf',
    process.env.H264_CRF ?? '22',
    '-pix_fmt',
    'yuv420p',
    '-c:a',
    'aac',
    '-movflags',
    '+faststart',
    mp4,
  ])

  await runCommand('ffmpeg', [
    '-y',
    '-i',
    filePath,
    '-vf',
    "scale='min(1920,iw)':-2",
    '-c:v',
    'libvpx-vp9',
    '-b:v',
    '0',
    '-crf',
    process.env.VP9_CRF ?? '32',
    '-deadline',
    'good',
    '-pix_fmt',
    'yuv420p',
    '-an',
    webm,
  ])

  await runCommand('ffmpeg', [
    '-y',
    '-i',
    filePath,
    '-vf',
    `fps=${GIF_FPS},scale=720:-1:flags=lanczos`,
    '-t',
    String(LOOP_DURATION),
    '-loop',
    '0',
    gif,
  ])

  console.log('✔ Completed conversions')
}

async function main() {
  await ensureFfmpegAvailable()
  await ensureDirs()

  const entries = await readdir(INPUT_DIR)
  const videos = []

  for (const entry of entries) {
    const filePath = join(INPUT_DIR, entry)
    const info = await stat(filePath)
    if (info.isFile() && entry.toLowerCase().endsWith('.mp4')) {
      videos.push(filePath)
    }
  }

  if (!videos.length) {
    console.log(`No .mp4 files found in ${INPUT_DIR}`)
    return
  }

  for (const video of videos) {
    await processFile(video)
  }

  console.log('\nAll done! Thumbnails, MP4, WebM, and GIF loops are available in:', OUTPUT_DIR)
}

main().catch((error) => {
  console.error('\nMedia processing failed:', error.message)
  if (error.cause) {
    console.error('↳', error.cause.message)
  }
  process.exitCode = 1
})
