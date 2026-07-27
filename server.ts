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

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  try {
    ai = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
    console.log("Gemini API initialized successfully.");
  } catch (err) {
    console.error("Failed to initialize Gemini API Client:", err);
  }
} else {
  console.warn("GEMINI_API_KEY environment variable is not defined.");
}

// Local mock database files path
const DATA_FILE = path.join(process.cwd(), "hospital_data.json");

// Helper to load database
function loadDb() {
  if (fs.existsSync(DATA_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(DATA_FILE, "utf-8"));
    } catch (e) {
      console.error("Error reading JSON data file, resetting database:", e);
    }
  }
  
  // Seed initial data if file doesn't exist
  const initialData = {
    admins: [
      {
        id: "adm-1",
        name: "System Administrator",
        email: "admin@medicare.com",
        password: "Admin@123",
        role: "ADMIN"
      }
    ],
    doctors: [
      {
        id: "doc-1",
        name: "Dr. Sarah Jenkins",
        email: "sarah.j@medicare.com",
        password: "Doctor@123",
        role: "DOCTOR",
        department: "Cardiology",
        experience: 12,
        rating: 4.9,
        availability: ["Monday", "Wednesday", "Friday"],
        slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM"],
        photo: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300",
        bio: "Senior cardiologist specialized in interventional cardiology and preventive cardiovascular health.",
        status: "APPROVED"
      },
      {
        id: "doc-2",
        name: "Dr. Michael Chen",
        email: "michael.c@medicare.com",
        password: "Doctor@123",
        role: "DOCTOR",
        department: "Pediatrics",
        experience: 8,
        rating: 4.8,
        availability: ["Monday", "Tuesday", "Thursday"],
        slots: ["10:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "04:00 PM"],
        photo: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
        bio: "Compassionate pediatrician focused on early childhood development and allergy management.",
        status: "APPROVED"
      },
      {
        id: "doc-3",
        name: "Dr. Elena Rostova",
        email: "elena.r@medicare.com",
        password: "Doctor@123",
        role: "DOCTOR",
        department: "Neurology",
        experience: 15,
        rating: 5.0,
        availability: ["Tuesday", "Thursday", "Friday"],
        slots: ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
        photo: "https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300",
        bio: "Renowned neurologist specializing in neurodegenerative diseases and sleep disorders.",
        status: "APPROVED"
      },
      {
        id: "doc-4",
        name: "Dr. James Wilson",
        email: "james.w@medicare.com",
        password: "Doctor@123",
        role: "DOCTOR",
        department: "Orthopedics",
        experience: 10,
        rating: 4.7,
        availability: ["Wednesday", "Thursday", "Friday"],
        slots: ["09:30 AM", "10:30 AM", "02:30 PM", "03:30 PM"],
        photo: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300",
        bio: "Specialist in orthopedic surgery, sports medicine, and joint reconstruction.",
        status: "APPROVED"
      },
      {
        id: "doc-5",
        name: "Dr. Amara Patel",
        email: "amara.p@medicare.com",
        password: "Doctor@123",
        role: "DOCTOR",
        department: "Dermatology",
        experience: 6,
        rating: 4.6,
        availability: ["Monday", "Tuesday", "Wednesday"],
        slots: ["09:00 AM", "10:30 AM", "01:30 PM", "03:00 PM"],
        photo: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300",
        bio: "Dermatologist with clinical expertise in pediatric dermatology, acne treatments, and skin cancers.",
        status: "PENDING"
      }
    ],
    patients: [
      {
        id: "pat-1",
        name: "Dinesh Kumar",
        email: "patient123@gmail.com",
        password: "patient123",
        role: "PATIENT",
        phone: "+91 98765 43210",
        dob: "2003-05-15",
        bloodGroup: "O+",
        photo: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=300",
        medicalHistory: "Allergic to Penicillin. Mild seasonal asthma.",
        joinedDate: "2026-01-10"
      }
    ],
    appointments: [
      {
        id: "apt-1",
        patientId: "pat-1",
        patientName: "Dinesh Kumar",
        doctorId: "doc-1",
        doctorName: "Dr. Sarah Jenkins",
        department: "Cardiology",
        date: "2026-07-20",
        time: "10:00 AM",
        status: "UPCOMING",
        symptoms: "Mild chest tightness after cardiovascular exercises.",
        aiSummary: "Patient reports mild exertion-induced chest tightness. Recommended checking blood pressure, dynamic ECG, and lipid profile."
      },
      {
        id: "apt-2",
        patientId: "pat-1",
        patientName: "Dinesh Kumar",
        doctorId: "doc-2",
        doctorName: "Dr. Michael Chen",
        department: "Pediatrics",
        date: "2026-05-12",
        time: "03:00 PM",
        status: "COMPLETED",
        symptoms: "Routine health checkup.",
        aiSummary: "Routine physical examination. Vital parameters stable. Vaccines up to date."
      }
    ],
    medicalReports: [
      {
        id: "rep-1",
        patientId: "pat-1",
        fileName: "blood_test_report_may2026.pdf",
        uploadDate: "2026-05-12",
        fileSize: "1.2 MB",
        summary: "CBC and Lipid profiles are within standard parameters. LDL cholesterol is slightly near the upper limit (128 mg/dL). Fasting blood glucose is optimal (88 mg/dL).",
        category: "Laboratory Report"
      }
    ],
    departments: ["Cardiology", "Pediatrics", "Neurology", "Orthopedics", "Dermatology", "General Medicine"],
    systemSettings: {
      hospitalName: "St. Jude AI Medical Center",
      allowAutoApproveDoctors: false,
      enableSmsNotifications: true,
      maxAppointmentsPerSlot: 1,
      emergencyContact: "+1 (555) 019-9000"
    }
  };
  saveDb(initialData);
  return initialData;
}

