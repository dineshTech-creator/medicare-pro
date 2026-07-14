import React, { useState } from "react";
import { 
  CheckCircle, 
  X, 
  Calendar, 
  Clock, 
  HeartPulse, 
  Stethoscope, 
  Sliders, 
  Lock, 
  Check, 
  UserMinus, 
  Activity, 
  Eye, 
  AlertCircle
} from "lucide-react";
import { Doctor, Appointment } from "../types";

interface DoctorDashboardProps {
  darkMode: boolean;
  doctor: Doctor;
  appointments: Appointment[];
  onAcceptAppointment: (id: string) => void;
  onRejectAppointment: (id: string) => void;
  onCompleteAppointment: (id: string) => void;
}

export default function DoctorDashboard({
  darkMode,
  doctor,
  appointments,
  onAcceptAppointment,
  onRejectAppointment,
  onCompleteAppointment
}: DoctorDashboardProps) {
  
  const myAppointments = appointments.filter(a => a.doctorId === doctor.id);
  const [selectedAptDetails, setSelectedAptDetails] = useState<Appointment | null>(null);

  // Slot blockout state
  const [blockedDays, setBlockedDays] = useState<string[]>([]);
  const [blockDay, setBlockDay] = useState("");

  const handleAddBlockDay = () => {
    if (blockDay && !blockedDays.includes(blockDay)) {
      setBlockedDays(prev => [...prev, blockDay]);
      setBlockDay("");
    }
  };

  const handleRemoveBlockDay = (day: string) => {
    setBlockedDays(prev => prev.filter(d => d !== day));
  };

  return (
    <div className="flex-grow p-8 overflow-y-auto max-w-7xl mx-auto font-sans">
      <div className="space-y-8">
        
        {/* Welcome Block */}
        <div className="flex justify-between items-center border-b pb-4 border-slate-200 dark:border-slate-800">
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-sky-500 font-bold uppercase tracking-widest">Medical Officer Viewport</span>
            <h1 className="text-2xl font-extrabold font-display text-slate-900 dark:text-white tracking-tight">{doctor.name}</h1>
            <p className="text-xs text-slate-400">Chief Attending of {doctor.department}</p>
          </div>

          <div className="flex gap-2">
            <span className="px-2.5 py-1 text-[10px] font-mono bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 rounded font-bold uppercase">
              Attending Rating: {doctor.rating}
            </span>
          </div>
        </div>

        {/* Doctor Slots and Holiday Blocks Configuration */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Calendar Agenda */}
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-xs font-mono uppercase tracking-widest text-slate-400 pl-1">Consultation Agenda</h2>
            
            <div className="space-y-3">
              {myAppointments.length === 0 ? (
                <div className={`p-8 rounded-2xl border text-center text-xs text-slate-400 border-dashed
                  ${darkMode ? "bg-[#0F172A]/10 border-slate-800" : "bg-slate-50 border-slate-200"}`}
                >
                  No clinical consultation requests registered under your ID.
                </div>
              ) : (
                myAppointments.map((apt) => (
                  <div 
                    key={apt.id}
                    className={`p-4 rounded-xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all
                      ${darkMode ? "bg-[#0F172A]/45 border-slate-800" : "bg-white border-slate-200"}`}
                  >
                    <div className="space-y-1 truncate">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[9px] font-mono font-bold rounded
                          ${apt.status === "UPCOMING" 
                            ? "bg-sky-500/15 text-sky-500" 
                            : apt.status === "COMPLETED" 
                              ? "bg-emerald-500/15 text-emerald-500" 
                              : "bg-rose-500/15 text-rose-500"}`}
                        >
                          {apt.status}
                        </span>
                        <p className="font-sans font-bold text-xs text-slate-900 dark:text-slate-100">{apt.patientName}</p>
                      </div>

                      <div className="flex gap-3 text-[10px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{apt.date}</span>
                        <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{apt.time}</span>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center shrink-0 w-full md:w-auto justify-end">
                      {apt.symptoms && (
                        <button
                          onClick={() => setSelectedAptDetails(apt)}
                          className="px-3 py-1.5 border border-slate-200 dark:border-slate-800 rounded-lg text-[10px] font-semibold text-sky-500 hover:bg-sky-500/5 transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Check AI Prep</span>
                        </button>
                      )}

                      {apt.status === "UPCOMING" && (
                        <>
                          <button
                            onClick={() => onCompleteAppointment(apt.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-[10px] font-bold transition-all flex items-center gap-1"
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>Mark Completed</span>
                          </button>
                          <button
                            onClick={() => onRejectAppointment(apt.id)}
                            className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-lg text-[10px] font-semibold transition-all"
                          >
                            Decline
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Slots & Blocks Control Column */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Slot Config Card */}
            <div className={`p-5 rounded-2xl border space-y-4
              ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-1.5">
                <Sliders className="w-4 h-4 text-sky-500" /> Availability Roster
              </h3>
              
              <div className="space-y-1 text-xs text-slate-400">
                <span className="text-[10px] uppercase font-mono tracking-wider block">Standard Active Days</span>
                <p className="font-bold text-slate-900 dark:text-slate-200">{doctor.availability.join(", ")}</p>
              </div>

              <div className="space-y-1 text-xs text-slate-400">
                <span className="text-[10px] uppercase font-mono tracking-wider block">Consultation Slots</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {doctor.slots.map((s, idx) => (
                    <span key={idx} className="px-2 py-1 bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 text-[10px] font-semibold rounded border border-slate-200/50 dark:border-slate-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Blocked Holidays */}
            <div className={`p-5 rounded-2xl border space-y-4
              ${darkMode ? "bg-[#0F172A]/40 border-slate-800" : "bg-white border-slate-200"}`}
            >
              <h3 className="text-xs font-mono uppercase tracking-widest text-slate-400 pl-1 flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-rose-500" /> Holiday Lockouts
              </h3>

              <div className="flex gap-2">
                <input
                  type="date"
                  value={blockDay}
                  onChange={(e) => setBlockDay(e.target.value)}
                  className={`flex-grow px-3 py-1.5 rounded-lg text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                    ${darkMode ? "bg-slate-900 border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                />
                <button
                  onClick={handleAddBlockDay}
                  className="px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  Block
                </button>
              </div>

              <div className="space-y-1.5">
                {blockedDays.length === 0 ? (
                  <p className="text-[11px] text-slate-400 italic">No custom clinical lockouts declared.</p>
                ) : (
                  blockedDays.map((day) => (
                    <div key={day} className="flex justify-between items-center p-2 bg-rose-500/5 border border-rose-500/10 rounded-lg text-xs text-slate-300">
                      <span className="font-mono text-[11px]">{day}</span>
                      <button 
                        onClick={() => handleRemoveBlockDay(day)}
                        className="text-rose-500 hover:text-rose-400 text-[10px] font-bold"
                      >
                        Remove
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

        </div>

        {/* AI Preparation advice detailed Modal */}
        {selectedAptDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
            <div className={`p-6 rounded-2xl border w-full max-w-2xl space-y-4 shadow-2xl relative
              ${darkMode ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-white border-slate-200"}`}
            >
              <button 
                onClick={() => setSelectedAptDetails(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sky-500">
                  <HeartPulse className="w-5 h-5 animate-pulse" />
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest">Attending prep report</span>
                </div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Clinical Preparation Details: {selectedAptDetails.patientName}
                </h3>
                <p className="text-[11px] text-slate-400">Scheduled Date: {selectedAptDetails.date} • {selectedAptDetails.time}</p>
              </div>

              <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                <div className="space-y-1">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-slate-500">Self-Reported Symptoms</h4>
                  <p className="text-xs text-slate-300 italic bg-[#0F172A] p-3 rounded-xl border border-slate-800">
                    "{selectedAptDetails.symptoms}"
                  </p>
                </div>

                <div className="space-y-1">
                  <h4 className="text-[10px] font-mono uppercase tracking-wider text-sky-500 font-bold">Dr. Gemini AI Clinical Diagnostics Assessment</h4>
                  <div className="text-xs text-slate-400 leading-relaxed whitespace-pre-line bg-sky-500/5 p-4 rounded-xl border border-slate-200">
                    {selectedAptDetails.aiSummary || "Triage metrics not initialized."}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
