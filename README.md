# 🏥 AI-Powered Hospital Appointment Booking System

[![React](https://img.shields.io/badge/React-19.0.1-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-blue.svg)](https://www.typescriptlang.org/)
[![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini%202.0-orange.svg)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A comprehensive healthcare management platform leveraging **Google Gemini AI** to provide intelligent patient care, automated appointment scheduling, and clinical decision support.

---

## 🌟 Key Features

### 🤖 AI-Powered Intelligence
- **AI Symptom Checker** - Intelligent triage with automatic department routing
- **Dr. Gemini Chatbot** - 24/7 AI health assistant for patient queries
- **Medical Report Summarizer** - Plain-language interpretation of lab results
- **Personalized Health Tips** - Department-specific wellness recommendations

### 👥 Multi-Role System
- **Patient Dashboard** - Book appointments, check symptoms, view health records
- **Doctor Dashboard** - Manage patient queue, access AI briefs, view analytics
- **Admin Dashboard** - Approve doctors, monitor platform, configure settings

### 📅 Smart Appointment Management
- Real-time availability checking
- AI-powered pre-screening
- Automatic conflict prevention
- Multi-status tracking (UPCOMING, COMPLETED, CANCELLED)

### 📊 Comprehensive Analytics
- Patient appointment metrics
- Doctor performance tracking
- Department-wise distribution
- Interactive charts (Recharts)

### 🎨 Modern UI/UX
- Responsive design (mobile, tablet, desktop)
- Dark mode support
- Smooth animations (Framer Motion)
- Toast notifications
- Loading states & skeletons

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **npm** or **yarn**
- **Google Gemini API Key** ([Get one free](https://ai.google.dev/))

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd AI-Powered_Hospital_Appointment_Booking_System

# 2. Install dependencies
npm install

# 3. Create environment file
# Create a new file named .env in the root directory

# 4. Add your Gemini API key to .env
# Open .env and add:
GEMINI_API_KEY=your_api_key_here

# 5. Start development server
npm run dev

# 6. Open browser at http://localhost:3000
```

### Default Login Credentials

| Role | Email | Password |
|------|-------|----------|
| **Patient** | patient123@gmail.com | patient123 |
| **Doctor** | sarah.j@medicare.com | Doctor@123 |
| **Admin** | admin@medicare.com | Admin@123 |

---

## 🛠️ Technology Stack

### Frontend
- **React 19** - UI component library
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Fast build tool
- **Framer Motion** - Animation library
- **Recharts** - Data visualization
- **Lucide React** - Icon library
- **Axios** - HTTP client

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Server-side types

### AI/ML
- **Google Gemini 2.0 Flash** - Advanced LLM for:
  - Symptom analysis
  - Medical report summarization
  - Health consultations
  - Clinical decision support

### Database
- JSON file storage (development)
- PostgreSQL/MongoDB ready (production)

---

## 📁 Project Structure

```
AI-Powered_Hospital_Appointment_Booking_System/
│
├── src/
│   ├── components/           # React components
│   │   ├── AdminDashboard.tsx
│   │   ├── AIChatbot.tsx
│   │   ├── AuthScreens.tsx
│   │   ├── DoctorDashboard.tsx
│   │   ├── PatientDashboard.tsx
│   │   ├── ReportSummarizer.tsx
│   │   ├── Sidebar.tsx
│   │   └── SymptomChecker.tsx
│   │
│   ├── data/                 # Static data & specs
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   ├── types.ts              # TypeScript definitions
│   └── index.css             # Global styles
│
├── server.ts                 # Express backend
├── hospital_data.json        # Database (auto-generated)
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
└── .env                      # Environment variables
```

---

## 🎯 Core Features

### For Patients

**Dashboard**
- View upcoming and past appointments
- Track appointment status
- Access personal health profile
- Get AI-generated health tips

**AI Symptom Checker**
- Enter symptoms, age, and gender
- Receive clinical assessment (not a diagnosis)
- Get recommended medical specialty
- Urgency level (LOW/MEDIUM/HIGH)
- Self-care advice and red flags

**Dr. Gemini Chatbot**
- Ask health-related questions
- Get explanations of medical terms
- Receive lifestyle recommendations
- Platform navigation help

**Appointment Booking**
- Search doctors by specialty
- Filter by availability and rating
- Select date and time slot
- Optional symptom input with AI analysis

**Medical Reports**
- Upload lab results or clinical notes
- Get AI-powered plain-language summaries
- View report history
- Suggested questions for doctor

### For Doctors

**Dashboard**
- Today's patient queue
- Weekly consultation analytics
- Performance metrics
- Patient growth trends

**Appointment Management**
- View patient details
- Access AI pre-consultation briefs
- Complete or reject appointments
- One-click status updates

**Availability Management**
- Set available days
- Configure time slots
- Block holidays or time off

### For Administrators

**Dashboard**
- System-wide analytics
- Platform metrics (doctors, patients, appointments)
- Department distribution charts
- Recent activity feed

**Doctor Management**
- Review doctor applications
- Approve or reject credentials
- Manage doctor profiles
- Remove inactive doctors

**Patient Registry**
- View all registered patients
- Search and filter
- Access patient details

**System Settings**
- Configure hospital name
- Set appointment limits
- Enable/disable notifications
- Emergency contact management

---

## 🔌 API Documentation

### Authentication

**POST /api/auth/login**
```json
{
  "email": "patient123@gmail.com",
  "password": "patient123",
  "role": "PATIENT"
}
```

**POST /api/auth/register/patient**
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

### AI Integration

**POST /api/gemini/symptom-check**
```json
{
  "symptoms": "Chest tightness when running",
  "patientAge": "24",
  "patientGender": "Male"
}
```

**POST /api/gemini/chat**
```json
{
  "messages": [
    { "role": "user", "text": "What causes high blood pressure?" }
  ]
}
```

**POST /api/gemini/summarize-report**
```json
{
  "reportText": "WBC: 6.8 x10^3/uL\nRBC: 4.95 x10^6/uL...",
  "reportType": "Laboratory Report"
}
```

### Appointments

**POST /api/appointments** - Create appointment  
**PUT /api/appointments/:id** - Update appointment  
**GET /api/db** - Fetch all data  
**DELETE /api/doctors/:id** - Delete doctor  
**PUT /api/doctors/:id** - Update doctor

[See full API documentation →](./TECHNICAL_DOCUMENTATION.md)

---

## 🧪 Testing

### Manual Testing

```bash
# Run development server
npm run dev

# Test different user roles:
# 1. Login as Patient - Book appointment
# 2. Login as Doctor - View patient queue
# 3. Login as Admin - Approve doctor
```

### Test Scenarios

✅ User authentication (all roles)  
✅ Appointment booking flow  
✅ AI symptom checker  
✅ AI chatbot conversation  
✅ Medical report summarization  
✅ Dark mode toggle  
✅ Mobile responsiveness (320px to 4K displays)  

---

## 🚢 Deployment

### Production Build

```bash
# Build frontend and backend
npm run build

# Output: dist/ folder
# - dist/client/ (frontend)
# - dist/server.cjs (backend)

# Start production server
npm start
```

### Environment Variables

```bash
# .env file
GEMINI_API_KEY=your_api_key_here
PORT=3000
NODE_ENV=production
```

### Deploy to Cloud

**Option 1: Vercel** (Frontend + Serverless Functions)
```bash
npm install -g vercel
vercel --prod
```

**Option 2: Heroku** (Full-stack)
```bash
heroku create hospital-booking-ai
heroku config:set GEMINI_API_KEY=your_key
git push heroku main
heroku open
```

**Option 3: Docker**
```bash
# Build image
docker build -t hospital-booking-ai .

# Run container
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key hospital-booking-ai
```

**Option 4: AWS EC2 / Azure / GCP**
```bash
# Upload code to cloud VM
# Install Node.js and dependencies
npm install
npm run build
npm start
```

[See full deployment guide →](./TECHNICAL_DOCUMENTATION.md#deployment-guide)

---

## 📖 Documentation

### 📚 Complete Documentation Set

| Document | Pages | Description |
|----------|-------|-------------|
| **[README.md](./README.md)** | 15 | Project overview and quick start guide |
| **[PROJECT_REPORT.md](./PROJECT_REPORT.md)** | 40+ | Complete internship report with objectives, implementation, and outcomes |
| **[TECHNICAL_DOCUMENTATION.md](./TECHNICAL_DOCUMENTATION.md)** | 38+ | System architecture, database schema, and API reference |
| **[CODE_DOCUMENTATION.md](./CODE_DOCUMENTATION.md)** | 64+ | Complete code examples, patterns, and best practices |

**Total: 140+ pages of professional documentation**

---

## 🔐 Security

### Current Implementation (Development)
- Email/password authentication
- Role-based access control
- Session persistence
- Server-side validation

### Production Recommendations
- JWT token authentication
- bcrypt password hashing
- HTTPS encryption
- Rate limiting
- Input sanitization
- CORS configuration

[See security best practices →](./TECHNICAL_DOCUMENTATION.md#security-implementation)

---

## 🗺️ Roadmap

### Short-term (3-6 months)
- [ ] JWT authentication
- [ ] PostgreSQL migration
- [ ] Video consultation (Twilio/Zoom)
- [ ] Email/SMS notifications
- [ ] Payment integration

### Medium-term (6-12 months)
- [ ] Voice-based symptom reporting
- [ ] Medical image analysis
- [ ] Native mobile apps (iOS/Android)
- [ ] Multi-language support
- [ ] Wearable device integration

### Long-term (1-2 years)
- [ ] Multi-hospital support
- [ ] AI diagnosis assistance for doctors
- [ ] Treatment outcome prediction
- [ ] Drug interaction checking
- [ ] Population health analytics

[See full roadmap →](./PROJECT_REPORT.md#future-enhancements)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**K Dinesh**  
Intern - Brainovision Solutions India Pvt. Ltd.  
Internship ID: BOV26O-0502  
Duration: June 1, 2026 - July 31, 2026

📧 Email: dineshstar979@gmail.com  
📱 Phone: +91 9703757210

---

## 🙏 Acknowledgments

- **Brainovision Solutions India Pvt. Ltd.** for the internship opportunity
- **Google AI** for Gemini API access
- **Open Source Community** for excellent libraries and tools

---

## 📊 Project Statistics

- **Lines of Code:** 7,500+
- **Components:** 8 major React components
- **API Endpoints:** 15+ RESTful endpoints
- **AI Features:** 4 Gemini integrations
- **Medical Specialties:** 6 departments
- **Development Time:** 320 hours (8 weeks)
- **Documentation:** 140+ pages

---

## 🐛 Known Issues & Future Improvements

Current limitations to be addressed:

- Medical report upload currently accepts text only (file upload feature planned)
- Appointment time conflict checking is basic (enhanced validation coming)
- Real-time notifications require WebSocket implementation
- Database is JSON-based (PostgreSQL migration planned for production)

**Note:** This is a development/demonstration version. Production deployment requires additional security hardening.

---

## 💡 Support & Contact

### Project Support
- 📧 **Email:** dineshstar979@gmail.com
- 📱 **Phone:** +91 9703757210
- 💬 **GitHub Issues:** For bug reports and feature requests

### Internship Program Support
- 📧 **Email:** internships@brainovision.in
- 📱 **WhatsApp:** +91 72077 75309 / +91 74169 35039
- 🌐 **Organization:** Brainovision Solutions India Pvt. Ltd.

---

## 🎓 Academic Use & Citation

This project was developed as part of an internship program at **Brainovision Solutions India Pvt. Ltd.** (June - July 2026).

If you use this project for academic or educational purposes, please cite:
```
K. Dinesh, "AI-Powered Hospital Appointment Booking System"
Brainovision Solutions India Pvt. Ltd., 2026
Internship ID: BOV26O-0502
```

---

## ⭐ Star This Project

If you find this project helpful, please consider giving it a star on GitHub!

---

## 📌 Important Notes

1. **Educational Purpose:** This is a demonstration project developed during an internship program
2. **Medical Disclaimer:** AI-generated medical advice is informational only and NOT a substitute for professional medical consultation
3. **API Key Required:** You need a Google Gemini API key to use AI features (free tier available)
4. **Development Stage:** Currently in development phase with JSON-based database
5. **Production Ready:** Requires security hardening, database migration, and deployment configuration

---

**Made with ❤️ for healthcare innovation**  
**Developed during Brainovision Solutions Internship Program**

© 2026 K Dinesh. All rights reserved.
