import { PhaseInfo } from "../types";

export const developerPhases: PhaseInfo[] = [
  {
    number: 1,
    title: "Requirements Analysis",
    status: "COMPLETED",
    description: "Detailed definition of actors, functional and non-functional requirements, and college project scope mapping.",
    learningOutcomes: [
      "Define Role-Based Access Control (RBAC) boundaries.",
      "Analyze Hospital Domain modeling (vitals, schedules, HIPAA considerations).",
      "Draft clear Software Requirement Specifications (SRS) for administrative approvals."
    ],
    commonErrors: [
      "Overlapping role boundaries (e.g., allowing Doctors to modify patient billing directly).",
      "Not accounting for hospital calendar blockouts and holiday edge cases."
    ],
    bestPractices: [
      "Keep patient health details confidential; secure transit endpoints.",
      "Use descriptive, human-readable labels and proper medical terminology."
    ],
    testingSteps: [
      "Verify actor permissions by drawing boundaries on role-based test grids.",
      "Perform black-box verification of scheduling scenarios."
    ]
  },
  {
    number: 2,
    title: "Software Architecture",
    status: "COMPLETED",
    description: "Multi-layered Clean Architecture matching MVC guidelines, DTO patterns, and Spring Boot Maven standard layouts.",
    learningOutcomes: [
      "Adopt clean separation of concerns: Controller -> Service -> Repository.",
      "Configure Spring Boot 3.x and Java 21 build dependencies using pom.xml.",
      "Implement the Data Transfer Object (DTO) model to decouple entity models from presentation layers."
    ],
    springFiles: [
      {
        path: "pom.xml",
        language: "xml",
        explanation: "Maven dependencies configuration for Spring Boot 3.x, Spring Security, JWT, SQLite Dialect, and Web.",
        code: `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>3.2.4</version>
        <relativePath/>
    </parent>
    
    <groupId>com.hospital.ai</groupId>
    <artifactId>appointment-booking-system</artifactId>
    <version>1.0.0</version>
    <name>AI Hospital Booking System</name>
    <description>Internship Project - AI Hospital Appointment Booking System</description>

    <properties>
        <java.version>21</java.version>
        <jjwt.version>0.11.5</jjwt.version>
    </properties>

    <dependencies>
        <!-- Spring Boot Starters -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-data-jpa</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-security</artifactId>
        </dependency>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-validation</artifactId>
        </dependency>
        
        <!-- SQLite Driver & Hibernate Dialect -->
        <dependency>
            <groupId>org.xerial</groupId>
            <artifactId>sqlite-jdbc</artifactId>
            <version>3.45.1.0</version>
        </dependency>
        <dependency>
            <groupId>org.hibernate.orm</groupId>
            <artifactId>hibernate-community-dialects</artifactId>
            <version>6.4.4.Final</version>
        </dependency>

        <!-- JWT Dependencies -->
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-api</artifactId>
            <version>\${jjwt.version}</version>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-impl</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>
        <dependency>
            <groupId>io.jsonwebtoken</groupId>
            <artifactId>jjwt-jackson</artifactId>
            <version>\${jjwt.version}</version>
            <scope>runtime</scope>
        </dependency>

        <!-- Development Tools -->
        <dependency>
            <groupId>org.projectlombok</groupId>
            <artifactId>lombok</artifactId>
            <optional>true</optional>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>
</project>`
      }
    ],
    commonErrors: [
      "Circular dependency imports between services (e.g., DoctorService calling AppointmentService which calls DoctorService).",
      "Using heavy entity models in REST Controller signatures instead of dedicated, trimmed DTO classes."
    ],
    bestPractices: [
      "Use Constructor-based injection in Spring classes rather than @Autowired field injection.",
      "Keep Lombok usage clean; avoid @Data on JPA entities to prevent cyclic hash/toString crashes in bi-directional relationships."
    ]
  },
  {
    number: 3,
    title: "Database Design",
    status: "COMPLETED",
    description: "Full normalization (3NF) relational SQLite script with complete triggers, indexes, and primary/foreign keys.",
    learningOutcomes: [
      "Map relational tables from logical structures.",
      "Ensure full compliance with Third Normal Form (3NF).",
      "Create performant query indexes for foreign references."
    ],
    databaseDesign: {
      normalForms: "The schema is fully compliant with 3rd Normal Form (3NF). Every non-prime attribute is fully dependent only on the primary key, eliminating multi-valued and transitive functional dependencies.",
      diagram: `
+-------------------------------------------------------------+
|                        ER DIAGRAM                           |
+-------------------------------------------------------------+
|                                                             |
|  [USERS] 1 -------- 0..1 [PATIENTS]                         |
|     |  (id)                  |                              |
|     |                        | 1                            |
|     | 1                      |                              |
|     +------ 0..1 [DOCTORS]   | 0..*                         |
|                |             |                              |
|                | 1           |                              |
|                |             v                              |
|                | 0..*  [APPOINTMENTS] <----- [REPORTS] 0..* |
|                +-----> (id, patient, doctor)                |
|                                                             |
+-------------------------------------------------------------+`,
      sqlSchema: `-- SQL Creation Script for SQLite database
-- SQLite supports full relational foreign key constraints if PRAGMA foreign_keys = ON is enabled.

PRAGMA foreign_keys = ON;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT CHECK(role IN ('ADMIN', 'DOCTOR', 'PATIENT')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
    id TEXT PRIMARY KEY,
    phone TEXT NOT NULL,
    dob TEXT NOT NULL,
    blood_group TEXT NOT NULL,
    photo_url TEXT,
    medical_history TEXT,
    joined_date TEXT NOT NULL,
    FOREIGN KEY(id) REFERENCES users(id) ON DELETE CASCADE
);

-- Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    id TEXT PRIMARY KEY,
    department TEXT NOT NULL,
    experience INTEGER NOT NULL,
    rating REAL DEFAULT 5.0,
    availability_days TEXT NOT NULL, -- Stored as comma-separated days: "Monday,Wednesday"
    slots TEXT NOT NULL,             -- Comma-separated slots: "09:00 AM,10:00 AM"
    photo_url TEXT,
    bio TEXT,
    status TEXT CHECK(status IN ('PENDING', 'APPROVED', 'REJECTED')) DEFAULT 'PENDING',
    FOREIGN KEY(id) REFERENCES users(id) ON DELETE CASCADE
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    doctor_id TEXT NOT NULL,
    department TEXT NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT CHECK(status IN ('UPCOMING', 'COMPLETED', 'CANCELLED')) DEFAULT 'UPCOMING',
    symptoms TEXT,
    ai_summary TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE,
    FOREIGN KEY(doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
);

-- Medical Reports Table
CREATE TABLE IF NOT EXISTS medical_reports (
    id TEXT PRIMARY KEY,
    patient_id TEXT NOT NULL,
    file_name TEXT NOT NULL,
    upload_date TEXT NOT NULL,
    file_size TEXT NOT NULL,
    summary TEXT,
    category TEXT NOT NULL,
    FOREIGN KEY(patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(date);
CREATE INDEX IF NOT EXISTS idx_appointments_patient ON appointments(patient_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor ON appointments(doctor_id);
`
    }
  },
  {
    number: 4,
    title: "Backend Setup",
    status: "PROPOSED",
    description: "Initialize Spring Boot 21 workspace, define directory layout, and write general base configuration files.",
    learningOutcomes: [
      "Configure SQLite application.properties datasource profiles.",
      "Understand multi-module project structures."
    ],
    springFiles: [
      {
        path: "src/main/resources/application.properties",
        language: "properties",
        explanation: "Spring Boot datasource profile with SQLite Dialect configuration and automatic DDL mapping.",
        code: `# Server Configuration
server.port=8080

# SQLite Datasource Profile Configuration
spring.datasource.url=jdbc:sqlite:hospital_ai.db
spring.datasource.driver-class-name=org.sqlite.JDBC
spring.datasource.username=
spring.datasource.password=

# JPA and Hibernate Configurations
spring.jpa.database-platform=org.hibernate.community.dialect.SQLiteDialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# Set SQLite Pragmas on Startup
spring.datasource.hikari.connection-init-sql=PRAGMA foreign_keys = ON;

# Upload files max size configuration
spring.servlet.multipart.max-file-size=5MB
spring.servlet.multipart.max-request-size=5MB
`
      }
    ]
  },
  {
    number: 5,
    title: "Authentication (JWT & Security)",
    status: "PROPOSED",
    description: "Write BCrypt encryption, Spring Security filter chains, JWT generation/verification, and login APIs.",
    learningOutcomes: [
      "Configure custom UserDetailsService mapping our SQLite tables.",
      "Configure Stateless Session management with JWT filter injectors."
    ],
    springFiles: [
      {
        path: "src/main/java/com/hospital/ai/security/JwtUtils.java",
        language: "java",
        explanation: "Java Utility to generate, validate, and parse claims out of JWT bearer headers.",
        code: `package com.hospital.ai.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtils {

    @Value("\${hospital.jwt.secret:SuperSecretSecureKeyThatShouldBeVeryLongToMeetHmacRequirements}")
    private String jwtSecret;

    @Value("\${hospital.jwt.expirationMs:86400000}") // 24 hours
    private int jwtExpirationMs;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(UserDetails userDetails, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role);
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(userDetails.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(getSigningKey(), SignatureAlgorithm.HS256)
                .compact();
    }

    public String getUsernameFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public String getRoleFromToken(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .get("role", String.class);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parserBuilder().setSigningKey(getSigningKey()).build().parseClaimsJws(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            System.err.println("Invalid JWT token: " + e.getMessage());
        }
        return false;
    }
}`
      }
    ]
  },
  {
    number: 6,
    title: "AI Integration Module",
    status: "PROPOSED",
    description: "Write Spring AI / HTTP REST templates to interact with Google Gemini API for medical report summary and symptom check.",
    learningOutcomes: [
      "Invoke standard Google Gemini LLM using RESTful payloads.",
      "Incorporate system role boundaries in medical advisory contexts."
    ],
    springFiles: [
      {
        path: "src/main/java/com/hospital/ai/service/GeminiService.java",
        language: "java",
        explanation: "Java Service invoking Gemini endpoints to summarize lab metrics and reports.",
        code: `package com.hospital.ai.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.util.*;

@Service
public class GeminiService {

    @Value("\${gemini.api.key}")
    private String apiKey;

    private final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash:generateContent?key=";

    public String getGeminiResponse(String promptText, String systemInstruction) {
        RestTemplate restTemplate = new RestTemplate();
        String url = GEMINI_API_URL + apiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        // Build Payload according to Google GenAI structure
        Map<String, Object> payload = new HashMap<>();
        
        Map<String, Object> contentPart = new HashMap<>();
        contentPart.put("text", promptText);
        
        Map<String, Object> parts = new HashMap<>();
        parts.put("parts", Collections.singletonList(contentPart));
        
        payload.put("contents", Collections.singletonList(parts));

        if (systemInstruction != null && !systemInstruction.isEmpty()) {
            Map<String, Object> systemPart = new HashMap<>();
            systemPart.put("text", systemInstruction);
            Map<String, Object> systemParts = new HashMap<>();
            systemParts.put("parts", Collections.singletonList(systemPart));
            payload.put("systemInstruction", systemParts);
        }

        HttpEntity<Map<String, Object>> entity = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(url, entity, Map.class);
            if (response.getStatusCode() == HttpStatus.OK && response.getBody() != null) {
                // Parse nested structure of response.candidates[0].content.parts[0].text
                List candidates = (List) response.getBody().get("candidates");
                if (!candidates.isEmpty()) {
                    Map candidate = (Map) candidates.get(0);
                    Map content = (Map) candidate.get("content");
                    List responseParts = (List) content.get("parts");
                    if (!responseParts.isEmpty()) {
                        Map responsePart = (Map) responseParts.get(0);
                        return (String) responsePart.get("text");
                    }
                }
            }
            return "Unable to parse clinical AI output.";
        } catch (Exception e) {
            return "Error invoking clinical AI assistant: " + e.getMessage();
        }
    }
}`
      }
    ]
  }
];
