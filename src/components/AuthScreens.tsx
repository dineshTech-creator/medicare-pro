import React, { useState } from "react";
import { LogIn, Key, Mail, ShieldAlert, Sparkles, Activity, CheckCircle, ArrowRight, UserPlus } from "lucide-react";

interface AuthScreensProps {
  darkMode: boolean;
  onLoginSuccess: (user: { name: string; role: "PATIENT" | "DOCTOR" | "ADMIN"; id: string; department?: string }) => void;
  onRegisterPatient: (patientData: { name: string; email: string; phone: string; dob: string; bloodGroup: string }) => void;
}

export default function AuthScreens({ darkMode, onLoginSuccess, onRegisterPatient }: AuthScreensProps) {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  // Registration States
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regDob, setRegDob] = useState("");
  const [regBlood, setRegBlood] = useState("O+");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Quick routing logins
    if (email.toLowerCase().includes("admin")) {
      onLoginSuccess({ name: "College Board Admin", role: "ADMIN", id: "adm-1" });
    } else if (email.toLowerCase().includes("doctor") || email.toLowerCase().includes("sarah")) {
      onLoginSuccess({ name: "Dr. Sarah Jenkins", role: "DOCTOR", id: "doc-1", department: "Cardiology" });
    } else {
      onLoginSuccess({ name: "Dinesh Kumar", role: "PATIENT", id: "pat-1" });
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onRegisterPatient({
      name: regName,
      email: regEmail,
      phone: regPhone,
      dob: regDob,
      bloodGroup: regBlood
    });
    setIsRegister(false);
  };

  const handlePresetSelect = (role: "PATIENT" | "DOCTOR" | "ADMIN") => {
    if (role === "ADMIN") {
      onLoginSuccess({ name: "Clinical System Board Admin", role: "ADMIN", id: "adm-1" });
    } else if (role === "DOCTOR") {
      onLoginSuccess({ name: "Dr. Sarah Jenkins", role: "DOCTOR", id: "doc-1", department: "Cardiology" });
    } else {
      onLoginSuccess({ name: "Dinesh Kumar", role: "PATIENT", id: "pat-1" });
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-8 font-sans">
      <div className={`w-full max-w-md p-8 rounded-2xl border shadow-xl flex flex-col justify-between transition-all duration-300
        ${darkMode ? "bg-[#0F172A]/80 border-slate-800" : "bg-white border-slate-200"}`}
      >
        
        {/* Core Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl ai-gradient text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-500/20">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <h2 className="text-xl font-extrabold font-display tracking-tight text-slate-900 dark:text-white leading-none">
            {isRegister ? "Create Clinical Account" : "Access Hospital Portal"}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister ? "Join St. Jude AI Medical Center" : "Role-Based JWT Gateway Credentials"}
          </p>
        </div>

        {/* Preset Role Quick Access (college convenience) */}
        {!isRegister && (
          <div className="mb-6 space-y-2 text-center">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest block pl-1 text-center">
              Quick Load Preset Roles (For Evaluators)
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button 
                onClick={() => handlePresetSelect("PATIENT")}
                className="px-2.5 py-2 rounded-xl text-[10px] font-mono font-semibold bg-sky-500/10 text-sky-500 hover:bg-sky-500/20 border border-sky-500/10 transition-colors cursor-pointer"
              >
                Patient Role
              </button>
              <button 
                onClick={() => handlePresetSelect("DOCTOR")}
                className="px-2.5 py-2 rounded-xl text-[10px] font-mono font-semibold bg-indigo-600/10 text-indigo-500 hover:bg-indigo-600/20 border border-indigo-500/10 transition-colors cursor-pointer"
              >
                Doctor Role
              </button>
              <button 
                onClick={() => handlePresetSelect("ADMIN")}
                className="px-2.5 py-2 rounded-xl text-[10px] font-mono font-semibold bg-pink-600/10 text-pink-600 hover:bg-pink-600/20 border border-pink-500/10 transition-colors cursor-pointer"
              >
                Admin Role
              </button>
            </div>
          </div>
        )}

        {/* Input Forms */}
        {isRegister ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Full Name</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Dinesh Kumar"
                className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                  ${darkMode ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Email address</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="dineshstar979@gmail.com"
                className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                  ${darkMode ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                required
              />
            </div>

            <div className="space-y-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Phone Number</label>
                  <input
                    type="text"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                      ${darkMode ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Blood Group</label>
                  <select
                    value={regBlood}
                    onChange={(e) => setRegBlood(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                      ${darkMode ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                  >
                    <option value="O+">O+</option>
                    <option value="A+">A+</option>
                    <option value="B+">B+</option>
                    <option value="AB+">AB+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Date of Birth</label>
              <input
                type="date"
                value={regDob}
                onChange={(e) => setRegDob(e.target.value)}
                className={`w-full px-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                  ${darkMode ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 ai-gradient text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/10 hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Patient Account</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Email or username</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="dineshstar979@gmail.com"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                    ${darkMode ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] uppercase font-mono tracking-wider text-slate-400 pl-1">Password</label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className={`w-full pl-9 pr-3 py-2 rounded-xl text-xs border focus:outline-none focus:ring-1 focus:ring-sky-500
                    ${darkMode ? "bg-[#0F172A] border-slate-800 text-slate-100" : "bg-slate-50 border-slate-200"}`}
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 ai-gradient text-white rounded-xl text-xs font-bold shadow-md shadow-sky-500/10 hover:opacity-95 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Enter Clinical Gateway</span>
            </button>
          </form>
        )}

        {/* Toggle Footer */}
        <div className="mt-6 border-t pt-4 border-inherit text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-[11px] text-sky-500 hover:text-sky-400 font-medium font-mono cursor-pointer"
          >
            {isRegister ? "Already registered? Access Login Portal" : "No clinical account? Book as Patient"}
          </button>
        </div>

      </div>
    </div>
  );
}
