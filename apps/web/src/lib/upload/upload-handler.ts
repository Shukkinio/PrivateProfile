import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 10);
}

const ALLOWED_TYPES: Record<string, string[]> = {
  image: ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'image/apng', 'image/x-icon', 'image/vnd.microsoft.icon'],
  video: ['video/mp4', 'video/webm'],
  audio: ['audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/mp3'],
  cursor: ['image/png', 'image/x-icon', 'image/vnd.microsoft.icon'],
};

export function getAllowedTypes(): string[] {
  return Object.values(ALLOWED_TYPES).flat();
}

export function getCategoryForMime(mime: string): string {
  for (const [category, types] of Object.entries(ALLOWED_TYPES)) {
    if (types.includes(mime)) return category;
  }
  return 'other';
}

export function getExtensionFromMime(mime: string): string {
  const map: Record<string, string> = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/webp': 'webp',
    'image/gif': 'gif',
    'image/apng': 'apng',
    'image/x-icon': 'ico',
    'image/vnd.microsoft.icon': 'ico',
    'video/mp4': 'mp4',
    'video/webm': 'webm',
    'audio/mpeg': 'mp3',
    'audio/mp3': 'mp3',
    'audio/ogg': 'ogg',
    'audio/wav': 'wav',
  };
  return map[mime] || 'bin';
}

export interface UploadResult {
  url: string;
  path: string;
  mimeType: string;
  size: number;
  originalName: string;
}

export async function saveUpload(
  file: File,
  subfolder: string = 'general',
): Promise<UploadResult> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const ext = getExtensionFromMime(file.type);
  const filename = `${uid()}.${ext}`;

  if (process.env.VERCEL) {
    const dir = join('/tmp', 'uploads', subfolder);
    await mkdir(dir, { recursive: true });
    const filePath = join(dir, filename);
    await writeFile(filePath, buffer);
    return {
      url: `/api/uploads/${subfolder}/${filename}`,
      path: filePath,
      mimeType: file.type,
      size: file.size,
      originalName: file.name,
    };
  }

  const dir = join(process.cwd(), 'public', 'uploads', subfolder);
  await mkdir(dir, { recursive: true });
  const filePath = join(dir, filename);
  await writeFile(filePath, buffer);
  return {
    url: `/uploads/${subfolder}/${filename}`,
    path: filePath,
    mimeType: file.type,
    size: file.size,
    originalName: file.name,
  };
}
