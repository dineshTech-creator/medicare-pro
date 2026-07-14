import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  FileText, Upload, Sparkles, Activity, Eye, X,
  CheckCircle2, AlertCircle, CloudUpload, FlaskConical,
  Pill, Heart, Bone
} from "lucide-react";
import axios from "axios";
import { MedicalReport } from "../types";

interface ReportSummarizerProps {
  darkMode: boolean;
  patientId: string;
  reports: MedicalReport[];
  onAddReport: (r: MedicalReport) => void;
}

const PRESETS = [
  {
    icon: FlaskConical,
    title: "Complete Blood Count",
    category: "Laboratory Report",
    text: "WBC: 6.8 x10^3/uL (Normal 4.5-11.0)\nRBC: 4.95 x10^6/uL (Normal 4.30-5.90)\nHemoglobin: 15.2 g/dL (Normal 13.5-17.5)\nHematocrit: 44.8% (Normal 41.0-50.0)\nPlatelets: 242 x10^3/uL (Normal 150-450)\nGlucose (Fasting): 92 mg/dL (Optimal < 100)\nCreatinine: 0.95 mg/dL (Normal 0.60-1.30)",
  },
  {
    icon: Heart,
    title: "Lipid Profile Panel",
    category: "Lipid Profile",
    text: "Total Cholesterol: 215 mg/dL (Desirable < 200) *HIGH*\nTriglycerides: 145 mg/dL (Normal < 150)\nHDL Cholesterol: 42 mg/dL\nLDL Cholesterol: 144 mg/dL (Optimal < 100) *HIGH*\nVLDL Cholesterol: 29 mg/dL",
  },
];

const CATEGORY_ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  "Laboratory Report": FlaskConical,
  "Cardiology ECG":    Heart,
  "Radiology X-Ray":  Bone,
  "Lipid Profile":     Heart,
  "General Health Report": FileText,
};

// ─── Summary Modal ────────────────────────────────────────────────────────────

