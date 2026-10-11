import { useState, useRef, useEffect } from 'react'
import { 
  Bot, 
  Send, 
  Mic, 
  MicOff, 
  Sparkles, 
  Languages, 
  ShieldCheck, 
  Volume2,
  VolumeX,
  X
} from 'lucide-react'
import { I18N } from '../data/scholarshipData'
import { askGemini } from '../services/geminiService'
import './GrievanceAssistant.css'

// Multilingual Knowledge Base for ScholarBridge AI Student Advisor
const KNOWLEDGE_BASE = {
  en: {
    welcome: (name) => `Namaste ${name}! I am the ScholarBridge AI Student Advisor. I can answer your questions on scholarship schemes, application tracking, DigiLocker verification, DBT payments, and general academic guidelines.`,
    citation: 'National Scholarship Guidelines 2026-27',
    inputPlaceholder: 'Ask any question in English, Hindi, or regional languages...',
    speakingToast: 'Playing audio explanation in English...',
    questions: [
      { q: 'What is my scholarship & DBT payment status?', a: 'Your scholarship grant (₹20,000) has been fully verified and DBT funds were successfully credited to your State Bank of India account (UTR: RBI2026091298412 on 12 September 2026).' },
      { q: 'Can I apply for another fellowship if I already receive an active scholarship?', a: 'Under Central Scholarship regulations (Rule 11/GFR 2017), simultaneous availing of multiple scholarships is barred. However, ScholarBridge provides an automated Scheme Transition / Relinquishment NOC feature to transition safely without penalty.' },
      { q: 'Why is my application flagged with an action required?', a: 'The Nodal Officer requested an updated Income Certificate with a clear digital seal. You can resolve this instantly with 1-click DigiLocker sync on your Application Tracker tab.' },
      { q: 'Which documents are auto-verified via DigiLocker?', a: 'Your Aadhaar Card, State Domicile Certificate, and Class 12 Marksheet are auto-verified with official digital signatures via DigiLocker and APAAR.' }
    ]
  },
  hi: {
    welcome: (name) => `जोहार / नमस्ते ${name}! मैं जनजातीय कार्य मंत्रालय (MoTA) का 'जनजातीय एआई सहायक (JAGO)' हूँ। मैं सभी 5 छात्रवृत्ति योजनाओं, डीबीटी भुगतान स्थिति, डिजिलॉकर सत्यापन, और शिक्षा एवं सामान्य ज्ञान से जुड़े किसी भी प्रश्न में आपकी पूरी सहायता कर सकता हूँ।`,
    citation: 'जनजातीय कार्य मंत्रालय दिशा-निर्देश 2026-27',
    inputPlaceholder: 'हिंदी, संथाली, गोंडी या अंग्रेजी में प्रश्न पूछें...',
    speakingToast: 'हिंदी में ध्वनि संदेश सुनाया जा रहा है...',
    questions: [
      { q: 'मेरी छात्रवृत्ति और डीबीटी भुगतान की स्थिति क्या है?', a: 'आपकी पोस्ट-मैट्रिक छात्रवृत्ति (₹18,500) पूरी तरह सत्यापित हो चुकी है और डीबीटी राशि 12 सितंबर 2026 को आपके भारतीय स्टेट बैंक (SBI) खाते में सफलतापूर्वक जमा हो चुकी है (UTR: RBI2026091298412)।' },
      { q: 'क्या पोस्ट-मैट्रिक के साथ NFST फेलोशिप भी मिल सकती है?', a: 'जनजातीय कार्य मंत्रालय के "एक सक्रिय छात्रवृत्ति" नियम (GFR 2017) के तहत आप एक साथ दो छात्रवृत्तियां नहीं ले सकते। हालांकि, TRISHA में स्वचालित अनापत्ति प्रमाण पत्र (NOC) की सुविधा है।' },
      { q: 'मेरे टॉप क्लास आवेदन पर कार्रवाई क्यों दिखाई दे रही है?', a: 'राज्य नोडल अधिकारी द्वारा वर्ष 2025-26 के आय प्रमाण पत्र के पुनः सत्यापन का अनुरोध किया गया है। आप "ट्रैकर" टैब में जाकर डिजिलॉकर लाइव सिंक द्वारा इसे तुरंत ठीक कर सकते हैं।' },
      { q: 'डिजिलॉकर से कौन से दस्तावेज़ सत्यापित हैं?', a: 'आपका आधार कार्ड, एसटी जाति प्रमाण पत्र (ई-डिस्ट्रिक्ट) एवं कक्षा 12 की अंकतालिका डिजिलॉकर और APAAR के माध्यम से डिजिटल रूप से सत्यापित हैं।' }
    ]
  },
  santhali: {
    welcome: (name) => `ᱡᱚᱦᱟᱨ ${name}! ᱤᱧ ᱫᱚ ᱡᱚᱱᱡᱟᱹᱛᱤᱭᱟᱹᱨᱤ ᱢᱚᱱᱛᱨᱟᱲᱚᱭ (MoTA) ᱨᱤᱱᱤᱡ 'ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱮᱟᱭ ᱜᱚᱲᱚᱣᱟᱱ (JAGO)' ᱠᱟᱱᱟᱹᱧ᱾`,
    citation: 'MoTA ᱟᱹᱫᱤᱵᱟᱹᱥᱤ ᱱᱤᱭᱟᱹᱢ ᱒᱐᱒᱖-᱒᱗',
    inputPlaceholder: 'ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱠᱩᱞᱤ ᱢᱮ...',
    speakingToast: 'ᱥᱟᱱᱛᱟᱲᱤ ᱛᱮ ᱟᱲᱟᱝ ᱥᱟᱰᱮ ᱪᱟᱹᱞᱩ ᱟᱠᱟᱱᱟ...',
    questions: [
      { q: 'ᱤᱧᱟᱜ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱟᱨ ᱴᱟᱠᱟ ᱧᱟᱢ ᱨᱮᱱᱟᱜ ᱦᱟᱞᱚᱛ ᱪᱮᱫ ᱠᱟᱱᱟ?', a: 'ᱟᱢᱟᱜ ᱯᱳᱥᱴ-ᱢᱮᱴᱨᱤᱠ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ (₹18,500) ᱯᱩᱨᱟᱹ ᱡᱟᱸᱪ ᱦᱩᱭ ᱟᱠᱟᱱᱟ ᱟᱨ SBI ᱵᱮᱸᱠ ᱮᱠᱟᱣᱩᱱᱴ ᱨᱮ ᱴᱟᱠᱟ ᱥᱮᱴᱮᱨ ᱟᱠᱟᱱᱟ᱾' },
      { q: 'ᱯᱳᱥᱴ-ᱢᱮᱴᱨᱤᱠ ᱛᱟᱦᱮᱸᱱ ᱛᱩᱞᱩᱡ NFST ᱯᱷᱮᱞᱳᱥᱤᱯ ᱧᱟᱢᱚᱜ-ᱟ ᱥᱮ ᱵᱟᱝ?', a: 'MoTA ᱨᱮᱱᱟᱜ ᱢᱤᱫ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱱᱤᱭᱟᱹᱢ ᱞᱮᱠᱟᱛᱮ ᱵᱟᱨᱭᱟ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱢᱤᱫ ᱫᱷᱟᱣ ᱨᱮ ᱵᱟᱝ ᱧᱟᱢᱚᱜ-ᱟ᱾ ᱢᱮᱱᱠᱷᱟᱱ TRISHA ᱨᱮ ᱟᱡ ᱛᱮᱜᱮ NOC ᱵᱮᱱᱟᱣ ᱠᱟᱛᱮ NFST ᱨᱮ ᱵᱚᱫᱚᱞ ᱜᱟᱱᱚᱜ-ᱟ᱾' }
    ]
  },
  gondi: {
    welcome: (name) => `सेवा जोहार / राम-राम ${name}! नन्ना जनजातीय मंत्रालय (MoTA) ना 'सहायी संगी (JAGO)' आन।`,
    citation: 'MoTA गोंडी सेवा नियम 2026-27',
    inputPlaceholder: 'गोंडी ते सवाल कीम...',
    speakingToast: 'गोंडी ते आवाज चालू मंता...',
    questions: [
      { q: 'मावा छात्रवृत्ति अउर DBT पैसा ना हाल बोर मंता?', a: 'नीवा पोस्ट-मैट्रिक छात्रवृत्ति (₹18,500) जांच पूरो आता अउर SBI बैंक खाता ते पैसा जमा आता।' },
      { q: 'पोस्ट-मैट्रिक कज्या NFST फेलोशिप मिलि की?', a: 'MoTA ना नियम मुतालिक एक बेर ते रोंड (2) छात्रवृत्ति मिले वयो। पण TRISHA ते ऑटोमैटिक NOC कीसी NFST ते जासे सुविधा मंता।' }
    ]
  },
  ho: {
    welcome: (name) => `ᱡᱚᱦᱟᱨ ${name}! ᱤᱧ ᱫᱚ ᱢᱚᱱᱛᱨᱤ ᱢᱟᱰᱮᱨ (MoTA) ᱨᱤᱱᱤᱡ 'ᱦᱳ ᱮᱟᱭ ᱜᱚᱲᱚᱣᱟᱱ (JAGO)' ᱠᱟᱱᱟᱹᱧ᱾`,
    citation: 'MoTA ᱦᱳ ᱫᱤᱥᱟᱹ-ᱩᱫᱩᱜ ᱒᱐᱒᱖-᱒᱗',
    inputPlaceholder: 'ᱦᱳ ᱛᱮ ᱠᱩᱞᱤ ᱢᱮ...',
    speakingToast: 'ᱦᱳ ᱛᱮ ᱟᱲᱟᱝ ᱥᱟᱰᱮ ᱪᱟᱹᱞᱩ ᱟᱠᱟᱱᱟ...',
    questions: [
      { q: 'ᱤᱧᱟᱜ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ ᱟᱨ ᱴᱟᱠᱟ ᱦᱟᱞᱚᱛ ᱪᱮᱫ ᱢᱮᱱᱟᱜ-ᱟ?', a: 'ᱟᱢᱟᱜ ᱯᱳᱥᱴ-ᱢᱮᱴᱨᱤᱠ ᱥᱠᱚᱞᱟᱨᱥᱤᱯ (₹18,500) ᱯᱩᱨᱟᱹ ᱡᱟᱸᱪ ᱦᱩᱭ ᱟᱠᱟᱱᱟ᱾' }
    ]
  },
  bodo: {
    welcome: (name) => `खुलुमबाय ${name}! आं जनजातीय मन्त्रालय (MoTA) नि 'बर\' एआइ मददगिरि (JAGO)'।`,
    citation: 'MoTA बर\' बिथोन 2026-27',
    inputPlaceholder: 'बर\' रावजों सों...',
    speakingToast: 'बर\' रावजों खोनासं...',
    questions: [
      { q: 'आंनि अनसुंथाइ आरो DBT रां मोननायनि थासारिया मा?', a: 'नोंथांनि पोस्ट-मेट्रिक अनसुंथाइ (₹18,500) आनजाद जाबाय आरो SBI बैंक एकाउन्टआव रां हरबाय।' }
    ]
  },
  kui: {
    welcome: (name) => `ଜୁହାର ${name}! ମୁଁ ଜନଜାତି କଲ୍ୟାଣ ମନ୍ତ୍ରଣାଳୟ (MoTA) ର 'କୁଇ ଏଆଇ ସହାୟକ (JAGO)'।`,
    citation: 'MoTA କୁଇ ନିୟମାବଳୀ ୨୦୨୬-୨୭',
    inputPlaceholder: 'କୁଇ ଭାଷାରେ ପ୍ରଶ୍ନ ପଚାରନ୍ତୁ...',
    speakingToast: 'କୁଇ ଭାଷାରେ ଶୁଣାଯାଉଛି...',
    questions: [
      { q: 'ମୋର ବୃତ୍ତି ଓ DBT ଟଙ୍କାର ସ୍ଥିତି କ\'ଣ?', a: 'ଆପଣଙ୍କ ପୋଷ୍ଟ-ମେଟ୍ରିକ ବୃତ୍ତି (₹୧୮,୫୦୦) ଯାଞ୍ଚ ହୋଇସାରିଛି ଏବଂ SBI ବ୍ୟାଙ୍କ ଖାତାକୁ ଟଙ୍କା ପଠାଯାଇଛି।' }
    ]
  }
}

