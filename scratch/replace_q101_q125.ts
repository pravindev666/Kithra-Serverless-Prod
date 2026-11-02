import fs from 'node:fs';
import path from 'node:path';

const filePath = path.resolve('src/data/expandedCandidateBank.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// Find where Q101 begins:
const q101Marker = "    id: 'q-101-conversational-depth',";
const q101Idx = content.indexOf(q101Marker);

if (q101Idx === -1) {
  console.error("Could not find Q101 marker!");
  process.exit(1);
}

// Find the opening brace '{' right before q101Marker
const startIdx = content.lastIndexOf('{', q101Idx);

// Find the end of ADDITIONAL_ITEMS array:
// Look for "EXPANDED_CANDIDATE_ITEMS.push(...ADDITIONAL_ITEMS);"
const endMarker = "EXPANDED_CANDIDATE_ITEMS.push(...ADDITIONAL_ITEMS);";
const endMarkerIdx = content.indexOf(endMarker);

if (endMarkerIdx === -1) {
  console.error("Could not find end marker!");
  process.exit(1);
}

// The closing of the array `];` comes right before endMarker
const endIdx = content.lastIndexOf('];', endMarkerIdx);

const replacementQuestions = `  {
    id: 'q-101-conversational-depth',
    themeId: 'theme-commun',
    questionNumber: 101,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'communication',
    facetId: 'conversational_depth',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'When you meet a potential companion for chai or coffee, what kind of conversation makes you feel truly connected?',
    translations: {
      ta: 'ஒருவருடன் தேநீர் அல்லது காபி அருந்தும்போது, எந்த வகையான உரையாடல் உங்களிடையே உண்மையான பிணைப்பை உருவாக்குகிறது?',
      hi: 'जब आप किसी नए साथी से चाय या कॉफी पर मिलते हैं, तो किस तरह की बातचीत आपको सचमुच गहरा जुड़ाव महसूस कराती है?'
    },
    context: 'Conversational pacing and intimacy tolerance in initial personal explorations.',
    whyWeAsk: 'Reveals whether you prefer building rapport through deep philosophical sharing or light, unhurried warmth.',
    researchBasis: 'Altman & Taylor (1973) Social Penetration Theory: Depth vs breadth in interpersonal relationship escalation.',
    measurementLimitations: 'Self-reported conversational preference; situational rapport varies widely across settings.',
    culturalSuitabilityNotes: 'Grounded in Indian social coffee/chai meeting culture across Bangalore, Chennai, and Mumbai.',
    completionBurdenMs: 14000,
    sectionId: 'communication',
    triangulationClusterId: 'reassurance_vs_space',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q101-deep',
        semanticId: 'sem-conv-depth-deep',
        normalizedValue: 85,
        label: 'Diving into personal philosophies, formative life memories, and what drives each of us',
        labelTa: 'தனிப்பட்ட வாழ்க்கைத் தத்துவங்கள், நினைவுகள் மற்றும் வாழ்க்கை நோக்கங்களை ஆழமாகப் பேசுவது',
        labelHi: 'व्यक्तिगत जीवन-दर्शन, स्मृतियों और जीवन के गहरे उद्देश्यों पर खुलकर चर्चा करना',
        reflection: 'Values rapid conversational depth and meaningful vulnerability.',
        signalEffect: 'Contributes to Conversational Depth (Similar to Me)',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q101-organic',
        semanticId: 'sem-conv-depth-organic',
        normalizedValue: 55,
        label: 'Starting with shared interests, books, and work, allowing deeper themes to unfold gradually',
        labelTa: 'பகிரப்பட்ட ஆர்வங்கள், புத்தகங்கள் அல்லது வேலை பற்றிப் பேசி, மெதுவாக ஆழமான உரையாடலுக்குள் செல்வது',
        labelHi: 'साझा रुचियों, पुस्तकों और काम की बातों से शुरुआत कर धीरे-धीरे गहराई में उतरना',
        reflection: 'Pragmatic, organic pacing from common ground to personal sharing.',
        signalEffect: 'Contributes to Conversational Depth (Similar to Me / We Balance Each Other)',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q101-light',
        semanticId: 'sem-conv-depth-light',
        normalizedValue: 25,
        label: 'Light-hearted humor, everyday observations, and keeping early meetings relaxed without heavy intensity',
        labelTa: 'நகைச்சுவை, அன்றாட நிகழ்வுகள் பற்றிப் பேசி, ஆரம்ப சந்திப்புகளை இலகுவாகவும் இயல்பாகவும் வைத்திருப்பது',
        labelHi: 'हल्का-फुल्का हास्य, दिनभर की रोचक बातें और शुरुआती मुलाकातों को बिना किसी दबाव के सहज रखना',
        reflection: 'Prioritizes conversational ease, levity, and low-pressure boundaries.',
        signalEffect: 'Contributes to Conversational Ease (Different from Me / Similar to Me)',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-102-de-escalation-patience',
    themeId: 'theme-confli',
    questionNumber: 102,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'emotional_regulation',
    facetId: 'de_escalation_patience',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'During a heated disagreement at home, voices rise and emotional frustration spikes. What is your most effective instinctive way to recover?',
    translations: {
      ta: 'வீட்டில் ஒரு விவாதம் தீவிரமடைந்து குரல்கள் உயரும் போது, மன அமைதிக்குத் திரும்ப உங்கள் இயல்பான வழி என்ன?',
      hi: 'घर पर किसी बहस के दौरान जब आवाज़ें तेज़ हो जाएं और तनाव बढ़ जाए, तो शांति बहाल करने का आपका स्वाभाविक तरीका क्या होता है?'
    },
    context: 'De-escalation strategy under acute relational friction.',
    whyWeAsk: 'Matches individuals whose conflict de-escalation styles soothe rather than exacerbate each others nervous systems.',
    researchBasis: 'Gottman & Levenson (1999) Physiological flooding and relational repair latency.',
    measurementLimitations: 'Self-reported retrospective recollection under simulated calm.',
    culturalSuitabilityNotes: 'Addresses domestic heated discussions common in high-density urban Indian households.',
    completionBurdenMs: 14000,
    sectionId: 'conflict_repair',
    triangulationClusterId: 'stress_regulation_and_decompression',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q102-pause',
        semanticId: 'sem-deescalate-calm-pause',
        normalizedValue: 90,
        label: 'Asking for an immediate 20-minute breather so both can breathe and resume with lowered heart rates',
        labelTa: 'இருவரின் மனநிலையும் சீராகும் வரை 20 நிமிட அமைதியான இடைவெளி கேட்பது',
        labelHi: 'दोनों का तनाव कम होने तक 20 मिनट का शांत विराम मांगना ताकि शांति से बात हो सके',
        reflection: 'Prioritizes physiological soothing and de-escalation pause.',
        signalEffect: 'Contributes to Conflict Repair & Emotional Regulation',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q102-humor',
        semanticId: 'sem-deescalate-soft-humor',
        normalizedValue: 55,
        label: 'Using a gentle tone shift or self-deprecating humor to break the tension without walking away',
        labelTa: 'இடத்திலிருந்து விலகாமல், மென்மையான குரல் அல்லது சிறு நகைச்சுவை மூலம் பதற்றத்தைத் தணிப்பது',
        labelHi: 'कमरे से बाहर जाए बिना, अपनी आवाज़ धीमी करके या सहज मुस्कान से तनाव कम करना',
        reflection: 'Relies on in-situ warmth and tonal defusing.',
        signalEffect: 'Contributes to Conflict Repair & Emotional Regulation',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q102-push',
        semanticId: 'sem-deescalate-push-through',
        normalizedValue: 20,
        label: 'Pushing through to address the issue directly right then, finding unfinished arguments deeply unsettling',
        labelTa: 'பேசாமல் இருப்பதை விட, அந்த கணத்திலேயே பேசி முடித்துத் தெளிவு பெறுவது',
        labelHi: 'बात को अधूरा छोड़ने के बजाय, उसी समय बात जारी रखकर तुरंत निष्कर्ष पर पहुँचना',
        reflection: 'Urgent drive for immediate cognitive closure.',
        signalEffect: 'Contributes to Conflict Resolution Rhythm',
        welcomesComplementarity: false
      }
    ]
  },
  {
    id: 'q-103-generosity-and-giving',
    themeId: 'theme-person',
    questionNumber: 103,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'personal_values',
    facetId: 'generosity_and_giving',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'When you experience a financial bonus or windfall, what feels most aligned with your personal values?',
    translations: {
      ta: 'எதிர்பாராத பண வரவு அல்லது போனஸ் கிடைக்கும்போது, உங்கள் தனிப்பட்ட மதிப்பீடுகளுக்கு ஏற்ப என்ன செய்யத் தோன்றும்?',
      hi: 'जब आपको कोई अप्रत्याशित वित्तीय लाभ या बोनस मिलता है, तो आपके मूल्यों के अनुसार उसका क्या उपयोग सबसे सही लगता है?'
    },
    context: 'Resource allocation attitudes: communal generosity vs individual asset accumulation.',
    whyWeAsk: 'Harmonizes financial giving expectations across partners and close companions.',
    researchBasis: 'Schwartz (1992) Universalism and Benevolence vs Security in human values.',
    measurementLimitations: 'Hypothetical spending choice susceptible to social desirability.',
    culturalSuitabilityNotes: 'Reflects Indian cultural expectations around supporting family and domestic staff.',
    completionBurdenMs: 14000,
    sectionId: 'personal_values',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q103-community',
        semanticId: 'sem-giving-community-support',
        normalizedValue: 85,
        label: 'Allocating a meaningful portion to support extended family, domestic staff, or community causes',
        labelTa: 'கூட்டுக்குடும்ப உறுப்பினர்கள், வீட்டுப் பணியாளர்கள் அல்லது சமூக நலனுக்கு ஒரு பகுதியை ஒதுக்குவது',
        labelHi: 'संयुक्त परिवार, घरेलू सहायकों या सामाजिक कारणों में सहायता के लिए एक निश्चित हिस्सा देना',
        reflection: 'Prioritizes communal responsibility and benevolent sharing.',
        signalEffect: 'Contributes to Communal Generosity',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q103-targeted',
        semanticId: 'sem-giving-targeted-thoughtful',
        normalizedValue: 55,
        label: 'Saving the majority for personal security while funding a specific, thoughtful gift or project for loved ones',
        labelTa: 'சேமிப்புக்கு முன்னுரிமை கொடுத்து, வேண்டியவர்களுக்குப் பயனுள்ள பரிசு அல்லது உதவியை வழங்குவது',
        labelHi: 'निजी सुरक्षा के लिए अधिकांश बचत करना और प्रियजनों के लिए कोई सार्थक उपहार या सहयोग चुनना',
        reflection: 'Balanced security with deliberate, targeted generosity.',
        signalEffect: 'Contributes to Balanced Generosity',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q103-invest',
        semanticId: 'sem-giving-longterm-compounding',
        normalizedValue: 20,
        label: 'Directing almost all of it into compounding investments and disciplined long-term assets',
        labelTa: 'முழுத் தொகையையும் நீண்டகால முதலீடுகள் மற்றும் சொத்துக்களில் முதலீடு செய்வது',
        labelHi: 'पूरी राशि को अनुशासित ढंग से दीर्घकालिक निवेश और वित्तीय स्वतंत्रता में लगाना',
        reflection: 'Focuses on capital preservation, security, and financial autonomy.',
        signalEffect: 'Contributes to Long-term Asset Prudence',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-104-weekend-recharge-rhythm',
    themeId: 'theme-social',
    questionNumber: 104,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'social_energy',
    facetId: 'weekend_recharge_rhythm',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'After a 50-hour demanding workweek, what does your ideal Saturday afternoon look like?',
    translations: {
      ta: '50 மணி நேரக் கடுமையான வேலை வாரத்திற்குப் பிறகு, உங்கள் சனிக்கிழமை மதிய நேரம் எப்படி அமைய வேண்டும் என்று விரும்புவீர்கள்?',
      hi: 'कामकाज के व्यस्त 50 घंटे के सप्ताह के बाद, आपकी शनिवार की आदर्श दोपहर कैसी होनी चाहिए?'
    },
    context: 'Restorative environment and social battery replenishment.',
    whyWeAsk: 'Prevents weekend lifestyle friction between solitary rechargers and active social seekers.',
    researchBasis: 'DeYoung (2015) Extraversion: Enthusiasm vs solitary sensory replenishment.',
    measurementLimitations: 'Varies with seasonal workload fluctuations.',
    culturalSuitabilityNotes: 'Reflects weekend cadence in Indian metro IT/corporate work cultures.',
    completionBurdenMs: 14000,
    sectionId: 'social_energy',
    triangulationClusterId: 'social_energy_vs_solitude',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q104-social',
        semanticId: 'sem-recharge-social-outing',
        normalizedValue: 85,
        label: 'Exploring a bustling flea market, art gallery, or meeting friends for an active evening out',
        labelTa: 'சுறுசுறுப்பான சந்தைகள், கலைக்கூடங்கள் அல்லது நண்பர்களுடன் உற்சாகமாக வெளியே செல்வது',
        labelHi: 'चहल-पहल वाले बाज़ार, कला दीर्घाओं में जाना या दोस्तों के साथ बाहर समय बिताना',
        reflection: 'Recharges through outward activity and social stimulation.',
        signalEffect: 'Contributes to Outward Social Energy',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q104-shared',
        semanticId: 'sem-recharge-quiet-shared',
        normalizedValue: 55,
        label: 'Cooking a slow home-cooked meal with a partner or taking a relaxed park walk',
        labelTa: 'வீட்டிலேயே மெதுவாகச் சமைத்துச் சாப்பிடுவது அல்லது பூங்காவில் அமைதியாக உலாவுவது',
        labelHi: 'घर पर आराम से खाना बनाना या किसी करीबी के साथ शांत पार्क में टहलना',
        reflection: 'Values quiet, intimate shared domestic restorative time.',
        signalEffect: 'Contributes to Shared Domestic Serenity',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q104-solitude',
        semanticId: 'sem-recharge-deep-solitude',
        normalizedValue: 20,
        label: 'Unplugged solitary downtime—curling up with a book, naps, or music in total quiet',
        labelTa: 'முழு அமைதியில் புத்தகங்கள் படிப்பது, தூங்குவது அல்லது இசை கேட்பது போன்ற தனிமை நேரம்',
        labelHi: 'पूरी तरह शांत कमरे में पुस्तक पढ़ना, विश्राम करना या अकेले संगीत सुनना',
        reflection: 'Requires deep solitary cocooning to restore equilibrium.',
        signalEffect: 'Contributes to Restorative Solitude',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-105-emergency-fund-philosophy',
    themeId: 'theme-finan',
    questionNumber: 105,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['dating', 'matrimony'],
    constructId: 'finances_independence',
    facetId: 'emergency_fund_philosophy',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'When budgeting monthly income, how do you view maintaining an emergency safety fund?',
    translations: {
      ta: 'மாத வருமானத்தைத் திட்டமிடும் போது, அவசரக்கால சேமிப்பு நிதியை எவ்வாறு கருதுகிறீர்கள்?',
      hi: 'मासिक आय का बजट बनाते समय, आप आपातकालीन सुरक्षा फंड बनाए रखने को किस नज़रिए से देखते हैं?'
    },
    context: 'Financial safety buffers versus discretionary spending and investment risk.',
    whyWeAsk: 'Financial misalignment is a leading cause of long-term relational friction.',
    researchBasis: 'Dew & Britt (2012) Financial management consensus and couple longevity.',
    measurementLimitations: 'Dependent on absolute income level and dependents.',
    culturalSuitabilityNotes: 'Critical for Indian dual-income couples managing family obligations and EMIs.',
    completionBurdenMs: 14000,
    sectionId: 'finances_independence',
    triangulationClusterId: 'financial_transparency_planning',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q105-buffer',
        semanticId: 'sem-fund-strict-buffer',
        normalizedValue: 90,
        label: 'A non-negotiable liquid buffer of 6–12 months of expenses before any discretionary lifestyle upgrades',
        labelTa: 'எந்த ஆடம்பரச் செலவுக்கும் முன், குறைந்தது 6 முதல் 12 மாதங்களுக்கான அவசரக்கால சேமிப்பு வைப்பது',
        labelHi: 'किसी भी ऐशो-आराम के खर्च से पहले 6 से 12 महीने के खर्च का सुरक्षित आपातकालीन फंड बनाए रखना',
        reflection: 'Prioritizes robust capital safety and debt-free security.',
        signalEffect: 'Contributes to Financial Prudence',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q105-balance',
        semanticId: 'sem-fund-moderate-balance',
        normalizedValue: 55,
        label: 'A practical 3-month buffer while continuing to invest in experiences, travel, and personal growth',
        labelTa: '3 மாதங்களுக்கான சேமிப்பை வைத்துக்கொண்டு, பயணம் மற்றும் தனிப்பட்ட வளர்ச்சிக்கும் செலவிடுவது',
        labelHi: '3 महीने का व्यावहारिक फंड रखना और साथ ही यात्रा, अनुभव और सीखने पर भी खर्च करना',
        reflection: 'Pragmatic balance between liquidity and present life enrichment.',
        signalEffect: 'Contributes to Financial Balance',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q105-lean',
        semanticId: 'sem-fund-lean-growth',
        normalizedValue: 25,
        label: 'Keeping minimal idle cash and deploying almost everything into higher-yield growth assets or business ventures',
        labelTa: 'பணத்தை சும்மா வைத்திருக்காமல், தொழில் அல்லது அதிக வருமானம் தரும் முதலீடுகளில் ஈடுபடுத்துவது',
        labelHi: 'बिना काम के नकदी रखने के बजाय पैसे को उच्च-लाभ वाले व्यापार या विकास संपत्तियों में लगाना',
        reflection: 'High capital efficiency and comfort with low cash buffers.',
        signalEffect: 'Contributes to Dynamic Capital Growth',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-106-holiday-family-coordination',
    themeId: 'theme-famil',
    questionNumber: 106,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['dating', 'matrimony'],
    constructId: 'family_domestic',
    facetId: 'holiday_family_coordination',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'During major festivals like Diwali, Pongal, or Eid, how do you prefer balancing visits between both sets of extended families?',
    translations: {
      ta: 'தீபாவளி, பொங்கல் அல்லது ஈத் போன்ற முக்கிய பண்டிகைகளின் போது, இரு குடும்பங்களுக்கும் நேரம் ஒதுக்குவதை எவ்வாறு சமன் செய்ய விரும்புகிறீர்கள்?',
      hi: 'दीवाली, पोंगल या ईद जैसे प्रमुख त्योहारों के दौरान, आप दोनों पक्षों के परिवारों में संतुलन कैसे बनाना पसंद करते हैं?'
    },
    context: 'Extended family festival coordination and couple autonomy in South Asian kinship.',
    whyWeAsk: 'Discloses expectations around filial duty, balance, and nuclear couple boundaries.',
    researchBasis: 'Sorketti et al. (2014) Family systems, in-law boundary clarity, and marital health.',
    measurementLimitations: 'Dependent on geographical proximity to parents and in-laws.',
    culturalSuitabilityNotes: 'Deeply resonant with modern Indian couples navigating dual-family festival expectations.',
    completionBurdenMs: 14000,
    sectionId: 'family_domestic',
    triangulationClusterId: 'parental_involvement_boundaries',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q106-split',
        semanticId: 'sem-family-split-equitable',
        normalizedValue: 85,
        label: 'Setting a transparent, pre-agreed rotation schedule between both families to ensure absolute balance and fairness',
        labelTa: 'இரு வீட்டிலும் சமமாக நேரம் செலவிட முன்கூட்டியே திட்டமிட்ட சுழற்சி முறையைப் பின்பற்றுவது',
        labelHi: 'दोनों परिवारों में निष्पक्ष समय बिताने के लिए पहले से स्पष्ट रोटेशन कार्यक्रम तय करना',
        reflection: 'Egalitarian and transparent extended family sharing.',
        signalEffect: 'Contributes to Dual-Family Equity',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q106-need',
        semanticId: 'sem-family-flexible-need',
        normalizedValue: 50,
        label: 'Adapting fluidly based on whoever needs support, elderly parents health, or family milestones that year',
        labelTa: 'அந்த ஆண்டில் யாருக்கு உதவி தேவை அல்லது பெற்றோர் உடல்நிலையைக் கவனித்து நெகிழ்வாக முடிவெடுப்பது',
        labelHi: 'उस वर्ष किस परिवार को अधिक आवश्यकता है या माता-पिता के स्वास्थ्य को देखकर निर्णय लेना',
        reflection: 'Situational empathy and needs-based elder support.',
        signalEffect: 'Contributes to Situational Family Care',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q106-couple',
        semanticId: 'sem-family-couple-sanctuary',
        normalizedValue: 20,
        label: 'Celebrating primarily as an intimate couple/nuclear unit, keeping extended family visits brief and boundary-protected',
        labelTa: 'தம்பதியராகச் சேர்ந்து பண்டிகையைக் கொண்டாடிவிட்டு, குடும்பச் சந்திப்புகளைக் குறுகிய அளவில் வைப்பது',
        labelHi: 'मुख्य रूप से अपने साथी के साथ त्योहार मनाना और विस्तृत पारिवारिक मुलाकातों को सीमित रखना',
        reflection: 'Prioritizes nuclear couple sanctuary and personal space.',
        signalEffect: 'Contributes to Nuclear Couple Autonomy',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-107-morning-sunlight-and-fitness',
    themeId: 'theme-lifes',
    questionNumber: 107,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'daily_lifestyle',
    facetId: 'morning_sunlight_and_fitness',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'What role does physical movement, morning exercise, or yoga play in your weekly rhythm?',
    translations: {
      ta: 'உடற்பயிற்சி, யோகா அல்லது நடைப்பயிற்சி உங்கள் வாராந்திர வாழ்க்கையில் என்ன பங்கு வகிக்கிறது?',
      hi: 'शारीरिक व्यायाम, सुबह की सैर या योग आपकी साप्ताहिक दिनचर्या में क्या स्थान रखते हैं?'
    },
    context: 'Physical vitality habits and somatic regulation.',
    whyWeAsk: 'Discovers lifestyle rhythm harmony regarding health and physical discipline.',
    researchBasis: 'Rhodes et al. (2012) Personality and physical activity: Conscientiousness and Extraversion.',
    measurementLimitations: 'Self-reported intention versus actual biometric consistency.',
    culturalSuitabilityNotes: 'Reflects growing urban Indian interest in running clubs, yoga, and gym culture.',
    completionBurdenMs: 14000,
    sectionId: 'daily_lifestyle',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q107-disciplined',
        semanticId: 'sem-fitness-disciplined-anchor',
        normalizedValue: 90,
        label: 'A non-negotiable daily morning ritual (gym, running, yoga) essential for mental focus and physical vitality',
        labelTa: 'உடற்பயிற்சி அல்லது யோகா அன்றாடக் கட்டாயப் பழக்கம்—அதுவே என் மன அமைதிக்கு ஆதாரம்',
        labelHi: 'रोज़ सुबह कसरत, दौड़ या योग करना—यह मेरे मानसिक संतुलन और ऊर्जा के लिए अनिवार्य है',
        reflection: 'High dedication to structured somatic health and discipline.',
        signalEffect: 'Contributes to Daily Physical Vitality',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q107-moderate',
        semanticId: 'sem-fitness-moderate-lifestyle',
        normalizedValue: 55,
        label: 'Regular casual activity like evening walks, badminton, or weekend cycling without rigid tracking',
        labelTa: 'நடைப்பயிற்சி, பூப்பந்து அல்லது வார இறுதி மிதிவண்டிப் பயணம் போன்ற இயல்பான உடற்பயிற்சி',
        labelHi: 'शाम को टहलना, बैडमिंटन खेलना या सप्ताहांत में साइकिल चलाना जैसी सहज सक्रियता',
        reflection: 'Relaxed, balanced functional health without rigid metrics.',
        signalEffect: 'Contributes to Moderate Lifestyle Fitness',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q107-relaxed',
        semanticId: 'sem-fitness-relaxed-occasional',
        normalizedValue: 20,
        label: 'Spontaneous and relaxed; prioritizing intellectual, creative, or restful pursuits over formal fitness routines',
        labelTa: 'வழக்கமான உடற்பயிற்சிகளை விட, வாசிப்பு, படைப்பாற்றல் மற்றும் ஓய்வுக்கு முன்னுரிமை அளிப்பது',
        labelHi: 'कड़े फिटनेस नियमों के बजाय पढ़ने, रचनात्मक कार्यों या आराम करने को प्राथमिकता देना',
        reflection: 'Sedentary or leisurely creative cadence over formal exercise.',
        signalEffect: 'Contributes to Leisure-Centric Lifestyle',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-108-intimate-privacy-boundaries',
    themeId: 'theme-bound',
    questionNumber: 108,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['dating', 'matrimony'],
    constructId: 'relational_boundaries',
    facetId: 'intimate_privacy_boundaries',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'In a committed relationship, what is your instinct regarding phone screen privacy, personal chats, and passwords?',
    translations: {
      ta: 'ஒரு நெருக்கமான உறவில், தொலைபேசி தனிப்பாதுகாப்பு, தனிப்பட்ட அரட்டைகள் மற்றும் கடவுச்சொற்கள் குறித்து உங்கள் பார்வை என்ன?',
      hi: 'एक समर्पित रिश्ते में, फोन की निजता, व्यक्तिगत संदेशों और पासवर्ड को लेकर आपकी स्वाभाविक सोच क्या है?'
    },
    context: 'Digital boundary expectations within intimate partnerships.',
    whyWeAsk: 'Prevents toxic surveillance while establishing clear digital trust expectations.',
    researchBasis: 'Petronio (2002) Communication Privacy Management in digital intimacies.',
    measurementLimitations: 'Responses may reflect past betrayal trauma rather than baseline preference.',
    culturalSuitabilityNotes: 'Highly pertinent for Indian millennials and Gen-Z balancing transparent marriage with digital boundaries.',
    completionBurdenMs: 14000,
    sectionId: 'relational_boundaries',
    triangulationClusterId: 'reassurance_vs_space',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q108-open',
        semanticId: 'sem-privacy-open-door',
        normalizedValue: 20,
        label: 'Complete open transparency—sharing phone unlock codes freely and having zero qualms about glances',
        labelTa: 'முழு வெளிப்படைத்தன்மை—இருவரிடமும் தொலைபேசி கடவுச்சொற்கள் இருப்பது மற்றும் ஒளிவுமறைவின்மை',
        labelHi: 'पूर्ण खुलापन—फोन के पासवर्ड साझा करना और किसी भी समय एक-दूसरे का फोन देखने में कोई आपत्ति न होना',
        reflection: 'Radical mutual openness and dissolved digital boundaries.',
        signalEffect: 'Contributes to Open Boundary Relational Style',
        welcomesComplementarity: false
      },
      {
        id: 'opt-q108-trust',
        semanticId: 'sem-privacy-respectful-trust',
        normalizedValue: 55,
        label: 'Open accessibility in emergencies, but keeping day-to-day private correspondence with friends/work personal by default',
        labelTa: 'அவசர காலங்களுக்கு மட்டும் அணுகல், ஆனால் வழக்கமான நண்பர்களின் உரையாடல்களுக்குத் தனிமை தருவது',
        labelHi: 'आपात स्थिति के लिए पहुंच रखना, परंतु मित्रों और काम की निजी बातचीत का सम्मान करना',
        reflection: 'Mature mutual trust with respectful personal sphere boundaries.',
        signalEffect: 'Contributes to Differentiated Privacy Balance',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q108-strict',
        semanticId: 'sem-privacy-strict-sanctuary',
        normalizedValue: 90,
        label: 'Firm personal sanctuary—viewing private journals, messages, and work devices as inviolable individual territory',
        labelTa: 'உறுதியான தனிப்பட்ட எல்லை—டைரிகள், தனிப்பட்ட செய்திகள் மற்றும் கணினி போன்றவை முழுத் தனிமை',
        labelHi: 'स्पष्ट व्यक्तिगत दायरा—निजी संदेश, डायरी और कार्य संबंधी उपकरणों को पूर्णतः व्यक्तिगत मानना',
        reflection: 'Strong individuation and firm digital sanctuary expectations.',
        signalEffect: 'Contributes to Strict Boundary Sanctuary',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-109-reading-and-learning-cadence',
    themeId: 'theme-intel',
    questionNumber: 109,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'intellectual_curiosity',
    facetId: 'reading_and_learning_cadence',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'When you have free leisure time, how drawn are you to reading, podcasts, non-fiction, or learning about new fields?',
    translations: {
      ta: 'ஓய்வு நேரத்தில், புத்தகங்கள், பாட்காஸ்ட்கள் அல்லது புதிய துறைகளைக் கற்றுக்கொள்வதில் உங்களுக்கு எவ்வளவு ஈடுபாடு உண்டு?',
      hi: 'अपने खाली समय में, किताबें पढ़ने, पॉडकास्ट सुनने या नए विषयों को सीखने में आपकी कितनी स्वाभाविक रुचि रहती है?'
    },
    context: 'Intellectual leisure consumption and drive for novelty.',
    whyWeAsk: 'Identifies mutual stimulation and conversational chemistry foundations.',
    researchBasis: 'Cacioppo & Petty (1982) Need for Cognition and epistemic curiosity.',
    measurementLimitations: 'Does not account for non-reading modes of analytical thinking.',
    culturalSuitabilityNotes: 'Appropriate across Indian urban intellectual, creative, and professional communities.',
    completionBurdenMs: 14000,
    sectionId: 'intellectual_curiosity',
    triangulationClusterId: 'intellectual_curiosity_debate',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q109-deep',
        semanticId: 'sem-intellect-deep-immersion',
        normalizedValue: 85,
        label: 'Deeply curious—regularly devouring books, long-form investigative essays, history, or science podcasts',
        labelTa: 'மிகுந்த ஆர்வத்துடன் புத்தகங்கள், ஆழமான கட்டுரைகள், வரலாறு அல்லது அறிவியல் பாட்காஸ்ட்களைக் கேட்பது',
        labelHi: 'निरंतर सीखने की तीव्र जिज्ञासा—किताबें, शोध लेख, इतिहास या विज्ञान से जुड़े पॉडकास्ट पढ़ना-सुनना',
        reflection: 'High epistemic drive and continuous learning appetite.',
        signalEffect: 'Contributes to Intellectual Depth',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q109-practical',
        semanticId: 'sem-intellect-practical-discovery',
        normalizedValue: 55,
        label: 'Curious when something catches my attention or has practical relevance to my career and life goals',
        labelTa: 'தொழில் அல்லது வாழ்க்கைக்குப் பயன்படும் புதிய விஷயங்களை ஆர்வத்துடன் தேடிக் கற்றுக்கொள்வது',
        labelHi: 'जब कोई विषय जीवन या करियर के लिए उपयोगी लगे, तब रुचि लेकर नई जानकारी प्राप्त करना',
        reflection: 'Applied, pragmatic intellectual discovery.',
        signalEffect: 'Contributes to Practical Curiosity',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q109-experiential',
        semanticId: 'sem-intellect-sensory-leisure',
        normalizedValue: 20,
        label: 'Preferring experiential relaxation—movies, comedy, food, music, and socializing over heavy analytical reading',
        labelTa: 'கனமான வாசிப்பை விட திரைப்படங்கள், நகைச்சுவை, இசை மற்றும் சுவையான உணவை அனுபவிப்பது',
        labelHi: 'भारी-भरकम अध्ययन के बजाय फिल्में, संगीत, हास्य और दोस्तों के साथ समय बिताने को प्राथमिकता देना',
        reflection: 'Sensory and experiential relaxation over analytical reading.',
        signalEffect: 'Contributes to Experiential Leisure Style',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-110-crisis-composure-anchor',
    themeId: 'theme-emoti',
    questionNumber: 110,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'emotional_regulation',
    facetId: 'crisis_composure_anchor',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'When an unexpected domestic or travel emergency strikes (flight cancelled, hospital visit, sudden leak), what is your first response?',
    translations: {
      ta: 'பயண ரத்து, மருத்துவமனை செல்ல வேண்டிய நிலை போன்ற எதிர்பாராத அவசரநிலை ஏற்படும் போது, உங்கள் முதல் எதிர்வினை என்ன?',
      hi: 'अचानक कोई आपात स्थिति आने पर (उड़ान रद्द होना, अस्पताल जाना, घर में कोई खराबी), आपकी पहली प्रतिक्रिया क्या होती है?'
    },
    context: 'Affective composure versus pragmatic action orientation under acute stress.',
    whyWeAsk: 'Pairs companions whose emergency coping styles complement rather than compound collective panic.',
    researchBasis: 'Gross (2002) Emotion regulation: Cognitive reappraisal vs expressive suppression.',
    measurementLimitations: 'Real acute trauma may produce different reactions than logistical emergencies.',
    culturalSuitabilityNotes: 'Addresses logistical challenges common in Indian transit and emergency care.',
    completionBurdenMs: 14000,
    sectionId: 'emotional_regulation',
    triangulationClusterId: 'stress_regulation_and_decompression',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q110-calm',
        semanticId: 'sem-crisis-calm-logistics',
        normalizedValue: 90,
        label: 'Emotionally cool and instantly focused on checklists, logistics, and next practical steps',
        labelTa: 'பதற்றப்படாமல் உடனே அடுத்த நடைமுறைத் தீர்வுகளை நோக்கிச் செயல்படத் தொடங்குவது',
        labelHi: 'शांत रहकर तुरंत समाधान और आवश्यक प्रबंध पर ध्यान केंद्रित करना',
        reflection: 'High crisis composure and systematic logistical focus.',
        signalEffect: 'Contributes to Crisis Composure',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q110-reassure',
        semanticId: 'sem-crisis-collaborative-reassurance',
        normalizedValue: 55,
        label: 'A momentary spike of stress, quickly centered by talking it through with a partner or trusted friend',
        labelTa: 'ஆரம்பத்தில் சிறு பதற்றம் ஏற்பட்டாலும், துணையுடன் பேசி விரைவாக நிதானத்திற்கு வருவது',
        labelHi: 'शुरुआत में थोड़ा तनाव महसूस होना, परंतु साथी से बात करके तुरंत स्थिति को संभाल लेना',
        reflection: 'Collaborative emotional regulation and mutual reassurance.',
        signalEffect: 'Contributes to Collaborative Composure',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q110-expressive',
        semanticId: 'sem-crisis-expressive-feeling',
        normalizedValue: 20,
        label: 'Visibly vocalizing the stress and needing emotional validation and presence before tackling the logistics',
        labelTa: 'சூழ்நிலையின் அழுத்தத்தை வெளிப்படையாகப் பேசிவிட்டு, உணர்வுபூர்வ ஆதரவுக்குப் பின் முடிவெடுப்பது',
        labelHi: 'अपनी घबराहट को खुलकर व्यक्त करना और पहले भावनात्मक सहारे की आवश्यकता महसूस करना',
        reflection: 'Emotionally expressive coping requiring supportive presence.',
        signalEffect: 'Contributes to Expressive Coping Style',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-111-living-for-now-vs-future',
    themeId: 'theme-goals',
    questionNumber: 111,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['dating', 'matrimony'],
    constructId: 'long_term_goals',
    facetId: 'living_for_now_vs_future',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'In balancing the pleasures of your 20s and 30s against retirement and future home ownership, which mindset feels truest to you?',
    translations: {
      ta: 'இளமைக்கால இன்பங்களை அனுபவிப்பதற்கும், எதிர்கால வீடு மற்றும் ஓய்வுக்கால சேமிப்பிற்கும் இடையே உள்ள சமநிலையில் உங்கள் அணுகுமுறை என்ன?',
      hi: 'वर्तमान जीवन के सुखों और भविष्य की बचत व घर खरीदने की योजनाओं के बीच संतुलन को लेकर आपका क्या विचार है?'
    },
    context: 'Temporal discounting and lifestyle investment horizon.',
    whyWeAsk: 'Critical alignment factor for couples choosing lifestyle pacing and financial milestones.',
    researchBasis: 'Kahneman & Tversky (1979) Prospect Theory and temporal intertemporal choice.',
    measurementLimitations: 'Dependent on generational wealth and family support safety nets.',
    culturalSuitabilityNotes: 'Key consideration in Indian urban life where real estate EMIs impact daily living.',
    completionBurdenMs: 14000,
    sectionId: 'long_term_goals',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q111-present',
        semanticId: 'sem-future-present-richness',
        normalizedValue: 25,
        label: 'Prioritizing rich present-day experiences—travel, dining, learning—while healthy and young, trusting future earning power',
        labelTa: 'இளமைக் காலத்தில் நல்ல பயணங்கள் மற்றும் வாழ்க்கை அனுபவங்களை அனுபவிப்பதே முக்கியம்',
        labelHi: 'युवावस्था में जीवन के अनुभवों, यात्राओं और वर्तमान का भरपूर आनंद लेने में विश्वास रखना',
        reflection: 'Values present-day experiential richness and experiential capital.',
        signalEffect: 'Contributes to Present-Oriented Experiential Living',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q111-balance',
        semanticId: 'sem-future-conscious-balance',
        normalizedValue: 55,
        label: 'Carefully dividing surplus: enjoying regular meaningful experiences while maintaining structured investments',
        labelTa: 'நிகழ்கால மகிழ்ச்சியையும் எதிர்காலச் சேமிப்பையும் சமமான விகிதத்தில் கவனித்துக் கொள்வது',
        labelHi: 'वर्तमान का आनंद और भविष्य की वित्तीय सुरक्षा—दोनों के बीच संतुलित सामंजस्य बनाना',
        reflection: 'Pragmatic dual-horizon financial and lifestyle stewardship.',
        signalEffect: 'Contributes to Balanced Life Planning',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q111-future',
        semanticId: 'sem-future-longterm-endurance',
        normalizedValue: 85,
        label: 'Disciplined frugality now to secure property ownership, financial autonomy, and early peace of mind',
        labelTa: 'எதிர்காலத்தில் சொந்த வீடு மற்றும் நிதிப் பாதுகாப்பை உறுதிசெய்ய இப்போதே சேமிப்பது',
        labelHi: 'भविष्य में मकान और पूर्ण वित्तीय स्वतंत्रता सुरक्षित करने के लिए अभी अनुशासित बचत करना',
        reflection: 'Prioritizes early financial security and tangible property foundations.',
        signalEffect: 'Contributes to Future Security Orientation',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-112-verbal-appreciation-cadence',
    themeId: 'theme-roman',
    questionNumber: 112,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['dating', 'matrimony'],
    constructId: 'romantic_expectations',
    facetId: 'verbal_appreciation_cadence',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'In an everyday relationship, how important is it to verbally hear "I appreciate you" or receive explicit spoken warmth?',
    translations: {
      ta: 'தினசரி வாழ்க்கையில், "உன்னை மதிக்கிறேன்" போன்ற அன்பான வார்த்தைகளைக் கேட்பது உங்களுக்கு எவ்வளவு முக்கியம்?',
      hi: 'दैनिक रिश्ते में, स्पष्ट रूप से प्रशंसा सुनना या शब्दों में प्यार जताना आपके लिए कितना आवश्यक है?'
    },
    context: 'Affectional expression modalities in romantic bonds.',
    whyWeAsk: 'Prevents emotional starvation when one partner needs verbal validation while the other shows love through acts of service.',
    researchBasis: 'Chapman (1992) Words of Affirmation in relational satisfaction.',
    measurementLimitations: 'Self-reported expectation that may evolve as trust deepens.',
    culturalSuitabilityNotes: 'Navigates traditional Indian understated affection versus modern verbal warmth.',
    completionBurdenMs: 14000,
    sectionId: 'romantic_expectations',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q112-verbal',
        semanticId: 'sem-appreciation-frequent-spoken',
        normalizedValue: 85,
        label: 'Vital—frequent, spontaneous spoken compliments and gratitude make me feel deeply seen and cherished',
        labelTa: 'அடிக்கடி அன்பான வார்த்தைகளாலும் பாராட்டுகளாலும் பாராட்டுவது மிகவும் முக்கியம்',
        labelHi: 'प्रेम और कृतज्ञता भरे शब्दों को बार-बार सुनना मेरे लिए अत्यंत महत्वपूर्ण है',
        reflection: 'Flourishes through explicit spoken affirmations and praise.',
        signalEffect: 'Contributes to High Verbal Affirmation Needs',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q112-actions',
        semanticId: 'sem-appreciation-actions-and-moments',
        normalizedValue: 55,
        label: 'Nice when spoken, but reliable acts of care, attentive listening, and quiet presence speak louder',
        labelTa: 'வார்த்தைகளை விட அக்கறையான செயல்களும் கனிவான உடனிருப்பும் அதிகப் பேசுகின்றன',
        labelHi: 'शब्द अच्छे लगते हैं, परंतु रोजमर्रा के छोटे-छोटे सहयोगी कार्य अधिक मायने रखते हैं',
        reflection: 'Action-anchored appreciation with periodic genuine words.',
        signalEffect: 'Contributes to Action-Centric Appreciation',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q112-implicit',
        semanticId: 'sem-appreciation-unstated-trust',
        normalizedValue: 20,
        label: 'We both know where we stand; constant verbal reassurance feels unnecessary when deep underlying trust is solid',
        labelTa: 'உண்மையான நம்பிக்கை இருக்கும்போது, வார்த்தைகளில் அடிக்கடி சொல்லத் தேவையில்லை',
        labelHi: 'जब आपसी विश्वास गहरा हो, तो बार-बार शब्दों में जताने की आवश्यकता नहीं होती',
        reflection: 'Secure, low-verbal implicit understanding.',
        signalEffect: 'Contributes to Implicit Emotional Security',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-113-voice-note-nuance',
    themeId: 'theme-commun',
    questionNumber: 113,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'communication',
    facetId: 'voice_note_nuance',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'When you want to share a nuanced thought or catch up during a busy week, which communication channel do you naturally prefer?',
    translations: {
      ta: 'வேலைப்பளு மிகுந்த வாரத்தில், ஒரு முக்கியமான விஷயத்தைப் பேச எந்தத் தொடர்பு வழியை நீங்கள் விரும்புவீர்கள்?',
      hi: 'व्यस्त सप्ताह के दौरान, जब आप कोई गहरी बात साझा करना चाहें, तो आप स्वाभाविक रूप से किस माध्यम को प्राथमिकता देते हैं?'
    },
    context: 'Everyday conversational bandwidth and synchronous vs asynchronous communication.',
    whyWeAsk: 'Prevents texting fatigue and communication channel mismatch.',
    researchBasis: 'Daft & Lengel (1986) Media Richness Theory in interpersonal communication.',
    measurementLimitations: 'Modality choices depend heavily on employer phone policies.',
    culturalSuitabilityNotes: 'Reflects widespread Indian WhatsApp voice note and calling habits.',
    completionBurdenMs: 14000,
    sectionId: 'communication',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q113-call',
        semanticId: 'sem-voice-call-presence',
        normalizedValue: 85,
        label: 'Picking up the phone for a real-time 10-minute voice call—tone of voice and instant connection are irreplaceable',
        labelTa: 'தொலைபேசியில் நேரடியாகப் பேசுவது—குரலின் தொனியும் உடனடித் தொடர்பும் மிக முக்கியம்',
        labelHi: 'सीधे फोन मिलाकर बात करना—आवाज़ का भाव और तुरंत जुड़ाव सबसे बेहतर लगता है',
        reflection: 'Prefers real-time auditory warmth and synchronous presence.',
        signalEffect: 'Contributes to Synchronous Voice Pacing',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q113-voicenote',
        semanticId: 'sem-voice-async-notes',
        normalizedValue: 55,
        label: 'Sending a 60-second voice note—conveys emotional warmth without demanding the other person pick up immediately',
        labelTa: 'சிறிய குரல் பதிவு (Voice Note) அனுப்புவது—அன்பையும் காட்டும், மறுபுறம் அழுத்தமும் தராது',
        labelHi: 'छोटी वॉयस नोट भेजना—यह बिना किसी दबाव के अपनी बात सहजता से पहुँचाती है',
        reflection: 'Balances audio nuance with respectful asynchronous boundaries.',
        signalEffect: 'Contributes to Asynchronous Audio Cadence',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q113-text',
        semanticId: 'sem-voice-written-clarity',
        normalizedValue: 20,
        label: 'Crisp, thoughtful written messages—allows each person to read and respond when fully unhurried',
        labelTa: 'தெளிவான குறுஞ்செய்திகள்—இருவரும் தங்களுக்கு நேரம் இருக்கும்போது நிதானமாகப் பதிலளிக்கலாம்',
        labelHi: 'स्पष्ट लिखित संदेश—ताकि दोनों अपनी सुविधानुसार शांत मन से उत्तर दे सकें',
        reflection: 'Low-pressure, thoughtful written cadence.',
        signalEffect: 'Contributes to Thoughtful Text Communication',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-114-unconditional-acceptance',
    themeId: 'theme-confli',
    questionNumber: 114,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['dating', 'matrimony'],
    constructId: 'conflict_repair',
    facetId: 'unconditional_acceptance',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'A partner or close companion has a minor recurring habit that mildly irks you (leaving cupboards open, losing keys, taking long to get ready). What is your instinct?',
    translations: {
      ta: 'உங்கள் துணையிடம் உங்களுக்குச் சற்றே எரிச்சலூட்டும் ஒரு சிறிய பழக்கம் இருந்தால் (எ.கா: சாவியைத் தொலைப்பது, கிளம்பத் தாமதமாவது), உங்கள் அணுகுமுறை என்ன?',
      hi: 'यदि आपके साथी में कोई ऐसी छोटी आदत हो जो कभी-कभी आपको परेशान करे (जैसे चाबी भूलना, तैयार होने में देर लगाना), तो आपकी स्वाभाविक प्रतिक्रिया क्या होती है?'
    },
    context: 'Tolerance for minor idiosyncrasies and friction regulation.',
    whyWeAsk: 'Predicts long-term domestic irritation tolerance and repair styles.',
    researchBasis: 'Gottman (1994) Perpetual problems and humor in enduring relationships.',
    measurementLimitations: 'Actual tolerance is contingent on cumulative relationship stress.',
    culturalSuitabilityNotes: 'Reflects daily domestic life realities in shared households.',
    completionBurdenMs: 14000,
    sectionId: 'conflict_repair',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q114-accept',
        semanticId: 'sem-quirk-gentle-acceptance',
        normalizedValue: 85,
        label: 'Smile and gently accept it as part of their quirky human package, cheerfully helping out without resentment',
        labelTa: 'அவர்களின் இயல்பான ஒரு பகுதியாகப் புன்னகையுடன் ஏற்றுக்கொண்டு உதவுவது',
        labelHi: 'इसे उनके स्वाभाविक व्यक्तित्व का हिस्सा मानकर सहजता और मुस्कान से स्वीकार करना',
        reflection: 'High acceptance and affectionate tolerance of quirks.',
        signalEffect: 'Contributes to High Idiosyncrasy Tolerance',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q114-fix',
        semanticId: 'sem-quirk-light-collaborative-fix',
        normalizedValue: 55,
        label: 'Laugh about it and work together to find a simple practical system (like a key bowl by the door)',
        labelTa: 'ஒன்றாகச் சிரித்துவிட்டு, வீட்டு வாசலில் சாவி வைக்க ஒரு கிண்ணம் வைப்பது போன்ற எளிய வழியைக் காண்பது',
        labelHi: 'हँसी-मज़ाक में एक व्यावहारिक व्यवस्था बना लेना (जैसे दरवाज़े पर चाबी रखने की जगह)',
        reflection: 'Humorous, collaborative practical scaffolding.',
        signalEffect: 'Contributes to Pragmatic Domestic Solutions',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q114-direct',
        semanticId: 'sem-quirk-direct-feedback',
        normalizedValue: 20,
        label: 'Bring it up directly for discussion; small daily friction points erode domestic harmony if left unaddressed',
        labelTa: 'இதை நேரடியாகப் பேசித் தீர்ப்பது—சிறு எரிச்சல்கள் நாளடைவில் மனக்கசப்பை உருவாக்கக்கூடாது',
        labelHi: 'इस पर सीधे बात करना—क्योंकि छोटी-छोटी बातें भी रोज़मर्रा के सुकून को प्रभावित कर सकती हैं',
        reflection: 'Direct friction containment and standards maintenance.',
        signalEffect: 'Contributes to Direct Domestic Standards',
        welcomesComplementarity: false
      }
    ]
  },
  {
    id: 'q-115-standing-up-for-fairness',
    themeId: 'theme-person',
    questionNumber: 115,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'personal_values',
    facetId: 'standing_up_for_fairness',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'At a family or workplace dinner, someone makes a patronizing or exclusionary comment about a quieter person. What is your reaction?',
    translations: {
      ta: 'குடும்பத்தினர் அல்லது அலுவலக விருந்தில், அமைதியாக இருக்கும் ஒருவரைப் பற்றி யாராவது தரக்குறைவாகப் பேசினால் உங்கள் எதிர்வினை என்ன?',
      hi: 'किसी पारिवारिक या कार्यालयीन दावत में, यदि कोई किसी शांत व्यक्ति पर अनुचित या उपहासपूर्ण टिप्पणी करे, तो आपकी प्रतिक्रिया क्या होगी?'
    },
    context: 'Moral courage, social diplomacy, and bystander intervention.',
    whyWeAsk: 'Illuminates core moral orientation toward justice versus social harmony.',
    researchBasis: 'Rest (1986) Moral judgment and prosocial intervention in groups.',
    measurementLimitations: 'Social desirability bias; real courage depends on power dynamics.',
    culturalSuitabilityNotes: 'Crucial in hierarchical Indian group settings (family elders, corporate managers).',
    completionBurdenMs: 14000,
    sectionId: 'personal_values',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q115-confront',
        semanticId: 'sem-fairness-direct-intervention',
        normalizedValue: 90,
        label: 'Speak up right there with clear, respectful firmness to ensure the quieter person is supported',
        labelTa: 'அந்த இடத்திலேயே மரியாதையுடன் உறுதியாகப் பேசி, பாதிக்கப்பட்டவருக்கு ஆதரவளிப்பது',
        labelHi: 'उसी क्षण शालीनता परंतु दृढ़ता से हस्तक्षेप करके उस व्यक्ति का पक्ष लेना',
        reflection: 'High moral assertiveness and public advocacy for fairness.',
        signalEffect: 'Contributes to Moral Assertiveness',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q115-diplomatic',
        semanticId: 'sem-fairness-diplomatic-redirection',
        normalizedValue: 55,
        label: 'Smoothly steer the group conversation away from the insult, and validate the quiet person immediately afterwards in private',
        labelTa: 'உரையாடலை நயமாகத் திசைதிருப்பிவிட்டு, பின்னர் தனியாக அவரிடம் நலம் விசாரிப்பது',
        labelHi: 'बातचीत का रुख सहजता से मोड़ देना और बाद में उस व्यक्ति से अकेले में बात कर ढांढस बंधाना',
        reflection: 'Diplomatic tension defusing coupled with private care.',
        signalEffect: 'Contributes to Diplomatic Compassion',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q115-contain',
        semanticId: 'sem-fairness-non-involvement',
        normalizedValue: 20,
        label: 'Keep quiet to avoid public drama, letting the individuals involved handle their own dynamic',
        labelTa: 'பொது இடத்தில் தகராறைத் தவிர்க்க அமைதியாக இருப்பது—அவர்களே பார்த்துக் கொள்வார்கள்',
        labelHi: 'माहौल में तनाव से बचने के लिए चुप रहना और उनके आपसी मामले में न पड़ना',
        reflection: 'Strict non-confrontational social boundary containment.',
        signalEffect: 'Contributes to Low Public Conflict Involvement',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-116-nature-vs-urban-energy',
    themeId: 'theme-social',
    questionNumber: 116,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'social_energy',
    facetId: 'nature_vs_urban_energy',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'For a 4-day long weekend getaway, which environment genuinely recharges your soul?',
    translations: {
      ta: '4 நாள் வார இறுதி விடுமுறையில், எந்தச் சூழல் உங்கள் மனதிற்கு உண்மையான புத்துணர்ச்சியை அளிக்கும்?',
      hi: '4 दिन की छुट्टियों में, किस तरह का वातावरण आपकी आत्मा को सच्ची शांति और ऊर्जा देता है?'
    },
    context: 'Environmental restoration preferences: wilderness calm vs bustling urban culture.',
    whyWeAsk: 'Vacation and weekend travel harmony is a major source of shared delight or frustration.',
    researchBasis: 'Kaplan (1995) Attention Restoration Theory and nature connectivity.',
    measurementLimitations: 'Preferences can vary depending on work exhaustion levels.',
    culturalSuitabilityNotes: 'Reflects popular Indian weekend destinations (Western Ghats, Goa, Pondicherry, Mumbai).',
    completionBurdenMs: 14000,
    sectionId: 'social_energy',
    triangulationClusterId: 'social_energy_vs_solitude',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q116-nature',
        semanticId: 'sem-travel-quiet-nature',
        normalizedValue: 20,
        label: 'A remote cabin, tea estate, or quiet coastal village with zero traffic, fresh air, and birdsong',
        labelTa: 'பசுமையான தேயிலைத் தோட்டம் அல்லது அமைதியான கடற்கரை கிராமம்—தூய காற்று மற்றும் அமைதி',
        labelHi: 'किसी शांत पहाड़ी क्षेत्र या प्रकृति की गोद में शांति से समय बिताना—प्रदूषण और शोर से दूर',
        reflection: 'Restores through peaceful natural isolation and stillness.',
        signalEffect: 'Contributes to Nature Serenity Preference',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q116-heritage',
        semanticId: 'sem-travel-heritage-blend',
        normalizedValue: 55,
        label: 'A historic town or coastal heritage town (like Pondicherry or Fort Kochi) blending cafes, walking, and quiet reading',
        labelTa: 'புதுச்சேரி அல்லது ஃபோர்ட் கொச்சி போன்ற பாரம்பரியம், கஃபேக்கள் மற்றும் அமைதியான உலா',
        labelHi: 'किसी ऐतिहासिक नगर में घूमना, जहाँ अच्छे कैफ़े, सुंदर रास्ते और आराम दोनों का मेल हो',
        reflection: 'Blends quiet aesthetic leisure with gentle cultural wandering.',
        signalEffect: 'Contributes to Cultural Leisure Balance',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q116-city',
        semanticId: 'sem-travel-dynamic-city',
        normalizedValue: 85,
        label: 'A vibrant metropolis (Mumbai, Bangkok, London)—art walks, diverse food scenes, live music, and city energy',
        labelTa: 'உற்சாகமான பெருநகரம்—கலைக் கண்காட்சிகள், புதிய உணவுகள் மற்றும் இரவு நேர இசை நிகழ்வுகள்',
        labelHi: 'ऊर्जावान बड़े शहर में जाना—कला, नए खान-पान के अनुभव और शहर की जीवंतता का आनंद',
        reflection: 'Energized by urban velocity, culinary diversity, and night life.',
        signalEffect: 'Contributes to Urban Energy Orientation',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-117-investment-risk-tolerance',
    themeId: 'theme-finan',
    questionNumber: 117,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['dating', 'matrimony'],
    constructId: 'finances_independence',
    facetId: 'investment_risk_tolerance',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'When investing your long-term wealth, which statement best captures your comfort level with volatility?',
    translations: {
      ta: 'நீண்டகால முதலீடுகளைச் செய்யும்போது, சந்தை அபாயங்களை எதிர்கொள்ளும் உங்கள் மனநிலை என்ன?',
      hi: 'दीर्घकालिक निवेश करते समय, बाज़ार के उतार-चढ़ाव को लेकर आपका दृष्टिकोण क्या रहता है?'
    },
    context: 'Financial risk tolerance and portfolio volatility comfort.',
    whyWeAsk: 'Financial risk mismatches frequently create anxiety in joint long-term planning.',
    researchBasis: 'Grable & Lytton (1999) Financial risk tolerance measurement.',
    measurementLimitations: 'Influenced by age, dependents, and current market conditions.',
    culturalSuitabilityNotes: 'Bridges traditional Indian asset preferences (gold, real estate) with modern equity investing.',
    completionBurdenMs: 14000,
    sectionId: 'finances_independence',
    triangulationClusterId: 'financial_transparency_planning',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q117-capital',
        semanticId: 'sem-risk-guaranteed-capital',
        normalizedValue: 20,
        label: 'Capital protection first—gold, fixed deposits, sovereign bonds; market crashes keep me awake at night',
        labelTa: 'தங்க முதலீடு, நிரந்தர வைப்பு நிதி போன்ற பாதுகாப்பான வழிகள்—பங்குச்சந்தை ஏற்ற இறக்கம் எனக்கு நிம்மதியளிக்காது',
        labelHi: 'मूलधन की पूर्ण सुरक्षा—सोना, बैंक एफडी; बाज़ार के उतार-चढ़ाव से मुझे चिंता होती है',
        reflection: 'Prioritizes guaranteed capital preservation and zero sleepless nights.',
        signalEffect: 'Contributes to Conservative Financial Risk Stance',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q117-index',
        semanticId: 'sem-risk-disciplined-index',
        normalizedValue: 55,
        label: 'Disciplined diversification—broad index mutual funds and systematic monthly SIPs, weathering downturns calmly',
        labelTa: 'பரவலாக்கப்பட்ட மியூச்சுவல் ஃபண்ட் மற்றும் மாதாந்திர சேமிப்பு (SIP)—சந்தை இறக்கங்களை நிதானமாக எதிர்கொள்வது',
        labelHi: 'अनुशासित म्यूचुअल फंड और नियमित एसआईपी—उतार-चढ़ाव को शांत भाव से स्वीकार करना',
        reflection: 'Balanced, long-term systematic equity compounder.',
        signalEffect: 'Contributes to Balanced Equity Diversification',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q117-growth',
        semanticId: 'sem-risk-high-conviction-growth',
        normalizedValue: 90,
        label: 'High-conviction growth—direct equities, startups, crypto, or commercial property with high upside potential',
        labelTa: 'அதிக வளர்ச்சி தரும் பங்குகள், புதிய தொழில் முதலீடுகள் அல்லது வணிகச் சொத்துக்கள்',
        labelHi: 'अधिक वृद्धि वाले शेयर, नए स्टार्टअप या व्यापारिक अवसर—जोखिम उठाकर बड़ा लाभ पाना',
        reflection: 'High risk appetite and entrepreneurial growth pursuit.',
        signalEffect: 'Contributes to Dynamic High-Growth Risk Stance',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-118-cooking-as-joy-vs-chore',
    themeId: 'theme-famil',
    questionNumber: 118,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'family_domestic',
    facetId: 'cooking_as_joy_vs_chore',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'In your vision of a shared household, how do you perceive cooking meals?',
    translations: {
      ta: 'ஒரு கூட்டு இல்லத்தில், சமைப்பதை நீங்கள் எவ்வாறு கருதுகிறீர்கள்?',
      hi: 'एक साझे घर में, आप भोजन पकाने को किस रूप में देखते हैं?'
    },
    context: 'Domestic culinary division of labor and leisure valuation.',
    whyWeAsk: 'Clarifies whether food preparation is a bonding joy or a chore to be delegated.',
    researchBasis: 'Gottman (1994) Domestic egalitarianism and relationship satisfaction.',
    measurementLimitations: 'Dependent on culinary skill, schedule pressures, and kitchen space.',
    culturalSuitabilityNotes: 'Deconstructs traditional gendered cooking roles into shared joy vs outsourced support.',
    completionBurdenMs: 14000,
    sectionId: 'family_domestic',
    triangulationClusterId: 'shared_decision_making',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q118-creative',
        semanticId: 'sem-cooking-creative-ritual',
        normalizedValue: 85,
        label: 'A joyful, creative ritual—cooking together with music on weekends is one of my favorite shared intimacies',
        labelTa: 'வார இறுதியில் இசையுடன் இணைந்து சமைப்பது ஒரு அழகான குடும்ப மகிழ்ச்சி',
        labelHi: 'साथ मिलकर खाना बनाना एक सुखद अनुभव और आपस में जुड़ने का सबसे सुंदर तरीका है',
        reflection: 'Culinary creativity as a shared bonding ritual.',
        signalEffect: 'Contributes to Collaborative Culinary Ritual',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q118-rotation',
        semanticId: 'sem-cooking-practical-rotation',
        normalizedValue: 50,
        label: 'A functional daily task to be shared fairly and efficiently, using meal prep or cooks when life is hectic',
        labelTa: 'நியாயமாகப் பிரித்துக் கொள்ள வேண்டிய அன்றாடப் பணி—வேலைப்பளு இருந்தால் எளிமைப்படுத்திக் கொள்வது',
        labelHi: 'घर की आवश्यक ज़िम्मेदारी—जिसे आपस में बांटना चाहिए और व्यस्तता में रसोइए का सहयोग लेना चाहिए',
        reflection: 'Pragmatic domestic labor sharing and practical outsourcing.',
        signalEffect: 'Contributes to Pragmatic Domestic Egalitarianism',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q118-utilitarian',
        semanticId: 'sem-cooking-utilitarian-fuel',
        normalizedValue: 15,
        label: 'Utilitarian fuel—preferring quick healthy meals, clean tiffin services, or dining out over spending hours in the kitchen',
        labelTa: 'சமையலறையில் அதிக நேரம் செலவிடுவதை விட, எளிய சத்தான உணவு அல்லது டிபன் சேவைகளுக்கு முன்னுரிமை',
        labelHi: 'रसोई में अधिक समय बिताने के बजाय सरल, पौष्टिक भोजन या टिफिन सेवा को प्राथमिकता देना',
        reflection: 'Time-efficient nutritional fuel over domestic culinary labor.',
        signalEffect: 'Contributes to Outward Efficient Dining Style',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-119-caffeine-and-tea-culture',
    themeId: 'theme-lifes',
    questionNumber: 119,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'daily_lifestyle',
    facetId: 'caffeine_and_tea_culture',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'What is your relationship with morning chai, filter coffee, or artisanal brews?',
    translations: {
      ta: 'காலையில் ஃபில்டர் காபி, தேநீர் அல்லது புத்துணர்ச்சி பானங்கள் அருந்துவது உங்கள் வாழ்க்கையில் என்ன பங்கு வகிக்கிறது?',
      hi: 'सुबह की चाय, फिल्टर कॉफी या अन्य पेय आपके दैनिक जीवन में क्या महत्व रखते हैं?'
    },
    context: 'Micro-rituals of morning pacing and sensory mindfulness.',
    whyWeAsk: 'Shared morning cadence creates subtle but enduring daily compatibility.',
    researchBasis: 'Csikszentmihalyi (1990) Flow and micro-rituals of daily living.',
    measurementLimitations: 'Dietary habits can change based on health or caffeine sensitivity.',
    culturalSuitabilityNotes: 'Deeply evocative in Indian culture (South Indian filter coffee, masala chai rituals).',
    completionBurdenMs: 14000,
    sectionId: 'daily_lifestyle',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q119-ritual',
        semanticId: 'sem-tea-cherished-ritual',
        normalizedValue: 85,
        label: 'A sacred, unhurried morning pause—sitting quietly with a fresh cup of filter coffee or chai sets my whole day right',
        labelTa: 'காலையில் நிதானமாக ஃபில்டர் காபி அல்லது டீ குடிப்பது என் நாளின் மிக முக்கியமான அமைதியான தருணம்',
        labelHi: 'सुबह की चाय या फिल्टर कॉफी एक सुकून भरा पल है, जिससे मेरे पूरे दिन की ऊर्जा तय होती है',
        reflection: 'Mindful sensory morning pause essential to well-being.',
        signalEffect: 'Contributes to Mindful Morning Ritual Cadence',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q119-social',
        semanticId: 'sem-tea-social-connector',
        normalizedValue: 50,
        label: 'A pleasant social habit—enjoying a cup while catching up with colleagues or family, but flexible without it',
        labelTa: 'குடும்பத்தினருடனோ அல்லது அலுவலக நண்பர்களுடனோ பேசிக்கொண்டே அருந்தும் இனிமையான பழக்கம்',
        labelHi: 'परिवार या सहकर्मियों के साथ बातचीत करते हुए चाय-कॉफी पीना एक अच्छी आदत है',
        reflection: 'Socially connective beverage habit with flexible attachment.',
        signalEffect: 'Contributes to Social Beverage Connector',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q119-indifferent',
        semanticId: 'sem-tea-indifferent-utilitarian',
        normalizedValue: 15,
        label: 'Purely utilitarian or indifferent—I drink water or herbal infusions and have zero dependence on caffeine rituals',
        labelTa: 'காபி அல்லது டீ பழக்கம் எனக்கு இல்லை—தண்ணீர் அல்லது எளிய மூலிகை பானங்களே போதுமானது',
        labelHi: 'मुझे चाय या कॉफी की कोई आदत नहीं है—सादा पानी या अन्य पेय ही पर्याप्त हैं',
        reflection: 'Non-dependent, functional hydration preference.',
        signalEffect: 'Contributes to Low Ritual Attachment',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-120-independent-solo-trips',
    themeId: 'theme-bound',
    questionNumber: 120,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['dating', 'matrimony'],
    constructId: 'relational_boundaries',
    facetId: 'independent_solo_trips',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'In an ongoing, deeply committed partnership, how do you feel about each person taking an annual solo trip or getaway with their own friends?',
    translations: {
      ta: 'ஒரு திருமண உறவில் இருக்கும்போது, ஒவ்வொருவரும் தனியாகவோ அல்லது தங்களின் சொந்த நண்பர்களுடனோ ஆண்டிற்கு ஒருமுறை சுற்றுலா செல்வது பற்றி உங்கள் கருத்து என்ன?',
      hi: 'एक गहरे रिश्ते में, दोनों में से किसी का साल में एक बार अकेले या अपने दोस्तों के साथ यात्रा पर जाना आपको कैसा लगता है?'
    },
    context: 'Couple autonomy and friendship preservation in committed partnerships.',
    whyWeAsk: 'Detects attachment security and tolerance for independent individuation.',
    researchBasis: 'Bowen (1978) Family Systems Theory: Differentiation of self in intimate partnerships.',
    measurementLimitations: 'Dependent on trust history and shared child-rearing responsibilities.',
    culturalSuitabilityNotes: 'Crucial for modern Indian relationships balancing couple unity with independent identity.',
    completionBurdenMs: 14000,
    sectionId: 'relational_boundaries',
    triangulationClusterId: 'opposite_sex_friendship_boundaries',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q120-celebrated',
        semanticId: 'sem-solotrip-healthy-celebrated',
        normalizedValue: 85,
        label: 'Fully celebrated—maintaining individual friendships and solo adventures keeps both partners refreshed and interesting',
        labelTa: 'மிகவும் ஆரோக்கியமானது—தனியாகவோ அல்லது சொந்த நண்பர்களுடனோ சுற்றுலா செல்வது புத்துணர்ச்சி தரும்',
        labelHi: 'पूरी तरह सकारात्मक—साथी का अपने दोस्तों के साथ या अकेले यात्रा करना रिश्ते को ताज़ा रखता है',
        reflection: 'High individuation and secure autonomous support.',
        signalEffect: 'Contributes to Autonomous Relational Security',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q120-aligned',
        semanticId: 'sem-solotrip-occasional-aligned',
        normalizedValue: 50,
        label: 'Comfortable occasionally, provided major annual vacation leaves and budget are prioritized for our shared memories',
        labelTa: 'எப்போதாவது சரி, ஆனால் பிரதான விடுமுறைகளும் சேமிப்பும் நாம் ஒன்றாகச் செல்வதற்கே இருக்க வேண்டும்',
        labelHi: 'कभी-कभार ठीक है, परंतु मुख्य छुट्टियां और बजट हमारे साथ बिताए जाने वाले समय के लिए होने चाहिए',
        reflection: 'Shared-first prioritization with room for occasional solo retreats.',
        signalEffect: 'Contributes to Shared-First Travel Balance',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q120-together',
        semanticId: 'sem-solotrip-always-together',
        normalizedValue: 15,
        label: 'Unnatural—I love experiencing the world together; vacation time is when we should be side by side',
        labelTa: 'நாம் உலகைப் பார்க்கும் பயணங்கள் அனைத்தும் ஒன்றாகவே அமைய வேண்டும் என்று விரும்புவது',
        labelHi: 'छुट्टियों का अर्थ ही एक-दूसरे के साथ होना है—अकेले यात्रा करने के बजाय साथ घूमना अधिक प्रिय है',
        reflection: 'Strong interdependence and exclusively shared leisure preference.',
        signalEffect: 'Contributes to Highly Interdependent Partnership',
        welcomesComplementarity: false
      }
    ]
  },
  {
    id: 'q-121-arts-culture-exploration',
    themeId: 'theme-intel',
    questionNumber: 121,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'intellectual_curiosity',
    facetId: 'arts_culture_exploration',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'How drawn are you to spending an evening at classical music concerts (Carnatic/Hindustani), theatre, art galleries, or heritage walks?',
    translations: {
      ta: 'கர்நாடக/ஹிந்துஸ்தானி இசைக்கச்சேரி, நாடகம், ஓவியக் கண்காட்சி அல்லது பாரம்பரிய நடைப்பயணங்களில் உங்களுக்கு எவ்வளவு ஈடுபாடு உண்டு?',
      hi: 'शास्त्रीय संगीत (कर्नाटक/हिंदुस्तानी), रंगमंच, कला दीर्घाओं या ऐतिहासिक स्थलों के भ्रमण में आपकी कितनी स्वाभाविक रुचि रहती है?'
    },
    context: 'Cultural aesthetic engagement and artistic resonance.',
    whyWeAsk: 'Aesthetic alignment enriches weekend dating and shared emotional experiences.',
    researchBasis: 'Silvia (2005) Knowledge and aesthetic interest in Openness to Experience.',
    measurementLimitations: 'Varies with local city cultural infrastructure and accessibility.',
    culturalSuitabilityNotes: 'Deeply rooted in Indian classical sabhas, Delhi theatre, and Kolkata art circles.',
    completionBurdenMs: 14000,
    sectionId: 'intellectual_curiosity',
    triangulationClusterId: 'intellectual_curiosity_debate',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q121-patron',
        semanticId: 'sem-arts-frequent-patron',
        normalizedValue: 85,
        label: 'Drawn and enriched—I actively seek out live theatre, cultural festivals, exhibitions, or heritage explorations',
        labelTa: 'நாடகம், பாரம்பரிய இசைக் கச்சேரிகள் மற்றும் கலைக் கண்காட்சிகளுக்கு விரும்பிச் செல்பவர்',
        labelHi: 'शास्त्रीय संगीत, नाटक, कला प्रदर्शनियों और सांस्कृतिक धरोहरों में गहरी रुचि और उपस्थिति',
        reflection: 'High aesthetic sensitivity and active cultural patronage.',
        signalEffect: 'Contributes to Aesthetic Cultural Affinity',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q121-receptive',
        semanticId: 'sem-arts-occasional-companion',
        normalizedValue: 50,
        label: 'Happy to attend when with a companion who loves it, enjoying the atmosphere without driving it myself',
        labelTa: 'துணைக்கு விருப்பமிருந்தால் மகிழ்ச்சியுடன் உடன் சென்று அந்தச் சூழலை ரசிப்பது',
        labelHi: 'यदि साथी को पसंद हो तो खुशी से साथ जाना और उस सुंदर वातावरण का आनंद लेना',
        reflection: 'Receptive social companion enjoying shared atmosphere.',
        signalEffect: 'Contributes to Receptive Cultural Participation',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q121-modern',
        semanticId: 'sem-arts-alternative-entertainment',
        normalizedValue: 15,
        label: 'Uninterested—I prefer movies, sports events, gaming, or dining out over classical or formal arts events',
        labelTa: 'கலை நிகழ்ச்சிகளை விட திரைப்படங்கள், விளையாட்டுப் போட்டிகள் அல்லது உணவகங்களுக்குச் செல்வது',
        labelHi: 'शास्त्रीय कलाओं के बजाय फिल्में, खेलकूद या अच्छे रेस्तरां में जाना अधिक पसंद है',
        reflection: 'Prefers contemporary popular entertainment over classical arts.',
        signalEffect: 'Contributes to Popular Commercial Entertainment Style',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-122-patience-in-frustrations',
    themeId: 'theme-emoti',
    questionNumber: 122,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'emotional_regulation',
    facetId: 'patience_in_frustrations',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'You are stuck in a 45-minute Bengaluru/Mumbai traffic jam or an unmoving administrative line through no fault of your own. What happens inside?',
    translations: {
      ta: 'பெங்களூரு அல்லது மும்பை போன்ற நகரில் 45 நிமிடக் கடுமையான போக்குவரத்து நெரிசலில் மாட்டிக்கொள்ளும் போது, உங்கள் மனநிலை என்னவாகும்?',
      hi: 'जब आप किसी भारी ट्रैफिक जाम या धीमी प्रशासनिक कतार में फंस जाते हैं, तो आपके भीतर क्या प्रतिक्रिया होती है?'
    },
    context: 'Frustration tolerance and inner equilibrium during external friction.',
    whyWeAsk: 'Reveals day-to-day patience and emotional reactivity in urban friction.',
    researchBasis: 'Rotter (1966) Locus of control and emotional reactivity.',
    measurementLimitations: 'Fatigue and physical hunger can temporarily lower tolerance.',
    culturalSuitabilityNotes: 'Directly addresses daily life realities across Indian urban metropolises.',
    completionBurdenMs: 14000,
    sectionId: 'emotional_regulation',
    triangulationClusterId: 'stress_regulation_and_decompression',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q122-zen',
        semanticId: 'sem-patience-zen-acceptance',
        normalizedValue: 85,
        label: 'Zen acceptance—it is outside my control, so I pop on an audiobook, podcast, or enjoy peaceful headspace',
        labelTa: 'என் கையில் இல்லாத சூழ்நிலை என்பதால், அமைதியாக பாட்காஸ்ட் அல்லது பாடல்களைக் கேட்டு ரசிப்பது',
        labelHi: 'जो मेरे वश में नहीं है उस पर गुस्सा न कर, शांति से कोई ऑडियोबुक या संगीत सुनकर समय बिताना',
        reflection: 'High cognitive reframing and philosophical equanimity.',
        signalEffect: 'Contributes to Frustration Tolerance & Zen Equanimity',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q122-mild',
        semanticId: 'sem-patience-mild-venting',
        normalizedValue: 50,
        label: 'A flash of inner annoyance, maybe checking alternative routes on Google Maps, settling down once a rhythm appears',
        labelTa: 'ஆரம்பத்தில் சற்று எரிச்சல் அடைந்தாலும், மாற்று வழிகளைத் தேடிவிட்டு அமைதியடைவது',
        labelHi: 'थोड़ा चिड़चिड़ापन होना, परंतु गूगल मैप्स पर अन्य रास्ते देखकर स्थिति को स्वीकार कर लेना',
        reflection: 'Moderate situational annoyance redirected toward problem-solving.',
        signalEffect: 'Contributes to Pragmatic Stress Management',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q122-restless',
        semanticId: 'sem-patience-visceral-restlessness',
        normalizedValue: 15,
        label: 'Deep visceral agitation—wasting valuable time in avoidable inefficiency feels intensely suffocating',
        labelTa: 'நேரம் வீணாவதை நினைத்து மிகுந்த படபடப்பும் கடுமையான சலிப்பும் அடைவது',
        labelHi: 'समय की बर्बादी पर गहरी बेचैनी और गुस्सा महसूस होना, क्योंकि ऐसी देरी मुझे बहुत परेशान करती है',
        reflection: 'Low tolerance for avoidable friction and time inefficiency.',
        signalEffect: 'Contributes to High Reactivity to Inefficiency',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-123-environmental-consciousness',
    themeId: 'theme-goals',
    questionNumber: 123,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'long_term_goals',
    facetId: 'environmental_consciousness',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'How do environmental considerations (plastic reduction, waste segregation, water conservation, sustainable fashion) influence your daily choices?',
    translations: {
      ta: 'நெகிழி பயன்பாட்டைக் குறைத்தல், குப்பையைப் பிரித்தல், நீர் சேமிப்பு போன்ற சுற்றுச்சூழல் விழிப்புணர்வு உங்கள் அன்றாட முடிவுகளை எவ்வாறு பாதிக்கிறது?',
      hi: 'प्लास्टिक का कम उपयोग, गीला-सूखा कचरा अलग करना और पानी की बचत जैसे पर्यावरणीय विचार आपके दैनिक निर्णयों को कितना प्रभावित करते हैं?'
    },
    context: 'Ecological responsibility and sustainable everyday consumption.',
    whyWeAsk: 'Living space and domestic consumption harmony for environmentally conscious adults.',
    researchBasis: 'Dunlap et al. (2000) New Ecological Paradigm in environmental values.',
    measurementLimitations: 'Gap often exists between ecological attitudes and consumer convenience.',
    culturalSuitabilityNotes: 'Reflects municipal waste segregation mandates in Bangalore, Chennai, Pune.',
    completionBurdenMs: 14000,
    sectionId: 'long_term_goals',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q123-conscious',
        semanticId: 'sem-eco-conscious-lifestyle',
        normalizedValue: 85,
        label: 'Conscious commitment—I diligently segregate waste, carry cloth bags, avoid single-use plastics, and research ethical choices',
        labelTa: 'மக்கும் குப்பையைப் பிரிப்பது, துணிப்பை பயன்படுத்துவது, பிளாஸ்டிக்கைத் தவிர்ப்பதில் உறுதியான கவனம்',
        labelHi: 'कचरा अलग करना, कपड़े के थैले रखना और सिंगल-यूज़ प्लास्टिक से बचना मेरी दिनचर्या का हिस्सा है',
        reflection: 'High personal ecological stewardship and mindful consumption.',
        signalEffect: 'Contributes to Conscious Ecological Living',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q123-sensible',
        semanticId: 'sem-eco-sensible-moderation',
        normalizedValue: 50,
        label: 'Sensible everyday habits—turning off taps, saving electricity, and avoiding blatant waste without obsessive lifestyle policing',
        labelTa: 'தண்ணீர் மற்றும் மின்சாரத்தை வீணாக்காமல் இருப்பது போன்ற நடைமுறை சார்ந்த நல்ல பழக்கங்கள்',
        labelHi: 'बिजली-पानी की बचत करना और अनावश्यक बर्बादी से बचना जैसे सामान्य समझदारी भरे नियम',
        reflection: 'Pragmatic conservation and anti-waste mindfulness.',
        signalEffect: 'Contributes to Sensible Ecological Conservation',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q123-convenience',
        semanticId: 'sem-eco-convenience-first',
        normalizedValue: 15,
        label: 'Convenience first—prioritizing ease, busy work schedules, and affordability over strict environmental rules',
        labelTa: 'வேலைப்பளுவில் வசதி மற்றும் நேர சேமிப்பிற்கு முன்னுரிமை—கடுமையான சுற்றுச்சூழல் விதிகள் சிரமம்',
        labelHi: 'व्यस्तता और सुविधा को प्राथमिकता देना—हर बात में कड़े नियमों का पालन करना व्यावहारिक नहीं लगता',
        reflection: 'Convenience, affordability, and time-saving over green consumerism.',
        signalEffect: 'Contributes to Practical Convenience Priority',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-124-teamwork-in-adversity',
    themeId: 'theme-roman',
    questionNumber: 124,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['dating', 'matrimony'],
    constructId: 'romantic_expectations',
    facetId: 'teamwork_in_adversity',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'When an unexpected life crisis hits (sudden job transition, health scare, family grief), what partnership dynamic makes you feel secure?',
    translations: {
      ta: 'வாழ்க்கையில் திடீர் வேலை இழப்பு, உடல்நலக் குறைவு போன்ற நெருக்கடி வரும்போது, உங்கள் இணையுடன் எந்த விதமான அணுகுமுறை உங்களுக்குப் பாதுகாப்பு தரும்?',
      hi: 'अचानक नौकरी में बदलाव, बीमारी या पारिवारिक संकट के समय, अपने साथी के साथ कैसा तालमेल आपको मानसिक संबल देता है?'
    },
    context: 'Dyadic coping and crisis coordination in committed life partnerships.',
    whyWeAsk: 'Predicts marital resilience under economic and emotional adversity.',
    researchBasis: 'Bodenmann (2005) Dyadic coping in couples under acute chronic stress.',
    measurementLimitations: 'Stated dynamic may shift depending on whether the crisis affects one or both partners.',
    culturalSuitabilityNotes: 'Crucial for Indian couples weathering economic transitions and joint family crises.',
    completionBurdenMs: 14000,
    sectionId: 'romantic_expectations',
    triangulationClusterId: 'shared_decision_making',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q124-squad',
        semanticId: 'sem-adversity-joint-squad',
        normalizedValue: 85,
        label: 'A unified "us against the world" command center—daily huddles, transparent feelings, and solving every detail side by side',
        labelTa: '"நாம் ஒன்றாக இதை வெல்வோம்"—ஒவ்வொரு நாளும் பேசி, ஒருவருக்கொருவர் தோள் கொடுத்துச் செயல்படுவது',
        labelHi: 'एक मज़बूत टीम बनकर हर चुनौती का सामना करना—दिन-प्रतिदिन साथ मिलकर रणनीति बनाना और सम्बल देना',
        reflection: 'High collaborative solidarity and deep emotional alignment in crisis.',
        signalEffect: 'Contributes to Dyadic Teamwork in Adversity',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q124-division',
        semanticId: 'sem-adversity-complementary-roles',
        normalizedValue: 50,
        label: 'Clear division of labor—one partner manages logistics while the other anchors emotional care or outside affairs',
        labelTa: 'ஒருவருக்கு ஒருவர் சுமையை முறையாகப் பிரித்துக் கொண்டு, தேவையான ஆதரவை வழங்குவது',
        labelHi: 'काम का स्पष्ट बंटवारा—एक व्यक्ति व्यवस्था संभाले और दूसरा भावनात्मक संबल दे',
        reflection: 'Functional role specialization and practical crisis stewardship.',
        signalEffect: 'Contributes to Functional Role Differentiation',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q124-containment',
        semanticId: 'sem-adversity-independent-containment',
        normalizedValue: 20,
        label: 'Giving each other space to process grief or stress individually before coming together once the dust settles',
        labelTa: 'ஆரம்பத்தில் அவரவர் மன அழுத்தத்தைத் தனிமையில் கையாள இடம் தந்து, பின்னர் கனிவுடன் இணைவது',
        labelHi: 'पहले अपने स्तर पर तनाव को शांत करने का समय देना और फिर साथ मिलकर आगे बढ़ना',
        reflection: 'Independent emotional self-soothing before collective regrouping.',
        signalEffect: 'Contributes to Autonomous Crisis Processing',
        welcomesComplementarity: true
      }
    ]
  },
  {
    id: 'q-125-humility-in-achievement',
    themeId: 'theme-person',
    questionNumber: 125,
    module: 'Everyday Values & Repair',
    intentionScope: 'All intentions',
    applicableIntentions: ['friendship', 'dating', 'matrimony'],
    constructId: 'personal_values',
    facetId: 'humility_in_achievement',
    formatType: 'situational_judgment',
    scoringType: 'continuous_trait',
    stage: 2,
    reverseKeyed: false,
    validationStatus: 'PILOT_REVIEWED',
    supportedLanguages: ['en', 'ta', 'hi'],
    prompt: 'When you achieve a major career milestone, promotion, or personal creative triumph, how do you naturally like to mark it?',
    translations: {
      ta: 'வேலையில் ஒரு பெரிய வெற்றி, பதவி உயர்வு அல்லது படைப்பாற்றல் சாதனை நிகழும்போது, அதை எப்படிக் கொண்டாட விரும்புகிறீர்கள்?',
      hi: 'जब आपको करियर में कोई बड़ी सफलता, पदोन्नति या व्यक्तिगत उपलब्धि मिलती है, तो आप स्वाभाविक रूप से उसका जश्न कैसे मनाना पसंद करते हैं?'
    },
    context: 'Public self-presentation and humility versus overt triumph broadcasting.',
    whyWeAsk: 'Reveals humility, social orientation, and relational sharing styles in achievement.',
    researchBasis: 'Leary (2007) Relational evaluation, self-presentation, and humble self-enhancement.',
    measurementLimitations: 'May vary depending on whether the achievement was individual or collective.',
    culturalSuitabilityNotes: 'Captures the Indian cultural balance between humble gratitude and earned self-expression.',
    completionBurdenMs: 14000,
    sectionId: 'personal_values',
    isApprovedForMembers: true,
    options: [
      {
        id: 'opt-q125-quiet',
        semanticId: 'sem-triumph-quiet-gratitude',
        normalizedValue: 85,
        label: 'A quiet, reflective celebration—a quiet dinner with 1 or 2 closest loved ones and quiet gratitude for those who helped',
        labelTa: 'மிக நெருக்கமான ஒன்று அல்லது இரண்டு பேருடன் அமைதியான இரவு உணவு மற்றும் மனமார்ந்த நன்றி',
        labelHi: 'केवल अपने सबसे करीबी लोगों के साथ सादगी से जश्न मनाना और ईश्वर व सहयोगियों के प्रति कृतज्ञ होना',
        reflection: 'Grounded humility and intimate, heartfelt gratitude.',
        signalEffect: 'Contributes to Humble Groundedness',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q125-community',
        semanticId: 'sem-triumph-shared-team-dinner',
        normalizedValue: 55,
        label: 'Hosting a warm celebratory dinner or party for the close friends, mentors, and peers who supported the journey',
        labelTa: 'உடன் நின்ற நண்பர்கள் மற்றும் வழிகாட்டிகளை அழைத்து ஓர் அன்பான விருந்து அளித்துக் கொண்டாடுவது',
        labelHi: 'इस यात्रा में साथ देने वाले मित्रों और सहयोगियों को बुलाकर एक स्नेहपूर्ण दावत देना',
        reflection: 'Communal celebration sharing credit with supportive network.',
        signalEffect: 'Contributes to Communal Triumph Sharing',
        welcomesComplementarity: true
      },
      {
        id: 'opt-q125-visible',
        semanticId: 'sem-triumph-visible-pride',
        normalizedValue: 20,
        label: 'Visible public pride—sharing the milestone on professional and social networks, savoring hard-earned recognition',
        labelTa: 'சமூக வலைத்தளங்களிலும் நண்பர்களிடமும் வெளிப்படையாகப் பகிர்ந்து, உழைப்பின் வெற்றியை ரசிப்பது',
        labelHi: 'अपनी मेहनत की सफलता को खुले दिल से सोशल मीडिया पर साझा करना और सार्वजनिक पहचान का आनंद लेना',
        reflection: 'Confident public celebration and comfortable visibility.',
        signalEffect: 'Contributes to Visible Public Self-Confidence',
        welcomesComplementarity: true
      }
    ]
  }`;

const updatedContent = content.substring(0, startIdx) + replacementQuestions + content.substring(endIdx);
fs.writeFileSync(filePath, updatedContent, 'utf-8');
console.log("Successfully replaced Q101-Q125 with reviewed scenario items!");

