import React, { useRef, useState } from 'react';
import { UploadCloud, Loader2, Crown, Lock } from 'lucide-react';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { useAuth } from '../../AuthContext';

interface FileUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  accept?: string;
  isPremium?: boolean;
}

export const FileUpload: React.FC<FileUploadProps> = ({ label, value, onChange, accept, isPremium }) => {
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { subscriptionStatus } = useAuth();
  
  const isPro = subscriptionStatus === 'pro';
  const disabled = isPremium && !isPro;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Strict 10MB Limit
    const MAX_SIZE_MB = 10;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`عذراً، حجم الملف يجب أن لا يتجاوز 10 ميجابايت.\nحجم ملفك هو ${(file.size / 1024 / 1024).toFixed(1)} ميجابايت.`);
      if (inputRef.current) inputRef.current.value = ''; // Reset input
      return;
    }

    setIsUploading(true);

    try {
      const region = import.meta.env.VITE_AWS_REGION;
      const bucket = import.meta.env.VITE_AWS_BUCKET_NAME;
      const accessKeyId = import.meta.env.VITE_AWS_ACCESS_KEY_ID;
      const secretAccessKey = import.meta.env.VITE_AWS_SECRET_ACCESS_KEY;

      if (!region || !bucket || !accessKeyId || !secretAccessKey) {
        console.warn('AWS S3 credentials missing. Falling back to base64.');
        const reader = new FileReader();
        reader.onload = (event) => {
          onChange(event.target?.result as string);
          setIsUploading(false);
        };
        reader.onerror = () => setIsUploading(false);
        reader.readAsDataURL(file);
        return;
      }

      const client = new S3Client({
        region,
        credentials: {
          accessKeyId,
          secretAccessKey,
        },
      });

      const extension = file.name.split('.').pop();
      const fileName = `uploads/${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;

      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      await client.send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: fileName,
          Body: uint8Array,
          ContentType: file.type,
        })
      );

      const url = `https://${bucket}.s3.${region}.amazonaws.com/${fileName}`;
      onChange(url);
    } catch (error: any) {
      console.error('Upload failed:', error);
      const errorMsg = error.message || JSON.stringify(error);
      const errorName = error.name || 'Unknown Error';
      alert(`خطأ في الرفع:\nالنوع: ${errorName}\nالتفاصيل: ${errorMsg}\n\nيرجى تصوير هذا الخطأ!`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-text-muted">{label}</label>
        {value && !isUploading && (
          <button 
            title="إزالة هذا الملف"
            onClick={(e) => { 
                e.preventDefault();
                e.stopPropagation(); 
                onChange(''); 
            }}
            className="text-xs font-semibold text-red-500 hover:text-red-600 bg-red-500/10 hover:bg-red-500/20 px-2 py-1 rounded-md transition-colors"
          >
            إزالة
          </button>
        )}
      </div>
      
      <div className="relative w-full group">
        <div 
          onClick={() => {
            if (!disabled) inputRef.current?.click();
          }}
          className={`w-full bg-base border border-dashed border-border-subtle rounded-xl px-4 py-6 text-center 
          backdrop-blur-md flex flex-col items-center justify-center gap-3 transition-all
          ${disabled ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer hover:bg-surface hover:border-electric/50'}`}
        >
          {disabled && (
            <div className="absolute top-2 right-2">
              <Lock size={16} className="text-text-muted" />
            </div>
          )}
          <input 
            type="file" 
            ref={inputRef}
            className="hidden" 
            accept={accept || "image/*,video/*,.pdf"} 
            onChange={handleFileChange} 
          />
          
          {isUploading ? (
             <Loader2 className="animate-spin text-electric" size={24} />
          ) : (
             <UploadCloud className={`transition-colors ${disabled ? 'text-text-muted' : 'text-text-muted group-hover:text-electric'}`} size={24} />
          )}
          
          <div className={`text-sm transition-colors ${disabled ? 'text-text-muted' : 'text-text-muted group-hover:text-text-main'}`}>
             {value ? 'تم رفع الملف بنجاح (انقر لتغييره)' : 'انقر لرفع ملف'}
          </div>
        </div>

        {disabled && (
          <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[220px] p-3 bg-base border border-border-subtle rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all text-center z-50 pointer-events-none">
             <p className="text-xs font-bold text-electric mb-1 flex items-center justify-center gap-1"><Crown size={12}/> ميزة PRO</p>
             <p className="text-[10px] text-text-muted leading-tight">الرفع المباشر متاح فقط في الباقة المدفوعة.</p>
          </div>
        )}
      </div>
    </div>
  );
};
