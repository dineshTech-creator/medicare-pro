import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Eye, EyeOff, Mail, Lock, User, Phone, Calendar, Droplets,
  ArrowRight, Activity, Shield, Brain, CheckCircle2, AlertCircle,
  HeartPulse, Stethoscope, UserPlus, LogIn, Sparkles,
  Building2, ChevronRight, Info
} from "lucide-react";
import axios from "axios";
import { UserSession } from "../types";

interface AuthScreensProps {
  darkMode: boolean;
  onLoginSuccess: (user: UserSession) => void;
  onRegisterPatient: (data: any) => void;
}

type Role = "PATIENT" | "DOCTOR" | "ADMIN";
type Screen = "login" | "register";

// ─── Left Panel ───────────────────────────────────────────────────────────────

function LeftPanel() {
  const stats = [
    { value: "50K+", label: "Monthly Appointments" },
    { value: "98%",  label: "Patient Satisfaction" },
    { value: "4.9★", label: "Platform Rating" },
  ];
  const features = [
    { icon: Brain,       label: "AI-Powered Diagnostics",   desc: "Gemini AI analyzes symptoms in real-time" },
    { icon: Shield,      label: "HIPAA Compliant Security", desc: "Enterprise-grade data protection" },
    { icon: HeartPulse,  label: "24/7 Clinical Support",    desc: "Round-the-clock medical assistance" },
    { icon: Stethoscope, label: "500+ Specialists",         desc: "Top-rated doctors across 20 departments" },
  ];
  return (
    <div className="hidden lg:flex lg:w-[52%] relative overflow-hidden flex-col justify-between p-12 gradient-hero">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-blue-600/20 blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-teal-500/15 blur-3xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.8) 1px,transparent 1px)", backgroundSize: "48px 48px" }} />
      <motion.div initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}
        className="relative z-10 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center shadow-brand">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <span className="text-white font-bold text-lg tracking-tight leading-none block">MediCare Pro</span>
          <span className="text-blue-300/80 text-xs font-medium">AI-Powered Healthcare Platform</span>
        </div>
      </motion.div>
      <motion.div initial={{ opacity:0, y:24 }} animate={{ opacity:1, y:0 }}
        transition={{ duration:0.6, delay:0.15 }} className="relative z-10 space-y-6">
        <div className="flex gap-3 flex-wrap">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 backdrop-blur-sm">
              <p className="text-white font-bold text-base leading-none">{s.value}</p>
              <p className="text-blue-200/70 text-[11px] mt-0.5">{s.label}</p>
            </motion.div>
          ))}
        </div>
        <div className="space-y-2">
          <h2 className="text-4xl font-bold text-white leading-tight tracking-tight">
            Healthcare,<br />
            <span className="bg-gradient-to-r from-blue-300 to-teal-300 bg-clip-text text-transparent">reimagined.</span>
          </h2>
          <p className="text-blue-200/80 text-sm leading-relaxed max-w-sm">
            AI-powered consultations, instant booking, and real-time health monitoring — all in one platform.
          </p>
        </div>
        <div className="space-y-3">
          {features.map((f, i) => (
            <motion.div key={f.label} initial={{ opacity:0, x:-16 }} animate={{ opacity:1, x:0 }}
              transition={{ delay: 0.5 + i * 0.08 }} className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center shrink-0 mt-0.5">
                <f.icon className="w-4 h-4 text-blue-200" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold leading-none">{f.label}</p>
                <p className="text-blue-300/60 text-xs mt-0.5">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
      <motion.blockquote initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.9 }}
        className="relative z-10 border-l-2 border-blue-400/40 pl-4">
        <p className="text-blue-200/70 text-sm italic leading-relaxed">
          "The art of medicine consists of amusing the patient while nature cures the disease."
        </p>
        <footer className="text-blue-300/50 text-xs mt-1 font-medium">— Voltaire</footer>
      </motion.blockquote>
    </div>
  );
}

// ─── Reusable Input ───────────────────────────────────────────────────────────

