import React, { useState, useRef, useEffect } from "react";
import { Send, Activity, User, HeartPulse, Brain, AlertTriangle } from "lucide-react";
import axios from "axios";
import { Message } from "../types";

interface AIChatbotProps {
  darkMode: boolean;
  patientAge: string;
}

export default function AIChatbot({ darkMode, patientAge }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "bot",
      text: "Hello! I am Dr. Gemini, Chief Resident of AI Systems here at St. Jude AI Medical Center. How can I assist you with your health, appointment logistics, or diagnostic questions today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (e?: React.FormEvent, presetText?: string) => {
    if (e) e.preventDefault();
    const textToSend = presetText || input;
    if (!textToSend.trim()) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Map to Gemini chat format on server side
      const chatHistory = [...messages, userMsg].map(m => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text
      }));

      const response = await axios.post("/api/gemini/chat", { messages: chatHistory });
      
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response.data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error(err);
      const errMsg: Message = {
        id: `err-${Date.now()}`,
        sender: "bot",
        text: "My apologies, I ran into a transient error connection. Could you please rephrase or resubmit your query?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  const PRESETS = [
    "What are the early indicators of hypertension?",
    "Explain the difference between LDL and HDL cholesterol",
    "How should I prepare for a blood glucose diagnostic scan?",
    "Give me tips for stabilizing pediatric sleep schedules"
  ];

  return (
    <div className="flex-grow flex flex-col h-[calc(100vh-4rem)] max-w-4xl mx-auto p-6 font-sans">
      
      {/* Chat Title */}
      <div className="flex items-center justify-between border-b pb-4 shrink-0 border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center">
            <Brain className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base font-extrabold font-display text-slate-900 dark:text-white leading-none">Consult Dr. Gemini</h1>
            <span className="text-[10px] font-mono uppercase tracking-widest text-sky-500 font-bold">St. Jude Chief AI Resident</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-sky-500/10 border border-sky-500/20 text-[10px] font-mono text-sky-500">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>Clinical Agent Online</span>
        </div>
      </div>

      {/* Messages Board */}
      <div className="flex-grow overflow-y-auto py-6 space-y-4 pr-1">
        
        {messages.map((m) => {
          const isBot = m.sender === "bot";
          return (
            <div
              key={m.id}
              className={`flex items-start gap-3.5 ${m.sender === "user" ? "flex-row-reverse" : ""}`}
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold
                ${isBot 
                  ? "bg-sky-500/10 text-sky-500" 
                  : "bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300"}`}
              >
                {isBot ? <HeartPulse className="w-4.5 h-4.5" /> : <User className="w-4.5 h-4.5" />}
              </div>

              <div className="space-y-1 max-w-[80%]">
                <div className={`p-4 rounded-2xl text-xs leading-relaxed border
                  ${isBot 
                    ? darkMode 
                      ? "bg-slate-900/40 border-slate-800 text-slate-200" 
                      : "bg-sky-50/20 border-sky-50 text-slate-800" 
                    : "ai-gradient text-white border-sky-500 shadow-md shadow-sky-500/10"}`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>
                </div>
                <span className={`text-[9px] font-mono text-slate-400 block px-1
                  ${m.sender === "user" ? "text-right" : ""}`}
                >
                  {m.timestamp}
                </span>
              </div>
            </div>
          );
        })}

        {loading && (
          <div className="flex items-start gap-3.5">
            <div className="w-8 h-8 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
              <HeartPulse className="w-4.5 h-4.5 animate-spin" />
            </div>
            <div className={`p-4 rounded-2xl text-xs bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 font-medium italic animate-pulse`}>
              Dr. Gemini is researching diagnostic records...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Preset Suggestions */}
      {messages.length === 1 && (
        <div className="pb-4 space-y-2 shrink-0">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest pl-1 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-slate-500" /> Presets Questions
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset, i) => (
              <button
                key={i}
                onClick={(e) => handleSend(e, preset)}
                className={`px-3.5 py-2 rounded-xl text-xs border text-left transition-all duration-200 cursor-pointer
                  ${darkMode 
                    ? "border-slate-800 bg-[#0F172A]/40 hover:bg-[#0F172A] text-slate-300" 
                    : "border-slate-200 bg-white hover:bg-slate-50 text-slate-600"}`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input Box */}
      <form onSubmit={handleSend} className="flex gap-2 shrink-0">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Dr. Gemini any physiological or medical query..."
          disabled={loading}
          className={`flex-grow px-4 py-3 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
            ${darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="px-4 ai-gradient text-white rounded-xl shadow-md shadow-sky-500/15 hover:opacity-95 transition-all flex items-center justify-center disabled:opacity-50 cursor-pointer"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

    </div>
  );
}
