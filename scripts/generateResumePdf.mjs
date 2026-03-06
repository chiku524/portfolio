import { mdToPdf } from 'md-to-pdf'
import { writeFile } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const resumeDir = join(__dirname, '..', 'resume')
const resumeMd = join(resumeDir, 'resume.md')
const resumeCss = join(resumeDir, 'resume-pdf.css')
const outPdf = join(resumeDir, 'Nico-Chikuji-Resume.pdf')

async function main() {
  console.log('Generating resume PDF...')
  console.log('  Input:', resumeMd)
  console.log('  Output:', outPdf)

  const pdf = await mdToPdf(
    { path: resumeMd },
    {
      pdf_options: {
        format: 'A4',
        margin: {
          top: '18mm',
          right: '18mm',
          bottom: '18mm',
          left: '18mm',
        },
        printBackground: true,
      },
      stylesheet: resumeCss,
    }
  )

  if (pdf && pdf.content) {
    await writeFile(outPdf, pdf.content)
    console.log('✓ Resume PDF saved:', outPdf)
  } else {
    console.error('✗ PDF generation failed')
    process.exit(1)
  }
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