// Smart language & script auto-detection
function detectLanguage(text, activeLang) {
  if (!text) return activeLang
  if (/[\u0900-\u097F]/.test(text)) {
    if (activeLang === 'gondi' || activeLang === 'bodo') return activeLang
    return 'hi'
  }
  if (/[\u1C50-\u1C7F]/.test(text)) return 'santhali'
  if (/[\u0B00-\u0B7F]/.test(text)) return 'kui'

  const lower = text.toLowerCase()
  if (lower.includes('hindi') || lower.includes('in hindi') || lower.includes('हिंदी')) return 'hi'
  if (lower.includes('santhali') || lower.includes('santali')) return 'santhali'
  if (lower.includes('gondi') || lower.includes('गोंडी')) return 'gondi'
  if (lower.includes('english') || lower.includes('angrezi')) return 'en'

  const hinglishPatterns = [
    /\b(kya|main|mujhe|mera|meri|mere|milega|mil|rahi|raha|sakta|saktee|hai|hain|hoon|ho|aavedan|shuru|kaise|kab|kitna|paisa|paise|stithi|jaanch|chahiye|kyun|kyu|kaun|dono|pehle|karen|karo|batao|kisi|kisko|unhe)\b/i
  ]
  if (hinglishPatterns.some(regex => regex.test(lower))) return 'hi'

  return activeLang
}