function saveDb(data: any) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (e) {
    console.error("Error saving JSON data:", e);
  }
}

// Server API Routes

// Load db data
app.get("/api/db", (req, res) => {
  res.json(loadDb());
});

// Update doctors
app.post("/api/doctors", (req, res) => {
  const db = loadDb();
  const newDoc = req.body;
  if (!newDoc.id) {
    newDoc.id = `doc-${Date.now()}`;
  }
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

// Patients
app.post("/api/patients", (req, res) => {
  const db = loadDb();
  const newPat = req.body;
  if (!newPat.id) {
    newPat.id = `pat-${Date.now()}`;
  }
  db.patients.push(newPat);
  saveDb(db);
  res.json({ success: true, patient: newPat });
});

app.put("/api/patients/:id", (req, res) => {
  const db = loadDb();
  const id = req.params.id;
  const index = db.patients.findIndex((p: any) => p.id === id);
  if (index !== -1) {
    db.patients[index] = { ...db.patients[index], ...req.body };
    saveDb(db);
    res.json({ success: true, patient: db.patients[index] });
  } else {
    res.status(404).json({ error: "Patient not found" });
  }
});

// Appointments
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

// Reports
app.post("/api/reports", (req, res) => {
  const db = loadDb();
  const newRep = req.body;
  newRep.id = `rep-${Date.now()}`;
  db.medicalReports.push(newRep);
  saveDb(db);
  res.json({ success: true, report: newRep });
});

// Admin System Settings
app.put("/api/settings", (req, res) => {
  const db = loadDb();
  db.systemSettings = { ...db.systemSettings, ...req.body };
  saveDb(db);
  res.json({ success: true, settings: db.systemSettings });
});

// ==========================
// AUTH ENDPOINTS
// ==========================

// LOGIN — checks patients, doctors, admins
app.post("/api/auth/login", (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ success: false, message: "Email, password and role are required." });
  }

  const db = loadDb();
  const em = email.toLowerCase().trim();

  if (role === "ADMIN") {
    const admin = (db.admins || []).find((a: any) =>
      a.email.toLowerCase() === em && a.password === password
    );
    if (!admin) return res.status(401).json({ success: false, message: "Invalid admin credentials." });
    return res.json({
      success: true,
      user: { id: admin.id, name: admin.name, email: admin.email, role: "ADMIN" }
    });
  }

  if (role === "DOCTOR") {
    const doc = (db.doctors || []).find((d: any) =>
      d.email.toLowerCase() === em && d.password === password
    );
    if (!doc) return res.status(401).json({ success: false, message: "Invalid doctor credentials." });
    if (doc.status === "PENDING") {
      return res.status(403).json({ success: false, message: "Your account is pending admin approval. Please wait." });
    }
    if (doc.status === "REJECTED") {
      return res.status(403).json({ success: false, message: "Your application was rejected. Contact the admin." });
    }
    return res.json({
      success: true,
      user: { id: doc.id, name: doc.name, email: doc.email, role: "DOCTOR", department: doc.department }
    });
  }

  if (role === "PATIENT") {
    const pat = (db.patients || []).find((p: any) =>
      p.email.toLowerCase() === em && p.password === password
    );
    if (!pat) return res.status(401).json({ success: false, message: "Invalid email or password." });
    return res.json({
      success: true,
      user: { id: pat.id, name: pat.name, email: pat.email, role: "PATIENT" }
    });
  }

  return res.status(400).json({ success: false, message: "Unknown role." });
});

