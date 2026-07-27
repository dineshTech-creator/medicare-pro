# AI-POWERED HOSPITAL APPOINTMENT BOOKING SYSTEM
## CODE DOCUMENTATION & REFERENCE

---

**Project:** AI-Powered Hospital Appointment Booking System  
**Developer:** K Dinesh  
**Internship ID:** BOV26O-0502  
**Organization:** Brainovision Solutions India Pvt. Ltd.  
**Date:** July 27, 2026

---

## TABLE OF CONTENTS

1. Project Structure
2. Core Type Definitions
3. Backend Server Code
4. Frontend Components
5. Utility Functions
6. Configuration Files
7. Code Examples and Patterns

---

## 1. PROJECT STRUCTURE

```
AI-Powered_Hospital_Appointment_Booking_System/
│
├── .env                          # Environment variables (not in git)
├── .gitignore                    # Git ignore rules
├── package.json                  # Dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
├── index.html                    # HTML entry point
├── server.ts                     # Express backend server
├── hospital_data.json            # JSON database (generated)
│
├── src/
│   ├── main.tsx                  # React entry point
│   ├── App.tsx                   # Root component
│   ├── index.css                 # Global styles + Tailwind
│   ├── types.ts                  # TypeScript type definitions
│   │
│   ├── components/
│   │   ├── AdminDashboard.tsx    # Admin panel
│   │   ├── AIChatbot.tsx         # Dr. Gemini chatbot
│   │   ├── AuthScreens.tsx       # Login/Register forms
│   │   ├── DoctorDashboard.tsx   # Doctor panel
│   │   ├── PatientDashboard.tsx  # Patient panel
│   │   ├── ReportSummarizer.tsx  # Medical report AI
│   │   ├── Sidebar.tsx           # Navigation sidebar
│   │   └── SymptomChecker.tsx    # AI symptom analysis
│   │
│   └── data/
│       └── developerSpecs.ts     # Spring Boot specifications
│
├── docs/
│   ├── PROJECT_REPORT.md         # Comprehensive project report
│   ├── TECHNICAL_DOCUMENTATION.md # Technical architecture guide
│   └── CODE_DOCUMENTATION.md      # This file
│
└── README.md                      # Quick start guide
```

---

## 2. CORE TYPE DEFINITIONS (src/types.ts)

### Domain Models

```typescript
// ─── User Roles ───────────────────────────────────────────────
export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";

// ─── Doctor Entity ────────────────────────────────────────────
export interface Doctor {
  id: string;                    // Unique identifier "doc-1"
  name: string;                  // Full name "Dr. Sarah Jenkins"
  email: string;                 // Login email
  role: "DOCTOR";                // Fixed role type
  department: string;            // Medical specialty
  experience: number;            // Years of experience
  rating: number;                // 0-5 star rating
  availability: string[];        // ["Monday", "Wednesday"]
  slots: string[];               // ["09:00 AM", "10:00 AM"]
  photo: string;                 // Profile image URL
  bio: string;                   // Professional background
  status: "PENDING" | "APPROVED" | "REJECTED";
  consultationFee?: number;      // Optional fee
  totalPatients?: number;        // Optional patient count
}

// ─── Patient Entity ───────────────────────────────────────────
export interface Patient {
  id: string;                    // Unique identifier "pat-1"
  name: string;                  // Full name
  email: string;                 // Login email
  role: "PATIENT";               // Fixed role type
  phone: string;                 // Contact number
  dob: string;                   // Date of birth "2003-05-15"
  bloodGroup: string;            // Blood type "O+"
  photo: string;                 // Profile image URL
  medicalHistory: string;        // Medical background
  joinedDate: string;            // Registration date
  weight?: string;               // Optional weight
  height?: string;               // Optional height
  allergies?: string[];          // Optional allergy list
}

// ─── Appointment Entity ───────────────────────────────────────
export interface Appointment {
  id: string;                    // Unique identifier "apt-1"
  patientId: string;             // Reference to patient
  patientName: string;           // Denormalized for quick access
  doctorId: string;              // Reference to doctor
  doctorName: string;            // Denormalized for quick access
  department: string;            // Medical department
  date: string;                  // Appointment date "2026-07-20"
  time: string;                  // Appointment time "10:00 AM"
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  symptoms: string;              // Patient-reported symptoms
  aiSummary?: string;            // AI-generated brief
  type?: "In-Person" | "Video" | "Phone";
}

// ─── Medical Report Entity ────────────────────────────────────
export interface MedicalReport {
  id: string;                    // Unique identifier "rep-1"
  patientId: string;             // Reference to patient
  fileName: string;              // Report file name
  uploadDate: string;            // Upload date
  fileSize: string;              // File size "1.2 MB"
  summary?: string;              // AI-generated summary
  category: string;              // Report category
}

// ─── Message Entity (Chatbot) ─────────────────────────────────
export interface Message {
  id: string;                    // Unique message ID
  sender: "user" | "bot";        // Message sender
  text: string;                  // Message content
  timestamp: string;             // Time sent
}

// ─── System Settings ──────────────────────────────────────────
export interface SystemSettings {
  hospitalName: string;
  allowAutoApproveDoctors: boolean;
  enableSmsNotifications: boolean;
  maxAppointmentsPerSlot: number;
  emergencyContact: string;
}

// ─── UI Types ─────────────────────────────────────────────────
export type ToastVariant = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  duration?: number;
}

export interface UserSession {
  name: string;
  role: UserRole;
  id: string;
  department?: string;
  photo?: string;
  email?: string;
}
```

---

## 3. BACKEND SERVER CODE (server.ts)

### 3.1 Server Initialization

```typescript
import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini AI Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: { 'User-Agent': 'aistudio-build' }
      }
    });
    console.log("✅ Gemini API initialized successfully.");
  } catch (err) {
    console.error("❌ Failed to initialize Gemini API:", err);
  }
} else {
  console.warn("⚠️  GEMINI_API_KEY not found in environment variables.");
}
```

### 3.2 Database Functions

