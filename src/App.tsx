import React, { useState, useEffect } from "react";
import axios from "axios";
import { Stethoscope, HeartPulse, ShieldAlert, Sparkles, AlertCircle, RefreshCw } from "lucide-react";

import Sidebar from "./components/Sidebar";
import AuthScreens from "./components/AuthScreens";
import PatientDashboard from "./components/PatientDashboard";
import DoctorDashboard from "./components/DoctorDashboard";
import AdminDashboard from "./components/AdminDashboard";
import SymptomChecker from "./components/SymptomChecker";
import AIChatbot from "./components/AIChatbot";
import ReportSummarizer from "./components/ReportSummarizer";

import { Doctor, Patient, Appointment, MedicalReport, SystemSettings } from "./types";

export default function App() {
  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(true);
  
  // Database States loaded from Express backend
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [reports, setReports] = useState<MedicalReport[]>([]);
  const [settings, setSettings] = useState<SystemSettings | null>(null);
  
  const [dbLoading, setDbLoading] = useState<boolean>(true);
  const [dbError, setDbError] = useState<string | null>(null);

  // Active Session State
  const [currentUser, setCurrentUser] = useState<{ name: string; role: "PATIENT" | "DOCTOR" | "ADMIN"; id: string; department?: string } | null>(null);
  const [currentView, setCurrentView] = useState<string>("patient-dashboard");

  // Fetch full-stack simulated database state on mount
  useEffect(() => {
    fetchDb();
  }, []);

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
    } catch (err: any) {
      console.error(err);
      setDbError("Express Full-Stack connection lost. Reloading...");
    } finally {
      setDbLoading(false);
    }
  };

  // State mutations synced back to backend Express APIs in real-time
  const handleBookAppointment = async (newApt: Omit<Appointment, "id">) => {
    try {
      const res = await axios.post("/api/appointments", newApt);
      if (res.data.success) {
        setAppointments(prev => [...prev, res.data.appointment]);
      }
    } catch (err) {
      console.error("Failed to sync booking to backend:", err);
    }
  };

  const handleCancelAppointment = async (id: string) => {
    try {
      const apt = appointments.find(a => a.id === id);
      if (apt) {
        const updated = { ...apt, status: "CANCELLED" as const };
        const res = await axios.put(`/api/appointments/${id}`, updated);
        if (res.data.success) {
          setAppointments(prev => prev.map(a => a.id === id ? res.data.appointment : a));
        }
      }
    } catch (err) {
      console.error("Failed to cancel booking:", err);
    }
  };

  const handleRescheduleAppointment = async (id: string, date: string, time: string) => {
    try {
      const apt = appointments.find(a => a.id === id);
      if (apt) {
        const updated = { ...apt, date, time };
        const res = await axios.put(`/api/appointments/${id}`, updated);
        if (res.data.success) {
          setAppointments(prev => prev.map(a => a.id === id ? res.data.appointment : a));
        }
      }
    } catch (err) {
      console.error("Failed to reschedule:", err);
    }
  };

  const handleAddReport = async (newRep: MedicalReport) => {
    try {
      const res = await axios.post("/api/reports", newRep);
      if (res.data.success) {
        setReports(prev => [...prev, res.data.report]);
      }
    } catch (err) {
      console.error("Failed to save report:", err);
    }
  };

  const handleApproveDoctor = async (id: string) => {
    try {
      const res = await axios.put(`/api/doctors/${id}`, { status: "APPROVED" });
      if (res.data.success) {
        setDoctors(prev => prev.map(d => d.id === id ? res.data.doctor : d));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectDoctor = async (id: string) => {
    try {
      const res = await axios.put(`/api/doctors/${id}`, { status: "REJECTED" });
      if (res.data.success) {
        setDoctors(prev => prev.map(d => d.id === id ? res.data.doctor : d));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddDoctor = async (newDoc: Omit<Doctor, "id">) => {
    try {
      const res = await axios.post("/api/doctors", newDoc);
      if (res.data.success) {
        setDoctors(prev => [...prev, res.data.doctor]);
      }
    } catch (err) {
      console.error("Failed to add doctor:", err);
    }
  };

  const handleRemoveDoctor = async (id: string) => {
    try {
      const res = await axios.delete(`/api/doctors/${id}`);
      if (res.data.success) {
        setDoctors(prev => prev.filter(d => d.id !== id));
      }
    } catch (err) {
      console.error("Failed to delete doctor:", err);
    }
  };

  const handleUpdateSettings = async (updatedSettings: Partial<SystemSettings>) => {
    try {
      const res = await axios.put("/api/settings", updatedSettings);
      if (res.data.success) {
        setSettings(res.data.settings);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptAppointment = async (id: string) => {
    // Already set upcoming, mark status or log
    console.log("Accepting clinic appointment id:", id);
  };

  const handleRejectAppointment = async (id: string) => {
    await handleCancelAppointment(id);
  };

  const handleCompleteAppointment = async (id: string) => {
    try {
      const apt = appointments.find(a => a.id === id);
      if (apt) {
        const updated = { ...apt, status: "COMPLETED" as const };
        const res = await axios.put(`/api/appointments/${id}`, updated);
        if (res.data.success) {
          setAppointments(prev => prev.map(a => a.id === id ? res.data.appointment : a));
        }
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterPatient = async (regData: { name: string; email: string; phone: string; dob: string; bloodGroup: string }) => {
    const newPat: Patient = {
      id: `pat-${Date.now()}`,
      name: regData.name,
      email: regData.email,
      role: "PATIENT",
      phone: regData.phone,
      dob: regData.dob,
      bloodGroup: regData.bloodGroup,
      photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300",
      medicalHistory: "New clinical enrollment history.",
      joinedDate: new Date().toISOString().split('T')[0]
    };
    try {
      const res = await axios.post("/api/patients", newPat);
      if (res.data.success) {
        setPatients(prev => [...prev, res.data.patient]);
        setCurrentUser({ name: res.data.patient.name, role: "PATIENT", id: res.data.patient.id });
        setCurrentView("patient-dashboard");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoginSuccess = (userSession: { name: string; role: "PATIENT" | "DOCTOR" | "ADMIN"; id: string; department?: string }) => {
    setCurrentUser(userSession);
    if (userSession.role === "PATIENT") {
      setCurrentView("patient-dashboard");
    } else if (userSession.role === "DOCTOR") {
      setCurrentView("doctor-dashboard");
    } else if (userSession.role === "ADMIN") {
      setCurrentView("admin-dashboard");
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentView("patient-dashboard");
  };

  // Helper: Let AI suggest clinical routing directly in dashboard
  const handleBookDepartment = (deptName: string) => {
    if (currentUser?.role === "PATIENT") {
      setCurrentView("patient-dashboard");
    }
  };

  // Render Portals based on view selection
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

    const currentPatient = patients.find(p => p.id === currentUser.id) || patients[0];
    const currentDoctor = doctors.find(d => d.id === currentUser.id) || doctors[0];

    switch (currentView) {
      case "patient-dashboard":
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
        return (
          <SymptomChecker 
            darkMode={darkMode} 
            onBookDepartment={handleBookDepartment}
          />
        );

      case "ai-chatbot":
        return (
          <AIChatbot 
            darkMode={darkMode} 
            patientAge="24"
          />
        );

      case "patient-reports":
        return (
          <ReportSummarizer
            darkMode={darkMode}
            patientId={currentPatient.id}
            reports={reports.filter(r => r.patientId === currentPatient.id)}
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
            onAcceptAppointment={handleAcceptAppointment}
            onRejectAppointment={handleRejectAppointment}
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
            settings={settings || {
              hospitalName: "St. Jude AI Medical Center",
              allowAutoApproveDoctors: false,
              enableSmsNotifications: true,
              maxAppointmentsPerSlot: 1,
              emergencyContact: "+1 (555) 019-9000"
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
  };

  const handlePresetSelect = (role: "PATIENT" | "DOCTOR" | "ADMIN") => {
    if (role === "ADMIN") {
      handleLoginSuccess({ name: "System Administrator", role: "ADMIN", id: "adm-1" });
    } else if (role === "DOCTOR") {
      handleLoginSuccess({ name: "Dr. Sarah Jenkins", role: "DOCTOR", id: "doc-1", department: "Cardiology" });
    } else {
      handleLoginSuccess({ name: "Dinesh Kumar", role: "PATIENT", id: "pat-1" });
    }
  };

  if (dbLoading) {
    return (
      <div className={`w-screen h-screen flex flex-col items-center justify-center font-sans transition-colors duration-300
        ${darkMode ? "bg-[#0F172A] text-slate-100" : "bg-[#F8FAFC] text-slate-900"}`}
      >
        <div className="space-y-4 text-center">
          <HeartPulse className="w-12 h-12 text-sky-500 animate-spin mx-auto" />
          <div>
            <h2 className="text-sm font-display uppercase tracking-widest text-sky-500 font-extrabold">MediSmart AI</h2>
            <p className="text-xs text-slate-400 mt-1">Booting full-stack clinical workspace containers...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-screen h-screen flex overflow-hidden font-sans select-none transition-colors duration-300
      ${darkMode ? "bg-[#0F172A] text-slate-100" : "bg-[#F8FAFC] text-slate-900"}`}
    >
      {/* Shared Sidebar */}
      {currentUser && (
        <Sidebar
          currentView={currentView}
          setCurrentView={setCurrentView}
          currentUser={currentUser}
          onLogout={handleLogout}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
      )}

      {/* Main Screen */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Simple top info status bar */}
        {currentUser && (
          <header className={`h-16 shrink-0 border-b flex items-center justify-between px-8 transition-colors
            ${darkMode ? "bg-[#0F172A]/85 border-slate-800" : "bg-white border-slate-200"}`}
          >
            <div className="flex items-center gap-3">
              <span className="px-2 py-0.5 text-[9px] font-mono rounded uppercase font-bold text-white ai-gradient shrink-0">
                Live Sync
              </span>
              <p className="text-xs text-slate-400">
                Active Session: {currentUser.role} Control Room
              </p>
            </div>

            <div className="flex items-center gap-4">
              {dbError && (
                <span className="text-[10px] text-rose-500 font-mono flex items-center gap-1.5 animate-pulse">
                  <AlertCircle className="w-4 h-4" />
                  {dbError}
                </span>
              )}
              <button 
                onClick={fetchDb}
                className="p-1.5 border border-slate-200 dark:border-slate-800 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors"
                title="Synchronize Database"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400 hover:text-slate-200" />
              </button>
              <span className="text-[10px] text-slate-400 font-mono">
                STJUDE_V1.0.0
              </span>
            </div>
          </header>
        )}

        {/* Content Container */}
        <div className="flex-grow overflow-hidden flex flex-col">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}