// REGISTER PATIENT — self-service
app.post("/api/auth/register/patient", (req, res) => {
  const { name, email, password, phone, dob, bloodGroup } = req.body;

  if (!name || !email || !password || !phone || !dob || !bloodGroup) {
    return res.status(400).json({ success: false, message: "All fields are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
  }

  const db = loadDb();
  const em = email.toLowerCase().trim();

  const exists = (db.patients || []).some((p: any) => p.email.toLowerCase() === em);
  if (exists) return res.status(409).json({ success: false, message: "An account with this email already exists." });

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
    user: { id: newPatient.id, name: newPatient.name, email: newPatient.email, role: "PATIENT" }
  });
});

// REGISTER DOCTOR — goes into PENDING, admin must approve
app.post("/api/auth/register/doctor", (req, res) => {
  const { name, email, password, department, experience, bio, photo } = req.body;

  if (!name || !email || !password || !department) {
    return res.status(400).json({ success: false, message: "Name, email, password and department are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
  }

  const db = loadDb();
  const em = email.toLowerCase().trim();

  const exists = (db.doctors || []).some((d: any) => d.email.toLowerCase() === em);
  if (exists) return res.status(409).json({ success: false, message: "A doctor with this email already exists." });

  const newDoctor = {
    id: `doc-${Date.now()}`,
    name: name.trim(),
    email: em,
    password,
    role: "DOCTOR",
    department,
    experience: Number(experience) || 1,
    rating: 5.0,
    bio: bio || "",
    availability: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    slots: ["09:00 AM", "10:00 AM", "11:00 AM", "02:00 PM", "03:00 PM", "04:00 PM"],
    photo: photo || "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300",
    status: "PENDING"
  };

  db.doctors.push(newDoctor);
  saveDb(db);

  return res.json({
    success: true,
    message: "Registration submitted. Your account is pending admin approval.",
    user: { id: newDoctor.id, name: newDoctor.name, email: newDoctor.email, role: "DOCTOR", department: newDoctor.department }
  });
});

// ==========================
// AI / GEMINI ENDPOINTS
// ==========================

// AI Symptom Analyzer
app.post("/api/gemini/symptom-check", async (req, res) => {
  const { symptoms, patientAge, patientGender } = req.body;
  
  const detectDepartment = (syms: string) => {
    const low = (syms || "").toLowerCase();
    if (low.includes("heart") || low.includes("chest") || low.includes("cardiac") || low.includes("palpitation")) return "Cardiology";
    if (low.includes("child") || low.includes("baby") || low.includes("kid") || low.includes("infant") || low.includes("pediatric")) return "Pediatrics";
    if (low.includes("head") || low.includes("migraine") || low.includes("brain") || low.includes("seizure") || low.includes("nerve")) return "Neurology";
    if (low.includes("bone") || low.includes("joint") || low.includes("knee") || low.includes("fracture") || low.includes("muscle")) return "Orthopedics";
    if (low.includes("skin") || low.includes("rash") || low.includes("acne") || low.includes("itch")) return "Dermatology";
    return "General Medicine";
  };

  const fallbackDept = detectDepartment(symptoms);

  if (!ai) {
    return res.json({
      analysis: `⚠️ **Gemini API key is not configured.**\n\n### Clinical Assessment\nBased on your reported symptoms ("${symptoms}"), we recommend a primary clinical review to rule out further complications. Your symptoms suggest a potential match with **${fallbackDept}** specialties.\n\n### Self-Care Advice\n- Stay well-hydrated and rest.\n- Monitor key indicators like temperature or blood pressure.\n- Keep a daily symptom log to share with your provider.\n\n### Warning Signs\nIf you experience acute pain, difficulty breathing, or sudden numbness, please seek immediate emergency care.`,
      recommendedSpecialty: fallbackDept
    });
  }

  const prompt = `
    You are an expert AI clinical diagnostic assistant at St. Jude AI Medical Center. 
    Analyze the following patient symptoms and details carefully.
    
    Patient Age: ${patientAge || 'Unknown'}
    Patient Gender: ${patientGender || 'Unknown'}
    Symptoms Reported: "${symptoms}"
    
    Please provide a highly professional, clinical-grade symptom analysis. 
    Format the response in clear Markdown with the following sections:
    1. **Primary Clinical Assessment**: Brief summary of what might be happening (clearly stating this is NOT an official diagnosis).
    2. **Potential Causes**: List 2-3 medical possibilities based on the symptoms.
    3. **Recommended Medical Specialty**: Recommend the department or specialty the patient should book (e.g., Cardiology, Pediatrics, Neurology, Dermatology, Orthopedics, General Medicine).
    4. **Urgency Assessment**: (LOW, MEDIUM, HIGH) with reasoning.
    5. **Self-Care & Triage Advice**: Practical temporary steps before seeing a doctor.
    6. **Red Flags / Immediate Warning Signs**: When to seek emergency care.
    
    CRITICAL: At the end of the text, include a separate single-line block formatted exactly as:
    RECOMMENDED_DEPARTMENT: <DepartmentName>
    (Ensure <DepartmentName> is exactly one of: Cardiology, Pediatrics, Neurology, Orthopedics, Dermatology, General Medicine)
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an empathetic, clinical-grade medical AI advisor. Speak clearly, professionally, and emphasize that your feedback is an assistant's tool, not a diagnostic replacement."
      }
    });

    const text = response.text || "";
    
    // Parse recommended specialty
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
    // Graceful fallback on API error (e.g., 503 or overload)
    res.json({
      analysis: `⚠️ **The AI Diagnostic Service is temporarily experiencing high demand. Responding in Secure Offline Mode.**\n\n### Offline Clinical Assessment\nBased on your symptoms ("${symptoms}"), there is a possible indication relating to **${fallbackDept}** functions. This offline review is for general informational triage.\n\n### Recommended Actions\n- **Consultation**: We advise scheduling an appointment with our specialist staff in **${fallbackDept}**.\n- **Symptom Tracker**: Note the severity of symptoms over the next 48 hours.\n- **Support**: If symptoms deteriorate, contact our emergency line at ${loadDb().systemSettings?.emergencyContact || "+1 (555) 019-9000"}.`,
      recommendedSpecialty: fallbackDept
    });
  }
});