```typescript
const DATA_FILE = path.join(process.cwd(), "hospital_data.json");

// Load database from JSON file
function loadDb() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      const db = JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
      
      // Force demo credentials for testing
      let modified = false;

      // Ensure demo patient exists
      let pat = db.patients?.find((p: any) => 
        p.id === "pat-1" || p.email === "patient123@gmail.com"
      );
      if (!pat) {
        pat = { 
          id: "pat-1", 
          name: "Demo Patient", 
          role: "PATIENT", 
          phone: "1234567890", 
          dob: "2000-01-01", 
          bloodGroup: "O+" 
        };
        if (!db.patients) db.patients = [];
        db.patients.push(pat);
        modified = true;
      }
      if (pat.email !== "patient123@gmail.com" || pat.password !== "patient123") {
        pat.email = "patient123@gmail.com";
        pat.password = "patient123";
        modified = true;
      }

      // Similar logic for doctor and admin...
      
      if (modified) {
        fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2));
      }

      return db;
    } catch (e) {
      console.error("Error reading database:", e);
    }
  }
  
  // Initialize with seed data if file doesn't exist
  const initialData = {
    admins: [...],
    doctors: [...],
    patients: [...],
    appointments: [...],
    medicalReports: [...],
    departments: ["Cardiology", "Pediatrics", ...],
    systemSettings: {...}
  };
  
  saveDb(initialData);
  return initialData;
}

// Save database to JSON file
function saveDb(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving database:", e);
  }
}
```

### 3.3 Authentication Endpoints

```typescript
// Login endpoint with role-based validation
app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ 
      success: false, 
      message: "Email, password and role are required." 
    });
  }

  const db = loadDb();
  const em = email.toLowerCase().trim();

  // Admin login
  if (role === "ADMIN") {
    const admin = (db.admins || []).find((a: any) =>
      a.email.toLowerCase() === em && a.password === password
    );
    if (!admin) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid admin credentials." 
      });
    }
    return res.json({
      success: true,
      user: { 
        id: admin.id, 
        name: admin.name, 
        email: admin.email, 
        role: "ADMIN" 
      }
    });
  }

  // Doctor login with status check
  if (role === "DOCTOR") {
    const doc = (db.doctors || []).find((d: any) =>
      d.email.toLowerCase() === em && d.password === password
    );
    if (!doc) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid doctor credentials." 
      });
    }
    if (doc.status === "PENDING") {
      return res.status(403).json({ 
        success: false, 
        message: "Account pending admin approval." 
      });
    }
    if (doc.status === "REJECTED") {
      return res.status(403).json({ 
        success: false, 
        message: "Application was rejected." 
      });
    }
    return res.json({
      success: true,
      user: { 
        id: doc.id, 
        name: doc.name, 
        email: doc.email, 
        role: "DOCTOR", 
        department: doc.department 
      }
    });
  }

  // Patient login
  if (role === "PATIENT") {
    const pat = (db.patients || []).find((p: any) =>
      p.email.toLowerCase() === em && p.password === password
    );
    if (!pat) {
      return res.status(401).json({ 
        success: false, 
        message: "Invalid email or password." 
      });
    }
    return res.json({
      success: true,
      user: { 
        id: pat.id, 
        name: pat.name, 
        email: pat.email, 
        role: "PATIENT" 
      }
    });
  }

  return res.status(400).json({ 
    success: false, 
    message: "Unknown role." 
  });
});

// Patient registration (self-service)
app.post("/api/auth/register/patient", (req, res) => {
  const { name, email, password, phone, dob, bloodGroup } = req.body;

  if (!name || !email || !password || !phone || !dob || !bloodGroup) {
    return res.status(400).json({ 
      success: false, 
      message: "All fields are required." 
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      success: false, 
      message: "Password must be at least 6 characters." 
    });
  }

  const db = loadDb();
  const em = email.toLowerCase().trim();

  // Check if email already exists
  const exists = (db.patients || []).some((p: any) => 
    p.email.toLowerCase() === em
  );
  if (exists) {
    return res.status(409).json({ 
      success: false, 
      message: "Account with this email already exists." 
    });
  }

  const newPatient = {
    id: `pat-${Date.now()}`,
    name: name.trim(),
    email: em,
    password,
    role: "PATIENT",
    phone,
    dob,
    bloodGroup,
    photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300",
    medicalHistory: "No prior history recorded.",
    joinedDate: new Date().toISOString().split("T")[0]
  };

  db.patients.push(newPatient);
  saveDb(db);

  return res.json({
    success: true,
    user: { 
      id: newPatient.id, 
      name: newPatient.name, 
      email: newPatient.email, 
      role: "PATIENT" 
    }
  });
});
```

---


### 3.4 AI Integration Endpoints

