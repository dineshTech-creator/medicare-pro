import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Sparkles, Activity, AlertCircle, ArrowRight, CheckCircle2,
  Stethoscope, HeartPulse, AlertTriangle, Info, ChevronRight
} from "lucide-react";
import axios from "axios";

interface SymptomCheckerProps {
  darkMode: boolean;
  onBookDepartment: (dept: string) => void;
}

const URGENCY_CONFIG: Record<string, { label: string; badge: string; icon: typeof AlertTriangle; desc: string }> = {
  HIGH:   { label: "High Urgency",   badge: "badge badge-red",    icon: AlertCircle,   desc: "Seek medical attention promptly." },
  MEDIUM: { label: "Medium Urgency", badge: "badge badge-yellow", icon: AlertTriangle, desc: "Schedule a consultation soon." },
  LOW:    { label: "Low Urgency",    badge: "badge badge-green",  icon: Info,          desc: "Monitor symptoms and book when convenient." },
};

const QUICK_SYMPTOMS = [
  "Chest tightness when exercising",
  "Persistent headache for 3 days",
  "Skin rash with itching",
  "Joint pain and swelling",
  "Difficulty sleeping",
];

export default function SymptomChecker({ darkMode, onBookDepartment }: SymptomCheckerProps) {
  const [symptoms, setSymptoms] = useState("");
  const [age,      setAge]      = useState("24");
  const [gender,   setGender]   = useState("Male");
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState<{ analysis: string; recommendedSpecialty: string } | null>(null);
  const [error,    setError]    = useState<string | null>(null);

  const detectUrgency = (text: string): "HIGH" | "MEDIUM" | "LOW" => {
    const t = text.toUpperCase();
    if (t.includes("HIGH")) return "HIGH";
    if (t.includes("MEDIUM")) return "MEDIUM";
    return "LOW";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    setLoading(true); setError(null); setResult(null);
    try {
      const res = await axios.post("/api/gemini/symptom-check", {
        symptoms, patientAge: age, patientGender: gender,
      });
      setResult(res.data);
    } catch {
      setError("Unable to reach the AI diagnostic service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const urgency = result ? detectUrgency(result.analysis) : null;
  const urgencyMeta = urgency ? URGENCY_CONFIG[urgency] : null;
  const card = darkMode ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200";

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-brand">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="badge badge-blue">AI-Powered</span>
        </div>
        <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
          AI Triage &amp; Symptom Checker
        </h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Describe your symptoms and receive an AI-powered clinical routing assessment powered by Google Gemini.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* Form */}
        <motion.form initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          onSubmit={handleSubmit}
          className={`lg:col-span-2 rounded-2xl ${card} p-6 space-y-5`}>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Age</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} className="input-field py-2.5" />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Gender</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className="input-field py-2.5">
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>
          </div>

          {/* Quick chips */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Quick Select</label>
            <div className="flex flex-wrap gap-1.5">
              {QUICK_SYMPTOMS.map(s => (
                <button key={s} type="button"
                  onClick={() => setSymptoms(s)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border transition-all
                    ${symptoms === s
                      ? "bg-blue-600 text-white border-blue-600"
                      : darkMode
                        ? "border-slate-700 text-slate-400 hover:border-slate-600 bg-slate-800"
                        : "border-slate-200 text-slate-500 hover:border-slate-300 bg-slate-50"}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Describe Symptoms</label>
            <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)}
              placeholder="e.g. Mild chest tightness when running, onset 3 days, no fever…"
              rows={5} required
              className="input-field resize-none leading-relaxed" />
          </div>

          <motion.button type="submit" disabled={loading || !symptoms.trim()}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full py-3 disabled:opacity-60">
            {loading ? (
              <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
                Analyzing symptoms…</>
            ) : (
              <><Sparkles className="w-4 h-4" />Analyze with Gemini AI</>
            )}
          </motion.button>
        </motion.form>

        {/* Result panel */}
        <div className="lg:col-span-3 space-y-4">
          {/* Loading state */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              className={`rounded-2xl ${card} p-10 text-center space-y-4`}>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.2, repeat: Infinity }}
                className="w-14 h-14 rounded-2xl gradient-brand flex items-center justify-center mx-auto shadow-brand"
              >
                <HeartPulse className="w-7 h-7 text-white" />
              </motion.div>
              <div className="space-y-1">
                <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Processing Clinical Parameters</p>
                <p className="text-xs text-slate-400">Gemini is analyzing symptom patterns and urgency indicators…</p>
              </div>
              <div className="w-48 mx-auto">
                <div className="progress-track">
                  <motion.div className="progress-fill"
                    animate={{ width: ["10%", "85%", "10%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
                </div>
              </div>
            </motion.div>
          )}

          {/* Error state */}
          {error && !loading && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 text-red-600 dark:text-red-400">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              <p className="text-sm">{error}</p>
            </motion.div>
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl ${card} p-12 text-center space-y-3 border-dashed`}>
              <Stethoscope className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
              <p className={`text-sm font-semibold ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                Awaiting Symptom Analysis
              </p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Describe your symptoms on the left. The AI will categorize them and recommend a specialist.
              </p>
            </motion.div>
          )}

          {/* Results */}
          {result && !loading && (
            <AnimatePresence>
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">

                {/* Routing card */}
                <div className={`rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4
                  bg-blue-600 text-white shadow-brand`}>
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-blue-200 uppercase tracking-wider">AI Recommended Route</p>
                    <h3 className="text-xl font-bold">{result.recommendedSpecialty}</h3>
                    {urgencyMeta && (
                      <div className="flex items-center gap-2 mt-1">
                        <urgencyMeta.icon className="w-3.5 h-3.5 text-blue-200" />
                        <span className="text-xs text-blue-200">{urgencyMeta.desc}</span>
                      </div>
                    )}
                  </div>
                  <motion.button whileTap={{ scale: 0.97 }}
                    onClick={() => onBookDepartment(result.recommendedSpecialty)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white text-blue-600 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shrink-0">
                    Book Specialist <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>

                {/* Urgency + Specialty badges */}
                {urgencyMeta && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={urgencyMeta.badge}>{urgencyMeta.label}</span>
                    <span className="badge badge-blue">{result.recommendedSpecialty}</span>
                    <span className="badge badge-teal flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />Gemini AI
                    </span>
                  </div>
                )}

                {/* Analysis text */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                  className={`rounded-2xl ${card} p-6 space-y-3`}>
                  <div className={`flex items-center gap-2 pb-3 border-b ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <h4 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
                      Clinical Analysis Report
                    </h4>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
                    {result.analysis}
                  </p>
                  <div className={`pt-3 border-t text-xs text-slate-400 italic
                    ${darkMode ? "border-slate-800" : "border-slate-100"}`}>
                    Disclaimer: AI triage provides routing guidance only — not a medical diagnosis.
                    Seek emergency care for acute symptoms.
                  </div>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}
