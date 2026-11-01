import { SupportedLocale, HeroNarrativeId } from '../types';

export interface LocaleMeta {
  code: SupportedLocale;
  name: string;
  nativeLabel: string;
  scriptFamily: string;
  status: 'live' | 'beta' | 'planned';
}

export const SUPPORTED_LOCALES: LocaleMeta[] = [
  { code: 'en', name: 'English', nativeLabel: 'English', scriptFamily: 'Latin (Fraunces + Inter)', status: 'live' },
  { code: 'hi', name: 'Hindi', nativeLabel: 'हिन्दी', scriptFamily: 'Noto Sans Devanagari', status: 'live' },
  { code: 'ta', name: 'Tamil', nativeLabel: 'தமிழ்', scriptFamily: 'Noto Sans Tamil', status: 'live' },
  { code: 'te', name: 'Telugu', nativeLabel: 'తెలుగు', scriptFamily: 'Noto Sans Telugu', status: 'planned' },
  { code: 'ml', name: 'Malayalam', nativeLabel: 'മലയാളം', scriptFamily: 'Noto Sans Malayalam', status: 'planned' },
  { code: 'kn', name: 'Kannada', nativeLabel: 'ಕನ್ನಡ', scriptFamily: 'Noto Sans Kannada', status: 'planned' },
  { code: 'bn', name: 'Bengali', nativeLabel: 'বাংলা', scriptFamily: 'Noto Sans Bengali', status: 'planned' },
];

export const HERO_NARRATIVES: Record<
  HeroNarrativeId,
  {
    id: HeroNarrativeId;
    label: string;
    eyebrow: Record<'en' | 'hi' | 'ta', string>;
    h1: Record<'en' | 'hi' | 'ta', string>;
    sub: Record<'en' | 'hi' | 'ta', string>;
    primaryCta: Record<'en' | 'hi' | 'ta', string>;
    secondaryCta: Record<'en' | 'hi' | 'ta', string>;
    trustNote: Record<'en' | 'hi' | 'ta', string>;
  }
