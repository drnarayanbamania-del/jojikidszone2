export interface ImageOptimizationResult {
  dataUrl: string;
  blob: Blob;
  thumbnailDataUrl: string;
  thumbnailBlob: Blob;
  originalSize: number;
  compressedSize: number;
  savingsPercent: number;
  width: number;
  height: number;
  mimeType: string;
  fileName: string;
}

export interface OptimizationOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  thumbSize?: number;
}

/**
 * Optimizes an uploaded image file by automatically resizing to target bounds,
 * converting to modern WebP format with quality compression, and producing a fast thumbnail.
 */
export async function optimizeAndCompressImage(
  file: File,
  options: OptimizationOptions = {}
): Promise<ImageOptimizationResult> {
  const {
    maxWidth = 1200,
    maxHeight = 1200,
    quality = 0.82,
    thumbSize = 200,
  } = options;

  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      return reject(new Error('Selected file is not an image. Please choose a JPG, PNG, or WebP photo.'));
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed reading image file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed loading image data.'));
      img.onload = () => {
        try {
          // 1. Calculate resized dimensions preserving aspect ratio
          let { width, height } = img;
          if (width > maxWidth || height > maxHeight) {
            const widthRatio = maxWidth / width;
            const heightRatio = maxHeight / height;
            const ratio = Math.min(widthRatio, heightRatio);
            width = Math.round(width * ratio);
            height = Math.round(height * ratio);
          }

          // 2. Render optimized image onto canvas
          const mainCanvas = document.createElement('canvas');
          mainCanvas.width = width;
          mainCanvas.height = height;
          const mainCtx = mainCanvas.getContext('2d');
          if (!mainCtx) {
            return reject(new Error('Could not initialize canvas context.'));
          }

          mainCtx.imageSmoothingEnabled = true;
          mainCtx.imageSmoothingQuality = 'high';
          mainCtx.drawImage(img, 0, 0, width, height);

          // Check if browser supports WebP canvas export
          let outputMimeType = 'image/webp';
          let dataUrl = mainCanvas.toDataURL('image/webp', quality);
          if (!dataUrl.startsWith('data:image/webp')) {
            // Fallback to JPEG if WebP export is not supported by environment
            outputMimeType = 'image/jpeg';
            dataUrl = mainCanvas.toDataURL('image/jpeg', quality);
          }

          // 3. Render miniature thumbnail (e.g., 200x200 center crop or scaled)
          const thumbCanvas = document.createElement('canvas');
          let thumbWidth = width;
          let thumbHeight = height;
          const thumbRatio = Math.min(thumbSize / width, thumbSize / height);
          thumbWidth = Math.round(width * thumbRatio);
          thumbHeight = Math.round(height * thumbRatio);

          thumbCanvas.width = thumbWidth;
          thumbCanvas.height = thumbHeight;
          const thumbCtx = thumbCanvas.getContext('2d');
          if (thumbCtx) {
            thumbCtx.imageSmoothingEnabled = true;
            thumbCtx.imageSmoothingQuality = 'high';
            thumbCtx.drawImage(img, 0, 0, thumbWidth, thumbHeight);
          }
          const thumbnailDataUrl = thumbCanvas.toDataURL(outputMimeType, 0.75);

          // Convert DataURLs to Blobs to calculate exact compressed byte size
          const byteString = atob(dataUrl.split(',')[1]);
          const ab = new ArrayBuffer(byteString.length);
          const ia = new Uint8Array(ab);
          for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
          }
          const blob = new Blob([ab], { type: outputMimeType });

          const thumbByteString = atob(thumbnailDataUrl.split(',')[1]);
          const thumbAb = new ArrayBuffer(thumbByteString.length);
          const thumbIa = new Uint8Array(thumbAb);
          for (let i = 0; i < thumbByteString.length; i++) {
            thumbIa[i] = thumbByteString.charCodeAt(i);
          }
          const thumbnailBlob = new Blob([thumbAb], { type: outputMimeType });

          const compressedSize = blob.size;
          const originalSize = file.size;
          const savingsPercent = Math.max(
            0,
            Math.round(((originalSize - compressedSize) / originalSize) * 100)
          );

          const baseName = file.name.replace(/\.[^/.]+$/, '');
          const newExtension = outputMimeType === 'image/webp' ? '.webp' : '.jpg';
          const newFileName = `${baseName}_optimized${newExtension}`;

          resolve({
            dataUrl,
            blob,
            thumbnailDataUrl,
            thumbnailBlob,
            originalSize,
            compressedSize,
            savingsPercent,
            width,
            height,
            mimeType: outputMimeType,
            fileName: newFileName,
          });
        } catch (err: any) {
          reject(err);
        }
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}

/**
 * Format bytes into human readable KB / MB string
 */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}
