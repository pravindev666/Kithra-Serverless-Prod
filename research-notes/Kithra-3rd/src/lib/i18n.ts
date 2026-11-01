import { HeroNarrativeId, SupportedLocale } from '../types';

export const LOCALE_META: Array<{
  code: SupportedLocale;
  label: string;
  nativeLabel: string;
  script: string;
}> = [
  { code: 'EN', label: 'English', nativeLabel: 'English', script: 'Latin' },
  { code: 'HI', label: 'Hindi', nativeLabel: 'हिन्दी', script: 'Devanagari' },
  { code: 'TA', label: 'Tamil', nativeLabel: 'தமிழ்', script: 'Tamil' },
  { code: 'TE', label: 'Telugu', nativeLabel: 'తెలుగు', script: 'Telugu' },
  { code: 'ML', label: 'Malayalam', nativeLabel: 'മലയാളം', script: 'Malayalam' },
  { code: 'KN', label: 'Kannada', nativeLabel: 'ಕನ್ನಡ', script: 'Kannada' },
  { code: 'BN', label: 'Bengali', nativeLabel: 'বাংলা', script: 'Bengali' },
];

export interface HeroCopyTranslation {
  eyebrow: string;
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: string;
}

export const HERO_NARRATIVES: Record<
  HeroNarrativeId,
  Record<SupportedLocale, HeroCopyTranslation>
