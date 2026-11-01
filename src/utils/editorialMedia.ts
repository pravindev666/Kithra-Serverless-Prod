/**
 * Provides licensed editorial photography URLs for everyday authentic human contexts
 * and retains the deterministic Coromandel SVG composition generator strictly as
 * an offline and broken-image fallback.
 */

export type EditorialVariant =
  | 'hero-main'
  | 'hero-side'
  | 'auth-quote'
  | 'member-aarav'
  | 'member-meera'
  | 'member-kabir'
  | 'member-ananya'
  | 'member-rohan'
  | 'member-zoya'
  | 'photo-primary'
  | 'photo-secondary'
  | 'photo-third'
  | 'broken-demo';

interface SceneConfig {
  photoUrl: string;
  creditLabel: string;
  bgStart: string;
  bgEnd: string;
  archColor: string;
  sunColor: string;
  garmentPrimary: string;
  garmentSecondary: string;
  skinTone: string;
  hairTone: string;
  captionTag: string;
  composition: 'duo-veranda' | 'tea-conversation' | 'courtyard-evening' | 'portrait-single';
}

const SCENE_CONFIGS: Record<Exclude<EditorialVariant, 'broken-demo'>, SceneConfig> = {
  'hero-main': {
    photoUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1100&q=85&fit=crop',
    creditLabel: 'Editorial photography · Unsplash License',
    bgStart: '#E8D8C0',
    bgEnd: '#C8A982',
    archColor: '#1F2F46',
    sunColor: '#E5B957',
    garmentPrimary: '#3D736E',
    garmentSecondary: '#9B5349',
    skinTone: '#9E6B4B',
    hairTone: '#1B1A1E',
    captionTag: 'Courtyard gathering · Warm daylight',
    composition: 'duo-veranda',
  },
  'hero-side': {
    photoUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=700&q=85&fit=crop',
    creditLabel: 'Editorial photography · Unsplash License',
    bgStart: '#DFCFB9',
    bgEnd: '#B99878',
    archColor: '#2B3E58',
    sunColor: '#C9962E',
    garmentPrimary: '#8E4B5A',
    garmentSecondary: '#1F2F46',
    skinTone: '#8C5A3C',
    hairTone: '#19181C',
    captionTag: 'Unhurried conversation over filter coffee',
    composition: 'tea-conversation',
  },
  'auth-quote': {
    photoUrl: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=1000&q=85&fit=crop',
    creditLabel: 'Editorial photography · Unsplash License',
    bgStart: '#1D2F45',
    bgEnd: '#0E1722',
    archColor: '#2E435E',
    sunColor: '#E5B957',
    garmentPrimary: '#C9962E',
    garmentSecondary: '#4D8A84',
    skinTone: '#946244',
    hairTone: '#141418',
    captionTag: 'Coromandel twilight veranda',
    composition: 'courtyard-evening',
  },
  'member-aarav': {
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=85&fit=crop',
    creditLabel: 'Illustrative portrait · Unsplash License',
    bgStart: '#EAE0D0',
    bgEnd: '#CFC0AA',
    archColor: '#4D8A84',
    sunColor: '#D9A74A',
    garmentPrimary: '#1F2F46',
    garmentSecondary: '#4D8A84',
    skinTone: '#9A6748',
    hairTone: '#1C1B20',
    captionTag: 'Bengaluru · Architectural studio',
    composition: 'portrait-single',
  },
  'member-meera': {
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&q=85&fit=crop',
    creditLabel: 'Illustrative portrait · Unsplash License',
    bgStart: '#EFE2D6',
    bgEnd: '#D4B9A5',
    archColor: '#8E4B5A',
    sunColor: '#C9962E',
    garmentPrimary: '#8E4B5A',
    garmentSecondary: '#C9962E',
    skinTone: '#8D5B3E',
    hairTone: '#18171B',
    captionTag: 'Chennai · Morning terrace',
    composition: 'portrait-single',
  },
  'member-kabir': {
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=85&fit=crop',
    creditLabel: 'Illustrative portrait · Unsplash License',
    bgStart: '#EDE1D5',
    bgEnd: '#CEB49D',
    archColor: '#B86A6A',
    sunColor: '#E2AE48',
    garmentPrimary: '#7D4747',
    garmentSecondary: '#1F2F46',
    skinTone: '#A37050',
    hairTone: '#1E1D22',
    captionTag: 'Mumbai · Seafront reading room',
    composition: 'portrait-single',
  },
  'member-ananya': {
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&q=85&fit=crop',
    creditLabel: 'Illustrative portrait · Unsplash License',
    bgStart: '#E5DFD3',
    bgEnd: '#C3B8A3',
    archColor: '#4D8A84',
    sunColor: '#C9962E',
    garmentPrimary: '#366863',
    garmentSecondary: '#C9962E',
    skinTone: '#926042',
    hairTone: '#18171B',
    captionTag: 'Hyderabad · Botanical conservatory',
    composition: 'portrait-single',
  },
  'member-rohan': {
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&q=85&fit=crop',
    creditLabel: 'Illustrative portrait · Unsplash License',
    bgStart: '#ECE0D4',
    bgEnd: '#CDB59F',
    archColor: '#8E4B5A',
    sunColor: '#C9962E',
    garmentPrimary: '#243752',
    garmentSecondary: '#8E4B5A',
    skinTone: '#9B684A',
    hairTone: '#1B1A1E',
    captionTag: 'Delhi · Lodhi garden walk',
    composition: 'portrait-single',
  },
  'member-zoya': {
    photoUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=85&fit=crop',
    creditLabel: 'Illustrative portrait · Unsplash License',
    bgStart: '#EFE3D8',
    bgEnd: '#D3B7A4',
    archColor: '#B86A6A',
    sunColor: '#D69F3A',
    garmentPrimary: '#9E5454',
    garmentSecondary: '#1F2F46',
    skinTone: '#A67353',
    hairTone: '#1C1A1E',
    captionTag: 'Pune · Ceramic & book studio',
    composition: 'portrait-single',
  },
  'photo-primary': {
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&q=85&fit=crop',
    creditLabel: 'Sample portrait · Unsplash License',
    bgStart: '#EDE2D0',
    bgEnd: '#CEB99A',
    archColor: '#1F2F46',
    sunColor: '#C9962E',
    garmentPrimary: '#2C4969',
    garmentSecondary: '#C9962E',
    skinTone: '#966345',
    hairTone: '#1A191D',
    captionTag: 'Primary portrait · 4:5 frame',
    composition: 'portrait-single',
  },
  'photo-secondary': {
    photoUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=700&q=85&fit=crop',
    creditLabel: 'Sample portrait · Unsplash License',
    bgStart: '#E4DDD0',
    bgEnd: '#C2B49E',
    archColor: '#4D8A84',
    sunColor: '#D8A441',
    garmentPrimary: '#4D8A84',
    garmentSecondary: '#1F2F46',
    skinTone: '#8F5D40',
    hairTone: '#19181C',
    captionTag: 'Sunday bookshop table',
    composition: 'tea-conversation',
  },
  'photo-third': {
    photoUrl: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=700&q=85&fit=crop',
    creditLabel: 'Sample portrait · Unsplash License',
    bgStart: '#EFE4D6',
    bgEnd: '#CFB69B',
    archColor: '#8E4B5A',
    sunColor: '#C9962E',
    garmentPrimary: '#8E4B5A',
    garmentSecondary: '#C9962E',
    skinTone: '#9B684A',
    hairTone: '#1B1A1E',
    captionTag: 'Courtyard music evening',
    composition: 'duo-veranda',
  },
};