```typescript
// AI Symptom Checker
app.post("/api/gemini/symptom-check", async (req, res) => {
  const { symptoms, patientAge, patientGender } = req.body;
  
  // Rule-based department detection fallback
  const detectDepartment = (syms: string) => {
    const low = (syms || "").toLowerCase();
    if (low.includes("heart") || low.includes("chest")) return "Cardiology";
    if (low.includes("child") || low.includes("baby")) return "Pediatrics";
    if (low.includes("head") || low.includes("brain")) return "Neurology";
    if (low.includes("bone") || low.includes("joint")) return "Orthopedics";
    if (low.includes("skin") || low.includes("rash")) return "Dermatology";
    return "General Medicine";
  };

  const fallbackDept = detectDepartment(symptoms);

  if (!ai) {
    // Fallback response when AI not available
    return res.json({
      analysis: `⚠️ **Gemini API key is not configured.**\n\n### Clinical Assessment\nBased on your symptoms ("${symptoms}"), we recommend consulting with **${fallbackDept}** specialists.`,
      recommendedSpecialty: fallbackDept
    });
  }

  const prompt = `
    You are an expert AI clinical diagnostic assistant at St. Jude AI Medical Center.
    Analyze the following patient symptoms carefully.
    
    Patient Age: ${patientAge || 'Unknown'}
    Patient Gender: ${patientGender || 'Unknown'}
    Symptoms Reported: "${symptoms}"
    
    Provide a professional symptom analysis in Markdown with:
    1. **Primary Clinical Assessment**: Brief summary
    2. **Potential Causes**: List 2-3 possibilities
    3. **Recommended Medical Specialty**: Department name
    4. **Urgency Assessment**: (LOW, MEDIUM, HIGH) with reasoning
    5. **Self-Care & Triage Advice**: Practical steps
    6. **Red Flags**: When to seek emergency care
    
    At the end include: RECOMMENDED_DEPARTMENT: <DepartmentName>
    (Use exactly one of: Cardiology, Pediatrics, Neurology, Orthopedics, Dermatology, General Medicine)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an empathetic clinical AI advisor. Emphasize this is NOT a diagnosis."
      }
    });

    const text = response.text || "";
    
    // Extract recommended department
    let dept = fallbackDept;
    const deptMatch = text.match(/RECOMMENDED_DEPARTMENT:\s*(\w+)/i);
    if (deptMatch && deptMatch[1]) {
      dept = deptMatch[1].trim();
    }

    res.json({
      analysis: text.replace(/RECOMMENDED_DEPARTMENT:.*/i, "").trim(),
      recommendedSpecialty: dept
    });
  } catch (error: any) {
    console.error("Symptom analyzer error:", error);
    // Graceful fallback on API error
    res.json({
      analysis: `⚠️ **AI Service temporarily unavailable.**\n\nBased on your symptoms, we recommend **${fallbackDept}** consultation.`,
      recommendedSpecialty: fallbackDept
    });
  }
});

// AI Chatbot
app.post("/api/gemini/chat", async (req, res) => {
  const { messages } = req.body;
  const lastMsg = messages[messages.length - 1];
  const messageContent = lastMsg?.text || "";
  
  if (!ai) {
    return res.json({
      response: `⚠️ **Gemini API not configured.** You asked: "${messageContent}". For actual medical advice, please schedule a consultation.`
    });
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      config: {
        systemInstruction: `You are Dr. Gemini, an AI health assistant at St. Jude AI Medical Center.
          Be friendly, professional, and compassionate.
          Answer health queries, explain medical terms in simple language, and help patients navigate the clinic.
          Always include a disclaimer that your advice is informational and they should consult physicians for medical decisions.`
      }
    });
    
    const response = await chat.sendMessage({ message: messageContent });
    res.json({ response: response.text });
  } catch (error: any) {
    console.error("AI Chatbot error:", error);
    res.json({
      response: `⚠️ **Dr. Gemini is assisting other patients.** Please schedule an appointment for proper evaluation.`
    });
  }
});

// Medical Report Summarizer
app.post("/api/gemini/summarize-report", async (req, res) => {
  const { reportText, reportType } = req.body;
  
  if (!ai) {
    return res.json({
      summary: "⚠️ **Gemini API not configured.** The report shows standard lab values. Please discuss with your physician."
    });
  }

  const prompt = `
    You are an expert medical AI specializing in clinical report interpretation.
    Summarize the following medical report in patient-friendly language.
    
    Report Type: "${reportType || 'General Medical Report'}"
    Report Data: "${reportText}"
    
    Provide summary in Markdown with:
    - **Key Findings**: Clear bullet points
    - **Reference Ranges**: Explain if values are high/normal/low
    - **Suggested Doctor Questions**: 3 practical questions for physician
    - **Overall Reassurance**: Warm closing statement
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    res.json({ summary: response.text });
  } catch (error: any) {
    console.error("Report summarizer error:", error);
    res.json({
      summary: `⚠️ **AI Summarizer unavailable.** Your ${reportType} has been received. Please discuss results with your physician.`
    });
  }
});

