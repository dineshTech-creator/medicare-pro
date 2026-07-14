import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Calendar, Clock, Star, Award, Search, Plus, X, Activity,
  Sparkles, CheckCircle2, AlertCircle, ChevronRight, Heart,
  Droplets, MapPin, Video, Phone, Filter, TrendingUp, FileText
} from "lucide-react";
import axios from "axios";
import { Doctor, Appointment, Patient } from "../types";

interface PatientDashboardProps {
  darkMode: boolean;
  patient: Patient;
  doctors: Doctor[];
  appointments: Appointment[];
  onBookAppointment: (apt: Omit<Appointment, "id">) => void;
  onCancelAppointment: (id: string) => void;
  onRescheduleAppointment: (id: string, date: string, time: string) => void;
  currentView?: string;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StatCard({ label, value, sub, icon: Icon, gradient, delay = 0 }: {
  label: string; value: string | number; sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  gradient: string; delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.4, 0, 0.2, 1] }}
      className={`stat-card text-white ${gradient}`}
    >
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

function StatusBadge({ status }: { status: "UPCOMING" | "COMPLETED" | "CANCELLED" }) {
  const map = {
    UPCOMING:  "badge badge-blue",
    COMPLETED: "badge badge-green",
    CANCELLED: "badge badge-red",
  };
  return <span className={map[status]}>{status}</span>;
}

// ─── Booking Modal ────────────────────────────────────────────────────────────

