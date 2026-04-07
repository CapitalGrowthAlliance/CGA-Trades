import React, { useState } from 'react';
import { X } from 'lucide-react';

interface ExpandableImageProps {
  src: string;
  alt: string;
  className?: string;
}

export default function ExpandableImage({ src, alt, className = '' }: ExpandableImageProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <img
        src={src}
        alt={alt}
        className={`cursor-pointer transition-transform duration-300 ${className}`}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsExpanded(true);
        }}
        referrerPolicy="no-referrer"
      />

      {isExpanded && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 sm:p-8 backdrop-blur-sm"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsExpanded(false);
          }}
        >
          <button
            className="absolute top-4 right-4 sm:top-8 sm:right-8 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-[101]"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsExpanded(false);
            }}
          >
            <X className="w-6 h-6 sm:w-8 sm:h-8" />
          </button>
          <img
            src={src}
            alt={alt}
            className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            referrerPolicy="no-referrer"
          />
        </div>
      )}
    </>
  );
}
