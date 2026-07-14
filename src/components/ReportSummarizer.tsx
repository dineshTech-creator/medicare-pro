import React, { useState } from "react";
import { FileText, Upload, Sparkles, CheckCircle, Activity, Heart, Eye } from "lucide-react";
import axios from "axios";
import { MedicalReport } from "../types";

interface ReportSummarizerProps {
  darkMode: boolean;
  patientId: string;
  reports: MedicalReport[];
  onAddReport: (report: MedicalReport) => void;
}

export default function ReportSummarizer({ darkMode, patientId, reports, onAddReport }: ReportSummarizerProps) {
  const [reportType, setReportType] = useState("Laboratory Report");
  const [reportText, setReportText] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeSummary, setActiveSummary] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Quick preset data loads to ease testing
  const REPORT_PRESETS = [
    {
      title: "Routine Complete Blood Count (CBC)",
      text: "WBC: 6.8 x10^3/uL (Normal 4.5-11.0)\nRBC: 4.95 x10^6/uL (Normal 4.30-5.90)\nHemoglobin: 15.2 g/dL (Normal 13.5-17.5)\nHematocrit: 44.8% (Normal 41.0-50.0)\nPlatelets: 242 x10^3/uL (Normal 150-450)\nGlucose (Fasting): 92 mg/dL (Optimal < 100)\nCreatinine: 0.95 mg/dL (Normal 0.60-1.30)"
    },
    {
      title: "Lipid Profile Panel",
      text: "Total Cholesterol: 215 mg/dL (Desirable < 200) *HIGH*\nTriglycerides: 145 mg/dL (Desirable < 150)\nHDL Cholesterol: 42 mg/dL (Low < 40 is risk factor)\nLDL Cholesterol: 144 mg/dL (Optimal < 100) *HIGH*\nVLDL Cholesterol: 29 mg/dL\nNote: Patient reports mild sedentary lifestyle and diet with saturated fats."
    }
  ];

  const handleUploadReport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportText.trim() || !fileName.trim()) return;

    setLoading(true);
    setError(null);
    setActiveSummary(null);

    try {
      const response = await axios.post("/api/gemini/summarize-report", {
        reportText,
        reportType
      });

      const newReport: MedicalReport = {
        id: `rep-${Date.now()}`,
        patientId,
        fileName,
        uploadDate: new Date().toISOString().split('T')[0],
        fileSize: `${Math.round(reportText.length / 100) / 10} KB`,
        summary: response.data.summary,
        category: reportType
      };

      onAddReport(newReport);
      setActiveSummary(response.data.summary);
      setReportText("");
      setFileName("");
    } catch (err) {
      console.error(err);
      setError("Failed to interpret clinical metrics. Please verify network configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow p-8 max-w-5xl mx-auto font-sans">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-sky-500">
            <FileText className="w-5 h-5" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Clinical Records Vault</span>
          </div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            Medical Reports & AI Summaries
          </h1>
          <p className="text-sm text-slate-400">
            Upload diagnostic text transcripts, lab results, or imaging summaries. MediSmart AI automatically parses 
            complex medical metrics into reassuring layman explanations.
          </p>
        </div>

        {/* Form and Records Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form Column */}
          <div className="lg:col-span-5 space-y-4">
            <form 
              onSubmit={handleUploadReport}
              className={`p-6 rounded-2xl border space-y-4 shadow-sm
                ${darkMode ? "bg-slate-950/40 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 pl-1">Analyze Diagnostics</h3>
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Document Name</label>
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="e.g. blood_chemistry_test.pdf"
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                    ${darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Report Category</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                    ${darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                >
                  <option value="Laboratory Report">Laboratory Report</option>
                  <option value="Cardiology ECG">Cardiology ECG</option>
                  <option value="Radiology X-Ray">Radiology X-Ray</option>
                  <option value="Lipid Profile">Lipid Profile Panel</option>
                  <option value="General Health Report">General Discharge Summary</option>
                </select>
              </div>

              {/* Presets load */}
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Load Demo Metrics</label>
                <div className="flex gap-2">
                  {REPORT_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setFileName(preset.title.toLowerCase().replace(/\s+/g, '_') + '.txt');
                        setReportText(preset.text);
                      }}
                      className="px-2 py-1 rounded bg-sky-500/10 text-sky-500 hover:bg-sky-500/20 text-[9px] font-semibold transition-colors"
                    >
                      {preset.title.split(' ').slice(0, 2).join(' ')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Paste Raw Report Text</label>
                <textarea
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="Paste metrics, lab data points, or diagnostic observations here..."
                  rows={5}
                  className={`w-full px-4 py-3 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500 leading-relaxed
                    ${darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading || !reportText.trim() || !fileName.trim()}
                className="w-full py-2.5 rounded-xl text-xs font-semibold ai-gradient hover:opacity-95 text-white shadow-md shadow-sky-500/10 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>AI Interpretive Scanning...</span>
                  </>
                ) : (
                  <>
                    <Upload className="w-4 h-4" />
                    <span>Upload & Summarize Report</span>
                  </>
                )}
              </button>
            </form>
            
            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs">
                {error}
              </div>
            )}
          </div>

          {/* Records list Column */}
          <div className="lg:col-span-7 space-y-4">
            
            {activeSummary && (
              <div className={`p-6 rounded-2xl border space-y-4
                ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200"}`}
              >
                <div className="flex items-center gap-2 text-sky-500 border-b pb-3 border-inherit">
                  <Sparkles className="w-4.5 h-4.5 animate-pulse" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">Dr. Gemini Interpretation Summary</span>
                </div>
                <div className="text-xs leading-relaxed text-slate-400 whitespace-pre-line space-y-3 prose prose-sm dark:prose-invert">
                  {activeSummary}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 pl-1">Historical Records Vault</h3>
              
              <div className="space-y-3">
                {reports.length === 0 ? (
                  <div className={`p-8 rounded-2xl border text-center text-xs text-slate-400 border-dashed
                    ${darkMode ? "bg-slate-950/10 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                  >
                    No clinical reports uploaded in this viewport.
                  </div>
                ) : (
                  reports.map((rep) => (
                    <div 
                      key={rep.id}
                      className={`p-4 rounded-xl border flex items-center justify-between gap-4 transition-all
                        ${darkMode ? "bg-[#0F172A]/40 border-slate-800 hover:border-slate-700" : "bg-white border-slate-200 hover:border-sky-500/30"}`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <div className="w-9 h-9 rounded-lg bg-sky-500/10 text-sky-500 flex items-center justify-center shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="truncate">
                          <p className="font-sans font-bold text-xs text-slate-900 dark:text-slate-100 truncate">{rep.fileName}</p>
                          <div className="flex gap-2 text-[10px] text-slate-400 font-mono mt-0.5">
                            <span>{rep.uploadDate}</span>
                            <span>•</span>
                            <span>{rep.category}</span>
                            <span>•</span>
                            <span>{rep.fileSize}</span>
                          </div>
                        </div>
                      </div>

                      {rep.summary && (
                        <button
                          onClick={() => setActiveSummary(rep.summary || null)}
                          className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-semibold text-sky-500 hover:bg-sky-500/5 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Interpretation</span>
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
