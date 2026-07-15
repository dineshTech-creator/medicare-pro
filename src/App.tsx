import React, { useState, useEffect, useCallback, createContext, useContext } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";
import {
  HeartPulse, AlertCircle, RefreshCw, CheckCircle2,
  AlertTriangle, Info, X, Bell, Search, ChevronDown, Moon, Sun
} from "lucide-react";

import Sidebar from "./components/Sidebar";
import AuthScreens from "./components/AuthScreens";
import PatientDashboard from "./components/PatientDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import SymptomChecker from "./components/SymptomChecker";
import AIChatbot from "./components/AIChatbot";
import ReportSummarizer from "./components/ReportSummarizer";

import { Doctor, Patient, Appointment, MedicalReport, SystemSettings, Toast, ToastVariant, UserSession } from "./types";

// ─── Toast Context ────────────────────────────────────────────────────────────

interface ToastContextValue {
  addToast: (title: string, description?: string, variant?: ToastVariant, duration?: number) => void;
}
const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });
export const useToast = () => useContext(ToastContext);

// ─── Toast Component ──────────────────────────────────────────────────────────

const TOAST_ICONS: Record<ToastVariant, React.ReactNode> = {
  success: <CheckCircle2 className="w-4 h-4 text-emerald-500" />,
  error:   <AlertCircle  className="w-4 h-4 text-red-500" />,
  warning: <AlertTriangle className="w-4 h-4 text-amber-500" />,
  info:    <Info         className="w-4 h-4 text-blue-500" />,
};
const TOAST_STYLES: Record<ToastVariant, string> = {
  success: "border-emerald-200 bg-white dark:bg-slate-900 dark:border-emerald-800/50",
  error:   "border-red-200   bg-white dark:bg-slate-900 dark:border-red-800/50",
  warning: "border-amber-200 bg-white dark:bg-slate-900 dark:border-amber-800/50",
  info:    "border-blue-200  bg-white dark:bg-slate-900 dark:border-blue-800/50",
};

