import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, Clock, Check, X, Eye, TrendingUp, Users,
  Star, Activity, ChevronRight, Stethoscope, Lock,
  Plus, Trash2, HeartPulse, Sparkles, DollarSign,
  CheckCircle2, AlertCircle, BarChart3
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  Tooltip, BarChart, Bar, CartesianGrid
} from "recharts";
import { Doctor, Appointment } from "../types";

interface DoctorDashboardProps {
  darkMode: boolean;
  doctor: Doctor;
  appointments: Appointment[];
  onAcceptAppointment: (id: string) => void;
  onRejectAppointment: (id: string) => void;
  onCompleteAppointment: (id: string) => void;
  currentView?: string;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    UPCOMING:  "badge badge-blue",
    COMPLETED: "badge badge-green",
    CANCELLED: "badge badge-red",
  };
  return <span className={map[status] ?? "badge badge-slate"}>{status}</span>;
}

function StatCard({ label, value, sub, icon: Icon, color, delay = 0 }: {
  label: string; value: string | number; sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string; delay?: number;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      className={`stat-card text-white ${color}`}>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold text-white/70 uppercase tracking-wider">{label}</p>
          <p className="text-3xl font-bold leading-none">{value}</p>
          {sub && <p className="text-xs text-white/60 mt-1">{sub}</p>}
        </div>
        <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
          <Icon className="w-5 h-5 text-white" />
        </div>
      </div>
      <div className="absolute bottom-0 right-0 w-20 h-20 rounded-full bg-white/5 -mr-4 -mb-4" />
    </motion.div>
  );
}

// ─── AI Prep Modal ────────────────────────────────────────────────────────────

