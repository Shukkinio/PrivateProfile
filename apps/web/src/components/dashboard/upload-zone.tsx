'use client';

import { useState, useRef } from 'react';
import { useUpload } from '@/hooks/use-upload';

interface UploadZoneProps {
  folder: string;
  accept: string;
  label: string;
  hint: string;
  maxSize?: number;
  onUpload: (url: string, mimeType: string) => void;
  currentUrl?: string;
  icon?: string;
}

export function UploadZone({ folder, accept, label, hint, maxSize = 50, onUpload, currentUrl, icon }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { upload, uploading, error } = useUpload();
  const [preview, setPreview] = useState(currentUrl);

  const handleFile = async (file: File) => {
    if (file.size > maxSize * 1024 * 1024) {
      return;
    }
    const result = await upload(file, folder);
    if (result) {
      setPreview(result.url);
      onUpload(result.url, result.mimeType);
    }
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = '';
        }}
      />
      <div
        onClick={() => inputRef.current?.click()}
        className="flex cursor-pointer flex-col items-center gap-2 rounded-lg border border-dashed border-[#c4b5fd]/25 px-4 py-5 text-center transition-all hover:border-[#c4b5fd]/55 hover:bg-[#c4b5fd]/4"
      >
        {icon && <div className="text-2xl text-[#c4b5fd]/50">{icon}</div>}
        <div className="text-xs text-white/35">
          <strong className="text-[#c4b5fd]">{label}</strong>
          <br />
          {hint}
        </div>
        {uploading && <div className="text-[10px] text-[#c4b5fd] animate-pulse">Uploading...</div>}
        {error && <div className="text-[10px] text-red-400">{error}</div>}
        {preview && !uploading && (
          <div className="text-[10px] text-[#34d399]">✓ Uploaded</div>
        )}
      </div>
    </div>
  );
}
