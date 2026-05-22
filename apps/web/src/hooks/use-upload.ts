'use client';

import { useState } from 'react';
import { api } from '@/lib/api-client';

interface UploadResult {
  url: string;
  mimeType: string;
  size: number;
  category: string;
  originalName: string;
}

export function useUpload() {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const upload = async (file: File, folder?: string): Promise<UploadResult | null> => {
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      if (folder) formData.append('folder', folder);
      const result = await api.upload<UploadResult>('/upload', formData);
      return result;
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Upload failed';
      setError(msg);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return { upload, uploading, error };
}