function ToastContainer({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: string) => void }) {
  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            layout
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{    opacity: 0, y: 8,  scale: 0.96, transition: { duration: 0.15 } }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-elevated min-w-[300px] max-w-sm ${TOAST_STYLES[t.variant]}`}
          >
            <div className="mt-0.5 shrink-0">{TOAST_ICONS[t.variant]}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{t.title}</p>
              {t.description && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{t.description}</p>}
            </div>
            <button onClick={() => onRemove(t.id)} className="shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors mt-0.5">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

// ─── Page Transition Wrapper ──────────────────────────────────────────────────

function PageWrapper({ children, viewKey }: { children: React.ReactNode; viewKey: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewKey}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{    opacity: 0, y: -4 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
        className="flex-1 flex flex-col min-h-0 overflow-hidden"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("darkMode");
    return saved ? saved === "true" : true;
  });

  // Sync dark mode to <html> class and localStorage
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) root.classList.add("dark");
    else root.classList.remove("dark");
    localStorage.setItem("darkMode", String(darkMode));
  }, [darkMode]);

  // Database state
  const [doctors,      setDoctors]      = useState<Doctor[]>([]);
  const [patients,     setPatients]     = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports,      setReports]      = useState<MedicalReport[]>([]);
  const [settings,     setSettings]     = useState<SystemSettings | null>(null);
  const [dbLoading,    setDbLoading]    = useState(true);
  const [dbError,      setDbError]      = useState<string | null>(null);

  // Session
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });
  const [currentView, setCurrentView] = useState(() => {
    const saved = localStorage.getItem("currentView");
    return saved ? saved : "patient-dashboard";
  });
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("currentUser", JSON.stringify(currentUser));
    } else {
      localStorage.removeItem("currentUser");
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("currentView", currentView);
  }, [currentView]);

  // Toast
  const [toasts, setToasts] = useState<Toast[]>([]);
  const addToast = useCallback((title: string, description?: string, variant: ToastVariant = "info", duration = 4000) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, title, description, variant, duration }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);
  const removeToast = useCallback((id: string) => setToasts(prev => prev.filter(t => t.id !== id)), []);

  useEffect(() => { fetchDb(); }, []);

  const fetchDb = async () => {
    setDbLoading(true);
    setDbError(null);
    try {
      const res = await axios.get("/api/db");
      setDoctors(res.data.doctors);
      setPatients(res.data.patients);
      setAppointments(res.data.appointments);
      setReports(res.data.medicalReports);
      setSettings(res.data.systemSettings);
    } catch (err) {
      console.error(err);
      setDbError("Unable to reach server. Check your connection.");
      addToast("Connection Error", "Could not sync database.", "error");
    } finally {
      setDbLoading(false);
    }
  };

  // ─── API Handlers ───────────────────────────────────────────────────────────

  const handleBookAppointment = async (newApt: Omit<Appointment, "id">) => {
    try {
      const res = await axios.post("/api/appointments", newApt);
      if (res.data.success) {
        setAppointments(prev => [...prev, res.data.appointment]);
        addToast("Appointment Booked", `Scheduled with ${newApt.doctorName} on ${newApt.date}`, "success");
      }
    } catch { addToast("Booking Failed", "Please try again.", "error"); }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      const apt = appointments.find(a => a.id === id);
      if (apt) {
        const res = await axios.put(`/api/appointments/${id}`, { ...apt, status: "CANCELLED" });
        if (res.data.success) {
          setAppointments(prev => prev.map(a => a.id === id ? res.data.appointment : a));
          addToast("Appointment Cancelled", "Your appointment has been cancelled.", "warning");
        }
      }
    } catch { addToast("Error", "Could not cancel appointment.", "error"); }
  };

  const handleRescheduleAppointment = async (id: string, date: string, time: string) => {
    try {
      const apt = appointments.find(a => a.id === id);
      if (apt) {
        const res = await axios.put(`/api/appointments/${id}`, { ...apt, date, time });
        if (res.data.success) {
          setAppointments(prev => prev.map(a => a.id === id ? res.data.appointment : a));
          addToast("Appointment Rescheduled", `New date: ${date} at ${time}`, "success");
        }
      }
    } catch { addToast("Error", "Could not reschedule.", "error"); }
  };

  const handleAddReport = async (newRep: MedicalReport) => {
    try {
      const res = await axios.post("/api/reports", newRep);
      if (res.data.success) {
        setReports(prev => [...prev, res.data.report]);
        addToast("Report Uploaded", "AI summary generated successfully.", "success");
      }
    } catch { addToast("Upload Failed", "Could not save report.", "error"); }
  };

  const handleApproveDoctor = async (id: string) => {
    try {
      const res = await axios.put(`/api/doctors/${id}`, { status: "APPROVED" });
      if (res.data.success) {
        setDoctors(prev => prev.map(d => d.id === id ? res.data.doctor : d));
        addToast("Doctor Approved", "Specialist is now active in the system.", "success");
      }
    } catch { addToast("Error", "Could not approve doctor.", "error"); }
  };

  const handleRejectDoctor = async (id: string) => {
    try {
      const res = await axios.put(`/api/doctors/${id}`, { status: "REJECTED" });
      if (res.data.success) {
        setDoctors(prev => prev.map(d => d.id === id ? res.data.doctor : d));
        addToast("Application Rejected", "Doctor application has been declined.", "warning");
      }
    } catch { addToast("Error", "Could not reject application.", "error"); }
  };

  const handleAddDoctor = async (newDoc: Omit<Doctor, "id">) => {
    try {
      const res = await axios.post("/api/doctors", newDoc);
      if (res.data.success) {
        setDoctors(prev => [...prev, res.data.doctor]);
        addToast("Doctor Added", `${newDoc.name} has been registered.`, "success");
      }
    } catch { addToast("Error", "Could not add doctor.", "error"); }
  };

  const handleRemoveDoctor = async (id: string) => {
    try {
      const res = await axios.delete(`/api/doctors/${id}`);
      if (res.data.success) {
        setDoctors(prev => prev.filter(d => d.id !== id));
        addToast("Doctor Removed", "Specialist removed from registry.", "info");
      }
    } catch { addToast("Error", "Could not remove doctor.", "error"); }
  };

  const handleUpdateSettings = async (updatedSettings: Partial<SystemSettings>) => {
    try {
      const res = await axios.put("/api/settings", updatedSettings);
      if (res.data.success) {
        setSettings(res.data.settings);
        addToast("Settings Saved", "Configuration updated successfully.", "success");
      }
    } catch { addToast("Error", "Could not save settings.", "error"); }
  };

  const handleCompleteAppointment = async (id: string) => {
    try {
      const apt = appointments.find(a => a.id === id);
      if (apt) {
        const res = await axios.put(`/api/appointments/${id}`, { ...apt, status: "COMPLETED" });
        if (res.data.success) {
          setAppointments(prev => prev.map(a => a.id === id ? res.data.appointment : a));
          addToast("Consultation Complete", "Appointment marked as completed.", "success");
        }
      }
    } catch { addToast("Error", "Could not complete appointment.", "error"); }
  };

  const handleRegisterPatient = (_data: any) => {
    // Registration is now handled inside AuthScreens via /api/auth/register/patient
  };

  const handleLoginSuccess = (session: UserSession) => {
    setCurrentUser(session);
    if      (session.role === "PATIENT") setCurrentView("patient-dashboard");
    else if (session.role === "DOCTOR")  setCurrentView("doctor-dashboard");
    else                                  setCurrentView("admin-dashboard");
    fetchDb(); // refresh DB so newly registered users see their data
    addToast(`Welcome back, ${session.name.split(" ")[0]}!`, `Logged in as ${session.role.toLowerCase()}`, "success");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("patient-dashboard");
    addToast("Signed Out", "You have been logged out securely.", "info");
  };

  const handleBookDepartment = (_deptName: string) => {
    if (currentUser?.role === "PATIENT") setCurrentView("patient-appointments");
  };

  // ─── Render ─────────────────────────────────────────────────────────────────

  const renderMainContent = () => {
    if (!currentUser) {
      return (
        <AuthScreens
          darkMode={darkMode}
          onLoginSuccess={handleLoginSuccess}
          onRegisterPatient={handleRegisterPatient}
        />
      );
    }

    const currentPatient = patients.find(p => p.id === currentUser.id) ?? patients[0];
    const currentDoctor  = doctors.find(d  => d.id === currentUser.id) ?? doctors[0];

    const content = (() => {
      switch (currentView) {
        case "patient-dashboard":
        case "patient-appointments":
          return (
            <PatientDashboard
              darkMode={darkMode}
              patient={currentPatient}
              doctors={doctors}
              appointments={appointments}
              onBookAppointment={handleBookAppointment}
              onCancelAppointment={handleCancelAppointment}
              onRescheduleAppointment={handleRescheduleAppointment}
              currentView={currentView}
            />
          );
        case "symptom-checker":
          return <SymptomChecker darkMode={darkMode} onBookDepartment={handleBookDepartment} />;
        case "ai-chatbot":
          return <AIChatbot darkMode={darkMode} patientAge="24" />;
        case "patient-reports":
          return (
            <ReportSummarizer
              darkMode={darkMode}
              patientId={currentPatient?.id ?? ""}
              reports={reports.filter(r => r.patientId === currentPatient?.id)}
              onAddReport={handleAddReport}
            />
          );
        case "doctor-dashboard":
        case "doctor-appointments":
        case "doctor-slots":
          return (
            <DoctorDashboard
              darkMode={darkMode}
              doctor={currentDoctor}
              appointments={appointments}
              onAcceptAppointment={(id) => console.log("accept", id)}
              onRejectAppointment={handleCancelAppointment}
              onCompleteAppointment={handleCompleteAppointment}
              currentView={currentView}
            />
          );
        case "admin-dashboard":
        case "admin-doctors":
        case "admin-patients":
        case "admin-settings":
          return (
            <AdminDashboard
              darkMode={darkMode}
              doctors={doctors}
              patients={patients}
              appointments={appointments}
              settings={settings ?? {
                hospitalName: "MediCare Pro",
                allowAutoApproveDoctors: false,
                enableSmsNotifications: true,
                maxAppointmentsPerSlot: 1,
                emergencyContact: "+1 (555) 019-9000",
              }}
              onApproveDoctor={handleApproveDoctor}
              onRejectDoctor={handleRejectDoctor}
              onAddDoctor={handleAddDoctor}
              onRemoveDoctor={handleRemoveDoctor}
              onUpdateSettings={handleUpdateSettings}
              currentView={currentView}
            />
          );
        default:
          return null;
      }
    })();

    return <PageWrapper viewKey={currentView}>{content}</PageWrapper>;
  };

  // ─── Loading Screen ──────────────────────────────────────────────────────────

  if (dbLoading) {
    return (
      <div className={`w-screen h-screen flex flex-col items-center justify-center gap-6 transition-colors duration-300 ${darkMode ? "bg-[#0F172A]" : "bg-[#F8FAFC]"}`}>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, ease: "backOut" }}
          className="flex flex-col items-center gap-5"
        >
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl gradient-brand flex items-center justify-center shadow-brand">
              <HeartPulse className="w-8 h-8 text-white" />
            </div>
            <motion.div
              className="absolute -inset-1 rounded-2xl border-2 border-blue-400/30"
              animate={{ scale: [1, 1.15, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          </div>
          <div className="text-center space-y-1">
            <h1 className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-slate-900"}`}>MediCare Pro</h1>
            <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Initializing clinical workspace…</p>
          </div>
          <div className={`w-48 h-1 rounded-full overflow-hidden ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}>
            <motion.div
              className="h-full gradient-brand rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, ease: "easeInOut" }}
            />
          </div>
        </motion.div>
      </div>
    );
  }

  // ─── Main Layout ─────────────────────────────────────────────────────────────

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className={`w-screen h-screen flex overflow-hidden transition-colors duration-200 ${darkMode ? "dark bg-[#0F172A] text-slate-100" : "bg-[#F8FAFC] text-slate-900"}`}>

        {/* Sidebar */}
        {currentUser && (
          <Sidebar
            currentView={currentView}
            setCurrentView={setCurrentView}
            currentUser={currentUser}
            onLogout={handleLogout}
            darkMode={darkMode}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed(p => !p)}
          />
        )}

        {/* Main Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Top Header */}
          {currentUser && (
            <header className={`h-14 shrink-0 flex items-center justify-between px-6 border-b transition-colors ${darkMode ? "bg-[#0F172A] border-slate-800" : "bg-white border-slate-200"}`}>

              {/* Left: breadcrumb / status */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="pulse-dot" />
                  <span className={`text-xs font-medium ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                    Live Sync Active
                  </span>
                </div>
                {dbError && (
                  <div className="flex items-center gap-1.5 text-xs text-red-500">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{dbError}</span>
                  </div>
                )}
              </div>

              {/* Right: actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={fetchDb}
                  title="Sync database"
                  className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-400 hover:text-slate-700"}`}
                >
                  <RefreshCw className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setDarkMode(p => !p)}
                  className={`p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"}`}
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                <button className={`relative p-2 rounded-lg transition-colors ${darkMode ? "hover:bg-slate-800 text-slate-400 hover:text-slate-200" : "hover:bg-slate-100 text-slate-500 hover:text-slate-700"}`}>
                  <Bell className="w-4 h-4" />
                  <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                </button>

                <div className={`flex items-center gap-2 pl-3 ml-1 border-l ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
                  <div className="w-7 h-7 rounded-full gradient-brand flex items-center justify-center text-white text-xs font-bold shrink-0">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="hidden sm:block">
                    <p className={`text-xs font-semibold leading-none ${darkMode ? "text-slate-200" : "text-slate-800"}`}>{currentUser.name.split(" ")[0]}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 capitalize">{currentUser.role.toLowerCase()}</p>
                  </div>
                </div>
              </div>
            </header>
          )}

          {/* Content */}
          <div className="flex-1 overflow-hidden flex flex-col min-h-0">
            {renderMainContent()}
          </div>
        </div>

        {/* Toast Notifications */}
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ToastContext.Provider>
  );
}
