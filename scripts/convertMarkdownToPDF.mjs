import { mdToPdf } from 'md-to-pdf';
import { readdir, stat } from 'fs/promises';
import { join, dirname, extname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function findMarkdownFiles(dir, fileList = []) {
  const files = await readdir(dir);
  
  for (const file of files) {
    const filePath = join(dir, file);
    const fileStat = await stat(filePath);
    
    if (fileStat.isDirectory()) {
      await findMarkdownFiles(filePath, fileList);
    } else if (extname(file) === '.md') {
      fileList.push(filePath);
    }
  }
  
  return fileList;
}

async function convertToPDF(mdFile) {
  try {
    const pdfPath = mdFile.replace(/\.md$/, '.pdf');
    console.log(`Converting: ${mdFile} -> ${pdfPath}`);
    
    // Create a temporary CSS file for styles
    const fs = await import('fs/promises');
    const cssPath = join(__dirname, 'temp-styles.css');
    const cssContent = `
      @import url('https://fonts.googleapis.com/css2?family=Comfortaa:wght@300;400;500;600;700&display=swap');
      
      body {
        font-family: 'Comfortaa', sans-serif;
        line-height: 1.6;
        color: #333;
        max-width: 800px;
        margin: 0 auto;
        padding: 20px;
      }
      h1, h2, h3, h4, h5, h6 {
        font-family: 'Comfortaa', sans-serif;
        color: #12f6ff;
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        font-weight: 700;
      }
      h1 {
        font-size: 2em;
        border-bottom: 2px solid #12f6ff;
        padding-bottom: 0.3em;
      }
      h2 {
        font-size: 1.5em;
      }
      h3 {
        font-size: 1.25em;
      }
      code {
        background: #f4f4f4;
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
      }
      pre {
        background: #f4f4f4;
        padding: 1em;
        border-radius: 5px;
        overflow-x: auto;
        border-left: 4px solid #12f6ff;
      }
      pre code {
        background: transparent;
        padding: 0;
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 1em 0;
      }
      th, td {
        border: 1px solid #ddd;
        padding: 8px;
        text-align: left;
      }
      th {
        background-color: #11172b;
        color: #f4f8ff;
        font-weight: 600;
      }
      tr:nth-child(even) {
        background-color: #f9f9f9;
      }
      a {
        color: #12f6ff;
        text-decoration: none;
      }
      a:hover {
        color: #ff906f;
        text-decoration: underline;
      }
      blockquote {
        border-left: 4px solid #12f6ff;
        padding-left: 1em;
        margin-left: 0;
        color: #666;
        font-style: italic;
      }
      ul, ol {
        margin: 1em 0;
        padding-left: 2em;
      }
      li {
        margin: 0.5em 0;
      }
    `;
    
    await fs.writeFile(cssPath, cssContent);
    
    const pdf = await mdToPdf(
      { path: mdFile },
      {
        pdf_options: {
          format: 'A4',
          margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm',
          },
        },
        stylesheet: cssPath,
      }
    );
    
    // Clean up temp CSS file
    await fs.unlink(cssPath).catch(() => {});
    
    if (pdf) {
      await fs.writeFile(pdfPath, pdf.content);
      console.log(`✓ Created: ${pdfPath}`);
    } else {
      console.log(`✗ Failed to convert: ${mdFile}`);
    }
  } catch (error) {
    console.error(`Error converting ${mdFile}:`, error.message);
  }
}

async function main() {
  const brandKitDir = join(__dirname, '..', 'brand-kit');
  const mdFiles = await findMarkdownFiles(brandKitDir);
  
  console.log(`Found ${mdFiles.length} markdown files to convert:\n`);
  
  for (const mdFile of mdFiles) {
    await convertToPDF(mdFile);
  }
  
  console.log(`\n✓ Conversion complete! Converted ${mdFiles.length} files.`);
}

main().catch(console.error);

