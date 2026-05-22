import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/api-auth';
import { saveUpload } from '@/lib/upload/upload-handler';

export async function POST(request: Request) {
  try {
    await requireAuth();
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const folder = (formData.get('folder') as string) || 'general';

    if (!file) return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    if (file.size > 50 * 1024 * 1024)
      return NextResponse.json({ error: 'File too large (max 50MB)' }, { status: 400 });

    const result = await saveUpload(file, folder);
    return NextResponse.json({
      url: result.url,
      mimeType: result.mimeType,
      size: result.size,
      originalName: result.originalName,
    });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Upload failed';
    if (msg === 'Unauthorized') return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
