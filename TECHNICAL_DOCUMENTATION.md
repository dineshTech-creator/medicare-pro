# AI-POWERED HOSPITAL APPOINTMENT BOOKING SYSTEM
## TECHNICAL DOCUMENTATION

---

**Project Name:** AI-Powered Hospital Appointment Booking System  
**Developer:** K Dinesh  
**Internship ID:** BOV26O-0502  
**Organization:** Brainovision Solutions India Pvt. Ltd.  
**Version:** 1.0.0  
**Last Updated:** July 27, 2026

---

## TABLE OF CONTENTS

1. System Overview
2. Architecture Design
3. Database Schema
4. API Documentation
5. Frontend Components
6. AI Integration
7. Security Implementation
8. Deployment Guide
9. Troubleshooting

---

## 1. SYSTEM OVERVIEW

### 1.1 Purpose

The AI-Powered Hospital Appointment Booking System is a comprehensive healthcare management platform that leverages Google Gemini AI to provide intelligent patient care, automated appointment scheduling, and clinical decision support.

### 1.2 Key Features

- **Multi-Role Access**: Patient, Doctor, and Administrator dashboards
- **AI Symptom Checker**: Intelligent triage and department routing
- **AI Health Assistant**: 24/7 conversational chatbot (Dr. Gemini)
- **Report Summarizer**: Plain-language medical report interpretation
- **Appointment Management**: Real-time scheduling with conflict prevention
- **Analytics Dashboard**: Comprehensive platform metrics
- **Responsive Design**: Mobile, tablet, and desktop support
- **Dark Mode**: Full theme customization

### 1.3 Technology Stack

**Frontend:** React 19 + TypeScript + Tailwind CSS + Vite  
**Backend:** Node.js + Express.js + TypeScript  
**AI:** Google Gemini 2.0 Flash  
**Database:** JSON file storage (development) - Upgradable to SQL/NoSQL  
**Charts:** Recharts  
**Animations:** Framer Motion

---

## 2. ARCHITECTURE DESIGN

### 2.1 System Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                              │
│                                                                   │
│  ┌────────────────┐  ┌────────────────┐  ┌─────────────────┐    │
│  │    Browser     │  │     Mobile     │  │     Tablet      │    │
│  │   (Desktop)    │  │   (iOS/And)    │  │    Devices      │    │
│  └────────┬───────┘  └────────┬───────┘  └────────┬────────┘    │
│           │                   │                    │              │
│           └───────────────────┴────────────────────┘              │
│                              │                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                         HTTPS/HTTP
                               │
┌──────────────────────────────▼────────────────────────────────────┐
│                      APPLICATION LAYER                            │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              React Single Page Application                  │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │  Components:                                                │ │
│  │  • App.tsx (Root)                                           │ │
│  │  • AuthScreens.tsx (Login/Register)                         │ │
│  │  • PatientDashboard.tsx                                     │ │
│  │  • DoctorDashboard.tsx                                      │ │
│  │  • AdminDashboard.tsx                                       │ │
│  │  • SymptomChecker.tsx                                       │ │
│  │  • AIChatbot.tsx                                            │ │
│  │  • ReportSummarizer.tsx                                     │ │
│  │  • Sidebar.tsx                                              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
│                      Axios HTTP Client                            │
│                              │                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                           REST API
                               │
