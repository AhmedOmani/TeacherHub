import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
}

export const Input: React.FC<InputProps> = ({ label, className, ...props }) => {
  return (
    <div className="flex flex-col gap-2 mb-4">
      <label className="text-sm font-medium text-text-muted">{label}</label>
      <input
        {...props}
        className={`w-full bg-base border border-border-subtle rounded-xl text-text-main px-4 py-3 
        backdrop-blur-md focus:border-electric/50 focus:ring-1 focus:ring-electric/50 outline-none transition-all ${className || ''}`}
      />
    </div>
  );
};