function SummaryModal({ summary, darkMode, onClose }: {
  summary: string; darkMode: boolean; onClose: () => void;
}) {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`w-full max-w-xl rounded-2xl border shadow-modal p-6 space-y-5 max-h-[80vh] flex flex-col
          ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className={`font-bold text-sm ${darkMode ? "text-white" : "text-slate-900"}`}>
                AI Report Summary
              </h3>
              <p className="text-xs text-slate-400">Powered by Gemini</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 min-h-0">
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
            {summary}
          </p>
        </div>
        <button onClick={onClose} className="btn-primary w-full py-2.5 shrink-0">Close</button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ReportSummarizer({
  darkMode, patientId, reports, onAddReport,
}: ReportSummarizerProps) {
  const [fileName,    setFileName]    = useState("");
  const [reportType,  setReportType]  = useState("Laboratory Report");
  const [reportText,  setReportText]  = useState("");
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [viewSummary, setViewSummary] = useState<string | null>(null);
  const [justUploaded,setJustUploaded]= useState(false);

  const CATEGORIES = [
    "Laboratory Report","Cardiology ECG","Radiology X-Ray","Lipid Profile","General Health Report",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim() || !fileName.trim()) return;
    setLoading(true); setError(null); setJustUploaded(false);
    try {
      const res = await axios.post("/api/gemini/summarize-report", { reportText, reportType });
      const newReport: MedicalReport = {
        id: `rep-${Date.now()}`, patientId, fileName,
        uploadDate: new Date().toISOString().split("T")[0],
        fileSize: `${(reportText.length / 1024).toFixed(1)} KB`,
        summary: res.data.summary, category: reportType,
      };
      onAddReport(newReport);
      setViewSummary(res.data.summary);
      setReportText(""); setFileName(""); setJustUploaded(true);
    } catch {
      setError("Failed to process report. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  const card = darkMode ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200";

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl gradient-brand flex items-center justify-center shadow-brand">
            <FileText className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="badge badge-teal">AI-Powered</span>
        </div>
        <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
          Medical Records &amp; AI Summaries
        </h1>
        <p className="text-sm text-slate-400 max-w-xl">
          Paste diagnostic text, lab results, or imaging notes. Gemini AI translates complex medical data into plain language.
        </p>
      </motion.div>

      {/* Success banner */}
      <AnimatePresence>
        {justUploaded && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
              Report uploaded and AI summary generated successfully.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-start">

        {/* Upload Form */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className={`lg:col-span-2 rounded-2xl ${card} p-6 space-y-5`}>
          <h3 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
            Upload &amp; Analyze Report
          </h3>

          {/* Preset loaders */}
          <div className="space-y-2">
            <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Load Demo Data</p>
            <div className="grid grid-cols-2 gap-2">
              {PRESETS.map(p => (
                <button key={p.title} type="button"
                  onClick={() => { setFileName(p.title.toLowerCase().replace(/\s+/g,"_") + ".txt"); setReportType(p.category); setReportText(p.text); }}
                  className={`p-3 rounded-xl border text-left transition-all flex items-start gap-2
                    ${darkMode ? "border-slate-700 bg-slate-800 hover:bg-slate-700" : "border-slate-200 bg-slate-50 hover:bg-slate-100"}`}>
                  <p.icon className="w-3.5 h-3.5 text-blue-500 mt-0.5 shrink-0" />
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 leading-tight">{p.title}</span>
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Document Name</label>
              <input value={fileName} onChange={e => setFileName(e.target.value)}
                placeholder="e.g. blood_chemistry_may2026.pdf"
                className="input-field" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Category</label>
              <select value={reportType} onChange={e => setReportType(e.target.value)} className="input-field">
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Paste Report Text</label>
              <textarea value={reportText} onChange={e => setReportText(e.target.value)}
                placeholder="Paste lab values, diagnostic observations, or imaging notes…"
                rows={6} required className="input-field resize-none leading-relaxed" />
            </div>

            {error && (
              <div className="flex items-start gap-2 text-xs text-red-500 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl p-3">
                <AlertCircle className="w-3.5 h-3.5 mt-0.5 shrink-0" />{error}
              </div>
            )}

            <motion.button type="submit" disabled={loading || !reportText.trim() || !fileName.trim()}
              whileTap={{ scale: 0.98 }}
              className="btn-primary w-full py-3 disabled:opacity-60">
              {loading ? (
                <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
                  Analyzing report…</>
              ) : (
                <><Upload className="w-4 h-4" />Upload &amp; Summarize</>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Records Vault */}
        <div className="lg:col-span-3 space-y-4">
          <h3 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>
            Records Vault
            {reports.length > 0 && <span className="badge badge-blue ml-2">{reports.length}</span>}
          </h3>

          {reports.length === 0 ? (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className={`rounded-2xl ${card} p-12 text-center space-y-3 border-dashed`}>
              <CloudUpload className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
              <p className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                No reports uploaded yet
              </p>
              <p className="text-xs text-slate-400">Upload your first report to get an AI-powered summary</p>
            </motion.div>
          ) : (
            <div className="space-y-3">
              {reports.map((rep, i) => {
                const Icon = CATEGORY_ICONS[rep.category] ?? FileText;
                return (
                  <motion.div key={rep.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06 }}
                    className={`rounded-2xl ${card} p-4 flex items-center gap-4 hover:shadow-card-hover transition-shadow`}>
                    <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-blue-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${darkMode ? "text-white" : "text-slate-900"}`}>
                        {rep.fileName}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                        <span className="text-[11px] text-slate-400">{rep.uploadDate}</span>
                        <span className="badge badge-blue text-[10px] px-1.5 py-0">{rep.category}</span>
                        <span className="text-[11px] text-slate-400">{rep.fileSize}</span>
                      </div>
                    </div>
                    {rep.summary && (
                      <button onClick={() => setViewSummary(rep.summary ?? null)}
                        className="btn-ghost text-xs py-1.5 px-3 text-blue-500 shrink-0">
                        <Eye className="w-3.5 h-3.5" />Summary
                      </button>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Loading overlay */}
      {loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm flex items-center justify-center">
          <div className={`rounded-2xl border p-8 text-center space-y-4 ${card}`}>
            <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ duration: 1, repeat: Infinity }}
              className="w-14 h-14 gradient-brand rounded-2xl flex items-center justify-center mx-auto shadow-brand">
              <Activity className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>
                AI Interpretive Scanning
              </p>
              <p className="text-xs text-slate-400 mt-1">Gemini is reading your report…</p>
            </div>
          </div>
        </motion.div>
      )}

      <AnimatePresence>
        {viewSummary && (
          <SummaryModal summary={viewSummary} darkMode={darkMode} onClose={() => setViewSummary(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