// Health Tips Generator
app.post("/api/gemini/health-tips", async (req, res) => {
  const { department, patientAge } = req.body;
  
  // Offline fallbacks by department
  const getOfflineTips = (dept: string) => {
    const tips: Record<string, string> = {
      "Cardiology": "• Monitor blood pressure daily\n• Limit sodium to <2,000mg/day\n• 30min cardio exercise daily",
      "Pediatrics": "• Balanced nutrition with fruits\n• Keep vaccines up to date\n• 60min active play daily",
      "Neurology": "• Cognitive exercises (puzzles)\n• Practice stress reduction\n• Consistent sleep schedule",
      "Orthopedics": "• Strength training exercises\n• Calcium & Vitamin D intake\n• Proper posture maintenance",
      "Dermatology": "• Apply SPF 30+ sunscreen daily\n• Moisturize after bathing\n• Monthly skin self-checks"
    };
    return tips[dept] || "• Stay hydrated (2-3L daily)\n• Balanced diet and exercise\n• Annual health screenings";
  };

  if (!ai) {
    return res.json({ tips: getOfflineTips(department) });
  }

  const prompt = `
    Generate 3 tailored wellness recommendations for a ${patientAge || '25'} year old patient 
    consulting the **${department || 'General Medicine'}** department.
    Make tips highly specific to this specialty.
    Format as direct, actionable Markdown bullet points.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    res.json({ tips: response.text });
  } catch (error: any) {
    console.error("Health tips error:", error);
    res.json({ tips: getOfflineTips(department) });
  }
});
```

---


### 3.5 CRUD Endpoints

```typescript
// ─── Database Sync ────────────────────────────────────────────
app.get("/api/db", (req, res) => {
  res.json(loadDb());
});

// ─── Appointment Management ───────────────────────────────────
app.post("/api/appointments", (req, res) => {
  const db = loadDb();
  const newApt = req.body;
  newApt.id = `apt-${Date.now()}`;
  db.appointments.push(newApt);
  saveDb(db);
  res.json({ success: true, appointment: newApt });
});

app.put("/api/appointments/:id", (req, res) => {
  const db = loadDb();
  const id = req.params.id;
  const index = db.appointments.findIndex((a: any) => a.id === id);
  if (index !== -1) {
    db.appointments[index] = { ...db.appointments[index], ...req.body };
    saveDb(db);
    res.json({ success: true, appointment: db.appointments[index] });
  } else {
    res.status(404).json({ error: "Appointment not found" });
  }
});

// ─── Doctor Management ────────────────────────────────────────
app.post("/api/doctors", (req, res) => {
  const db = loadDb();
  const newDoc = req.body;
  if (!newDoc.id) newDoc.id = `doc-${Date.now()}`;
  db.doctors.push(newDoc);
  saveDb(db);
  res.json({ success: true, doctor: newDoc });
});

app.put("/api/doctors/:id", (req, res) => {
  const db = loadDb();
  const id = req.params.id;
  const index = db.doctors.findIndex((d: any) => d.id === id);
  if (index !== -1) {
    db.doctors[index] = { ...db.doctors[index], ...req.body };
    saveDb(db);
    res.json({ success: true, doctor: db.doctors[index] });
  } else {
    res.status(404).json({ error: "Doctor not found" });
  }
});

app.delete("/api/doctors/:id", (req, res) => {
  const db = loadDb();
  const id = req.params.id;
  const index = db.doctors.findIndex((d: any) => d.id === id);
  if (index !== -1) {
    const deleted = db.doctors.splice(index, 1)[0];
    saveDb(db);
    res.json({ success: true, doctor: deleted });
  } else {
    res.status(404).json({ error: "Doctor not found" });
  }
});

// ─── Medical Reports ──────────────────────────────────────────
app.post("/api/reports", (req, res) => {
  const db = loadDb();
  const newRep = req.body;
  newRep.id = `rep-${Date.now()}`;
  db.medicalReports.push(newRep);
  saveDb(db);
  res.json({ success: true, report: newRep });
});

// ─── System Settings ──────────────────────────────────────────
app.put("/api/settings", (req, res) => {
  const db = loadDb();
  db.systemSettings = { ...db.systemSettings, ...req.body };
  saveDb(db);
  res.json({ success: true, settings: db.systemSettings });
});
```

### 3.6 Server Start

```typescript
async function startServer() {
  // Development: Use Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } 
  // Production: Serve static files
  else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

startServer();
```

---

## 4. FRONTEND COMPONENTS

### 4.1 App.tsx (Root Component - Abbreviated)

```typescript
import React, { useState, useEffect, createContext } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "motion/react";

// Context for toast notifications
interface ToastContextValue {
  addToast: (title: string, description?: string, variant?: ToastVariant) => void;
}
const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });
export const useToast = () => useContext(ToastContext);

export default function App() {
  // State management
  const [darkMode, setDarkMode] = useState(true);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [currentView, setCurrentView] = useState("patient-dashboard");
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Fetch database on mount
  useEffect(() => { fetchDb(); }, []);

  const fetchDb = async () => {
    try {
      const res = await axios.get("/api/db");
      setDoctors(res.data.doctors);
      setPatients(res.data.patients);
      setAppointments(res.data.appointments);
    } catch (err) {
      console.error(err);
      addToast("Connection Error", "Could not sync database.", "error");
    }
  };

  // Toast notification function
  const addToast = useCallback((title: string, description?: string, variant: ToastVariant = "info") => {
    const id = `toast-${Date.now()}`;
    setToasts(prev => [...prev, { id, title, description, variant }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
  }, []);

  // Appointment handlers
  const handleBookAppointment = async (newApt: Omit<Appointment, "id">) => {
    try {
      const res = await axios.post("/api/appointments", newApt);
      if (res.data.success) {
        setAppointments(prev => [...prev, res.data.appointment]);
        addToast("Appointment Booked", `Scheduled with ${newApt.doctorName}`, "success");
      }
    } catch { 
      addToast("Booking Failed", "Please try again.", "error"); 
    }
  };

  // Authentication handlers
  const handleLoginSuccess = (session: UserSession) => {
    setCurrentUser(session);
    if (session.role === "PATIENT") setCurrentView("patient-dashboard");
    else if (session.role === "DOCTOR") setCurrentView("doctor-dashboard");
    else setCurrentView("admin-dashboard");
    fetchDb();
    addToast(`Welcome back, ${session.name}!`, `Logged in as ${session.role}`, "success");
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    addToast("Signed Out", "You have been logged out.", "info");
  };

  // Render appropriate dashboard based on role and view
  const renderMainContent = () => {
    if (!currentUser) {
      return <AuthScreens onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentView) {
      case "patient-dashboard":
        return <PatientDashboard 
          patient={currentPatient}
          doctors={doctors}
          appointments={appointments}
          onBookAppointment={handleBookAppointment}
          {...otherProps}
        />;
      
      case "doctor-dashboard":
        return <DoctorDashboard 
          doctor={currentDoctor}
          appointments={appointments}
          {...otherProps}
        />;
      
      case "admin-dashboard":
        return <AdminDashboard 
          doctors={doctors}
          patients={patients}
          appointments={appointments}
          {...otherProps}
        />;
      
      case "symptom-checker":
        return <SymptomChecker darkMode={darkMode} />;
      
      case "ai-chatbot":
        return <AIChatbot darkMode={darkMode} />;
      
      default:
        return null;
    }
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      <div className={`w-screen h-screen flex ${darkMode ? "dark bg-[#0F172A]" : "bg-[#F8FAFC]"}`}>
        {currentUser && (
          <Sidebar 
            currentView={currentView}
            setCurrentView={setCurrentView}
            currentUser={currentUser}
            onLogout={handleLogout}
            darkMode={darkMode}
          />
        )}
        
        <div className="flex-1 flex flex-col">
          {currentUser && <Header darkMode={darkMode} setDarkMode={setDarkMode} />}
          {renderMainContent()}
        </div>

        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </div>
    </ToastContext.Provider>
  );
}
```

---


### 4.2 SymptomChecker.tsx (AI Triage Component - Key Parts)

```typescript
export default function SymptomChecker({ darkMode, onBookDepartment }: SymptomCheckerProps) {
  const [symptoms, setSymptoms] = useState("");
  const [age, setAge] = useState("24");
  const [gender, setGender] = useState("Male");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ analysis: string; recommendedSpecialty: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptoms.trim()) return;
    
    setLoading(true);
    setResult(null);

    try {
      const res = await axios.post("/api/gemini/symptom-check", {
        symptoms,
        patientAge: age,
        patientGender: gender,
      });
      setResult(res.data);
    } catch {
      setError("Unable to reach AI diagnostic service.");
    } finally {
      setLoading(false);
    }
  };

  // Detect urgency level from AI response
  const detectUrgency = (text: string): "HIGH" | "MEDIUM" | "LOW" => {
    const t = text.toUpperCase();
    if (t.includes("HIGH")) return "HIGH";
    if (t.includes("MEDIUM")) return "MEDIUM";
    return "LOW";
  };

  const urgency = result ? detectUrgency(result.analysis) : null;

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      {/* Header */}
      <h1>AI Triage & Symptom Checker</h1>

      {/* Input Form */}
      <form onSubmit={handleSubmit}>
        <input type="number" value={age} onChange={e => setAge(e.target.value)} />
        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option>Male</option>
          <option>Female</option>
          <option>Other</option>
        </select>
        <textarea 
          value={symptoms} 
          onChange={e => setSymptoms(e.target.value)}
          placeholder="Describe your symptoms..."
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Analyzing..." : "Analyze with Gemini AI"}
        </button>
      </form>

      {/* Loading State */}
      {loading && <LoadingAnimation />}

      {/* Results Display */}
      {result && !loading && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {/* Recommended Specialty Card */}
          <div className="routing-card">
            <h3>{result.recommendedSpecialty}</h3>
            <p>{urgency && URGENCY_CONFIG[urgency].desc}</p>
            <button onClick={() => onBookDepartment(result.recommendedSpecialty)}>
              Book Specialist
            </button>
          </div>

          {/* AI Analysis */}
          <div className="analysis-card">
            <h4>Clinical Analysis Report</h4>
            <p>{result.analysis}</p>
            <div className="disclaimer">
              AI triage provides routing guidance only — not a medical diagnosis.
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
```

### 4.3 AIChatbot.tsx (Dr. Gemini Component - Key Parts)

```typescript
export default function AIChatbot({ darkMode, patientAge }: AIChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([{
    id: "init",
    sender: "bot",
    text: "Hello! I'm **Dr. Gemini**, your AI health assistant. I can help with health questions, explain medical terms, and guide you through our platform.\n\n*Note: My responses are informational only.*",
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || loading) return;

    // Add user message
    const userMsg: Message = {
      id: `u-${Date.now()}`,
      sender: "user",
      text: trimmed,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    setMessages(p => [...p, userMsg]);
    setInput("");
    setLoading(true);

    try {
      // Send conversation history to AI
      const history = [...messages, userMsg].map(m => ({
        role: m.sender === "user" ? "user" : "model",
        text: m.text,
      }));
      
      const res = await axios.post("/api/gemini/chat", { messages: history });
      
      // Add AI response
      setMessages(p => [...p, {
        id: `b-${Date.now()}`,
        sender: "bot",
        text: res.data.response,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } catch {
      setMessages(p => [...p, {
        id: `e-${Date.now()}`,
        sender: "bot",
        text: "I'm temporarily unavailable. Please try again.",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 max-w-3xl mx-auto w-full p-6 gap-4">
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto rounded-2xl border p-5 space-y-4">
        {messages.map(m => <MessageBubble key={m.id} msg={m} darkMode={darkMode} />)}
        {loading && <TypingIndicator darkMode={darkMode} />}
      </div>

      {/* Input Form */}
      <form onSubmit={e => { e.preventDefault(); send(input); }} className="flex gap-2.5">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
          placeholder="Ask Dr. Gemini anything about your health…"
          className="input-field flex-1"
        />
        <button type="submit" disabled={loading || !input.trim()} className="btn-primary">
          {loading ? <Spinner /> : <Send className="w-4 h-4" />}
        </button>
      </form>
    </div>
  );
}
```

---

## 5. UTILITY FUNCTIONS & PATTERNS

### 5.1 Toast Notification System

```typescript
// Toast Context Provider (in App.tsx)
const ToastContext = createContext<ToastContextValue>({ addToast: () => {} });

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastContext.Provider');
  }
  return context;
};

// Usage in any component
function MyComponent() {
  const { addToast } = useToast();
  
  const handleAction = () => {
    // Success toast
    addToast("Success!", "Operation completed.", "success");
    
    // Error toast
    addToast("Error", "Something went wrong.", "error");
    
    // Warning toast
    addToast("Warning", "Please check this.", "warning");
    
    // Info toast
    addToast("Info", "Just so you know.", "info");
  };
}
```

### 5.2 Dark Mode Implementation

```typescript
// In App.tsx
const [darkMode, setDarkMode] = useState<boolean>(() => {
  const saved = localStorage.getItem("darkMode");
  return saved ? saved === "true" : true; // Default to dark
});

// Sync to HTML class and localStorage
useEffect(() => {
  const root = document.documentElement;
  if (darkMode) {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
  localStorage.setItem("darkMode", String(darkMode));
}, [darkMode]);

// Toggle function
const toggleDarkMode = () => setDarkMode(prev => !prev);

// Usage in CSS (Tailwind)
<div className="bg-white dark:bg-slate-900">
  <p className="text-slate-900 dark:text-slate-100">Text</p>
</div>
```

### 5.3 Session Persistence

```typescript
// Save session to localStorage
const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
  const saved = localStorage.getItem("currentUser");
  return saved ? JSON.parse(saved) : null;
});

useEffect(() => {
  if (currentUser) {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  } else {
    localStorage.removeItem("currentUser");
  }
}, [currentUser]);

// Logout function
const handleLogout = () => {
  setCurrentUser(null);
  localStorage.removeItem("currentUser");
  setCurrentView("patient-dashboard");
};
```

### 5.4 API Request Pattern with Axios

```typescript
// Centralized API calls
const API_BASE = "/api";

// GET request
const fetchData = async () => {
  try {
    const response = await axios.get(`${API_BASE}/db`);
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
};

// POST request
const createAppointment = async (data: Omit<Appointment, "id">) => {
  try {
    const response = await axios.post(`${API_BASE}/appointments`, data);
    return response.data;
  } catch (error) {
    console.error("Create appointment error:", error);
    throw error;
  }
};

// PUT request
const updateDoctor = async (id: string, updates: Partial<Doctor>) => {
  try {
    const response = await axios.put(`${API_BASE}/doctors/${id}`, updates);
    return response.data;
  } catch (error) {
    console.error("Update doctor error:", error);
    throw error;
  }
};

// DELETE request
const deleteDoctor = async (id: string) => {
  try {
    const response = await axios.delete(`${API_BASE}/doctors/${id}`);
    return response.data;
  } catch (error) {
    console.error("Delete doctor error:", error);
    throw error;
  }
};
```

### 5.5 Animation Patterns with Framer Motion

```typescript
// Page transition wrapper
function PageWrapper({ children, viewKey }: { children: React.ReactNode; viewKey: string }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={viewKey}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -4 }}
        transition={{ duration: 0.18, ease: [0.4, 0, 0.2, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

// Staggered list animation
{items.map((item, i) => (
  <motion.div
    key={item.id}
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: i * 0.06, duration: 0.3 }}
  >
    {item.content}
  </motion.div>
))}

// Button tap animation
<motion.button
  whileTap={{ scale: 0.97 }}
  className="btn-primary"
>
  Click Me
</motion.button>

// Modal entrance/exit
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {modalContent}
    </motion.div>
  )}
</AnimatePresence>
```

---

## 6. CONFIGURATION FILES

### 6.1 package.json

```json
{
  "name": "medicare-pro",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "tsx server.ts",
    "build": "vite build && esbuild server.ts --bundle --platform=node --format=cjs --packages=external --sourcemap --outfile=dist/server.cjs",
    "start": "node dist/server.cjs",
    "clean": "rm -rf dist hospital_data.json",
    "lint": "tsc --noEmit"
  },
  "dependencies": {
    "@google/genai": "^2.4.0",
    "@tailwindcss/vite": "^4.1.14",
    "@vitejs/plugin-react": "^5.0.4",
    "axios": "^1.18.1",
    "dotenv": "^17.2.3",
    "express": "^4.21.2",
    "lucide-react": "^0.546.0",
    "motion": "^12.23.24",
    "react": "^19.0.1",
    "react-dom": "^19.0.1",
    "react-router-dom": "^7.18.1",
    "recharts": "^3.9.2",
    "vite": "^6.2.3"
  },
  "devDependencies": {
    "@types/express": "^4.17.21",
    "@types/node": "^22.14.0",
    "autoprefixer": "^10.4.21",
    "esbuild": "^0.25.0",
    "tailwindcss": "^4.1.14",
    "tsx": "^4.21.0",
    "typescript": "~5.8.2"
  }
}
```

### 6.2 tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    
    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",
    
    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*", "server.ts", "vite.config.ts"]
}
```

### 6.3 vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      }
    }
  }
});
```

### 6.4 .env (Environment Variables)

```bash
# Google Gemini AI Configuration
GEMINI_API_KEY=your_actual_api_key_here

# Server Configuration
PORT=3000
NODE_ENV=development

# Database (for production SQL migration)
# DATABASE_URL=postgresql://user:pass@localhost:5432/hospital_db

# JWT Secret (for production authentication)
# JWT_SECRET=your_random_secret_key_here

# CORS Configuration (for production)
# CORS_ORIGIN=https://yourdomain.com
```

### 6.5 .gitignore

```gitignore
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Production build
dist/
build/

# Environment variables
.env
.env.local
.env.production

# Database
hospital_data.json
*.db
*.sqlite

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db

# Logs
logs/
*.log

# Temp files
temp_*.txt
```

---


### 5.6 Date and Time Utilities

```typescript
// Format date for display
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  });
};

// Check if date is today
const isToday = (dateString: string): boolean => {
  const date = new Date(dateString);
  const today = new Date();
  return date.toDateString() === today.toDateString();
};

// Check if appointment is upcoming
const isUpcoming = (dateString: string, timeString: string): boolean => {
  const appointmentDate = new Date(`${dateString}T${convertTo24Hour(timeString)}`);
  return appointmentDate > new Date();
};

// Convert 12-hour to 24-hour format
const convertTo24Hour = (time12h: string): string => {
  const [time, modifier] = time12h.split(' ');
  let [hours, minutes] = time.split(':');
  
  if (hours === '12') {
    hours = '00';
  }
  
  if (modifier === 'PM') {
    hours = String(parseInt(hours, 10) + 12);
  }
  
  return `${hours}:${minutes}`;
};

// Get time slots for a specific day
const getAvailableSlots = (doctor: Doctor, date: string): string[] => {
  const dayName = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
  
  if (!doctor.availability.includes(dayName)) {
    return [];
  }
  
  return doctor.slots;
};
```

### 5.7 Filtering and Search

```typescript
// Filter doctors by department
const filterByDepartment = (doctors: Doctor[], department: string): Doctor[] => {
  if (department === "All Departments") return doctors;
  return doctors.filter(doc => doc.department === department);
};

// Search doctors by name
const searchDoctors = (doctors: Doctor[], query: string): Doctor[] => {
  const q = query.toLowerCase().trim();
  if (!q) return doctors;
  
  return doctors.filter(doc => 
    doc.name.toLowerCase().includes(q) ||
    doc.department.toLowerCase().includes(q) ||
    doc.bio.toLowerCase().includes(q)
  );
};

// Get appointments by status
const getAppointmentsByStatus = (
  appointments: Appointment[], 
  status: Appointment['status']
): Appointment[] => {
  return appointments.filter(apt => apt.status === status);
};

// Get patient appointments
const getPatientAppointments = (
  appointments: Appointment[], 
  patientId: string
): Appointment[] => {
  return appointments.filter(apt => apt.patientId === patientId);
};

// Get doctor appointments
const getDoctorAppointments = (
  appointments: Appointment[], 
  doctorId: string
): Appointment[] => {
  return appointments.filter(apt => apt.doctorId === doctorId);
};
```

### 5.8 Status Badge Colors

```typescript
// Get color class based on appointment status
const getStatusColor = (status: Appointment['status']): string => {
  const colors = {
    UPCOMING: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    COMPLETED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    CANCELLED: "bg-red-500/10 text-red-500 border-red-500/20"
  };
  return colors[status];
};

// Get urgency color
const getUrgencyColor = (urgency: "HIGH" | "MEDIUM" | "LOW"): string => {
  const colors = {
    HIGH: "bg-red-500 text-white",
    MEDIUM: "bg-amber-500 text-white",
    LOW: "bg-emerald-500 text-white"
  };
  return colors[urgency];
};

// Get doctor status color
const getDoctorStatusColor = (status: Doctor['status']): string => {
  const colors = {
    PENDING: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    REJECTED: "bg-red-500/10 text-red-600 border-red-500/20"
  };
  return colors[status];
};
```

### 5.9 Chart Data Transformations

```typescript
// Transform appointments for weekly bar chart
const getWeeklyChartData = (appointments: Appointment[]) => {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const counts = new Array(7).fill(0);
  
  appointments.forEach(apt => {
    const dayIndex = new Date(apt.date).getDay();
    counts[dayIndex === 0 ? 6 : dayIndex - 1]++;
  });
  
  return days.map((day, i) => ({
    name: day,
    consultations: counts[i]
  }));
};

// Transform appointments for department pie chart
const getDepartmentChartData = (appointments: Appointment[]) => {
  const deptCounts: Record<string, number> = {};
  
  appointments.forEach(apt => {
    deptCounts[apt.department] = (deptCounts[apt.department] || 0) + 1;
  });
  
  return Object.entries(deptCounts).map(([name, value]) => ({
    name,
    value,
    fill: DEPARTMENT_COLORS[name] || "#94a3b8"
  }));
};

// Department color mapping
const DEPARTMENT_COLORS: Record<string, string> = {
  "Cardiology": "#ef4444",
  "Pediatrics": "#3b82f6",
  "Neurology": "#8b5cf6",
  "Orthopedics": "#10b981",
  "Dermatology": "#f59e0b",
  "General Medicine": "#6366f1"
};
```

---

## 7. CODE EXAMPLES AND PATTERNS

### 7.1 Complete Component Example: StatusBadge

```typescript
import React from 'react';
import { motion } from 'motion/react';

interface StatusBadgeProps {
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  darkMode: boolean;
  className?: string;
}

export function StatusBadge({ status, darkMode, className = "" }: StatusBadgeProps) {
  const getConfig = () => {
    const configs = {
      UPCOMING: {
        label: "Upcoming",
        icon: "⏰",
        color: "text-blue-500",
        bg: "bg-blue-500/10",
        border: "border-blue-500/20"
      },
      COMPLETED: {
        label: "Completed",
        icon: "✓",
        color: "text-emerald-500",
        bg: "bg-emerald-500/10",
        border: "border-emerald-500/20"
      },
      CANCELLED: {
        label: "Cancelled",
        icon: "✕",
        color: "text-red-500",
        bg: "bg-red-500/10",
        border: "border-red-500/20"
      }
    };
    return configs[status];
  };

  const config = getConfig();

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
        border ${config.bg} ${config.color} ${config.border}
        ${className}
      `}
    >
      <span>{config.icon}</span>
      <span>{config.label}</span>
    </motion.span>
  );
}
```

### 7.2 Custom Hook: useDebounce

```typescript
import { useState, useEffect } from 'react';