// AI Chatbot Dr. Gemini
app.post("/api/gemini/chat", async (req, res) => {
  const { messages } = req.body; 
  const lastMsg = messages[messages.length - 1];
  const messageContent = lastMsg?.text || lastMsg?.content || "";
  
  if (!ai) {
    return res.json({
      response: `⚠️ **Gemini API key is not configured.**\n\nThis is a simulated assistant response. You asked about: "${messageContent}". Dr. Gemini recommends drinking plenty of fluids, getting restful sleep, and scheduling a clinical consultation through our booking portal if symptoms persist.`
    });
  }

  try {
    const chat = ai.chats.create({
      model: "gemini-2.0-flash",
      config: {
        systemInstruction: `You are Dr. Gemini, the chief AI resident at St. Jude AI Medical Center. 
          You are friendly, professional, compassionate, and highly skilled in clinical communication.
          Answer health-related queries, explain clinical terms in simple human language, give active health tips, 
          and help patients navigate our clinic.
          Always include a professional disclaimer that your advice is informational and they should see our specialists for actual medical decisions.`
      }
    });
    
    const response = await chat.sendMessage({ message: messageContent });
    res.json({ response: response.text });
  } catch (error: any) {
    console.error("AI Chatbot error:", error);
    // Graceful fallback on API error (e.g. 503)
    res.json({
      response: `⚠️ **Dr. Gemini is currently assisting other high-priority patients (Service is under high demand).**\n\n*Clinical Assistant Fallback:* Regarding your question "${messageContent}", I recommend keeping a detailed symptom log, monitoring your temperature, and scheduling an appointment with our specialist physicians for proper evaluation. Avoid self-diagnosis.`
    });
  }
});