function BookingModal({ doctor, darkMode, onClose, onConfirm }: {
  doctor: Doctor; darkMode: boolean;
  onClose: () => void;
  onConfirm: (date: string, time: string, symptoms: string) => void;
}) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 400));
    onConfirm(date, time, symptoms);
    setLoading(false);
  };

  const base = darkMode
    ? "bg-slate-900 border-slate-700 text-slate-100"
    : "bg-white border-slate-200 text-slate-900";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 8 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`w-full max-w-md rounded-2xl border shadow-modal p-6 space-y-5 ${base}`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <img src={doctor.photo} alt={doctor.name}
              className="w-12 h-12 rounded-xl object-cover border border-slate-200/40" />
            <div>
              <h3 className="font-bold text-base leading-tight">{doctor.name}</h3>
              <p className="text-xs text-blue-500 font-medium mt-0.5">{doctor.department}</p>
            </div>
          </div>
          <button onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)}
                className="input-field py-2.5" required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Time Slot</label>
              <select value={time} onChange={e => setTime(e.target.value)}
                className="input-field py-2.5" required>
                <option value="">Select slot</option>
                {doctor.slots.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Symptoms <span className="text-slate-300 normal-case font-normal">(optional — for AI pre-screening)</span>
            </label>
            <textarea value={symptoms} onChange={e => setSymptoms(e.target.value)}
              placeholder="Describe what you're experiencing…"
              rows={3}
              className="input-field resize-none leading-relaxed" />
          </div>

          <div className={`flex items-center gap-2.5 p-3 rounded-xl text-xs ${darkMode ? "bg-blue-900/20 border border-blue-800/40 text-blue-300" : "bg-blue-50 border border-blue-100 text-blue-700"}`}>
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            Gemini AI will pre-screen your symptoms and prepare your doctor before the consultation.
          </div>

          <div className="flex gap-2.5 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5">Cancel</button>
            <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
              className="btn-primary flex-1 py-2.5">
              {loading ? (
                <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />Booking…</>
              ) : (<><Calendar className="w-4 h-4" />Confirm Booking</>)}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PatientDashboard({
  darkMode, patient, doctors, appointments,
  onBookAppointment, onCancelAppointment, currentView = "patient-dashboard",
}: PatientDashboardProps) {

  const [searchTerm,  setSearchTerm]  = useState("");
  const [selectedDept, setSelectedDept] = useState("All");
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [healthTips, setHealthTips]   = useState<string | null>(null);
  const [tipsLoading, setTipsLoading] = useState(false);
  const [confirmedMsg, setConfirmedMsg] = useState<string | null>(null);

  const myApts = appointments.filter(a => a.patientId === patient?.id);
  const upcoming  = myApts.filter(a => a.status === "UPCOMING");
  const completed = myApts.filter(a => a.status === "COMPLETED");

  useEffect(() => {
    if (currentView !== "patient-dashboard") return;
    setTipsLoading(true);
    axios.post("/api/gemini/health-tips", { department: "General Medicine", patientAge: "24" })
      .then(r => setHealthTips(r.data.tips))
      .catch(() => setHealthTips("• Stay hydrated — aim for 2–3L of water daily.\n• Walk 30 minutes each morning for cardiovascular health.\n• Schedule your annual preventive health screening."))
      .finally(() => setTipsLoading(false));
  }, [currentView]);

  const filteredDoctors = doctors.filter(d => {
    if (d.status !== "APPROVED") return false;
    const q = searchTerm.toLowerCase();
    const matchSearch = d.name.toLowerCase().includes(q) || d.department.toLowerCase().includes(q) || d.bio.toLowerCase().includes(q);
    const matchDept = selectedDept === "All" || d.department === selectedDept;
    return matchSearch && matchDept;
  });

  const DEPTS = ["All", "Cardiology", "Pediatrics", "Neurology", "Orthopedics", "Dermatology"];

  const handleBookingConfirm = async (date: string, time: string, symptoms: string) => {
    if (!bookingDoctor || !patient) return;
    let aiSummary: string | undefined;
    if (symptoms.trim()) {
      try {
        const r = await axios.post("/api/gemini/symptom-check", { symptoms, patientAge: "24", patientGender: "Male" });
        aiSummary = r.data.analysis;
      } catch { /* silent */ }
    }
    onBookAppointment({
      patientId: patient.id, patientName: patient.name,
      doctorId: bookingDoctor.id, doctorName: bookingDoctor.name,
      department: bookingDoctor.department,
      date, time, status: "UPCOMING", symptoms, aiSummary,
    });
    setConfirmedMsg(`Appointment with ${bookingDoctor.name} on ${date} at ${time} confirmed!`);
    setBookingDoctor(null);
    setTimeout(() => setConfirmedMsg(null), 5000);
  };

  const card = darkMode
    ? "bg-slate-900 border border-slate-800"
    : "bg-white border border-slate-200";

  if (!patient) return null;

  // ── APPOINTMENTS VIEW ────────────────────────────────────────────────────────
  if (currentView === "patient-appointments") {
    return (
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
              Book an Appointment
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">Find and book your specialist consultation</p>
          </div>
        </div>

        {/* Search + Filters */}
        <div className={`p-4 rounded-2xl ${card} space-y-3`}>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search by doctor name, specialty, or keyword…"
              className="input-field pl-10" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {DEPTS.map(d => (
              <button key={d} onClick={() => setSelectedDept(d)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedDept === d
                    ? "bg-blue-600 text-white border-blue-600 shadow-brand"
                    : darkMode
                      ? "bg-slate-800 text-slate-400 border-slate-700 hover:border-slate-600"
                      : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
                }`}>{d}</button>
            ))}
          </div>
        </div>

        {/* Doctor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredDoctors.map((doc, i) => (
            <motion.div key={doc.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className={`rounded-2xl ${card} p-5 flex flex-col gap-4 hover:shadow-card-hover transition-shadow`}>
              <div className="flex gap-3">
                <img src={doc.photo} alt={doc.name} referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-xl object-cover border border-slate-200/40 shrink-0" />
                <div className="min-w-0">
                  <h4 className={`font-bold text-sm leading-tight truncate ${darkMode ? "text-white" : "text-slate-900"}`}>{doc.name}</h4>
                  <span className="badge badge-blue mt-1">{doc.department}</span>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="flex items-center gap-1 text-amber-500 text-xs font-semibold">
                      <Star className="w-3.5 h-3.5 fill-current" />{doc.rating}
                    </span>
                    <span className="text-slate-400 text-xs flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" />{doc.experience}yr exp
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{doc.bio}</p>
              <div className="border-t pt-3 border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <div className="text-xs text-slate-400">{doc.availability.slice(0,2).join(", ")}{doc.availability.length > 2 ? "…" : ""}</div>
                <motion.button whileTap={{ scale: 0.97 }}
                  onClick={() => setBookingDoctor(doc)}
                  className="btn-primary py-1.5 px-3.5 text-xs">
                  <Plus className="w-3.5 h-3.5" />Book
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>

        <AnimatePresence>
          {bookingDoctor && (
            <BookingModal doctor={bookingDoctor} darkMode={darkMode}
              onClose={() => setBookingDoctor(null)} onConfirm={handleBookingConfirm} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── DASHBOARD VIEW ───────────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">

      {/* Success toast */}
      <AnimatePresence>
        {confirmedMsg && (
          <motion.div initial={{ opacity:0, y:-12 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-8 }}
            className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 dark:bg-emerald-900/20 dark:border-emerald-800/50">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">{confirmedMsg}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Greeting */}
      <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
            Good morning, {patient.name.split(" ")[0]} 👋
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Here's your health overview for today</p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="badge badge-green flex items-center gap-1.5">
            <Droplets className="w-3 h-3" />{patient.bloodGroup}
          </span>
          <span className="badge badge-blue">{patient.id}</span>
          <span className="badge badge-slate flex items-center gap-1.5">
            <Calendar className="w-3 h-3" />Joined {patient.joinedDate}
          </span>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Appointments" value={myApts.length}    sub="All time"         icon={Calendar}    gradient="gradient-card-blue"   delay={0}    />
        <StatCard label="Upcoming"           value={upcoming.length}  sub="Scheduled"        icon={Clock}       gradient="gradient-card-teal"   delay={0.08} />
        <StatCard label="Completed"          value={completed.length} sub="Consultations"    icon={CheckCircle2} gradient="gradient-card-green"  delay={0.12} />
        <StatCard label="Active Doctors"     value={doctors.filter(d=>d.status==="APPROVED").length} sub="Available now" icon={TrendingUp} gradient="gradient-card-orange" delay={0.16} />
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Appointments Timeline */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Upcoming Consultations</h2>
            <button onClick={() => {}} className="text-xs text-blue-500 hover:text-blue-600 font-medium flex items-center gap-1">
              View all <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className={`rounded-2xl ${card} divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden`}>
            {upcoming.length === 0 ? (
              <div className="p-8 text-center">
                <Calendar className="w-10 h-10 mx-auto text-slate-300 dark:text-slate-700 mb-3" />
                <p className={`text-sm font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>No upcoming appointments</p>
                <p className="text-xs text-slate-400 mt-1">Book a consultation to get started</p>
              </div>
            ) : (
              upcoming.map((apt, i) => (
                <motion.div key={apt.id}
                  initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                  transition={{ delay: i*0.07 }}
                  className="p-4 flex items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold truncate ${darkMode ? "text-white" : "text-slate-900"}`}>{apt.doctorName}</p>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-2">
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{apt.date}</span>
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{apt.time}</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={apt.status} />
                    <button onClick={() => onCancelAppointment(apt.id)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          {/* Recent completed */}
          {completed.length > 0 && (
            <>
              <h2 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Recent Consultations</h2>
              <div className={`rounded-2xl ${card} divide-y divide-slate-100 dark:divide-slate-800 overflow-hidden`}>
                {completed.slice(0, 3).map((apt, i) => (
                  <motion.div key={apt.id}
                    initial={{ opacity:0, x:-12 }} animate={{ opacity:1, x:0 }}
                    transition={{ delay: i*0.07 }}
                    className="p-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center shrink-0">
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold truncate ${darkMode ? "text-white" : "text-slate-900"}`}>{apt.doctorName}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{apt.department} · {apt.date}</p>
                    </div>
                    <StatusBadge status={apt.status} />
                  </motion.div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Health Profile Card */}
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
            className={`rounded-2xl ${card} p-5 space-y-4`}>
            <h3 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>Health Profile</h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white font-bold text-lg shrink-0">
                {patient.name.charAt(0)}
              </div>
              <div>
                <p className={`font-semibold text-sm ${darkMode ? "text-white" : "text-slate-900"}`}>{patient.name}</p>
                <p className="text-xs text-slate-400">{patient.email}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label:"Blood Group", value: patient.bloodGroup, icon: Droplets },
                { label:"DOB",         value: patient.dob,        icon: Calendar },
                { label:"Phone",       value: patient.phone,      icon: Phone },
                { label:"Member Since",value: patient.joinedDate, icon: Award },
              ].map(item => (
                <div key={item.label}
                  className={`p-2.5 rounded-xl ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">{item.label}</p>
                  <p className={`text-xs font-semibold mt-0.5 truncate ${darkMode ? "text-slate-200" : "text-slate-700"}`}>{item.value}</p>
                </div>
              ))}
            </div>
            <div className={`p-3 rounded-xl ${darkMode ? "bg-slate-800" : "bg-slate-50"}`}>
              <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide mb-1">Medical History</p>
              <p className="text-xs text-slate-500 leading-relaxed">{patient.medicalHistory}</p>
            </div>
          </motion.div>

          {/* AI Health Tips */}
          <motion.div initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.28 }}
            className={`rounded-2xl ${card} p-5 space-y-3`}>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-blue-500" />
              </div>
              <h3 className={`text-sm font-bold ${darkMode ? "text-white" : "text-slate-900"}`}>AI Health Tips</h3>
              <span className="badge badge-blue ml-auto">Gemini</span>
            </div>
            {tipsLoading ? (
              <div className="space-y-2">
                {[80, 65, 72].map(w => (
                  <div key={w} className="skeleton h-3 rounded" style={{ width: `${w}%` }} />
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-line">
                {healthTips}
              </p>
            )}
          </motion.div>
        </div>
      </div>

      <AnimatePresence>
        {bookingDoctor && (
          <BookingModal doctor={bookingDoctor} darkMode={darkMode}
            onClose={() => setBookingDoctor(null)} onConfirm={handleBookingConfirm} />
        )}
      </AnimatePresence>
    </div>
  );
}