/**
 * Debounce hook to delay execution
 * Useful for search inputs to avoid excessive API calls
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Usage example
function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // Perform search with debounced value
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <input
      type="text"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search doctors..."
    />
  );
}
```

### 7.3 Loading States Pattern

```typescript
// Skeleton loader component
function SkeletonCard({ darkMode }: { darkMode: boolean }) {
  return (
    <div className={`
      rounded-xl border p-4 space-y-3
      ${darkMode ? 'border-slate-700 bg-slate-800/50' : 'border-slate-200 bg-white'}
    `}>
      {/* Avatar skeleton */}
      <div className="w-16 h-16 rounded-full bg-slate-700/50 animate-pulse" />
      
      {/* Text skeletons */}
      <div className="space-y-2">
        <div className="h-4 bg-slate-700/50 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-slate-700/50 rounded animate-pulse w-1/2" />
      </div>
      
      {/* Button skeleton */}
      <div className="h-9 bg-slate-700/50 rounded-lg animate-pulse" />
    </div>
  );
}

// Usage with conditional rendering
function DoctorList({ loading, doctors }: DoctorListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <SkeletonCard key={i} darkMode={true} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {doctors.map(doctor => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}
```

### 7.4 Modal Pattern

```typescript
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  darkMode: boolean;
}

function Modal({ isOpen, onClose, title, children, darkMode }: ModalProps) {
  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`
            relative max-w-2xl w-full max-h-[90vh] overflow-y-auto
            rounded-2xl shadow-2xl
            ${darkMode ? 'bg-slate-800 text-slate-100' : 'bg-white text-slate-900'}
          `}
        >
          {/* Header */}
          <div className="sticky top-0 z-10 flex items-center justify-between p-6 border-b">
            <h2 className="text-xl font-semibold">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-700/50 rounded-lg transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Usage
function MyComponent() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button onClick={() => setShowModal(true)}>Open Modal</button>
      
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Book Appointment"
        darkMode={true}
      >
        <AppointmentForm />
      </Modal>
    </>
  );
}
```

---


### 7.5 Form Validation Pattern

```typescript
interface FormErrors {
  [key: string]: string;
}

