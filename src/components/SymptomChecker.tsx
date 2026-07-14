import React, { useState } from "react";
import { Sparkles, Stethoscope, AlertCircle, ArrowRight, Check, Activity, HeartPulse } from "lucide-react";
import axios from "axios";

interface SymptomCheckerProps {
  darkMode: boolean;
  onBookDepartment: (dept: string) => void;
}

export default function SymptomChecker({ darkMode, onBookDepartment }: SymptomCheckerProps) {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("24");
  const [gender, setGender] = useState("Male");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ analysis: string; recommendedSpecialty: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post("/api/gemini/symptom-check", {
        symptoms,
        patientAge: age,
        patientGender: gender
      });
      setResult(response.data);
    } catch (err: any) {
      console.error(err);
      setError("Failed to consult St. Jude AI resident. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-grow p-8 max-w-4xl mx-auto font-sans">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sky-500">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Clinical Intelligence</span>
          </div>
          <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">
            AI Triage & Symptom Checker
          </h1>
          <p className="text-sm text-slate-400">
            Enter physical discomforts, duration, and patient profiles. St. Jude AI Resident analyzed metrics using 
            Google Gemini to supply initial diagnostic routing pathways.
          </p>
        </div>

        {/* Input Form and Response Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Form */}
          <form 
            onSubmit={handleSubmit} 
            className={`lg:col-span-5 p-6 rounded-2xl border space-y-4 shadow-sm
              ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200"}`}
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Age</label>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                    ${darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                />
              </div>
              
              <div className="space-y-1">
                <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Gender</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                  className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                    ${darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Describe symptoms</label>
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Example: Mild chest tightness when running, radiates slightly to the shoulder, duration 3 days..."
                rows={5}
                className={`w-full px-4 py-3 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500 leading-relaxed
                  ${darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading || !symptoms.trim()}
              className="w-full py-3 rounded-xl text-xs font-semibold ai-gradient text-white shadow-md shadow-sky-500/10 hover:opacity-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <Activity className="w-4 h-4 animate-spin" />
                  <span>Processing clinical parameters...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Symptoms with Gemini</span>
                </>
              )}
            </button>
          </form>

          {/* Result Block */}
          <div className="lg:col-span-7 space-y-4">
            
            {loading && (
              <div className={`p-12 rounded-2xl border text-center space-y-3 animate-pulse
                ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <HeartPulse className="w-8 h-8 mx-auto text-sky-500 animate-bounce" />
              <p className="text-xs font-mono text-sky-500 font-bold uppercase tracking-wide">Processing Bio-Signals</p>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                Gemini is categorizing pathology indexes and assessing urgency criteria. Please wait...
              </p>
            </div>
            )}

            {error && (
              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs flex gap-3">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p>{error}</p>
              </div>
            )}

            {!result && !loading && (
              <div className={`p-8 rounded-2xl border text-center space-y-3 border-dashed
                ${darkMode ? "bg-[#0F172A]/10 border-slate-800" : "bg-slate-50/60 border-slate-200"}`}
              >
                <Stethoscope className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700" />
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase font-mono tracking-wider">Awaiting Diagnostics</h3>
                <p className="text-xs text-slate-400 max-w-xs mx-auto">
                  Provide symptoms on the left. The output provides clinical categorizations and immediate booking links to specific departments.
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                
                {/* Routing suggestion card */}
                <div className={`p-5 rounded-2xl border border-sky-500/20 bg-sky-500/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4`}>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono text-sky-500 uppercase font-bold tracking-widest">Recommended Route</span>
                    <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                      Department of {result.recommendedSpecialty}
                    </h3>
                  </div>
                  
                  <button
                    onClick={() => onBookDepartment(result.recommendedSpecialty)}
                    className="px-4 py-2 ai-gradient hover:opacity-95 text-white rounded-lg text-xs font-semibold shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <span>Book Specialist Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Main text report */}
                <div className={`p-6 rounded-2xl border text-xs leading-relaxed space-y-4 prose prose-invert max-w-none text-slate-400
                  ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200 text-slate-700"}`}
                >
                  <div className="flex items-center gap-2 border-b pb-3 border-inherit">
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="font-mono font-bold uppercase tracking-wider text-slate-900 dark:text-white">Analysis Findings</span>
                  </div>
                  
                  {/* Render the markdown with clean space line breaks */}
                  <div className="whitespace-pre-line space-y-3">
                    {result.analysis}
                  </div>

                  <div className="mt-4 pt-3 border-t border-inherit text-[10px] text-slate-400 italic">
                    Disclaimer: AI clinical triage models offer routing indicators only. For acute or severe chest tightness, high fevers, or localized pains, seek emergency clinic care.
                  </div>
                </div>

              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
}