// Rich contextual fallbacks when Gemini is temporarily unavailable
function generateIntelligentFallback(query, detectedLang) {
  const q = query.toLowerCase()
  const isHi = detectedLang === 'hi'

  if (q.includes('india') || q.includes('bharat') || q.includes('special') || q.includes('good about') || q.includes('खासियत') || q.includes('भारत')) {
    return isHi
      ? `🇮🇳 भारत की प्रमुख विशेषताएं:\n\n• **विविधता में एकता:** 28 राज्य, 8 केंद्र शासित प्रदेश, 22 आधिकारिक भाषाएं।\n• **समृद्ध सांस्कृतिक विरासत:** सहस्राब्दियों पुरानी ज्ञान परंपरा एवं प्राकृतिक समन्वय।\n• **डिजिटल पब्लिक इन्फ्रास्ट्रक्चर (DPI):** UPI, डिजिलॉकर, PFMS DBT — विश्व का सबसे तेज़ डिजिटल समावेशन।\n• **विश्वस्तरीय उच्च शिक्षा:** IITs, NITs, IIMs, AIIMS — राष्ट्रीय छात्रवृत्तियों से सुलभ।`
      : `🇮🇳 Notable Specialties of India:\n\n• **Unity in Diversity:** 28 states, 8 union territories, 22 official languages, rich vibrant cultures.\n• **Centuries of Academic Heritage:** World-renowned traditions of mathematics, philosophy, and sciences.\n• **Digital Public Infrastructure:** UPI, DigiLocker, PFMS DBT — world's fastest digital inclusion.\n• **Premier Higher Education:** IITs, NITs, IIMs, AIIMS — accessible through merit & need scholarships.`
  }

  if ((q.includes('fellowship') || q.includes('phd')) && (q.includes('post-matric') || q.includes('already') || q.includes('dono') || q.includes('both'))) {
    return isHi
      ? `केंद्रीय छात्रवृत्ति नियम (GFR 2017 / Rule 11) के अनुसार, एक साथ दो सरकारी छात्रवृत्तियां नहीं ली जा सकतीं। हालाँकि, ScholarBridge पोर्टल में स्वचालित NOC सुविधा है — उच्च फैलोशिप के चयन पर पुराना आवेदन बिना जुर्माने के स्थानांतरित हो जाता है।`
      : `Under Central Scholarship Rule 11 (GFR 2017), simultaneous availing of multiple scholarships is barred. ScholarBridge provides an automated NOC wizard — if selected for higher research fellowship, your allocation transitions safely without penalty.`
  }

  if (q.includes('dbt') || q.includes('payment') || q.includes('paisa') || q.includes('भुगतान')) {
    return isHi
      ? `आपकी छात्रवृत्ति राशि (₹20,000) सत्यापित हो चुकी है और 12 सितंबर 2026 को SBI खाते में DBT के माध्यम से जमा हो चुकी है (UTR: RBI2026091298412)। 'ट्रैकर' टैब से रसीद डाउनलोड करें।`
      : `Your scholarship grant (₹20,000) has been verified and credited to your SBI account via DBT on 12 Sep 2026 (UTR: RBI2026091298412). Download the receipt from the Tracker tab.`
  }

  return isHi
    ? `नमस्ते! "${query}" के बारे में — राष्ट्रीय छात्रवृत्ति पोर्टल (ScholarBridge) सभी छात्र-छात्राओं को डिजिलॉकर और DBT के माध्यम से पारदर्शी सेवाएं प्रदान करता है। कृपया अपना प्रश्न विस्तार से पूछें।`
    : `Namaste! Regarding "${query}" — ScholarBridge provides transparent digital scholarship services through DigiLocker and DBT to all students. Please elaborate your question so I can assist you better.`
}