function Field({ id, label, type="text", value, onChange, icon, rightAddon, required }: {
  id: string; label: string; type?: string; value: string;
  onChange: (v: string) => void; icon?: React.ReactNode;
  rightAddon?: React.ReactNode; required?: boolean;
}) {
  return (
    <div className="relative">
      {icon && (
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
          {icon}
        </div>
      )}
      <input id={id} type={type} value={value} onChange={e => onChange(e.target.value)}
        placeholder=" " required={required}
        className="w-full pt-5 pb-2 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none transition-all duration-200 peer focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder-transparent"
        style={{ paddingLeft: icon ? "2.5rem" : "0.875rem", paddingRight: rightAddon ? "2.75rem" : "0.875rem" }} />
      <label htmlFor={id}
        className="absolute top-1/2 -translate-y-1/2 text-sm text-slate-400 pointer-events-none transition-all duration-200
          peer-focus:top-3.5 peer-focus:translate-y-0 peer-focus:text-[10px] peer-focus:font-bold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-blue-500
          peer-[&:not(:placeholder-shown)]:top-3.5 peer-[&:not(:placeholder-shown)]:translate-y-0 peer-[&:not(:placeholder-shown)]:text-[10px] peer-[&:not(:placeholder-shown)]:font-bold peer-[&:not(:placeholder-shown)]:uppercase peer-[&:not(:placeholder-shown)]:tracking-wider peer-[&:not(:placeholder-shown)]:text-blue-500"
        style={{ left: icon ? "2.5rem" : "0.875rem" }}>
        {label}
      </label>
      {rightAddon && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 z-10">{rightAddon}</div>
      )}
    </div>
  );
}

// ─── Error / Success banners ──────────────────────────────────────────────────

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
      className="flex items-start gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
      <span>{msg}</span>
    </motion.div>
  );
}

function SuccessBanner({ msg }: { msg: string }) {
  return (
    <motion.div initial={{ opacity:0, y:-6 }} animate={{ opacity:1, y:0 }}
      className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm">
      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
      <span>{msg}</span>
    </motion.div>
  );
}

// ─── Submit Button ────────────────────────────────────────────────────────────

function SubmitBtn({ loading, label, icon: Icon }: {
  loading: boolean; label: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <motion.button type="submit" disabled={loading} whileTap={{ scale: 0.98 }}
      className="w-full py-3 rounded-xl text-sm font-semibold text-white gradient-brand shadow-brand hover:opacity-90 transition-all flex items-center justify-center gap-2 disabled:opacity-60">
      {loading ? (
        <>
          <motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block" />
          Please wait…
        </>
      ) : (
        <><Icon className="w-4 h-4" />{label}</>
      )}
    </motion.button>
  );
}

// ─── Role Tab Bar ─────────────────────────────────────────────────────────────

