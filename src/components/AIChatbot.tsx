import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Send, Brain, HeartPulse, User, AlertTriangle,
  Sparkles, Activity, X, ChevronDown
} from "lucide-react";
import axios from "axios";
import { Message } from "../types";

interface AIChatbotProps {
  darkMode: boolean;
  patientAge: string;
}

const PRESETS = [
  "What are early signs of high blood pressure?",
  "Explain LDL vs HDL cholesterol",
  "How should I prepare for a blood test?",
  "Tips for better sleep quality",
];

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator({ darkMode }: { darkMode: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
        <HeartPulse className="w-4 h-4 text-blue-500" />
      </div>
      <div className={`px-4 py-3 rounded-2xl chat-bubble-bot`}>
        <div className="flex items-center gap-1.5 h-4">
          {[0, 0.15, 0.3].map(d => (
            <motion.span key={d}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 0.6, delay: d, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-500 inline-block"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg, darkMode }: { msg: Message; darkMode: boolean }) {
  const isBot = msg.sender === "bot";
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.97 }}
      animate={{ opacity: 1, y: 0,  scale: 1 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className={`flex items-start gap-3 ${!isBot ? "flex-row-reverse" : ""}`}
    >
      <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold
        ${isBot
          ? "bg-blue-50 dark:bg-blue-900/20 text-blue-500"
          : "gradient-brand text-white"}`}
      >
        {isBot ? <HeartPulse className="w-4 h-4" /> : <User className="w-4 h-4" />}
      </div>

      <div className={`space-y-1 max-w-[78%]`}>
        <div className={`px-4 py-3 text-sm leading-relaxed
          ${isBot ? "chat-bubble-bot text-slate-700 dark:text-slate-200" : "chat-bubble-user"}`}
        >
          <p className="whitespace-pre-line">{msg.text}</p>
        </div>
        <p className={`text-[10px] text-slate-400 px-1 ${!isBot ? "text-right" : ""}`}>
          {msg.timestamp}
        </p>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AIChatbot({ darkMode }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([{
    id: "init", sender: "bot", text:
      "Hello! I'm **Dr. Gemini**, your AI health assistant at MediCare Pro.\n\nI can help with health questions, explain medical terms, suggest when to see a specialist, and guide you through our platform.\n\n*Note: My responses are informational only and not a substitute for professional medical advice.*",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const scrollRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);

  const scrollToBottom = (smooth = true) => {
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => { scrollToBottom(); }, [messages, loading]);

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setShowScrollBtn(el.scrollHeight - el.scrollTop - el.clientHeight > 120);
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    const userMsg: Message = {
      id: `u-${Date.now()}`, sender: "user", text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setLoading(true);
    inputRef.current?.focus();

    try {
      const history = [...messages, userMsg].map(m => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text,
      }));
      const res = await axios.post("/api/gemini/chat", { messages: history });
      setMessages(p => [...p, {
        id: `b-${Date.now()}`, sender: "bot", text: res.data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch {
      setMessages(p => [...p, {
        id: `e-${Date.now()}`, sender: "bot",
        text: "I'm temporarily unavailable. Please try again in a moment.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => { e.preventDefault(); send(input); };

  const card = darkMode ? "bg-slate-900 border-slate-800" : "bg-white border-slate-200";

  return (
    <div className="flex-1 flex flex-col min-h-0 max-w-3xl mx-auto w-full p-6 lg:p-8 gap-4">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
        className={`rounded-2xl border p-4 flex items-center justify-between shrink-0 ${card}`}>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-brand">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className={`text-sm font-bold leading-none ${darkMode ? "text-white" : "text-slate-900"}`}>
              Dr. Gemini
            </h1>
            <span className="text-[11px] text-slate-400">AI Health Assistant · MediCare Pro</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/30">
          <span className="pulse-dot" style={{ width: 6, height: 6 }} />
          <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">Online</span>
        </div>
      </motion.div>

      {/* Messages */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className={`flex-1 overflow-y-auto rounded-2xl border p-5 space-y-4 min-h-0 ${card}`}
      >
        <AnimatePresence initial={false}>
          {messages.map(m => <MessageBubble key={m.id} msg={m} darkMode={darkMode} />)}
        </AnimatePresence>
        {loading && <TypingIndicator darkMode={darkMode} />}
        <div ref={bottomRef} />
      </div>

      {/* Scroll to bottom button */}
      <AnimatePresence>
        {showScrollBtn && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={() => scrollToBottom()}
            className="absolute bottom-28 right-10 w-8 h-8 rounded-full gradient-brand text-white flex items-center justify-center shadow-brand"
          >
            <ChevronDown className="w-4 h-4" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Preset suggestions — only shown at start */}
      {messages.length === 1 && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }} className="space-y-2 shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Suggested questions</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map(p => (
              <motion.button key={p} whileTap={{ scale: 0.97 }}
                onClick={() => send(p)}
                className={`px-3.5 py-2 rounded-xl text-xs border text-left transition-all
                  ${darkMode
                    ? "border-slate-700 bg-slate-800/60 hover:bg-slate-800 text-slate-300"
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"}`}
              >
                {p}
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Disclaimer */}
      <div className={`flex items-start gap-2 px-3 py-2.5 rounded-xl text-[11px] shrink-0
        ${darkMode ? "bg-amber-900/20 border border-amber-800/30 text-amber-300" : "bg-amber-50 border border-amber-100 text-amber-700"}`}>
        <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        For emergencies, call 911. AI responses are informational only — consult a licensed physician for medical decisions.
      </div>

      {/* Input */}
      <form onSubmit={handleSubmit} className="flex gap-2.5 shrink-0">
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          placeholder="Ask Dr. Gemini anything about your health…"
          className="input-field flex-1 py-3"
          aria-label="Chat message input"
        />
        <motion.button
          type="submit"
          disabled={loading || !input.trim()}
          whileTap={{ scale: 0.95 }}
          className="btn-primary px-4 py-3 disabled:opacity-50 shrink-0"
          aria-label="Send message"
        >
          {loading
            ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
            : <Send className="w-4 h-4" />}
        </motion.button>
      </form>
    </div>
  );
}