export function getEditorialPhotoUrl(variant: EditorialVariant): string {
  if (variant === 'broken-demo') return '';
  return SCENE_CONFIGS[variant]?.photoUrl ?? SCENE_CONFIGS['hero-main'].photoUrl;
}

export function getEditorialSvgDataUrl(variant: EditorialVariant): string {
  if (variant === 'broken-demo') {
    return '';
  }
  const cfg = SCENE_CONFIGS[variant] ?? SCENE_CONFIGS['hero-main'];

  let subjectMarkup = '';
  if (cfg.composition === 'duo-veranda') {
    subjectMarkup = `
      <path d="M 140 680 L 140 250 A 210 210 0 0 1 560 250 L 560 680 Z" fill="${cfg.archColor}" fill-opacity="0.14" />
      <polygon points="80,0 440,0 680,680 220,680" fill="${cfg.sunColor}" fill-opacity="0.14" />
      <ellipse cx="620" cy="130" rx="110" ry="38" transform="rotate(-24 620 130)" fill="${cfg.archColor}" fill-opacity="0.12" />
      <ellipse cx="660" cy="190" rx="95" ry="32" transform="rotate(-12 660 190)" fill="${cfg.archColor}" fill-opacity="0.10" />
      <path d="M 170 690 C 175 515, 365 515, 370 690 Z" fill="${cfg.garmentPrimary}" />
      <path d="M 225 545 L 315 545 L 290 690 L 245 690 Z" fill="${cfg.sunColor}" fill-opacity="0.32" />
      <rect x="252" y="450" width="36" height="55" rx="16" fill="${cfg.skinTone}" />
      <circle cx="272" cy="405" r="56" fill="${cfg.skinTone}" />
      <path d="M 214 398 C 214 338, 330 336, 330 398 C 312 374, 236 374, 214 398 Z" fill="${cfg.hairTone}" />
      <path d="M 380 690 C 385 500, 595 500, 600 690 Z" fill="${cfg.garmentSecondary}" />
      <path d="M 430 520 C 460 560, 520 560, 545 520 L 570 690 L 410 690 Z" fill="${cfg.sunColor}" fill-opacity="0.22" />
      <rect x="472" y="432" width="36" height="55" rx="16" fill="${cfg.skinTone}" />
      <circle cx="488" cy="388" r="58" fill="${cfg.skinTone}" />
      <circle cx="534" cy="396" r="24" fill="${cfg.hairTone}" />
      <path d="M 430 384 C 432 320, 548 320, 546 388 C 522 362, 456 362, 430 384 Z" fill="${cfg.hairTone}" />
    `;
  } else if (cfg.composition === 'tea-conversation') {
    subjectMarkup = `
      <rect x="90" y="70" width="520" height="440" rx="22" fill="${cfg.archColor}" fill-opacity="0.11" />
      <line x1="350" y1="70" x2="350" y2="510" stroke="${cfg.archColor}" stroke-opacity="0.16" stroke-width="4" />
      <rect x="120" y="560" width="560" height="140" fill="${cfg.archColor}" fill-opacity="0.18" />
      <rect x="310" y="522" width="34" height="38" rx="6" fill="${cfg.sunColor}" />
      <rect x="378" y="528" width="34" height="32" rx="6" fill="${cfg.sunColor}" />
      <path d="M 130 660 C 140 470, 310 470, 320 660 Z" fill="${cfg.garmentPrimary}" />
      <circle cx="232" cy="388" r="52" fill="${cfg.skinTone}" />
      <path d="M 180 382 C 182 325, 286 325, 284 384 C 262 360, 202 360, 180 382 Z" fill="${cfg.hairTone}" />
      <path d="M 410 660 C 420 470, 590 470, 600 660 Z" fill="${cfg.garmentSecondary}" />
      <circle cx="496" cy="392" r="52" fill="${cfg.skinTone}" />
      <path d="M 444 386 C 446 328, 548 328, 548 388 C 524 364, 466 364, 444 386 Z" fill="${cfg.hairTone}" />
    `;
  } else if (cfg.composition === 'courtyard-evening') {
    subjectMarkup = `
      <circle cx="540" cy="180" r="140" fill="${cfg.sunColor}" fill-opacity="0.22" />
      <path d="M 160 700 L 160 240 A 200 200 0 0 1 560 240 L 560 700 Z" fill="${cfg.sunColor}" fill-opacity="0.12" />
      <path d="M 210 700 C 220 490, 410 490, 420 700 Z" fill="${cfg.garmentPrimary}" />
      <circle cx="318" cy="400" r="56" fill="${cfg.skinTone}" />
      <path d="M 262 392 C 264 334, 374 334, 374 394 C 350 370, 286 370, 262 392 Z" fill="${cfg.hairTone}" />
      <path d="M 370 700 C 380 510, 555 510, 565 700 Z" fill="${cfg.garmentSecondary}" />
      <circle cx="465" cy="418" r="52" fill="${cfg.skinTone}" />
      <path d="M 413 410 C 415 352, 517 352, 517 412 C 495 388, 435 388, 413 410 Z" fill="${cfg.hairTone}" />
    `;
  } else {
    subjectMarkup = `
      <path d="M 150 680 L 150 220 A 210 210 0 0 1 570 220 L 570 680 Z" fill="${cfg.archColor}" fill-opacity="0.12" />
      <circle cx="520" cy="170" r="95" fill="${cfg.sunColor}" fill-opacity="0.22" />
      <path d="M 185 690 C 195 475, 525 475, 535 690 Z" fill="${cfg.garmentPrimary}" />
      <path d="M 295 495 L 425 495 L 395 690 L 325 690 Z" fill="${cfg.garmentSecondary}" fill-opacity="0.55" />
      <rect x="334" y="405" width="52" height="75" rx="22" fill="${cfg.skinTone}" />
      <circle cx="360" cy="340" r="76" fill="${cfg.skinTone}" />
      <path d="M 332 335 Q 342 329 350 335" stroke="#2B211B" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M 372 335 Q 382 329 390 335" stroke="#2B211B" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M 346 368 Q 360 378 376 368" stroke="#2B211B" stroke-width="3" fill="none" stroke-linecap="round" />
      <path d="M 282 336 C 282 246, 438 244, 438 338 C 408 302, 314 302, 282 336 Z" fill="${cfg.hairTone}" />
      <circle cx="426" cy="356" r="28" fill="${cfg.hairTone}" />
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 680" width="720" height="680">
    <defs>
      <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${cfg.bgStart}" />
        <stop offset="100%" stop-color="${cfg.bgEnd}" />
      </linearGradient>
    </defs>
    <rect width="720" height="680" fill="url(#bgGrad)" />
    ${subjectMarkup}
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