const ROLE_TABS: { role: Role; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [
  { role: "PATIENT", label: "Patient",  icon: User,       color: "text-blue-600" },
  { role: "DOCTOR",  label: "Doctor",   icon: Stethoscope,color: "text-teal-600" },
  { role: "ADMIN",   label: "Admin",    icon: Building2,  color: "text-violet-600" },
];

function RoleTabs({ active, onChange }: { active: Role; onChange: (r: Role) => void }) {
  return (
    <div className="flex rounded-xl bg-slate-100 p-1 gap-1">
      {ROLE_TABS.map(t => (
        <button key={t.role} type="button" onClick={() => onChange(t.role)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-semibold transition-all duration-200
            ${active === t.role
              ? "bg-white shadow-sm text-slate-900"
              : "text-slate-500 hover:text-slate-700"}`}>
          <t.icon className={`w-3.5 h-3.5 ${active === t.role ? t.color : ""}`} />
          {t.label}
        </button>
      ))}
    </div>
  );
}

// ─── PATIENT FORMS ────────────────────────────────────────────────────────────

function PatientLogin({ onSuccess }: { onSuccess: (u: UserSession) => void }) {
  const [email, setEmail]       = useState("");
  const [pass,  setPass]        = useState("");
  const [show,  setShow]        = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", { email, password: pass, role: "PATIENT" });
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <button 
        type="button" 
        onClick={() => { setEmail("dineshstar979@gmail.com"); setPass("Patient@123"); }}
        className="w-full py-2 mb-1 rounded-xl text-sm font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors flex items-center justify-center gap-2"
      >
        <User className="w-4 h-4" /> Use Demo Patient Account
      </button>
      {error && <ErrorBanner msg={error} />}
      <Field id="p-email" label="Email address" type="email" value={email} onChange={setEmail}
        icon={<Mail className="w-4 h-4" />} required />
      <Field id="p-pass" label="Password" type={show ? "text" : "password"} value={pass} onChange={setPass}
        icon={<Lock className="w-4 h-4" />} required
        rightAddon={
          <button type="button" onClick={() => setShow(s => !s)}
            className="text-slate-400 hover:text-slate-600 transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        } />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer select-none">
          <input type="checkbox" className="w-3.5 h-3.5 rounded border-slate-300 accent-blue-600" />
          <span className="text-xs text-slate-500">Remember me</span>
        </label>
        <button type="button" className="text-xs text-blue-500 hover:text-blue-600 font-semibold">Forgot password?</button>
      </div>
      <SubmitBtn loading={loading} label="Sign In" icon={ArrowRight} />
    </form>
  );
}

function PatientRegister({ onSuccess }: { onSuccess: (u: UserSession) => void }) {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [show,  setShow]  = useState(false);
  const [phone, setPhone] = useState("");
  const [dob,   setDob]   = useState("");
  const [blood, setBlood] = useState("O+");
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/register/patient",
        { name, email, password: pass, phone, dob, bloodGroup: blood });
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      {error && <ErrorBanner msg={error} />}
      <Field id="r-name"  label="Full name"     value={name}  onChange={setName}  icon={<User className="w-4 h-4" />}     required />
      <Field id="r-email" label="Email address" type="email" value={email} onChange={setEmail} icon={<Mail className="w-4 h-4" />} required />
      <Field id="r-pass"  label="Password (min 6 chars)" type={show ? "text" : "password"} value={pass} onChange={setPass}
        icon={<Lock className="w-4 h-4" />} required
        rightAddon={
          <button type="button" onClick={() => setShow(s => !s)}
            className="text-slate-400 hover:text-slate-600 transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        } />
      <Field id="r-phone" label="Phone number"  value={phone} onChange={setPhone} icon={<Phone className="w-4 h-4" />}    required />
      <Field id="r-dob"   label="Date of birth" type="date"   value={dob}   onChange={setDob}   icon={<Calendar className="w-4 h-4" />} required />
      <div className="relative">
        <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none z-10">
          <Droplets className="w-4 h-4" />
        </div>
        <select value={blood} onChange={e => setBlood(e.target.value)}
          className="w-full pl-10 pt-5 pb-2 pr-3.5 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
          {["O+","O-","A+","A-","B+","B-","AB+","AB-"].map(g => <option key={g} value={g}>{g}</option>)}
        </select>
        <label className="absolute left-10 top-1.5 text-[10px] font-bold uppercase tracking-wider text-blue-500 pointer-events-none">Blood Group</label>
      </div>
      <SubmitBtn loading={loading} label="Create Patient Account" icon={UserPlus} />
    </form>
  );
}

// ─── DOCTOR FORMS ─────────────────────────────────────────────────────────────

const DEPTS = ["Cardiology","Pediatrics","Neurology","Orthopedics","Dermatology","General Medicine"];

function DoctorLogin({ onSuccess }: { onSuccess: (u: UserSession) => void }) {
  const [email, setEmail]     = useState("");
  const [pass,  setPass]      = useState("");
  const [show,  setShow]      = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", { email, password: pass, role: "DOCTOR" });
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      <button 
        type="button" 
        onClick={() => { setEmail("sarah.j@medicare.com"); setPass("Doctor@123"); }}
        className="w-full py-2 mb-1 rounded-xl text-sm font-semibold text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 transition-colors flex items-center justify-center gap-2"
      >
        <Stethoscope className="w-4 h-4" /> Use Demo Doctor Account
      </button>
      {error && <ErrorBanner msg={error} />}
      <Field id="d-email" label="Doctor email" type="email" value={email} onChange={setEmail}
        icon={<Mail className="w-4 h-4" />} required />
      <Field id="d-pass" label="Password" type={show ? "text" : "password"} value={pass} onChange={setPass}
        icon={<Lock className="w-4 h-4" />} required
        rightAddon={
          <button type="button" onClick={() => setShow(s => !s)}
            className="text-slate-400 hover:text-slate-600 transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        } />
      <SubmitBtn loading={loading} label="Sign In as Doctor" icon={ArrowRight} />
    </form>
  );
}

function DoctorRegister({ onDone }: { onDone: () => void }) {
  const [name,  setName]  = useState("");
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [show,  setShow]  = useState(false);
  const [dept,  setDept]  = useState("Cardiology");
  const [exp,   setExp]   = useState("1");
  const [bio,   setBio]   = useState("");
  const [photo, setPhoto] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [success, setSuccess] = useState("");

  const handlePhotoUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (ev.target?.result) {
        setPhoto(ev.target.result as string);
        setError("");
      }
    };
    reader.readAsDataURL(file);
  };

  const onDragOver = (e: React.DragEvent) => { e.preventDefault(); setIsDragging(true); };
  const onDragLeave = () => setIsDragging(false);
  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handlePhotoUpload(e.dataTransfer.files[0]);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      await axios.post("/api/auth/register/doctor",
        { name, email, password: pass, department: dept, experience: exp, bio, photo });
      setSuccess("Application submitted! An admin will review and approve your account. You can then sign in.");
      onDone();
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed.");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-3">
      {error   && <ErrorBanner   msg={error} />}
      {success && <SuccessBanner msg={success} />}
      <div className="p-3 rounded-xl bg-amber-50 border border-amber-100 flex items-start gap-2 text-xs text-amber-700">
        <Sparkles className="w-3.5 h-3.5 mt-0.5 shrink-0" />
        <span>Your account will be <strong>PENDING</strong> until an Admin approves it. You will be able to log in after approval.</span>
      </div>
      <Field id="dr-name"  label="Full name"       value={name}  onChange={setName}  icon={<User className="w-4 h-4" />}  required />
      <Field id="dr-email" label="Work email"      type="email"  value={email} onChange={setEmail} icon={<Mail className="w-4 h-4" />} required />
      <Field id="dr-pass"  label="Password (min 6 chars)" type={show ? "text" : "password"} value={pass} onChange={setPass}
        icon={<Lock className="w-4 h-4" />} required
        rightAddon={
          <button type="button" onClick={() => setShow(s => !s)}
            className="text-slate-400 hover:text-slate-600 transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        } />
      <div className="grid grid-cols-2 gap-3">
        <div className="relative">
          <select value={dept} onChange={e => setDept(e.target.value)}
            className="w-full px-3 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none appearance-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100">
            {DEPTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <label className="absolute left-3 top-1 text-[10px] font-bold uppercase tracking-wider text-blue-500 pointer-events-none">Department</label>
        </div>
        <Field id="dr-exp" label="Experience (yrs)" type="number" value={exp} onChange={setExp}
          icon={<ChevronRight className="w-4 h-4" />} required />
      </div>
      <div className="relative">
        <textarea value={bio} onChange={e => setBio(e.target.value)} rows={2} placeholder="Brief professional bio…"
          className="w-full px-3.5 py-3 text-sm text-slate-900 bg-slate-50 border border-slate-200 rounded-xl outline-none resize-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-100 leading-relaxed" />
      </div>
      <div 
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`w-full p-4 border-2 border-dashed rounded-xl flex flex-col items-center justify-center transition-colors cursor-pointer
          ${isDragging ? "border-blue-500 bg-blue-50" : "border-slate-300 bg-slate-50 hover:bg-slate-100"}
          ${photo ? "py-2" : "py-6"}`}
      >
        <input 
          type="file" 
          accept="image/*" 
          onChange={(e) => { if (e.target.files && e.target.files[0]) handlePhotoUpload(e.target.files[0]); }}
          className="hidden" 
          id="photo-upload"
        />
        <label htmlFor="photo-upload" className="flex flex-col items-center cursor-pointer w-full h-full">
          {photo ? (
            <div className="relative group">
              <img src={photo} alt="Preview" className="w-16 h-16 rounded-full object-cover shadow-sm border border-slate-200" />
              <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[10px] text-white font-bold uppercase">Change</span>
              </div>
            </div>
          ) : (
            <>
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center mb-2">
                <User className="w-5 h-5 text-blue-500" />
              </div>
              <span className="text-xs font-semibold text-slate-700">Drag & drop profile photo</span>
              <span className="text-[10px] text-slate-400 mt-0.5">or click to browse</span>
            </>
          )}
        </label>
      </div>
      <SubmitBtn loading={loading} label="Submit Application" icon={UserPlus} />
    </form>
  );
}

// ─── ADMIN FORM (login only — no public registration) ────────────────────────

function AdminLogin({ onSuccess }: { onSuccess: (u: UserSession) => void }) {
  const [email, setEmail]     = useState("");
  const [pass,  setPass]      = useState("");
  const [show,  setShow]      = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { data } = await axios.post("/api/auth/login", { email, password: pass, role: "ADMIN" });
      onSuccess(data.user);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid admin credentials.");
    } finally { setLoading(false); }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <button 
        type="button" 
        onClick={() => { setEmail("admin@medicare.com"); setPass("Admin@123"); }}
        className="w-full py-2 mb-1 rounded-xl text-sm font-semibold text-violet-700 bg-violet-50 hover:bg-violet-100 border border-violet-200 transition-colors flex items-center justify-center gap-2"
      >
        <Building2 className="w-4 h-4" /> Use Demo Admin Account
      </button>
      {error && <ErrorBanner msg={error} />}

      <div className="p-4 rounded-xl bg-violet-50 border border-violet-100 space-y-1.5">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-violet-500" />
          <p className="text-xs font-bold text-violet-700 uppercase tracking-wide">System Administrator Access</p>
        </div>
        <p className="text-[11px] text-violet-500">Admin accounts are managed by the system. Contact your IT administrator for access credentials.</p>
      </div>

      <Field id="a-email" label="Admin email" type="email" value={email} onChange={setEmail}
        icon={<Mail className="w-4 h-4" />} required />
      <Field id="a-pass" label="Password" type={show ? "text" : "password"} value={pass} onChange={setPass}
        icon={<Lock className="w-4 h-4" />} required
        rightAddon={
          <button type="button" onClick={() => setShow(s => !s)}
            className="text-slate-400 hover:text-slate-600 transition-colors">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        } />
      <SubmitBtn loading={loading} label="Sign In as Admin" icon={Shield} />
    </form>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AuthScreens({ onLoginSuccess }: AuthScreensProps) {
  const [role,   setRole]   = useState<Role>("PATIENT");
  const [screen, setScreen] = useState<Screen>("login");

  // Reset screen to login whenever role changes
  const handleRoleChange = (r: Role) => {
    setRole(r);
    setScreen("login");
  };

  const ROLE_META = {
    PATIENT: { accent: "text-blue-600",  bg: "bg-blue-50",   border: "border-blue-100" },
    DOCTOR:  { accent: "text-teal-600",  bg: "bg-teal-50",   border: "border-teal-100" },
    ADMIN:   { accent: "text-violet-600",bg: "bg-violet-50", border: "border-violet-100" },
  };
  const meta = ROLE_META[role];

  return (
    <div className="flex w-full h-full bg-white">
      <LeftPanel />

      {/* ── Right Panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 overflow-y-auto bg-white">
        <div className="w-full max-w-[380px] space-y-6">

          {/* Logo (mobile only — left panel is hidden on mobile) */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">MediCare Pro</span>
          </div>

          {/* Page heading */}
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {screen === "login" ? "Sign in" : "Create account"}
            </h1>
            <p className="text-sm text-slate-400 mt-0.5">
              {screen === "login"
                ? "Welcome back — choose your role below"
                : "Fill in your details to get started"}
            </p>
          </div>

          {/* Role tabs */}
          <RoleTabs active={role} onChange={handleRoleChange} />

          {/* Role description strip */}
          <div className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border ${meta.bg} ${meta.border}`}>
            {role === "PATIENT" && <User       className={`w-4 h-4 ${meta.accent}`} />}
            {role === "DOCTOR"  && <Stethoscope className={`w-4 h-4 ${meta.accent}`} />}
            {role === "ADMIN"   && <Building2   className={`w-4 h-4 ${meta.accent}`} />}
            <p className={`text-xs font-semibold ${meta.accent}`}>
              {role === "PATIENT" && "Book appointments, check symptoms, view medical records"}
              {role === "DOCTOR"  && "Manage your patient queue, consultations and schedule"}
              {role === "ADMIN"   && "Full platform control — doctors, patients, analytics"}
            </p>
          </div>

          {/* Form area */}
          <AnimatePresence mode="wait">
            <motion.div key={`${role}-${screen}`}
              initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}>

              {/* PATIENT */}
              {role === "PATIENT" && screen === "login"    && <PatientLogin    onSuccess={onLoginSuccess} />}
              {role === "PATIENT" && screen === "register" && <PatientRegister onSuccess={onLoginSuccess} />}

              {/* DOCTOR */}
              {role === "DOCTOR"  && screen === "login"    && <DoctorLogin     onSuccess={onLoginSuccess} />}
              {role === "DOCTOR"  && screen === "register" && <DoctorRegister  onDone={() => setScreen("login")} />}

              {/* ADMIN — login only */}
              {role === "ADMIN"   && <AdminLogin onSuccess={onLoginSuccess} />}
            </motion.div>
          </AnimatePresence>

          {/* Login ↔ Register toggle — not shown for Admin */}
          {role !== "ADMIN" && (
            <p className="text-center text-sm text-slate-400">
              {screen === "login" ? (
                <>
                  {role === "PATIENT" ? "New patient?" : "New to MediCare Pro?"}{" "}
                  <button onClick={() => setScreen("register")}
                    className={`font-semibold transition-colors ${meta.accent} hover:opacity-75`}>
                    {role === "PATIENT" ? "Create patient account" : "Apply as a Doctor"}
                  </button>
                </>
              ) : (
                <>
                  Already have an account?{" "}
                  <button onClick={() => setScreen("login")}
                    className={`font-semibold transition-colors ${meta.accent} hover:opacity-75`}>
                    Sign in
                  </button>
                </>
              )}
            </p>
          )}

          {/* Footer note */}
          <p className="text-center text-[11px] text-slate-300">
            By continuing you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