┌──────────────────────────────▼────────────────────────────────────┐
│                        SERVER LAYER                               │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                 Express.js REST API                         │ │
│  ├─────────────────────────────────────────────────────────────┤ │
│  │  Endpoints:                                                 │ │
│  │  • /api/auth/*          - Authentication                    │ │
│  │  • /api/db              - Data synchronization              │ │
│  │  • /api/appointments/*  - Appointment CRUD                  │ │
│  │  • /api/doctors/*       - Doctor management                 │ │
│  │  • /api/patients/*      - Patient management                │ │
│  │  • /api/reports/*       - Medical reports                   │ │
│  │  • /api/gemini/*        - AI integration                    │ │
│  │  • /api/settings        - System configuration              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                              │                                    │
└──────────────────────────────┼────────────────────────────────────┘
                               │
                ┌──────────────┴──────────────┐
                │                             │
┌───────────────▼──────────────┐  ┌──────────▼─────────────────────┐
│      DATA LAYER              │  │    AI SERVICE LAYER            │
│                              │  │                                │
│  ┌────────────────────────┐  │  │  ┌──────────────────────────┐ │
│  │  hospital_data.json    │  │  │  │  Google Gemini AI        │ │
│  ├────────────────────────┤  │  │  ├──────────────────────────┤ │
│  │  • users               │  │  │  │  • Symptom Analysis      │ │
│  │  • patients            │  │  │  │  • Report Summarization  │ │
│  │  • doctors             │  │  │  │  • Health Chatbot        │ │
│  │  • appointments        │  │  │  │  • Wellness Tips         │ │
│  │  • medicalReports      │  │  │  └──────────────────────────┘ │
│  │  • systemSettings      │  │  │                                │
│  └────────────────────────┘  │  │  Model: gemini-2.0-flash       │
│                              │  │                                │
└──────────────────────────────┘  └────────────────────────────────┘
```


### 2.2 Component Hierarchy

```
App (Root Component)
│
├── ToastContext Provider
│
├── Sidebar (when authenticated)
│   ├── Navigation Items
│   ├── User Profile
│   └── Logout Button
│
├── Header Bar
│   ├── Live Sync Indicator
│   ├── Dark Mode Toggle
│   ├── Notifications Bell
│   └── User Avatar
│
└── Main Content Area
    │
    ├── AuthScreens (unauthenticated)
    │   ├── Login Form
    │   └── Registration Forms
    │       ├── Patient Registration
    │       └── Doctor Registration
    │
    ├── PatientDashboard
    │   ├── Stats Cards
    │   ├── Appointments Timeline
    │   ├── Health Profile Card
    │   ├── AI Health Tips
    │   └── Booking Modal
    │
    ├── DoctorDashboard
    │   ├── Performance Stats
    │   ├── Patient Queue
    │   ├── Analytics Charts
    │   └── AI Prep Modal
    │
    ├── AdminDashboard
    │   ├── Platform Stats
    │   ├── Pending Approvals
    │   ├── Analytics Charts
    │   └── Add Doctor Modal
    │
    ├── SymptomChecker
    │   ├── Input Form
    │   └── AI Analysis Results
    │
    ├── AIChatbot
    │   ├── Message History
    │   ├── Typing Indicator
    │   └── Input Field
    │
    └── ReportSummarizer
        ├── Upload Form
        ├── Reports Vault
        └── Summary Modal
```

### 2.3 Data Flow

**Authentication Flow:**
```
User → Login Form → /api/auth/login → Validate Credentials → 
Session Storage → Redirect to Dashboard
```

**Appointment Creation Flow:**
```
Patient → Select Doctor → Choose Date/Time → Enter Symptoms → 
AI Pre-screening → /api/appointments POST → Update Database → 
Notification → Doctor Dashboard Update
```

**AI Symptom Check Flow:**
```
User Input → /api/gemini/symptom-check → Google Gemini API → 
AI Analysis → Department Routing → Display Results → 
Optional: Book Appointment
```

---

## 3. DATABASE SCHEMA

### 3.1 Data Model (hospital_data.json)

```typescript
interface Database {
  admins: Admin[];
  doctors: Doctor[];
  patients: Patient[];
  appointments: Appointment[];
  medicalReports: MedicalReport[];
  departments: string[];
  systemSettings: SystemSettings;
}
```

### 3.2 Entity Definitions

**Admin Entity:**
```typescript
interface Admin {
  id: string;              // "adm-1"
  name: string;            // "System Administrator"
  email: string;           // "admin@medicare.com"
  password: string;        // Plain text (dev) - Hash in production
  role: "ADMIN";
}
```

**Doctor Entity:**
```typescript
interface Doctor {
  id: string;              // "doc-1"
  name: string;            // "Dr. Sarah Jenkins"
  email: string;           // "sarah.j@medicare.com"
  password: string;        // Plain text (dev) - Hash in production
  role: "DOCTOR";
  department: string;      // "Cardiology"
  experience: number;      // Years of experience
  rating: number;          // 0-5 stars
  availability: string[];  // ["Monday", "Wednesday", "Friday"]
  slots: string[];         // ["09:00 AM", "10:00 AM", "11:00 AM"]
  photo: string;           // URL to profile image
  bio: string;             // Professional background
  status: "PENDING" | "APPROVED" | "REJECTED";
  consultationFee?: number;
  totalPatients?: number;
}
```

**Patient Entity:**
```typescript
interface Patient {
  id: string;              // "pat-1"
  name: string;            // "Dinesh Kumar"
  email: string;           // "patient123@gmail.com"
  password: string;        // Plain text (dev) - Hash in production
  role: "PATIENT";
  phone: string;           // "+91 98765 43210"
  dob: string;             // "2003-05-15"
  bloodGroup: string;      // "O+"
  photo: string;           // URL to profile image
  medicalHistory: string;  // "Allergic to Penicillin..."
  joinedDate: string;      // "2026-01-10"
  weight?: string;
  height?: string;
  allergies?: string[];
}
```

**Appointment Entity:**
```typescript
interface Appointment {
  id: string;              // "apt-1"
  patientId: string;       // Reference to Patient
  patientName: string;     // Denormalized for quick access
  doctorId: string;        // Reference to Doctor
  doctorName: string;      // Denormalized for quick access
  department: string;      // "Cardiology"
  date: string;            // "2026-07-20"
  time: string;            // "10:00 AM"
  status: "UPCOMING" | "COMPLETED" | "CANCELLED";
  symptoms: string;        // Patient-reported symptoms
  aiSummary?: string;      // AI-generated pre-consultation brief
  type?: "In-Person" | "Video" | "Phone";
  createdAt?: string;      // ISO timestamp
}
```

**MedicalReport Entity:**
```typescript
interface MedicalReport {
  id: string;              // "rep-1"
  patientId: string;       // Reference to Patient
  fileName: string;        // "blood_test_report_may2026.pdf"
  uploadDate: string;      // "2026-05-12"
  fileSize: string;        // "1.2 MB"
  summary?: string;        // AI-generated plain-language summary
  category: string;        // "Laboratory Report"
}
```

**SystemSettings Entity:**
```typescript
interface SystemSettings {
  hospitalName: string;              // "St. Jude AI Medical Center"
  allowAutoApproveDoctors: boolean;  // false
  enableSmsNotifications: boolean;   // true
  maxAppointmentsPerSlot: number;    // 1
  emergencyContact: string;          // "+1 (555) 019-9000"
}
```

### 3.3 Relationships

```
Admins (1) ──── manages ──── (*) Doctors
Patients (1) ──── books ──── (*) Appointments
Doctors (1) ──── receives ──── (*) Appointments
Patients (1) ──── uploads ──── (*) MedicalReports
```

### 3.4 Indexes (for production SQL migration)

```sql
-- Recommended indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_appointments_status ON appointments(status);
CREATE INDEX idx_doctors_department ON doctors(department);
CREATE INDEX idx_doctors_status ON doctors(status);
```

---

## 4. API DOCUMENTATION

### 4.1 Authentication Endpoints

#### POST /api/auth/login
**Description:** Authenticate user and create session

**Request Body:**
```json
{
  "email": "patient123@gmail.com",
  "password": "patient123",
  "role": "PATIENT" | "DOCTOR" | "ADMIN"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "pat-1",
    "name": "Dinesh Kumar",
    "email": "patient123@gmail.com",
    "role": "PATIENT"
  }
}
```

**Error Response (401):**
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

#### POST /api/auth/register/patient
**Description:** Register new patient account

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1 234 567 8900",
  "dob": "1995-06-15",
  "bloodGroup": "A+"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "user": {
    "id": "pat-123",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "PATIENT"
  }
}
```

#### POST /api/auth/register/doctor
**Description:** Register new doctor (requires admin approval)

**Request Body:**
```json
{
  "name": "Dr. Jane Smith",
  "email": "jane@hospital.com",
  "password": "doctor123",
  "department": "Cardiology",
  "experience": 10,
  "bio": "Specialist in interventional cardiology..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Registration submitted. Pending admin approval.",
  "user": {
    "id": "doc-123",
    "name": "Dr. Jane Smith",
    "role": "DOCTOR",
    "department": "Cardiology"
  }
}
```

### 4.2 Appointment Endpoints

#### POST /api/appointments
**Description:** Create new appointment

**Request Body:**
```json
{
  "patientId": "pat-1",
  "patientName": "Dinesh Kumar",
  "doctorId": "doc-1",
  "doctorName": "Dr. Sarah Jenkins",
  "department": "Cardiology",
  "date": "2026-07-30",
  "time": "10:00 AM",
  "status": "UPCOMING",
  "symptoms": "Chest tightness when exercising",
  "aiSummary": "AI analysis result..."
}
```

**Success Response (200):**
```json
{
  "success": true,
  "appointment": {
    "id": "apt-456",
    ...appointmentData
  }
}
```

#### PUT /api/appointments/:id
**Description:** Update appointment status or details

**Request Body:**
```json
{
  "status": "COMPLETED",
  "date": "2026-07-31",
  "time": "11:00 AM"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "appointment": { ...updatedData }
}
```


### 4.3 AI Integration Endpoints

#### POST /api/gemini/symptom-check
**Description:** Analyze patient symptoms and recommend specialist

**Request Body:**
```json
{
  "symptoms": "Mild chest tightness when running, onset 3 days ago",
  "patientAge": "24",
  "patientGender": "Male"
}
```

**Success Response (200):**
```json
{
  "analysis": "## Primary Clinical Assessment\nBased on your symptoms...",
  "recommendedSpecialty": "Cardiology"
}
```

#### POST /api/gemini/chat
**Description:** Chat with Dr. Gemini AI assistant

**Request Body:**
```json
{
  "messages": [
    { "role": "user", "text": "What are signs of high blood pressure?" },
    { "role": "model", "text": "Previous AI response..." },
    { "role": "user", "text": "How can I lower it naturally?" }
  ]
}
```

**Success Response (200):**
```json
{
  "response": "To lower blood pressure naturally, consider these approaches:\n1. Reduce sodium intake..."
}
```

#### POST /api/gemini/summarize-report
**Description:** Generate plain-language summary of medical report

**Request Body:**
```json
{
  "reportText": "WBC: 6.8 x10^3/uL\nRBC: 4.95 x10^6/uL\nHemoglobin: 15.2 g/dL...",
  "reportType": "Laboratory Report"
}
```

**Success Response (200):**
```json
{
  "summary": "## Key Findings\n- White blood cell count is within normal range...\n\n## Suggested Doctor Questions\n1. Are these results..."
}
```

#### POST /api/gemini/health-tips
**Description:** Get personalized health recommendations

**Request Body:**
```json
{
  "department": "Cardiology",
  "patientAge": "24"
}
```

**Success Response (200):**
```json
{
  "tips": "• Monitor Blood Pressure: Keep a daily log...\n• Sodium Control: Limit to under 2,000 mg...\n• Cardiac Exercise: 30 minutes daily..."
}
```

### 4.4 Doctor Management Endpoints

#### POST /api/doctors
**Description:** Add new doctor (admin only)

**Request Body:**
```json
{
  "name": "Dr. Michael Chen",
  "email": "michael@hospital.com",
  "department": "Pediatrics",
  "experience": 8,
  "status": "APPROVED",
  ...otherFields
}
```

#### PUT /api/doctors/:id
**Description:** Update doctor status or details

**Request Body:**
```json
{
  "status": "APPROVED",
  "rating": 4.9
}
```

#### DELETE /api/doctors/:id
**Description:** Remove doctor from system

**Success Response (200):**
```json
{
  "success": true,
  "doctor": { ...deletedDoctorData }
}
```

### 4.5 Data Synchronization

#### GET /api/db
**Description:** Fetch entire database for client-side state

**Success Response (200):**
```json
{
  "admins": [...],
  "doctors": [...],
  "patients": [...],
  "appointments": [...],
  "medicalReports": [...],
  "departments": ["Cardiology", "Pediatrics", ...],
  "systemSettings": {...}
}
```

---

## 5. FRONTEND COMPONENTS

### 5.1 App.tsx (Root Component)

**Responsibilities:**
- Global state management
- Authentication handling
- Theme management (dark mode)
- Toast notification system
- Database synchronization
- Route rendering based on user role

**Key State Variables:**
```typescript
const [darkMode, setDarkMode] = useState(true);
const [doctors, setDoctors] = useState<Doctor[]>([]);
const [patients, setPatients] = useState<Patient[]>([]);
const [appointments, setAppointments] = useState<Appointment[]>([]);
const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
const [currentView, setCurrentView] = useState("patient-dashboard");
```

**Main Functions:**
- `fetchDb()` - Sync database from server
- `handleBookAppointment()` - Create new appointment
- `handleCancelAppointment()` - Cancel existing appointment
- `handleLoginSuccess()` - Process successful authentication
- `handleLogout()` - Clear session and redirect

### 5.2 PatientDashboard.tsx

**Features:**
- View upcoming and completed appointments
- Search and filter doctors by specialty
- Book new appointments with AI symptom pre-screening
- Display personal health profile
- View AI-generated wellness tips

**Sub-components:**
- `StatCard` - Displays key metrics
- `StatusBadge` - Shows appointment status
- `BookingModal` - Appointment creation form

**Props Interface:**
```typescript
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
```

### 5.3 DoctorDashboard.tsx

**Features:**
- View today's patient queue
- Access AI pre-consultation briefs
- Complete or reject appointments
- Manage availability and blocked dates
- View performance analytics

**Charts:**
- Weekly consultation volume (Bar Chart)
- Patient growth trend (Area Chart)
- Performance metrics (Progress Bars)

### 5.4 AdminDashboard.tsx

**Features:**
- Approve/reject doctor applications
- View all patients and doctors
- System-wide analytics
- Configure platform settings
- Monitor recent activity

**Charts:**
- Consultations by department (Bar Chart)
- Doctor distribution (Pie Chart)
- 6-month platform trend (Area Chart)

### 5.5 SymptomChecker.tsx

**Workflow:**
1. User enters age, gender, symptoms
2. Quick symptom presets available
3. Submit to AI for analysis
4. Display urgency level and recommended specialty
5. Option to book appointment directly

### 5.6 AIChatbot.tsx

**Features:**
- Multi-turn conversation support
- Preset question suggestions
- Typing indicator during AI response
- Scroll-to-bottom functionality
- Message history persistence

**Message Interface:**
```typescript
interface Message {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
}
```

### 5.7 ReportSummarizer.tsx

**Features:**
- Upload medical report text
- Select report category
- Demo data presets (CBC, Lipid Panel)
- AI-powered summarization
- View reports vault
- Display summaries in modal

---

## 6. AI INTEGRATION DETAILS

### 6.1 Google Gemini Configuration

**Initialization:**
```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: { 'User-Agent': 'aistudio-build' }
  }
});
```

**Model Used:** `gemini-2.0-flash`
- Fast response times (<2 seconds average)
- Cost-effective for high-volume usage
- Excellent medical knowledge base
- Context window: 1M tokens

### 6.2 Prompt Engineering Strategies

**1. Role Definition:**
```typescript
systemInstruction: "You are an expert AI clinical diagnostic assistant at St. Jude AI Medical Center..."
```

**2. Output Structure:**
```typescript
const prompt = `
Please provide analysis in Markdown with:
1. **Primary Assessment**: ...
2. **Potential Causes**: ...
3. **Recommended Specialty**: ...
4. **Urgency Level**: ...
`;
```

**3. Safety Guidelines:**
```typescript
systemInstruction: "Always include professional disclaimers. Your advice is informational only and not a substitute for professional medical care."
```

### 6.3 Error Handling & Fallbacks

**API Failure Handling:**
```typescript
try {
  const response = await ai.models.generateContent({...});
  return response.text;
} catch (error) {
  console.error("AI API Error:", error);
  return generateOfflineFallback(userInput);
}
```

**Fallback Strategies:**
1. Rule-based department detection
2. Pre-written health tips by specialty
3. Generic symptom assessment messages
4. Graceful error notifications to users

### 6.4 Response Processing

**Department Extraction:**
```typescript
function extractDepartment(aiResponse: string): string {
  const match = aiResponse.match(/RECOMMENDED_DEPARTMENT:\s*(\w+)/i);
  if (match) return match[1];
  
  // Fallback: keyword detection
  if (aiResponse.includes("heart") || aiResponse.includes("cardiac")) {
    return "Cardiology";
  }
  // ... more keyword rules
  
  return "General Medicine";
}
```

**Urgency Detection:**
```typescript
function detectUrgency(text: string): "HIGH" | "MEDIUM" | "LOW" {
  const upper = text.toUpperCase();
  if (upper.includes("HIGH URGENCY") || upper.includes("EMERGENCY")) {
    return "HIGH";
  }
  if (upper.includes("MEDIUM")) return "MEDIUM";
  return "LOW";
}
```

---

## 7. SECURITY IMPLEMENTATION

### 7.1 Current Security (Development)

**Authentication:**
- Email/password-based login
- Plain text password storage (dev only)
- Session stored in localStorage
- Role-based access control

**API Security:**
- Server-side validation on all endpoints
- Request body validation
- Error message sanitization

### 7.2 Production Security Recommendations

**Password Security:**
```typescript
import bcrypt from 'bcrypt';

// Hash password during registration
const hashedPassword = await bcrypt.hash(password, 10);

// Verify during login
const isValid = await bcrypt.compare(password, user.hashedPassword);
```

**JWT Authentication:**
```typescript
import jwt from 'jsonwebtoken';

// Generate token
const token = jwt.sign(
  { userId: user.id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

// Verify token
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    res.status(401).json({ error: 'Unauthorized' });
  }
};
```

**HTTPS Enforcement:**
```typescript
// Redirect HTTP to HTTPS in production
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(`https://${req.header('host')}${req.url}`);
  } else {
    next();
  }
});
```

**Rate Limiting:**
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

**Input Sanitization:**
```typescript
import validator from 'validator';

// Sanitize email
const cleanEmail = validator.normalizeEmail(email);

// Escape HTML
const cleanText = validator.escape(userInput);
```

### 7.3 Data Privacy

**HIPAA Considerations:**
- Encrypt sensitive medical data at rest
- Use HTTPS for data in transit
- Implement audit logging
- Set up automatic session timeout
- Enable data anonymization for analytics

**Environment Variables:**
```bash
# .env file (never commit to git)
GEMINI_API_KEY=your_api_key_here
JWT_SECRET=random_secret_key
DATABASE_URL=postgresql://...
NODE_ENV=production
```

---

## 8. DEPLOYMENT GUIDE

### 8.1 Local Development Setup

**Prerequisites:**
```bash
# Check Node.js version (v18+)
node --version

# Check npm version
npm --version
```

**Installation Steps:**
```bash
# 1. Clone repository
git clone <repository-url>
cd AI-Powered_Hospital_Appointment_Booking_System

# 2. Install dependencies
npm install

# 3. Create environment file
cp .env.example .env

# 4. Add your Gemini API key to .env
echo "GEMINI_API_KEY=your_key_here" >> .env

# 5. Start development server
npm run dev

# Server runs on http://localhost:3000
```

### 8.2 Production Build

**Build Process:**
```bash
# Clean previous builds
npm run clean

# Create production build
npm run build

# Output:
# - dist/ folder contains compiled code
# - dist/server.cjs (backend bundle)
# - dist/client/ (static frontend assets)
```

**Start Production Server:**
```bash
npm start
# or
node dist/server.cjs
```

### 8.3 Cloud Deployment Options

**Option 1: Vercel (Recommended for Frontend)**
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

**Option 2: Heroku (Full-Stack)**
```bash
# Create Heroku app
heroku create hospital-booking-ai

# Set environment variables
heroku config:set GEMINI_API_KEY=your_key

# Deploy
git push heroku main

# Open app
heroku open
```

**Option 3: AWS EC2**
```bash
# SSH into EC2 instance
ssh -i key.pem ubuntu@ec2-instance

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Clone and setup
git clone <repo>
cd project
npm install
npm run build

# Use PM2 for process management
npm install -g pm2
pm2 start dist/server.cjs --name hospital-app
pm2 startup
pm2 save
```

**Option 4: Docker**
```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000

CMD ["node", "dist/server.cjs"]
```

```bash
# Build image
docker build -t hospital-booking .

# Run container
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key hospital-booking
```

### 8.4 Database Migration (JSON to PostgreSQL)

**Schema Creation:**
```sql
-- Create users table (unified)
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'DOCTOR', 'PATIENT')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create patients table (extends users)
CREATE TABLE patients (
  id VARCHAR(50) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  phone VARCHAR(50) NOT NULL,
  dob DATE NOT NULL,
  blood_group VARCHAR(10) NOT NULL,
  photo_url TEXT,
  medical_history TEXT,
  joined_date DATE NOT NULL
);

-- Create doctors table (extends users)
CREATE TABLE doctors (
  id VARCHAR(50) PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  department VARCHAR(100) NOT NULL,
  experience INTEGER NOT NULL,
  rating DECIMAL(2,1) DEFAULT 5.0,
  availability_days TEXT NOT NULL,
  slots TEXT NOT NULL,
  photo_url TEXT,
  bio TEXT,
  status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED'))
);

-- Create appointments table
CREATE TABLE appointments (
  id VARCHAR(50) PRIMARY KEY,
  patient_id VARCHAR(50) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  doctor_id VARCHAR(50) NOT NULL REFERENCES doctors(id) ON DELETE CASCADE,
  department VARCHAR(100) NOT NULL,
  date DATE NOT NULL,
  time VARCHAR(20) NOT NULL,
  status VARCHAR(20) DEFAULT 'UPCOMING' CHECK (status IN ('UPCOMING', 'COMPLETED', 'CANCELLED')),
  symptoms TEXT,
  ai_summary TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create medical_reports table
CREATE TABLE medical_reports (
  id VARCHAR(50) PRIMARY KEY,
  patient_id VARCHAR(50) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  upload_date DATE NOT NULL,
  file_size VARCHAR(50) NOT NULL,
  summary TEXT,
  category VARCHAR(100) NOT NULL
);

-- Create indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_appointments_date ON appointments(date);
CREATE INDEX idx_appointments_patient ON appointments(patient_id);
CREATE INDEX idx_appointments_doctor ON appointments(doctor_id);
CREATE INDEX idx_doctors_department ON doctors(department);
```

**Data Migration Script:**
```typescript
import fs from 'fs';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function migrate() {
  const data = JSON.parse(fs.readFileSync('hospital_data.json', 'utf-8'));
  
  // Migrate users (patients, doctors, admins)
  for (const patient of data.patients) {
    await pool.query(
      'INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5)',
      [patient.id, patient.name, patient.email, patient.password, 'PATIENT']
    );
    await pool.query(
      'INSERT INTO patients (id, phone, dob, blood_group, photo_url, medical_history, joined_date) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [patient.id, patient.phone, patient.dob, patient.bloodGroup, patient.photo, patient.medicalHistory, patient.joinedDate]
    );
  }
  
  // Similar for doctors and appointments...
  console.log('Migration completed!');
}

migrate().catch(console.error);
```

---

## 9. TROUBLESHOOTING

### 9.1 Common Issues and Solutions

**Issue: API Key Not Working**
```
Error: "GEMINI_API_KEY environment variable is not defined"

Solution:
1. Check .env file exists in root directory
2. Verify key is set: GEMINI_API_KEY=your_actual_key
3. Restart development server: npm run dev
4. Test key at: https://ai.google.dev/
```

**Issue: Port Already in Use**
```
Error: "EADDRINUSE: address already in use :::3000"

Solution:
# Find process using port 3000
netstat -ano | findstr :3000  # Windows
lsof -i :3000                 # Mac/Linux

# Kill the process
taskkill /PID <PID> /F        # Windows
kill -9 <PID>                 # Mac/Linux

# Or change port in server.ts
const PORT = 3001;
```

**Issue: Dark Mode Not Working**
```
Problem: Theme toggle doesn't change appearance

Solution:
1. Check localStorage: localStorage.getItem('darkMode')
2. Verify Tailwind dark: classes in components
3. Check browser DevTools for console errors
4. Clear browser cache and reload
```

**Issue: AI Responses Too Slow**
```
Problem: Gemini API taking >5 seconds

Solution:
1. Check internet connection
2. Verify API quota not exceeded
3. Consider implementing request caching
4. Use gemini-flash model instead of gemini-pro
```

**Issue: Appointments Not Showing**
```
Problem: Dashboard shows "No appointments"

Solution:
1. Check hospital_data.json exists
2. Verify patient ID matches appointments
3. Check API endpoint: GET /api/db
4. Inspect Network tab in DevTools
5. Clear localStorage and re-login
```

### 9.2 Performance Optimization

**Lazy Loading:**
```tsx
import { lazy, Suspense } from 'react';

const AdminDashboard = lazy(() => import('./components/AdminDashboard'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <AdminDashboard />
    </Suspense>
  );
}
```

**Image Optimization:**
```tsx
// Use WebP format with fallback
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="..." loading="lazy" />
</picture>
```

**API Response Caching:**
```typescript
const cache = new Map();

async function fetchWithCache(url: string) {
  if (cache.has(url)) {
    return cache.get(url);
  }
  const response = await fetch(url);
  const data = await response.json();
  cache.set(url, data);
  return data;
}
```

### 9.3 Debugging Tips

**Enable Verbose Logging:**
```typescript
// server.ts
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});
```

**React DevTools:**
```bash
# Install React DevTools browser extension
# Chrome: https://chrome.google.com/webstore/detail/react-developer-tools/...
# Firefox: https://addons.mozilla.org/firefox/addon/react-devtools/
```

**Network Monitoring:**
```typescript
// Log all Axios requests
axios.interceptors.request.use(config => {
  console.log('API Request:', config.url, config.data);
  return config;
});

axios.interceptors.response.use(
  response => {
    console.log('API Response:', response.data);
    return response;
  },
  error => {
    console.error('API Error:', error.response?.data);
    return Promise.reject(error);
  }
);
```

---

## CONCLUSION

This technical documentation provides comprehensive guidance for understanding, deploying, and maintaining the AI-Powered Hospital Appointment Booking System. For additional support or questions, please contact:

**Developer:** K Dinesh  
**Email:** dineshstar979@gmail.com  
**Internship ID:** BOV26O-0502  
**Organization:** Brainovision Solutions India Pvt. Ltd.

---

**Document Version:** 1.0.0  
**Last Updated:** July 27, 2026  
**Status:** Production Ready

---

END OF TECHNICAL DOCUMENTATION