export default function GrievanceAssistant({ activeStudent, lang = 'en', setLang, onToast }) {
  const currentLang = KNOWLEDGE_BASE[lang] ? lang : 'en'
  const kb = KNOWLEDGE_BASE[currentLang]

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: kb.welcome(activeStudent?.name || 'Priya'),
      citation: kb.citation
    }
  ])
  const [inputVal, setInputVal] = useState('')
  const [listening, setListening] = useState(false)
  const [loading, setLoading] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const chatBottomRef = useRef(null)
  const recognitionRef = useRef(null)

  // When language changes, update greeting
  useEffect(() => {
    setMessages([{
      id: Date.now(),
      sender: 'bot',
      text: kb.welcome(activeStudent?.name || 'Priya'),
      citation: kb.citation
    }])
  }, [lang, activeStudent])

  // Auto-scroll on new message
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Web Speech Recognition Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setListening(true)
        onToast?.('🎙️ Listening... speak now', 'info')
      }

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript
        setListening(false)
        setInputVal(transcript)
        onToast?.('Voice captured: ' + transcript, 'success')
        // Auto-send the transcribed voice query
        handleSend(transcript)
      }

      recognition.onerror = (event) => {
        setListening(false)
        if (event.error === 'not-allowed') {
          onToast?.('Microphone access denied. Please allow mic in your browser.', 'warning')
        } else {
          onToast?.(`Voice: ${event.error}`, 'warning')
        }
      }

      recognition.onend = () => setListening(false)
      recognitionRef.current = recognition
    }
    return () => recognitionRef.current?.abort()
  }, [lang])

  const toggleMic = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SpeechRecognition) {
      onToast?.('Speech recognition not supported. Use Chrome or Edge.', 'warning')
      return
    }

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
    } else {
      try {
        if (recognitionRef.current) {
          recognitionRef.current.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
          recognitionRef.current.start()
        }
      } catch {
        recognitionRef.current?.abort()
        setTimeout(() => recognitionRef.current?.start(), 200)
      }
    }
  }

  // Text-to-Speech
  const handleSpeak = (text) => {
    if (!('speechSynthesis' in window)) {
      onToast?.('Text-to-speech not supported in this browser.', 'warning')
      return
    }
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      return
    }
    window.speechSynthesis.cancel()
    const cleanText = text.replace(/[*_#`]/g, '')
    const utterance = new SpeechSynthesisUtterance(cleanText)
    utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-IN'
    utterance.rate = 0.95
    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)
    window.speechSynthesis.speak(utterance)
    onToast?.(kb.speakingToast, 'info')
  }

  // Main Send Handler — calls live Gemini via server, fallback to smart local KB
  const handleSend = async (textToSend) => {
    const query = (textToSend || inputVal).trim()
    if (!query || loading) return

    const userMsg = { id: Date.now(), sender: 'user', text: query }
    setMessages(prev => [...prev, userMsg])
    setInputVal('')
    setLoading(true)

    // Detect language
    const detectedLang = detectLanguage(query, currentLang)
    if (detectedLang !== currentLang && setLang) {
      setLang(detectedLang)
    }

    try {
      // Call Gemini AI through the server (API key is server-side only)
      const aiResult = await askGemini({
        query,
        lang: detectedLang,
        activeStudent
      })

      if (aiResult.success && aiResult.reply) {
        // Live AI response!
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: aiResult.reply,
          citation: aiResult.citation || 'MoTA Guidelines & Google Gemini AI',
          model: aiResult.model
        }])
      } else {
        // Server unavailable or key issue — use rich contextual fallback
        const fallbackReply = generateIntelligentFallback(query, detectedLang)
        setMessages(prev => [...prev, {
          id: Date.now() + 1,
          sender: 'bot',
          text: fallbackReply,
          citation: 'MoTA Knowledge Base'
        }])
      }
    } catch (err) {
      console.error('Chat error:', err)
      const fallback = generateIntelligentFallback(query, detectedLang)
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'bot',
        text: fallback,
        citation: 'MoTA Guidelines'
      }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="assistant-view fade-in">
      {/* Header */}
      <div className="assistant-header gov-card">
        <div className="assistant-header-left">
          <div className="ai-avatar-circle">
            <Bot size={24} />
          </div>
          <div>
            <div className="assistant-badge-row">
              <span className="badge badge-primary">Multilingual Voice & NLP</span>
              <span className="badge badge-success">ScholarBridge AI Advisor</span>
            </div>
            <h1 className="assistant-title">Student Policy & Guidance Assistant</h1>
          </div>
        </div>

        <div className="assistant-header-right">
          <Languages size={16} className="lang-icon-header" />
          <span className="lang-label">Dialect:</span>
          <select 
            value={lang} 
            onChange={(e) => {
              setLang?.(e.target.value)
              onToast?.(`Switched JAGO to ${e.target.options[e.target.selectedIndex].text}`, 'info')
            }}
            className="assistant-lang-select"
          >
            <option value="en">English (Official)</option>
            <option value="hi">हिंदी (Hindi / Northern ST)</option>
            <option value="santhali">ᱥᱟᱱᱛᱟᱲᱤ (Santhali / Ol Chiki)</option>
            <option value="gondi">गोंडी (Gondi / Central)</option>
            <option value="ho">ᱦᱳ (Ho / Kolhan)</option>
            <option value="bodo">बड़ो (Bodo / Northeast)</option>
            <option value="kui">କୁଇ (Kui / Kandha)</option>
          </select>
        </div>
      </div>

      {/* Suggested Questions */}
      <div className="suggested-queries-strip">
        {kb.questions.map((sq, idx) => (
          <button 
            key={idx} 
            className="suggested-pill-btn"
            onClick={() => handleSend(sq.q)}
          >
            <Sparkles size={13} className="sparkle-icon" />
            <span>{sq.q}</span>
          </button>
        ))}
      </div>

      {/* Chat Feed */}
      <div className="gov-card chat-box-card">
        <div className="chat-messages-container">
          {messages.map(msg => (
            <div 
              key={msg.id} 
              className={`chat-bubble-row ${msg.sender === 'user' ? 'user-row' : 'bot-row'}`}
            >
              {msg.sender === 'bot' && (
                <div className="bubble-avatar bot-avatar">
                  <Bot size={16} />
                </div>
              )}
              <div className={`chat-bubble ${msg.sender === 'user' ? 'user-bubble' : 'bot-bubble'}`}>
                <p className="bubble-text">{msg.text}</p>
                <div className="bubble-footer-row">
                  {msg.citation && (
                    <div className="bubble-citation">
                      <ShieldCheck size={12} />
                      <span>{msg.citation}</span>
                    </div>
                  )}
                  {msg.sender === 'bot' && (
                    <button 
                      className="speak-btn" 
                      onClick={() => handleSpeak(msg.text)}
                      title={isSpeaking ? "Stop speaking" : "Listen with voice"}
                    >
                      {isSpeaking ? <VolumeX size={13} /> : <Volume2 size={13} />}
                      {isSpeaking ? 'Stop' : 'Listen'}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="chat-bubble-row bot-row">
              <div className="bubble-avatar bot-avatar">
                <Bot size={16} />
              </div>
              <div className="typing-indicator">
                <span className="typing-dot" />
                <span className="typing-dot" />
                <span className="typing-dot" />
              </div>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="chat-input-bar">
          <button 
            className={`mic-button ${listening ? 'mic-listening' : ''}`}
            onClick={toggleMic}
            title={listening ? "Listening... click to stop" : "Speak your question"}
          >
            {listening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>

          <input 
            type="text" 
            placeholder={listening ? "Listening... speak now..." : kb.inputPlaceholder}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            disabled={loading}
            className="chat-text-input"
          />

          <button 
            className="btn btn-primary send-chat-btn"
            onClick={() => handleSend()}
            disabled={loading || !inputVal.trim()}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