> = {
  'H-B': {
    EN: {
      eyebrow: 'Friendship · Dating · Matrimony — Strictly Isolated by Consent',
      headline: 'Find your people—through how you actually think, live, and care.',
      subheadline:
        'Explore Friendship circles, intentional Dating, or adult-led Matrimony under one account. Every compatibility view is a transparent Agreement Index across 12 everyday themes—with zero AI twins or soulmate predictions.',
      primaryCta: 'Start Your Relationship Map',
      secondaryCta: 'See How Agreement Works',
    },
    HI: {
      eyebrow: 'मित्रता · डेटिंग · विवाह — सहमति द्वारा पूर्णतः पृथक',
      headline: 'अपने लोगों से मिलें—आप वास्तव में कैसे सोचते, जीते और परवाह करते हैं, उसके आधार पर।',
      subheadline:
        'एक ही खाते में मित्रता, डेटिंग या विवाह मोड चुनें—प्रत्येक की अपनी स्वतंत्र गोपनीयता और सहमति है। कोई एआई ट्विन नहीं, केवल स्पष्ट सहमति सूचकांक।',
      primaryCta: 'अपना रिलेशनशिप मैप शुरू करें',
      secondaryCta: 'जानें यह कैसे काम करता है',
    },
    TA: {
      eyebrow: 'நட்பு · டேட்டிங் · திருமணம் — ஒப்புதலால் தனிமைப்படுத்தப்பட்டது',
      headline: 'நீங்கள் சிந்திக்கும், வாழும் மற்றும் அக்கறை காட்டும் விதத்தில் உங்கள் மனிதர்களைக் கண்டறியுங்கள்.',
      subheadline:
        'நட்பு, டேட்டிங் மற்றும் திருமணம் ஆகிய மூன்று முறைகளும் தனித்தனி ஒப்புதலுடன் செயல்படுகின்றன. AI கணிப்புகள் இல்லை.',
      primaryCta: 'உங்கள் உறவு வரைபடத்தைத் தொடங்குங்கள்',
      secondaryCta: 'எப்படி செயல்படுகிறது எனப் பார்க்கவும்',
    },
    TE: {
      eyebrow: 'స్నేహం · డేటింగ్ · వివాహం — సమ్మతితో వేరు చేయబడింది',
      headline: 'మీరు ఆలోచించే, జీవించే విధానం ద్వారా సరైన వ్యక్తులను కనుగొనండి.',
      subheadline:
        'ఒకే ఖాతాలో స్నేహం, డేటింగ్ మరియు వివాహ మోడ్‌లు—ప్రతి మోడ్‌కు ప్రత్యేక గోపनीयత మరియు సమ్మతి ఉంటుంది.',
      primaryCta: 'ప్రారంభించండి',
      secondaryCta: 'ఎలా పనిచేస్తుందో చూడండి',
    },
    ML: {
      eyebrow: 'സൗഹൃദം · ഡേറ്റിംഗ് · വിവാഹം — സമ്മതത്തോടെ വേർതിരിച്ചത്',
      headline: 'നിങ്ങൾ ചിന്തിക്കുകയും ജീവിക്കുകയും ചെയ്യുന്ന രീതിയിലൂടെ നിങ്ങളുടെ മനുഷ്യരെ കണ്ടെത്തുക.',
      subheadline:
        'സൗഹൃദം, ഡേറ്റിംഗ്, വിവാഹം എന്നിവ ഒരേ അക്കൗണ്ടിൽ, എന്നാൽ പൂർണ്ണമായും വേറിട്ട സ്വകാര്യതയോടെ.',
      primaryCta: 'ആരംഭിക്കുക',
      secondaryCta: 'കൂടുതൽ അറിയുക',
    },
    KN: {
      eyebrow: 'ಸ್ನೇಹ · ಡೇಟಿಂಗ್ · ಮ್ಯಾಟ್ರಿಮೋನಿ — ಸಮ್ಮತಿಯಿಂದ ಪ್ರತ್ಯೇಕಿಸಲಾಗಿದೆ',
      headline: 'ನೀವು ಯೋಚಿಸುವ ಮತ್ತು ಬದುಕುವ ರೀತಿಯಲ್ಲೇ ನಿಮ್ಮವರನ್ನು ಹುಡುಕಿ.',
      subheadline:
        'ಸ್ನೇಹ, ಡೇಟಿಂಗ್ ಮತ್ತು ವಿವಾಹಕ್ಕಾಗಿ ಒಂದೇ ಖಾತೆ—ಪ್ರತಿಯೊಂದಕ್ಕೂ ಪ್ರತ್ಯೇಕ ಗೌಪ್ಯತೆ ಮತ್ತು ಒಪ್ಪಿಗೆ.',
      primaryCta: 'ಪ್ರಾರಂಭಿಸಿ',
      secondaryCta: 'ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ ನೋಡಿ',
    },
    BN: {
      eyebrow: 'বন্ধুত্ব · ডেটিং · বিবাহ — সম্মতি দ্বারা সম্পূর্ণ পৃথক',
      headline: 'আপনি যেভাবে চিন্তা করেন এবং জীবনযাপন করেন, তার মাধ্যমেই আপনার মানুষদের খুঁজে নিন।',
      subheadline:
        'বন্ধুত্ব, ডেটিং এবং বিবাহ—একই অ্যাকাউন্টে তিনটি সম্পূর্ণ পৃথক মোড এবং স্বচ্ছ সামঞ্জস্য সূচক।',
      primaryCta: 'শুরু করুন',
      secondaryCta: 'কীভাবে কাজ করে দেখুন',
    },
  },
  'H-A': {
    EN: {
      eyebrow: 'Narrative H-A · Three Modes, One Honest Membership',
      headline: 'Three ways to connect. Zero context collapse between them.',
      subheadline:
        'Turn on Friendship, Dating, or Matrimony independently. Your coworkers in a book circle never see your Dating profile, and your Matrimony conversations stay adult-led and private.',
      primaryCta: 'Choose Your Active Modes',
      secondaryCta: 'Inspect Mode Isolation',
    },
    HI: {
      eyebrow: 'तीन मोड · एक सदस्यता · पूर्ण गोपनीयता',
      headline: 'जुड़ने के तीन तरीके। उनके बीच शून्य टकराव।',
      subheadline: 'मित्रता, डेटिंग और विवाह मोड को स्वतंत्र रूप से चालू या बंद करें।',
      primaryCta: 'अपना मोड चुनें',
      secondaryCta: 'गोपनीयता देखें',
    },
    TA: {
      eyebrow: 'மூன்று முறைகள் · ஒரே உறுப்பினர் திட்டம்',
      headline: 'இணைய மூன்று வழிகள். முழுமையான தனிியுரிமை.',
      subheadline: 'நட்பு, டேட்டிங் மற்றும் திருமணம் ஆகியவற்றை தனித்தனியாக கட்டுப்படுத்துங்கள்.',
      primaryCta: 'தொடங்குங்கள்',
      secondaryCta: 'மேலும் அறிக',
    },
    TE: {
      eyebrow: 'మూడు మోడ్‌లు · ఒకే సభ్యత్వం',
      headline: 'కనెక్ట్ అవ్వడానికి మూడు మార్గాలు. పూర్తి గోప్యత.',
      subheadline: 'స్నేహం, డేటింగ్ మరియు వివాహ మోడ్‌లను విడివిడిగా నియంత్రించండి.',
      primaryCta: 'ప్రారంభించండి',
      secondaryCta: 'వివరాలు చూడండి',
    },
    ML: {
      eyebrow: 'മൂന്ന് മോഡുകൾ · ഒരേ അംഗത്വം',
      headline: 'ബന്ധപ്പെടാൻ മൂന്ന് വഴികൾ. പൂർണ്ണ സ്വകാര്യത.',
      subheadline: 'സൗഹൃദം, ഡേറ്റിംഗ്, വിവാഹം എന്നിവ സ്വതന്ത്രമായി തിരഞ്ഞെടുക്കാം.',
      primaryCta: 'ആരംഭിക്കുക',
      secondaryCta: 'കൂടുതൽ അറിയുക',
    },
    KN: {
      eyebrow: 'ಮೂರು ಮೋಡ್‌ಗಳು · ಒಂದೇ ಸದಸ್ಯತ್ವ',
      headline: 'ಸಂಪರ್ಕಿಸಲು ಮೂರು ದಾರಿಗಳು. ಸಂಪೂರ್ಣ ಗೌಪ್ಯತೆ.',
      subheadline: 'ಸ್ನೇಹ, ಡೇಟಿಂಗ್ ಮತ್ತು ಮ್ಯಾಟ್ರಿಮೋನಿ ಮೋಡ್‌ಗಳನ್ನು ಪ್ರತ್ಯೇಕವಾಗಿ ನಿಯಂತ್ರಿಸಿ.',
      primaryCta: 'ಪ್ರಾರಂಭಿಸಿ',
      secondaryCta: 'ವಿವರಗಳನ್ನು ನೋಡಿ',
    },
    BN: {
      eyebrow: 'তিনটি মোড · একটি সদস্যপদ',
      headline: 'যুক্ত হওয়ার তিনটি পথ। সম্পূর্ণ পৃথক গোপনীয়তা।',
      subheadline: 'বন্ধুত্ব, ডেটিং এবং বিবাহ মোড আলাদাভাবে নিয়ন্ত্রণ করুন।',
      primaryCta: 'শুরু করুন',
      secondaryCta: 'বিস্তারিত দেখুন',
    },
  },
  'H-C': {
    EN: {
      eyebrow: 'Narrative H-C · Compatibility With Context (Model v1.2)',
      headline: 'Stop swiping on five photos. Compare how you actually live.',
      subheadline:
        'Switch between Echo (Similar), Counterpoint (Healthy Contrast), and Mosaic Fit (Rule-based Complementarity) across 12 everyday themes—with full item coverage shown on every card.',
      primaryCta: 'Explore the 3 Matching Lenses',
      secondaryCta: 'Try the Relationship Map',
    },
    HI: {
      eyebrow: 'संदर्भ के साथ अनुकूलता · मॉडल v1.2',
      headline: 'केवल फ़ोटो पर स्वाइप करना बंद करें। अपने जीवन मूल्यों की तुलना करें।',
      subheadline: 'इको, काउंटरपॉइंट और मोज़ेक फ़िट लेंस के साथ 12 विषयों में समानता और पूरकता देखें।',
      primaryCta: 'तीनों लेंस देखें',
      secondaryCta: 'रिलेशनशिप मैप आज़माएं',
    },
    TA: {
      eyebrow: 'பொருத்தமும் புரிதலும் · மாதிரி v1.2',
      headline: 'புகைப்படங்களை மட்டும் வைத்து தீர்மானிக்காதீர்கள்.',
      subheadline: '12 வாழ்க்கைத் தலைப்புகளில் எக்கோ, கவுண்டர்பாயிண்ட் மற்றும் மொசைக் ஃபிட் லென்ஸ்களைப் பயன்படுத்துங்கள்.',
      primaryCta: 'லென்ஸ்களைப் பார்க்கவும்',
      secondaryCta: 'வரைபடத்தை முயற்சிக்கவும்',
    },
    TE: {
      eyebrow: 'సందర్భంతో కూడిన అనుకూలత · మోడల్ v1.2',
      headline: 'కేవలం ఫోటోల ఆధారంగా కాకుండా, జీవన విధానం ఆధారంగా కలవండి.',
      subheadline: '12 అంశాలలో ఎకో, కౌంటర్‌పాయింట్ మరియు మొజాయిక్ ఫిట్ లెన్స్‌లను ఉపయోగించండి.',
      primaryCta: 'లెన్స్‌లను చూడండి',
      secondaryCta: 'మ్యాప్‌ను ప్రయత్నించండి',
    },
    ML: {
      eyebrow: 'വ്യക്തതയുള്ള പൊരുത്തം · മോഡൽ v1.2',
      headline: 'ചിത്രങ്ങൾക്കപ്പുറം ജീവിതരീതികൾ താരതമ്യം ചെയ്യാം.',
      subheadline: '12 വിഷയങ്ങളിൽ എക്കോ, കൗണ്ടർപോയിന്റ്, മൊസൈക് ഫിറ്റ് ലെൻസുകൾ പരിശോധിക്കാം.',
      primaryCta: 'ലെൻസുകൾ കാണുക',
      secondaryCta: 'മാപ്പ് പരീക്ഷിക്കുക',
    },
    KN: {
      eyebrow: 'ಸಂದರ್ಭದೊಂದಿಗೆ ಹೊಂದಾಣಿಕೆ · ಮಾಡೆಲ್ v1.2',
      headline: 'ಕೇವಲ ಫೋಟೋ ನೋಡಿ ನಿರ್ಧರಿಸಬೇಡಿ. ಜೀವನಶೈಲಿಯನ್ನು ಹೋಲಿಸಿ ನೋಡಿ.',
      subheadline: '12 ವಿಷಯಗಳಲ್ಲಿ ಎಕೋ, ಕೌಂಟರ್‌ಪಾಯಿಂಟ್ ಮತ್ತು ಮೊಸಾಯಿಕ್ ಫಿಟ್ ಲೆನ್ಸ್‌ಗಳನ್ನು ಬಳಸಿ.',
      primaryCta: 'ಲೆನ್ಸ್‌ಗಳನ್ನು ನೋಡಿ',
      secondaryCta: 'ಮ್ಯಾಪ್ ಪ್ರಯತ್ನಿಸಿ',
    },
    BN: {
      eyebrow: 'প্রসঙ্গসহ সামঞ্জস্য · মডেল v1.2',
      headline: 'শুধু ছবি দেখে নয়, জীবনযাত্রার মানদণ্ডে মানুষ চিনুন।',
      subheadline: '১২টি বিষয়ে ইকো, কাউন্টারপয়েন্ট এবং মোজাইক ফিট লেন্স ব্যবহার করে সামঞ্জস্য দেখুন।',
      primaryCta: 'লেন্সগুলো দেখুন',
      secondaryCta: 'ম্যাপ ব্যবহার করুন',
    },
  },
};