function validateAppointmentForm(data: {
  doctorId: string;
  date: string;
  time: string;
  symptoms: string;
}): FormErrors {
  const errors: FormErrors = {};

  // Validate doctor selection
  if (!data.doctorId) {
    errors.doctorId = "Please select a doctor";
  }

  // Validate date
  if (!data.date) {
    errors.date = "Please select a date";
  } else {
    const selectedDate = new Date(data.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      errors.date = "Cannot book appointments in the past";
    }
  }

  // Validate time slot
  if (!data.time) {
    errors.time = "Please select a time slot";
  }

  // Validate symptoms (optional but recommended)
  if (data.symptoms && data.symptoms.length < 10) {
    errors.symptoms = "Please provide more detail about your symptoms";
  }

  return errors;
}

// Usage in component
function BookingForm() {
  const [formData, setFormData] = useState({
    doctorId: "",
    date: "",
    time: "",
    symptoms: ""
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateAppointmentForm(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Submit form
    submitAppointment(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <select
        value={formData.doctorId}
        onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
        className={errors.doctorId ? 'border-red-500' : ''}
      >
        <option value="">Select Doctor</option>
        {doctors.map(doc => (
          <option key={doc.id} value={doc.id}>{doc.name}</option>
        ))}
      </select>
      {errors.doctorId && <p className="text-red-500 text-sm">{errors.doctorId}</p>}

      {/* Other form fields... */}
      
      <button type="submit">Book Appointment</button>
    </form>
  );
}
```

### 7.6 Error Boundary Component

```typescript
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
    // Log to error reporting service (e.g., Sentry)
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex items-center justify-center min-h-screen p-4">
          <div className="text-center space-y-4">
            <h2 className="text-2xl font-bold text-red-500">
              Oops! Something went wrong
            </h2>
            <p className="text-slate-600">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

// Usage
function App() {
  return (
    <ErrorBoundary>
      <YourAppComponents />
    </ErrorBoundary>
  );
}
```

### 7.7 Responsive Grid Layout Pattern

```typescript
// Responsive grid with Tailwind
function DoctorGrid({ doctors }: { doctors: Doctor[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {doctors.map(doctor => (
        <DoctorCard key={doctor.id} doctor={doctor} />
      ))}
    </div>
  );
}

// Masonry-style layout
function MasonryGrid({ items }: { items: any[] }) {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4">
      {items.map((item, i) => (
        <div key={i} className="break-inside-avoid mb-4">
          <Card data={item} />
        </div>
      ))}
    </div>
  );
}

// Flexbox auto-fit pattern
function AutoFitGrid({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-wrap gap-4">
      {React.Children.map(children, child => (
        <div className="flex-1 min-w-[300px] max-w-[400px]">
          {child}
        </div>
      ))}
    </div>
  );
}
```

---

## 8. BEST PRACTICES AND CONVENTIONS

### 8.1 Coding Standards

**TypeScript Usage:**
- Always define explicit types for props and state
- Use interfaces over types for object shapes
- Avoid `any` type; use `unknown` if type is truly unknown
- Enable strict mode in tsconfig.json

**Component Structure:**
```typescript
// ✅ Good: Consistent structure
function ComponentName({ prop1, prop2 }: ComponentProps) {
  // 1. Hooks
  const [state, setState] = useState();
  const context = useContext();
  
  // 2. Derived values
  const computedValue = useMemo(() => expensive(), [dep]);
  
  // 3. Effects
  useEffect(() => {}, []);
  
  // 4. Event handlers
  const handleClick = () => {};
  
  // 5. Render
  return <div>...</div>;
}
```

**Naming Conventions:**
- Components: PascalCase (`PatientDashboard.tsx`)
- Functions/variables: camelCase (`handleSubmit`, `isLoading`)
- Constants: UPPER_SNAKE_CASE (`API_BASE_URL`)
- CSS classes: kebab-case or Tailwind utilities
- Files: Match component name (`PatientDashboard.tsx`)

### 8.2 Performance Optimization

**Memoization:**
```typescript
// Memoize expensive computations
const filteredDoctors = useMemo(() => {
  return doctors.filter(d => d.department === selectedDept);
}, [doctors, selectedDept]);

// Memoize components
const MemoizedDoctorCard = memo(DoctorCard);

// Memoize callbacks
const handleUpdate = useCallback((id: string) => {
  updateDoctor(id, newData);
}, [newData]);
```

**Code Splitting:**
```typescript
// Lazy load heavy components
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const ReportSummarizer = lazy(() => import('./components/ReportSummarizer'));

// Use with Suspense
<Suspense fallback={<LoadingSpinner />}>
  <AdminDashboard />
</Suspense>
```

**Image Optimization:**
```tsx
// Use loading="lazy" for images
<img src={doctor.photo} alt={doctor.name} loading="lazy" />

// Optimize with srcset for responsive images
<img
  src={image.url}
  srcSet={`${image.url}?w=400 400w, ${image.url}?w=800 800w`}
  sizes="(max-width: 768px) 400px, 800px"
  alt="..."
/>
```

### 8.3 Security Best Practices

**Input Sanitization:**
```typescript
// Sanitize user input before display
const sanitizeInput = (input: string): string => {
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
```

**Environment Variables:**
```typescript
// Never expose API keys in client code
// ❌ Bad
const apiKey = "AIzaSyC...";

// ✅ Good - Use environment variables on server only
const apiKey = process.env.GEMINI_API_KEY;
```

**Authentication:**
```typescript
// Always validate user session
const requireAuth = (user: UserSession | null): boolean => {
  if (!user) {
    // Redirect to login
    return false;
  }
  return true;
};

// Role-based access control
const requireRole = (user: UserSession, allowedRoles: UserRole[]): boolean => {
  return allowedRoles.includes(user.role);
};
```

### 8.4 Accessibility Guidelines

**Semantic HTML:**
```tsx
// ✅ Good: Use semantic elements
<nav>...</nav>
<main>...</main>
<article>...</article>
<button>Click</button>

// ❌ Bad: Divitis
<div role="navigation">...</div>
<div role="main">...</div>
<div onClick={...}>Click</div>
```

**ARIA Labels:**
```tsx
<button aria-label="Close modal" onClick={onClose}>
  <X className="w-5 h-5" />
</button>

<input
  type="text"
  aria-describedby="search-helper"
  placeholder="Search..."
/>
<p id="search-helper" className="text-sm text-slate-500">
  Search by doctor name or specialty
</p>
```

**Keyboard Navigation:**
```typescript
// Support keyboard shortcuts
useEffect(() => {
  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'Escape') closeModal();
    if (e.ctrlKey && e.key === 's') saveChanges();
  };
  
  window.addEventListener('keydown', handleKeyPress);
  return () => window.removeEventListener('keydown', handleKeyPress);
}, []);
```

---

## 9. TROUBLESHOOTING GUIDE

### Common Issues

**Issue: TypeScript Errors**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache

# Reinstall dependencies
npm install

# Run type check
npm run lint
```

**Issue: Dark Mode Not Persisting**
```typescript
// Ensure localStorage is used correctly
useEffect(() => {
  const saved = localStorage.getItem('darkMode');
  if (saved !== null) {
    setDarkMode(saved === 'true');
  }
}, []);
```

**Issue: API Calls Failing**
```typescript
// Check CORS configuration
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Add error logging
axios.interceptors.response.use(
  response => response,
  error => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);
```

---

## 10. DEPLOYMENT CHECKLIST

- [ ] Update environment variables for production
- [ ] Enable HTTPS
- [ ] Implement JWT authentication
- [ ] Hash passwords with bcrypt
- [ ] Migrate to production database (PostgreSQL/MongoDB)
- [ ] Set up error logging (Sentry, LogRocket)
- [ ] Configure CDN for static assets
- [ ] Enable gzip compression
- [ ] Set up monitoring and analytics
- [ ] Create backup strategy
- [ ] Document API endpoints
- [ ] Write unit tests
- [ ] Perform security audit
- [ ] Optimize bundle size
- [ ] Test on multiple devices

---

## CONCLUSION

This code documentation provides comprehensive reference material for understanding, maintaining, and extending the AI-Powered Hospital Appointment Booking System. The codebase follows modern React and TypeScript best practices with a focus on performance, accessibility, and maintainability.

**For Support:**
- **Developer:** K Dinesh
- **Email:** dineshstar979@gmail.com
- **Internship ID:** BOV26O-0502
- **Organization:** Brainovision Solutions India Pvt. Ltd.

---

**Document Version:** 1.0.0  
**Last Updated:** July 27, 2026  
**Status:** Complete

---

**END OF CODE DOCUMENTATION**
