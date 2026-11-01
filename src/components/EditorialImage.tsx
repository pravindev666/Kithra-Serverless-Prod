import React, { useState } from 'react';
import {
  EditorialVariant,
  getEditorialPhotoUrl,
  getEditorialSvgDataUrl,
} from '../utils/editorialMedia';
import { PhotoCropTransform } from '../types/kithra';
import { ImageOff } from 'lucide-react';

interface EditorialImageProps {
  variant: EditorialVariant;
  alt: string;
  localObjectUrl?: string;
  cropTransform?: PhotoCropTransform;
  className?: string;
  aspectClass?: string;
  lazy?: boolean;
  forceFallback?: boolean;
  children?: React.ReactNode;
}

export const EditorialImage: React.FC<EditorialImageProps> = ({
  variant,
  alt,
  localObjectUrl,
  cropTransform,
  className = '',
  aspectClass = 'aspect-[4/5]',
  lazy = false,
  forceFallback = false,
  children,
}) => {
  const [useSvgFallback, setUseSvgFallback] = useState(false);
  const [totalFailure, setTotalFailure] = useState(false);

  const primaryPhotoUrl = localObjectUrl || getEditorialPhotoUrl(variant);
  const svgFallbackUrl = getEditorialSvgDataUrl(variant);

  const activeSrc = forceFallback
    ? ''
    : useSvgFallback
    ? svgFallbackUrl
    : primaryPhotoUrl || svgFallbackUrl;

  if (forceFallback || totalFailure || !activeSrc) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`relative overflow-hidden rounded-[13px] border border-[var(--line)] bg-[var(--surface2)] flex flex-col items-center justify-center p-6 text-center ${aspectClass} ${className}`}
      >
        <ImageOff className="w-7 h-7 text-[var(--muted)] mb-2.5 opacity-80" aria-hidden="true" />
        <p className="text-sm font-semibold text-[var(--heading)]">Portrait unavailable</p>
        <p className="text-xs text-[var(--muted)] mt-1 max-w-[240px]">{alt}</p>
        <p className="text-[11px] text-[var(--muted)] mt-2 opacity-80">
          Offline fallback card · Media could not be loaded
        </p>
        {children}
      </div>
    );
  }

  const transformStyle: React.CSSProperties | undefined = cropTransform
    ? {
        transform: `scale(${cropTransform.zoom}) translate(${cropTransform.panX}%, ${cropTransform.panY}%) rotate(${cropTransform.rotation}deg)`,
        transition: 'transform 160ms cubic-bezier(0.16, 1, 0.3, 1)',
      }
    : undefined;

  return (
    <div
      className={`relative overflow-hidden rounded-[13px] bg-[var(--surface2)] ${aspectClass} ${className}`}
      style={{ boxShadow: 'var(--shadow)' }}
    >
      <img
        src={activeSrc}
        alt={alt}
        loading={lazy ? 'lazy' : 'eager'}
        referrerPolicy="no-referrer"
        style={transformStyle}
        onError={() => {
          if (!useSvgFallback && svgFallbackUrl) {
            setUseSvgFallback(true);
          } else {
            setTotalFailure(true);
          }
        }}
        className="w-full h-full object-cover block"
      />
      {useSvgFallback && (
        <span className="sr-only">Displayed using offline illustrated fallback</span>
      )}
      {children}
    </div>
  );
};