> = {
  'H-B': {
    id: 'H-B',
    label: 'H-B · Recommended ("Your kind of people")',
    eyebrow: {
      en: 'Friendship · Dating · Matrimony — your choice, one account',
      hi: 'मित्रता · डेटिंग · विवाह — आपकी पसंद, एक खाता',
      ta: 'நட்பு · டேட்டிங் · திருமணம் — உங்கள் தேர்வு, ஒரே கணக்கு',
    },
    h1: {
      en: 'Understand your patterns. Meet people who make sense to you.',
      hi: 'अपने पैटर्न को समझें। ऐसे लोगों से मिलें जो आपके अनुकूल हों।',
      ta: 'உங்கள் இயல்புகளைப் புரிந்துகொள்ளுங்கள். உங்களுக்குப் பொருந்தும் மனிதர்களைச் சந்தியுங்கள்.',
    },
    sub: {
      en: 'Kithra is one platform with three separate intentions. Thoughtful questions build a private picture of how you connect — then we explain, in plain language, why two people might fit. No mind-reading. No guarantees. Just clearer introductions.',
      hi: 'किथ्रा तीन अलग-अलग उद्देश्यों वाला एक मंच है। विचारशील प्रश्न बताते हैं कि आप कैसे जुड़ते हैं — और हम सरल भाषा में समझाते हैं कि दो लोग क्यों मेल खा सकते हैं। कोई भविष्यवाणी नहीं, केवल स्पष्ट परिचय।',
      ta: 'கித்ரா மூன்று தனித்தனி நோக்கங்களைக் கொண்ட ஒரே தளம். சிந்தனைமிக்க கேள்விகள் நீங்கள் எப்படி இணைகிறீர்கள் என்பதை விளக்குகின்றன — எந்த மிகைப்படுத்தலும் இன்றி தெளிவான அறிமுகங்கள்.',
    },
    primaryCta: {
      en: 'Start with a few questions',
      hi: 'कुछ प्रश्नों से शुरुआत करें',
      ta: 'சில கேள்விகளுடன் தொடங்குங்கள்',
    },
    secondaryCta: {
      en: 'See how matching works',
      hi: 'जानें मिलान कैसे काम करता है',
      ta: 'பொருத்தம் எப்படி செயல்படுகிறது எனப் பார்க்கவும்',
    },
    trustNote: {
      en: 'Your answers are private by default. You choose what each mode can see.',
      hi: 'आपके उत्तर डिफ़ॉल्ट रूप से निजी हैं। आप चुनते हैं कि प्रत्येक मोड क्या देख सकता है।',
      ta: 'உங்கள் பதில்கள் இயல்பாகவே தனிப்பட்டவை. ஒவ்வொரு பிரிவும் எதைப் பார்க்கலாம் என்பதை நீங்களே தேர்வு செய்கிறீர்கள்.',
    },
  },
  'H-A': {
    id: 'H-A',
    label: 'H-A · Belonging / Friendship-First',
    eyebrow: {
      en: 'New city or new chapter · Friendship · Dating · Matrimony',
      hi: 'नया शहर या नया अध्याय · मित्रता · डेटिंग · विवाह',
      ta: 'புதிய நகரம் அல்லது புதிய தொடக்கம் · நட்பு · டேட்டிங் · திருமணம்',
    },
    h1: {
      en: 'New city? Meet people who make sense to you.',
      hi: 'नया शहर? ऐसे लोगों से मिलें जो आपको समझते हों।',
      ta: 'புதிய நகரமா? உங்களுக்குப் புரியும் மனிதர்களைச் சந்தியுங்கள்.',
    },
    sub: {
      en: 'Start in Friendship with platonic boundaries respected, or enable Dating and Matrimony separately when you choose. Every introduction comes with a plain-language explanation of shared rhythms and values.',
      hi: 'सम्मानजनक सीमाओं के साथ मित्रता से शुरू करें, या अपनी इच्छा से डेटिंग और विवाह मोड चुनें।',
      ta: 'நட்புப் பிரிவில் தொடங்குங்கள், அல்லது நீங்கள் விரும்பும்போது டேட்டிங் மற்றும் திருமணப் பிரிவுகளைத் தேர்ந்தெடுங்கள்.',
    },
    primaryCta: {
      en: 'Start with a few questions',
      hi: 'कुछ प्रश्नों से शुरुआत करें',
      ta: 'சில கேள்விகளுடன் தொடங்குங்கள்',
    },
    secondaryCta: {
      en: 'See how matching works',
      hi: 'जानें मिलान कैसे काम करता है',
      ta: 'பொருத்தம் எப்படி செயல்படுகிறது எனப் பார்க்கவும்',
    },
    trustNote: {
      en: 'Your answers are private by default. Turning on Dating never exposes your Friendship profile.',
      hi: 'डेटिंग चालू करने से आपकी मित्रता प्रोफ़ाइल कभी सार्वजनिक नहीं होती।',
      ta: 'டேட்டிங் பிரிவை இயக்குவது உங்கள் நட்பு சுயவிவரத்தை ஒருபோதும் வெளிப்படுத்தாது.',
    },
  },
  'H-C': {
    id: 'H-C',
    label: 'H-C · Three Journeys, One Platform (SEO Variant)',
    eyebrow: {
      en: 'Deterministic Compatibility · No Swipe Roulette',
      hi: 'पारदर्शी अनुकूलता · कोई स्वाइप रूलेट नहीं',
      ta: 'வெளிப்படையான பொருத்தம் · ஸ்வைப் சூதாட்டம் இல்லை',
    },
    h1: {
      en: 'Friendship, dating or marriage — one honest platform.',
      hi: 'मित्रता, डेटिंग या विवाह — एक ईमानदार मंच।',
      ta: 'நட்பு, டேட்டிங் அல்லது திருமணம் — ஒரே நேர்மையான தளம்.',
    },
    sub: {
      en: 'Compare communication pace, everyday routines and long-term plans through versioned questionnaires. Every score shows its coverage and model version — agreement on compared answers, never a soulmate guarantee.',
      hi: 'संवाद शैली, दिनचर्या और जीवन योजनाओं की पारदर्शी तुलना करें।',
      ta: 'உரையாடல் முறை, அன்றாடப் பழக்கங்கள் மற்றும் வாழ்க்கைத் திட்டங்களை நேர்மையாக ஒப்பிடுங்கள்.',
    },
    primaryCta: {
      en: 'Start with a few questions',
      hi: 'कुछ प्रश्नों से शुरुआत करें',
      ta: 'சில கேள்விகளுடன் தொடங்குங்கள்',
    },
    secondaryCta: {
      en: 'See how matching works',
      hi: 'जानें मिलान कैसे काम करता है',
      ta: 'பொருத்தம் எப்படி செயல்படுகிறது எனப் பார்க்கவும்',
    },
    trustNote: {
      en: 'Safety, blocking, reporting, and mutual messaging are free in every mode.',
      hi: 'ब्लॉक करना, रिपोर्ट करना और परस्पर संदेश भेजना हमेशा निःशुल्क है।',
      ta: 'தடுப்பது, புகாரளிப்பது மற்றும் பரஸ்பர உரையாடல் எப்போதும் இலவசம்.',
    },
  },
};

export function resolveLocaleKey(locale: SupportedLocale): 'en' | 'hi' | 'ta' {
  if (locale === 'hi' || locale === 'ta') return locale;
  return 'en';
}
