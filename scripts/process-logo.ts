import sharp from 'sharp';
import path from 'path';

const inputPath = path.join(process.cwd(), 'apps/sure/metadata/original_logo.png');
const outputPath = path.join(process.cwd(), 'apps/sure/metadata/logo.jpg');

async function processLogo() {
  try {
    await sharp(inputPath)
      .resize(Math.round(512 * 0.7), Math.round(512 * 0.7), {
        fit: 'contain',
        background: { r: 26, g: 26, b: 26, alpha: 0 } 
      })
      .extend({
        top: Math.round(512 * 0.15),
        bottom: Math.round(512 * 0.15),
        left: Math.round(512 * 0.15),
        right: Math.round(512 * 0.15),
        background: { r: 26, g: 26, b: 26, alpha: 1 }
      })
      .flatten({ background: { r: 26, g: 26, b: 26 } }) // In case of transparency
      .toFormat('jpeg', { quality: 90 })
      .toFile(outputPath);
    
    console.log('Logo processed successfully to:', outputPath);
  } catch (error) {
    console.error('Error processing logo:', error);
    process.exit(1);
  }
}

processLogo();
