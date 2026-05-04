import { useState } from 'react';
import type { PixelCrop } from 'react-image-crop';

export function useCropImage() {
  const [croppedUrl, setCroppedUrl] = useState<string | null>(null);

  const cropImage = async (image: HTMLImageElement, crop: PixelCrop) => {
    const canvas = document.createElement('canvas');
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    canvas.width = crop.width;
    canvas.height = crop.height;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    return new Promise<void>((resolve) => {
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setCroppedUrl(url);
        }
        resolve();
      }, 'image/jpeg');
    });
  };

  return { croppedUrl, cropImage, setCroppedUrl };
}