function PrepModal({ apt, darkMode, onClose }: {
  apt: Appointment; darkMode: boolean; onClose: () => void;
}) {
  const base = darkMode
    ? "bg-slate-900 border-slate-700 text-slate-100"
    : "bg-white border-slate-200 text-slate-900";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`w-full max-w-lg rounded-2xl border shadow-modal p-6 space-y-5 ${base}`}>

        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
              <HeartPulse className="w-4.5 h-4.5 text-blue-500" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">AI Pre-Consultation Brief</h3>
              <p className="text-xs text-slate-400">{apt.patientName} · {apt.date} at {apt.time}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3">
          <div className={`p-4 rounded-xl space-y-1.5 ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Patient-Reported Symptoms</p>
            <p className="text-sm text-slate-500 italic leading-relaxed">
              "{apt.symptoms || "No symptoms reported."}"
            </p>
          </div>

          <div className={`p-4 rounded-xl space-y-2 ${darkMode ? "bg-blue-900/20 border border-blue-800/30" : "bg-blue-50 border border-blue-100"}`}>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              <p className="text-[10px] font-bold uppercase tracking-wider text-blue-500">Gemini AI Clinical Assessment</p>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed whitespace-pre-line">
              {apt.aiSummary || "AI assessment not available for this appointment."}
            </p>
          </div>
        </div>

        <button onClick={onClose} className="btn-primary w-full py-2.5">
          Close Brief
        </button>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DoctorDashboard({
  darkMode, doctor, appointments,
  onRejectAppointment, onCompleteAppointment, currentView = "doctor-dashboard",
}: DoctorDashboardProps) {
  const [selectedApt, setSelectedApt] = useState<Appointment | null>(null);
  const [blockDay, setBlockDay] = useState("");
  const [blockedDays, setBlockedDays] = useState<string[]>([]);

  if (!doctor) return null;

  const myApts      = appointments.filter(a => a.doctorId === doctor.id);
  const upcoming    = myApts.filter(a => a.status === "UPCOMING");
  const completed   = myApts.filter(a => a.status === "COMPLETED");
  const cancelled   = myApts.filter(a => a.status === "CANCELLED");

  // Chart data — weekly consultation trend (mock based on real counts)
  const weekDays = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const weeklyData = weekDays.map((day, i) => ({
    day,
    Consultations: Math.max(0, Math.floor(myApts.length / 7 * (1 + Math.sin(i) * 0.5)) + (i % 3 === 0 ? 2 : 0)),
    Completed: Math.max(0, completed.length > 0 ? Math.floor(completed.length / 7 * (1 + Math.cos(i) * 0.4)) : 0),
  }));

  // Monthly trend for area chart
  const months = ["Jan","Feb","Mar","Apr","May","Jun"];
  const monthlyData = months.map((m, i) => ({
    month: m,
    Patients: 8 + i * 3 + (i % 2 === 0 ? 2 : -1),
  }));

  const card = darkMode
    ? "bg-slate-900 border border-slate-800"
    : "bg-white border border-slate-200";

  const tooltipStyle = {
    contentStyle: {
      background: darkMode ? "#1E293B" : "#fff",
      border: darkMode ? "1px solid #334155" : "1px solid #E2E8F0",
      borderRadius: "10px", fontSize: "12px",
    },
    labelStyle: { color: darkMode ? "#94A3B8" : "#64748B" },
  };

  // ── SLOTS VIEW ───────────────────────────────────────────────────────────────
  if (currentView === "doctor-slots") {
    return (
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
            Availability Manager
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Configure your consultation schedule and block unavailable dates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Active Schedule */}
          <div className={`rounded-2xl ${card} p-6 space-y-4`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
              <Activity className="w-4 h-4 text-blue-500" /> Regular Schedule
            </h3>
            <div className="space-y-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Active Days</p>
                <div className="flex flex-wrap gap-2">
                  {doctor.availability.map(d => (
                    <span key={d} className="badge badge-blue">{d}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Time Slots</p>
                <div className="flex flex-wrap gap-2">
                  {doctor.slots.map(s => (
                    <span key={s}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border ${darkMode ? "bg-slate-800 border-slate-700 text-slate-300" : "bg-slate-50 border-slate-200 text-slate-700"}`}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Holiday Lockouts */}
          <div className={`rounded-2xl ${card} p-6 space-y-4`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
              <Lock className="w-4 h-4 text-red-500" /> Holiday Lockouts
            </h3>
            <div className="flex gap-2">
              <input type="date" value={blockDay} onChange={e => setBlockDay(e.target.value)}
                className="input-field flex-1 py-2" />
              <button
                onClick={() => { if (blockDay && !blockedDays.includes(blockDay)) { setBlockedDays(p => [...p, blockDay]); setBlockDay(""); }}}
                className="btn-primary px-4 py-2 text-sm">
                <Plus className="w-4 h-4" />Block
              </button>
            </div>
            <div className="space-y-2">
              {blockedDays.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No blocked dates configured.</p>
              ) : blockedDays.map(d => (
                <div key={d}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-xl border ${darkMode ? "bg-red-900/10 border-red-900/30" : "bg-red-50 border-red-100"}`}>
                  <span className="text-xs font-semibold text-red-500">{d}</span>
                  <button onClick={() => setBlockedDays(p => p.filter(x => x !== d))}
                    className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── APPOINTMENTS VIEW ────────────────────────────────────────────────────────
  if (currentView === "doctor-appointments") {
    return (
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>My Appointments</h1>
          <p className="text-sm text-slate-400 mt-0.5">{upcoming.length} upcoming · {completed.length} completed</p>
        </div>
        <div className={`rounded-2xl ${card} overflow-hidden`}>
          {myApts.length === 0 ? (
            <div className="p-12 text-center">
              <Calendar className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
              <p className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>No appointments yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {myApts.map((apt, i) => (
                <motion.div key={apt.id}
                  initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-4 flex flex-col sm:flex-row sm:items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shrink-0">
                    <Users className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${darkMode ? "text-white" : "text-slate-900"}`}>{apt.patientName}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{apt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{apt.time}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={apt.status} />
                    {apt.symptoms && (
                      <button onClick={() => setSelectedApt(apt)}
                        className="btn-ghost text-xs py-1.5 px-2.5 text-blue-500">
                        <Eye className="w-3.5 h-3.5" />AI Brief
                      </button>
                    )}
                    {apt.status === "UPCOMING" && (
                      <>
                        <button onClick={() => onCompleteAppointment(apt.id)}
                          className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 transition-colors">
                          <Check className="w-4 h-4" />
                        </button>
                        <button onClick={() => onRejectAppointment(apt.id)}
                          className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors">
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
        <AnimatePresence>{selectedApt && <PrepModal apt={selectedApt} darkMode={darkMode} onClose={() => setSelectedApt(null)} />}</AnimatePresence>
      </div>
    );
  }

  // ── DASHBOARD VIEW ───────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <img src={doctor.photo} alt={doctor.name} referrerPolicy="no-referrer"
            className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-card shrink-0" />
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
              {doctor.name}
            </h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="badge badge-blue">{doctor.department}</span>
              <span className="badge badge-teal flex items-center gap-1"><Star className="w-3 h-3 fill-current" />{doctor.rating}</span>
              <span className="badge badge-slate">{doctor.experience} yrs exp</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Queue"   value={upcoming.length}   sub="Awaiting"       icon={Users}       color="gradient-card-blue"   delay={0}    />
        <StatCard label="Completed"       value={completed.length}  sub="This period"    icon={CheckCircle2} color="gradient-card-green"  delay={0.07} />
        <StatCard label="Est. Revenue"    value={`$${(completed.length * (doctor.consultationFee ?? 150)).toLocaleString()}`} sub="Consultations" icon={DollarSign} color="gradient-card-teal"  delay={0.12} />
        <StatCard label="Rating"          value={doctor.rating}     sub="Patient avg"    icon={Star}        color="gradient-card-orange" delay={0.17} />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Patient Queue */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Today's Patient Queue</h2>
            <span className="badge badge-blue">{upcoming.length} pending</span>
          </div>

          <div className={`rounded-2xl ${card} overflow-hidden`}>
            {upcoming.length === 0 ? (
              <div className="p-10 text-center">
                <Stethoscope className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                <p className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>No upcoming appointments today</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {upcoming.map((apt, i) => (
                  <motion.div key={apt.id}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.07 }}
                    className="p-4 flex items-center gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                    <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                      {apt.patientName.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-semibold text-sm truncate ${darkMode ? "text-white" : "text-slate-900"}`}>{apt.patientName}</p>
                      <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <Clock className="w-3 h-3" />{apt.time}
                        {apt.symptoms && <span className="truncate max-w-32">· {apt.symptoms.slice(0,30)}…</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {apt.symptoms && (
                        <button onClick={() => setSelectedApt(apt)}
                          className="btn-ghost text-xs py-1 px-2 text-blue-500">
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button onClick={() => onCompleteAppointment(apt.id)}
                        className="p-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 transition-colors" title="Mark complete">
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => onRejectAppointment(apt.id)}
                        className="p-1.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors" title="Decline">
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* Weekly Bar Chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className={`rounded-2xl ${card} p-5 space-y-4`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
              <BarChart3 className="w-4 h-4 text-blue-500" /> Weekly Consultation Volume
            </h3>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyData} barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1E293B" : "#F1F5F9"} />
                  <XAxis dataKey="day" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="Consultations" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Completed"     fill="#14B8A6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Doctor Profile Card */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className={`rounded-2xl ${card} p-5 space-y-4`}>
            <h3 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Performance</h3>
            {[
              { label: "Completion Rate", value: myApts.length > 0 ? Math.round(completed.length / myApts.length * 100) : 0, color: "bg-blue-500" },
              { label: "Patient Satisfaction", value: Math.round(doctor.rating / 5 * 100), color: "bg-teal-500" },
              { label: "Appointments Handled", value: Math.min(100, myApts.length * 10), color: "bg-emerald-500" },
            ].map(m => (
              <div key={m.label} className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-400">{m.label}</span>
                  <span className={`text-xs font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>{m.value}%</span>
                </div>
                <div className="progress-track">
                  <motion.div className={`progress-fill ${m.color}`}
                    initial={{ width: 0 }} animate={{ width: `${m.value}%` }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.4, 0, 0.2, 1] }} />
                </div>
              </div>
            ))}
          </motion.div>

          {/* Growth Chart */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28 }}
            className={`rounded-2xl ${card} p-5 space-y-3`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
              <TrendingUp className="w-4 h-4 text-teal-500" /> Patient Growth
            </h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyData}>
                  <defs>
                    <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#14B8A6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="#94A3B8" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Area type="monotone" dataKey="Patients" stroke="#14B8A6" strokeWidth={2}
                    fill="url(#areaGrad)" dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Quick Info */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className={`rounded-2xl ${card} p-5 space-y-3`}>
            <h3 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Schedule Overview</h3>
            <div className="space-y-2">
              {[
                { label: "Available Days", value: doctor.availability.join(", ") },
                { label: "Consultation Slots", value: `${doctor.slots.length} per day` },
                { label: "Dept.", value: doctor.department },
              ].map(r => (
                <div key={r.label} className="flex items-start justify-between gap-2">
                  <span className="text-xs text-slate-400 shrink-0">{r.label}</span>
                  <span className={`text-xs font-semibold text-right ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{r.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <AnimatePresence>{selectedApt && <PrepModal apt={selectedApt} darkMode={darkMode} onClose={() => setSelectedApt(null)} />}</AnimatePresence>
    </div>
  );
}