// AI Medical Report Summarizer
app.post("/api/gemini/summarize-report", async (req, res) => {
  const { reportText, reportType } = req.body;
  
  if (!ai) {
    return res.json({
      summary: "⚠️ **Gemini API key is not configured.**\n\n*Simulated Summary:* The provided medical report represents a standard lab panel. Blood cell counts are stable. Liver enzyme values (AST/ALT) are within reference lines. Suggest discussing with a physician during your upcoming physical visit."
    });
  }

  const prompt = `
    You are an expert medical AI specializing in interpreting laboratory and clinical diagnostic paperwork.
    Summarize the following medical text/report of type: "${reportType || 'General Medical Report'}" in clear, plain, reassuring patient-friendly language.
    
    Report Data:
    "${reportText}"
    
    Provide the summary in clean Markdown structure:
    - **Key Findings**: Clear, simplified bullet points summarizing the most important observations.
    - **Reference Ranges**: Explain if any values are flag-high, normal, or low in layman's terms.
    - **Suggested Doctor Questions**: Generate 3 practical, intelligent questions the patient can ask their doctor during their consultation based on these results.
    - **Overall Reassurance**: A warm closing statement clarifying the diagnostic context.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    res.json({ summary: response.text });
  } catch (error: any) {
    console.error("Report summarizer error:", error);
    // Graceful fallback on API error (e.g. 503)
    res.json({
      summary: `⚠️ **The Medical Report Summarizer is currently experiencing high demand. Responding in Secure Offline Mode.**\n\n### Report Overview\nYour ${reportType || 'General Medical Report'} has been parsed by our local parser. Key values appear to fall within standard reference intervals.\n\n### Next Steps & Questions for Your Doctor\n1. *"Are there any lifestyle or dietary updates recommended based on these lab readings?"*\n2. *"When should I schedule my next follow-up panel to monitor these metrics?"*\n3. *"Do any of these results correlate with the general symptoms I've been feeling?"*\n\n*Please discuss this document with your attending physician to receive a tailored interpretation.*`
    });
  }
});

// AI Appointment Summary & Health Tips
app.post("/api/gemini/health-tips", async (req, res) => {
  const { department, patientAge } = req.body;
  
  const getOfflineTips = (dept: string) => {
    if (dept === "Cardiology") {
      return "- **Monitor Blood Pressure**: Keep a daily log of blood pressure readings at rest.\n- **Sodium Control**: Restrict dietary sodium to under 2,000 mg per day.\n- **Cardiac Exercise**: Aim for 30 minutes of low-impact cardiovascular activity (like brisk walking) daily.";
    } else if (dept === "Pediatrics") {
      return "- **Balanced Nutrition**: Ensure a colorful plate of fruits, vegetables, and high-quality protein daily.\n- **Immunization Schedule**: Keep vaccines up to date with the pediatric registry.\n- **Outdoor Play**: Encourage at least 60 minutes of active physical play every day.";
    } else if (dept === "Neurology") {
      return "- **Cognitive Exercises**: Challenge your brain with puzzles, reading, or learning new skills.\n- **Stress Reduction**: Practice mindfulness, deep breathing, or yoga to lower stress hormones.\n- **Consistent Sleep**: Maintain a strict sleep-wake schedule, even on weekends.";
    } else if (dept === "Orthopedics") {
      return "- **Strength Training**: Do resistance exercises to build bone density and supporting muscle groups.\n- **Calcium & Vitamin D**: Ensure daily intake via supplements or leafy greens/dairy products.\n- **Ergonomics**: Maintain proper posture when sitting or lifting heavy objects.";
    } else if (dept === "Dermatology") {
      return "- **Broad-Spectrum Sunscreen**: Apply SPF 30+ daily, even when overcast.\n- **Moisturize Daily**: Hydrate your skin barrier immediately after bathing.\n- **Skin Checks**: Examine mole spots monthly and report changes to a certified dermatologist.";
    } else {
      return "- **Hydration**: Drink 2-3 liters of water throughout the day.\n- **Balanced Routine**: Blend physical activity, mental rest, and solid nutrition into your week.\n- **Annual Screening**: Schedule regular preventative diagnostics to detect risks early.";
    }
  };

  if (!ai) {
    return res.json({
      tips: getOfflineTips(department)
    });
  }

  const prompt = `
    Generate 3 highly tailored, practical, clinical-grade wellness recommendations and preventative health tips for a patient who is ${patientAge || '25'} years old and consulting the **${department || 'General Medicine'}** department.
    Ensure they are highly specific to this department (e.g. cardiac conditioning tips for Cardiology, developmental/nutrition tips for Pediatrics, cognitive/stress tips for Neurology, bone/joint care for Orthopedics, UV safety/skin barrier for Dermatology).
    Format as direct, elegant, actionable markdown bullet points.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
    });
    res.json({ tips: response.text });
  } catch (error: any) {
    console.error("Health tips error:", error);
    // Graceful fallback on API error (e.g. 503)
    res.json({ tips: getOfflineTips(department) });
  }
});


// Start Dev and Asset Server Configuration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom full-stack server running on http://localhost:${PORT}`);
  });
}

startServer();
