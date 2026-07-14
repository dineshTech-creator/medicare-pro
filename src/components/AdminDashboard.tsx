import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Users, Stethoscope, Calendar, Settings, Check, X, Plus,
  Activity, Trash2, TrendingUp, DollarSign, Search, Filter,
  BarChart3, PieChart as PieIcon, Clock, ChevronDown,
  CheckCircle2, AlertTriangle, RefreshCw, Shield
} from "lucide-react";
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip,
  CartesianGrid, PieChart, Pie, Cell, AreaChart, Area, Legend
} from "recharts";
import { Doctor, Patient, Appointment, SystemSettings } from "../types";

interface AdminDashboardProps {
  darkMode: boolean;
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  settings: SystemSettings;
  onApproveDoctor: (id: string) => void;
  onRejectDoctor: (id: string) => void;
  onAddDoctor: (doc: Omit<Doctor, "id">) => void;
  onRemoveDoctor: (id: string) => void;
  onUpdateSettings: (s: Partial<SystemSettings>) => void;
  currentView?: string;
}

const COLORS = ["#2563EB", "#14B8A6", "#22C55E", "#F59E0B", "#EF4444", "#8B5CF6"];

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

// ─── Add Doctor Modal ─────────────────────────────────────────────────────────

function AddDoctorModal({ darkMode, onClose, onAdd }: {
  darkMode: boolean; onClose: () => void;
  onAdd: (doc: Omit<Doctor, "id">) => void;
}) {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [dept, setDept]   = useState("Cardiology");
  const [exp, setExp]     = useState(5);
  const [bio, setBio]     = useState("");

  const DEPTS = ["Cardiology","Pediatrics","Neurology","Orthopedics","Dermatology","General Medicine"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;
    onAdd({
      name, email, role: "DOCTOR", department: dept,
      experience: Number(exp), rating: 5.0, bio, status: "APPROVED",
      availability: ["Monday","Tuesday","Wednesday","Thursday","Friday"],
      slots: ["09:00 AM","10:00 AM","11:00 AM","02:00 PM","03:00 PM","04:00 PM"],
      photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    });
    onClose();
  };

  const base = darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200";
  const inp  = "input-field py-2.5";

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={e => e.target === e.currentTarget && onClose()}>
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        className={`w-full max-w-md rounded-2xl border shadow-modal p-6 space-y-5 ${base}`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className={`font-bold text-base ${darkMode ? "text-white" : "text-slate-900"}`}>Register Specialist</h3>
            <p className="text-xs text-slate-400 mt-0.5">Add a new doctor to the platform</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5 col-span-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Dr. Jane Smith" className={inp} required />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="jane@hospital.org" className={inp} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Department</label>
              <select value={dept} onChange={e => setDept(e.target.value)} className={inp}>
                {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Experience (yrs)</label>
              <input type="number" min={1} max={60} value={exp} onChange={e => setExp(Number(e.target.value))} className={inp} required />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Bio</label>
            <textarea rows={2} value={bio} onChange={e => setBio(e.target.value)}
              placeholder="Brief clinical background…" className="input-field resize-none leading-relaxed" />
          </div>
          <div className="flex gap-2.5 pt-1">
            <button type="button" onClick={onClose} className="btn-secondary flex-1 py-2.5">Cancel</button>
            <button type="submit" className="btn-primary flex-1 py-2.5">
              <Plus className="w-4 h-4" />Add Doctor
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AdminDashboard({
  darkMode, doctors, patients, appointments, settings,
  onApproveDoctor, onRejectDoctor, onAddDoctor, onRemoveDoctor,
  onUpdateSettings, currentView = "admin-dashboard",
}: AdminDashboardProps) {

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchDoc, setSearchDoc]       = useState("");
  const [searchPat, setSearchPat]       = useState("");
  const [hospName,   setHospName]       = useState(settings.hospitalName);
  const [emergency,  setEmergency]      = useState(settings.emergencyContact);
  const [autoApprove,setAutoApprove]    = useState(settings.allowAutoApproveDoctors);

  const approved = doctors.filter(d => d.status === "APPROVED");
  const pending  = doctors.filter(d => d.status === "PENDING");
  const upcoming = appointments.filter(a => a.status === "UPCOMING");
  const completed= appointments.filter(a => a.status === "COMPLETED");

  const card = darkMode ? "bg-slate-900 border border-slate-800" : "bg-white border border-slate-200";
  const tooltipStyle = {
    contentStyle: { background: darkMode ? "#1E293B" : "#fff", border: darkMode ? "1px solid #334155" : "1px solid #E2E8F0", borderRadius: "10px", fontSize: "12px" },
    labelStyle: { color: darkMode ? "#94A3B8" : "#64748B" },
  };

  // Chart data
  const deptCounts: Record<string, number> = {};
  appointments.forEach(a => { deptCounts[a.department] = (deptCounts[a.department] ?? 0) + 1; });
  const barData = Object.entries(deptCounts).map(([name, Appointments]) => ({ name, Appointments }));

  const docDeptCounts: Record<string, number> = {};
  approved.forEach(d => { docDeptCounts[d.department] = (docDeptCounts[d.department] ?? 0) + 1; });
  const pieData = Object.entries(docDeptCounts).map(([name, value]) => ({ name, value }));

  const months = ["Jan","Feb","Mar","Apr","May","Jun"];
  const trendData = months.map((m, i) => ({
    month: m,
    Appointments: 4 + i * 2 + (i % 2 === 0 ? 1 : 0),
    Patients: 2 + i + (i % 3 === 0 ? 2 : 0),
  }));

  // Activity feed — derived from real data
  const recentActivity = [
    ...appointments.slice(-3).map(a => ({
      id: a.id, icon: Calendar, color: "text-blue-500 bg-blue-50 dark:bg-blue-900/20",
      title: `Appointment booked`, desc: `${a.patientName} → ${a.doctorName}`, time: a.date,
    })),
    ...pending.slice(0,2).map(d => ({
      id: d.id, icon: AlertTriangle, color: "text-amber-500 bg-amber-50 dark:bg-amber-900/20",
      title: "Pending approval", desc: `${d.name} — ${d.department}`, time: "Pending",
    })),
  ].slice(0, 5);

  // ── SETTINGS VIEW ─────────────────────────────────────────────────────────────
  if (currentView === "admin-settings") {
    return (
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 max-w-2xl">
        <div>
          <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>System Configuration</h1>
          <p className="text-sm text-slate-400 mt-0.5">Manage platform-wide settings and preferences</p>
        </div>
        <form onSubmit={e => { e.preventDefault(); onUpdateSettings({ hospitalName: hospName, emergencyContact: emergency, allowAutoApproveDoctors: autoApprove }); }}
          className="space-y-4">
          {[
            { label: "Hospital Name", value: hospName, set: setHospName, type: "text" },
            { label: "Emergency Contact", value: emergency, set: setEmergency, type: "text" },
          ].map(f => (
            <div key={f.label} className={`rounded-2xl ${card} p-5 space-y-3`}>
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{f.label}</label>
              <input type={f.type} value={f.value} onChange={e => f.set(e.target.value)} className="input-field" />
            </div>
          ))}
          <div className={`rounded-2xl ${card} p-5 flex items-center justify-between`}>
            <div>
              <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-slate-900"}`}>Auto-Approve Doctors</p>
              <p className="text-xs text-slate-400 mt-0.5">Automatically approve new doctor registrations</p>
            </div>
            <button type="button" onClick={() => setAutoApprove(p => !p)}
              className={`w-11 h-6 rounded-full transition-colors relative ${autoApprove ? "bg-blue-600" : darkMode ? "bg-slate-700" : "bg-slate-200"}`}>
              <motion.span animate={{ x: autoApprove ? 20 : 2 }}
                className="absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm" />
            </button>
          </div>
          <button type="submit" className="btn-primary w-full py-3">
            <Shield className="w-4 h-4" />Save Configuration
          </button>
        </form>
      </div>
    );
  }

  // ── PATIENTS VIEW ─────────────────────────────────────────────────────────────
  if (currentView === "admin-patients") {
    const filtered = patients.filter(p =>
      p.name.toLowerCase().includes(searchPat.toLowerCase()) ||
      p.email.toLowerCase().includes(searchPat.toLowerCase())
    );
    return (
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>Patient Registry</h1>
            <p className="text-sm text-slate-400 mt-0.5">{patients.length} registered patients</p>
          </div>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={searchPat} onChange={e => setSearchPat(e.target.value)}
              placeholder="Search patients…" className="input-field pl-10" />
          </div>
        </div>
        <div className={`rounded-2xl ${card} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="premium-table">
              <thead>
                <tr>
                  {["Patient","Email","Blood Group","Joined","ID"].map(h => (
                    <th key={h} className="p-4">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="p-10 text-center text-slate-400 text-sm">No patients found</td></tr>
                ) : filtered.map((p, i) => (
                  <motion.tr key={p.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {p.name.charAt(0)}
                        </div>
                        <span className={`font-semibold text-sm ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{p.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-400 text-sm">{p.email}</td>
                    <td className="p-4"><span className="badge badge-green">{p.bloodGroup}</span></td>
                    <td className="p-4 text-slate-400 text-sm">{p.joinedDate}</td>
                    <td className="p-4 font-mono text-xs text-slate-400">{p.id}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  // ── DOCTORS VIEW ──────────────────────────────────────────────────────────────
  if (currentView === "admin-doctors") {
    const filtered = approved.filter(d =>
      d.name.toLowerCase().includes(searchDoc.toLowerCase()) ||
      d.department.toLowerCase().includes(searchDoc.toLowerCase())
    );
    return (
      <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>Specialist Registry</h1>
            <p className="text-sm text-slate-400 mt-0.5">{approved.length} active · {pending.length} pending approval</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="btn-primary py-2.5 px-4 text-sm self-start sm:self-auto">
            <Plus className="w-4 h-4" />Add Specialist
          </button>
        </div>

        {/* Pending Queue */}
        {pending.length > 0 && (
          <div className="space-y-3">
            <h2 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              Pending Credential Review
              <span className="badge badge-yellow">{pending.length}</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pending.map((doc, i) => (
                <motion.div key={doc.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className={`rounded-xl ${card} p-4 flex items-center gap-3`}>
                  <img src={doc.photo} alt={doc.name} referrerPolicy="no-referrer"
                    className="w-10 h-10 rounded-lg object-cover shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm truncate ${darkMode ? "text-white" : "text-slate-900"}`}>{doc.name}</p>
                    <p className="text-xs text-slate-400">{doc.department} · {doc.experience}yr exp</p>
                  </div>
                  <div className="flex gap-1.5 shrink-0">
                    <button onClick={() => onApproveDoctor(doc.id)}
                      className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 hover:bg-emerald-100 transition-colors">
                      <Check className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => onRejectDoctor(doc.id)}
                      className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 transition-colors">
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input value={searchDoc} onChange={e => setSearchDoc(e.target.value)}
            placeholder="Search specialists…" className="input-field pl-10" />
        </div>

        {/* Active Doctors Table */}
        <div className={`rounded-2xl ${card} overflow-hidden`}>
          <div className="overflow-x-auto">
            <table className="premium-table">
              <thead>
                <tr>{["Physician","Specialty","Rating","Experience","Status","Actions"].map(h => <th key={h} className="p-4">{h}</th>)}</tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="p-10 text-center text-slate-400 text-sm">No doctors found</td></tr>
                ) : filtered.map((doc, i) => (
                  <motion.tr key={doc.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.04 }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img src={doc.photo} alt={doc.name} referrerPolicy="no-referrer"
                          className="w-9 h-9 rounded-lg object-cover shrink-0" />
                        <div>
                          <p className={`font-semibold text-sm ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{doc.name}</p>
                          <p className="text-xs text-slate-400">{doc.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4"><span className="badge badge-blue">{doc.department}</span></td>
                    <td className="p-4 text-amber-500 font-bold text-sm">★ {doc.rating}</td>
                    <td className="p-4 text-slate-400 text-sm">{doc.experience} yrs</td>
                    <td className="p-4"><span className="badge badge-green">Active</span></td>
                    <td className="p-4">
                      <button onClick={() => { if (confirm(`Remove ${doc.name}?`)) onRemoveDoctor(doc.id); }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <AnimatePresence>
          {showAddModal && (
            <AddDoctorModal darkMode={darkMode} onClose={() => setShowAddModal(false)} onAdd={onAddDoctor} />
          )}
        </AnimatePresence>
      </div>
    );
  }

  // ── ANALYTICS DASHBOARD ───────────────────────────────────────────────────────
  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className={`text-2xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>
          Analytics Overview
        </h1>
        <p className="text-sm text-slate-400 mt-0.5">Platform-wide clinical performance metrics</p>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Active Doctors"  value={approved.length}     sub="Certified"     icon={Stethoscope}  color="gradient-card-blue"   delay={0}    />
        <StatCard label="Patients"        value={patients.length}     sub="Registered"    icon={Users}        color="gradient-card-teal"   delay={0.07} />
        <StatCard label="Appointments"    value={appointments.length} sub="Total booked"  icon={Calendar}     color="gradient-card-green"  delay={0.12} />
        <StatCard label="Pending Review"  value={pending.length}      sub="Awaiting"      icon={AlertTriangle} color="gradient-card-orange" delay={0.17} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Bar Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className={`lg:col-span-2 rounded-2xl ${card} p-5 space-y-4`}>
          <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
            <BarChart3 className="w-4 h-4 text-blue-500" />Consultations by Department
          </h3>
          <div className="h-52">
            {barData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">No appointment data yet</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke={darkMode ? "#1E293B" : "#F1F5F9"} />
                  <XAxis dataKey="name" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="Appointments" fill="#2563EB" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </motion.div>

        {/* Pie Chart */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className={`rounded-2xl ${card} p-5 space-y-4`}>
          <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
            <PieIcon className="w-4 h-4 text-teal-500" />Doctor Distribution
          </h3>
          <div className="h-40">
            {pieData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-sm text-slate-400">No data</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={45} outerRadius={65}
                    paddingAngle={3} dataKey="value">
                    {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
          <div className="space-y-1.5">
            {pieData.slice(0, 4).map((d, i) => (
              <div key={d.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-slate-400 truncate max-w-24">{d.name}</span>
                </div>
                <span className={`text-xs font-bold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{d.value}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Trend + Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Area trend */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
          className={`lg:col-span-2 rounded-2xl ${card} p-5 space-y-4`}>
          <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
            <TrendingUp className="w-4 h-4 text-teal-500" />6-Month Platform Trend
          </h3>
          <div className="h-44">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#2563EB" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#14B8A6" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#14B8A6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#94A3B8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip {...tooltipStyle} />
                <Legend iconSize={8} wrapperStyle={{ fontSize: "11px" }} />
                <Area type="monotone" dataKey="Appointments" stroke="#2563EB" strokeWidth={2} fill="url(#g1)" dot={false} />
                <Area type="monotone" dataKey="Patients"     stroke="#14B8A6" strokeWidth={2} fill="url(#g2)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Recent Activity Feed */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className={`rounded-2xl ${card} p-5 space-y-4`}>
          <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? "text-white" : "text-slate-900"}`}>
            <Activity className="w-4 h-4 text-blue-500" />Recent Activity
          </h3>
          <div className="space-y-3">
            {recentActivity.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No recent activity.</p>
            ) : recentActivity.map((item, i) => (
              <motion.div key={item.id + i}
                initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.45 + i * 0.06 }}
                className="flex items-start gap-3">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}>
                  <item.icon className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <p className={`text-xs font-semibold truncate ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{item.title}</p>
                  <p className="text-[11px] text-slate-400 truncate">{item.desc}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddDoctorModal darkMode={darkMode} onClose={() => setShowAddModal(false)} onAdd={onAddDoctor} />
        )}
      </AnimatePresence>
    </div>
  );
}
