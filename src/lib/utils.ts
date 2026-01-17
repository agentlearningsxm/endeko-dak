import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

// Merge Tailwind classes with clsx
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Compress image to base64
export async function compressImage(
  file: File,
  options: { maxWidth?: number; maxHeight?: number; quality?: number } = {}
): Promise<string> {
  const { maxWidth = 1200, maxHeight = 1200, quality = 0.8 } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      let { width, height } = img;

      // Calculate new dimensions maintaining aspect ratio
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width = (width * maxHeight) / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL('image/jpeg', quality));
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
}

// Validate image URL
export function isValidImageURL(url: string): boolean {
  try {
    const parsed = new URL(url);
    return ['http:', 'https:'].includes(parsed.protocol);
  } catch {
    return false;
  }
}

// Format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// Get storage usage
export function getStorageUsage(): { used: number; available: number; percentage: number } {
  let totalSize = 0;

  for (const key in localStorage) {
    if (Object.prototype.hasOwnProperty.call(localStorage, key)) {
      totalSize += localStorage[key].length * 2; // UTF-16 = 2 bytes per char
    }
  }

  const usedMB = totalSize / (1024 * 1024);
  const availableMB = 5; // Typical localStorage limit

  return {
    used: usedMB,
    available: availableMB,
    percentage: (usedMB / availableMB) * 100,
  };
}

// Debounce function
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
