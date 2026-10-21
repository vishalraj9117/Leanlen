/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BoundingBox } from '../types';

export type RedactionStyle = 'solid_black' | 'pixelate' | 'whiteout';

export interface RedactionRegion {
  id: string;
  bbox: BoundingBox; // 0 to 1000 normalized coordinates
  label?: string;
  style: RedactionStyle;
}

/**
 * Irreversibly applies redactions to an image using an offscreen HTML Canvas.
 * Directly alters pixel values in the canvas buffer and returns a clean,
 * metadata-stripped PNG data URL.
 */
export async function applyIrreversibleRedaction(
  imageSource: string,
  regions: RedactionRegion[]
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.naturalWidth || img.width;
      canvas.height = img.naturalHeight || img.height;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });

      if (!ctx) {
        reject(new Error('Failed to get 2D canvas context'));
        return;
      }

      // Draw original image into the canvas
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Apply each redaction region irreversibly
      for (const region of regions) {
        const { bbox, style, label } = region;

        // Convert normalized coordinates (0-1000) to actual canvas pixel coordinates
        const x = Math.max(0, Math.floor((bbox.xmin / 1000) * canvas.width));
        const y = Math.max(0, Math.floor((bbox.ymin / 1000) * canvas.height));
        const width = Math.min(canvas.width - x, Math.ceil(((bbox.xmax - bbox.xmin) / 1000) * canvas.width));
        const height = Math.min(canvas.height - y, Math.ceil(((bbox.ymax - bbox.ymin) / 1000) * canvas.height));

        if (width <= 0 || height <= 0) continue;

        if (style === 'solid_black') {
          // Irreversible black fill
          ctx.fillStyle = '#050811';
          ctx.fillRect(x, y, width, height);

          // Subtle security hatched border to signal deliberate redaction
          ctx.strokeStyle = '#334155';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, width, height);

          // Optional label stamp if room permits
          if (height >= 18 && width >= 50) {
            ctx.fillStyle = '#94a3b8';
            ctx.font = 'bold 10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(label ? `[REDACTED: ${label.toUpperCase()}]` : '[REDACTED]', x + width / 2, y + height / 2, width - 4);
          }
        } else if (style === 'pixelate') {
          // True mosaic pixel averaging: destroys underlying high-frequency text information
          const blockSize = Math.max(8, Math.floor(Math.min(width, height) / 4));
          const imgData = ctx.getImageData(x, y, width, height);
          const data = imgData.data;

          for (let by = 0; by < height; by += blockSize) {
            for (let bx = 0; bx < width; bx += blockSize) {
              const currentBlockW = Math.min(blockSize, width - bx);
              const currentBlockH = Math.min(blockSize, height - by);

              let totalR = 0, totalG = 0, totalB = 0, count = 0;

              // Calculate average color for the block
              for (let py = 0; py < currentBlockH; py++) {
                for (let px = 0; px < currentBlockW; px++) {
                  const pixelIndex = ((by + py) * width + (bx + px)) * 4;
                  totalR += data[pixelIndex];
                  totalG += data[pixelIndex + 1];
                  totalB += data[pixelIndex + 2];
                  count++;
                }
              }

              const avgR = Math.round(totalR / count);
              const avgG = Math.round(totalG / count);
              const avgB = Math.round(totalB / count);

              // Overwrite all pixels in the block with the average color
              for (let py = 0; py < currentBlockH; py++) {
                for (let px = 0; px < currentBlockW; px++) {
                  const pixelIndex = ((by + py) * width + (bx + px)) * 4;
                  data[pixelIndex] = avgR;
                  data[pixelIndex + 1] = avgG;
                  data[pixelIndex + 2] = avgB;
                  data[pixelIndex + 3] = 255;
                }
              }
            }
          }

          ctx.putImageData(imgData, x, y);
          ctx.strokeStyle = '#475569';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, width, height);
        } else if (style === 'whiteout') {
          // Solid light gray fill
          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(x, y, width, height);
          ctx.strokeStyle = '#cbd5e1';
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, width, height);

          if (height >= 16 && width >= 40) {
            ctx.fillStyle = '#64748b';
            ctx.font = '10px monospace';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText('[REDACTED]', x + width / 2, y + height / 2, width - 4);
          }
        }
      }

      // Exporting as PNG from canvas automatically strips EXIF, GPS, camera metadata
      const redactedUrl = canvas.toDataURL('image/png');
      resolve(redactedUrl);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for irreversible redaction'));
    };

    img.src = imageSource;
  });
}

/**
 * Triggers a secure browser download for the redacted file.
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
