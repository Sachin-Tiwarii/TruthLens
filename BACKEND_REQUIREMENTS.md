# TruthLens — Backend Development Requirements

## 1. Project Overview

**Project:** TruthLens  
**Category:** AI-Generated Media Detection & Verification Platform  
**Frontend:** React + Vite  
**Frontend styling:** CSS  
**Routing:** React Router DOM  
**HTTP client:** Axios  
**Backend API base URL (development):** `http://localhost:5000/api`

### Purpose

TruthLens is an AI-powered media verification platform designed to identify potentially AI-generated or digitally manipulated images, audio recordings, and videos.

The platform should combine multiple AI detection models and digital forensic techniques to examine uploaded media and produce an explainable verification report.

The system should not rely on only one detection model. It should validate findings across multiple available models and forensic checks to improve reliability.

### Main objectives

- Detect potentially AI-generated images.
- Detect synthetic or manipulated audio.
- Identify potentially AI-generated or manipulated videos.
- Perform media-specific forensic examinations.
- Combine results from multiple detection models.
- Generate a confidence score and an understandable verdict.
- Provide supporting evidence for the assessment.
- Store analysis history for authenticated users.
- Generate downloadable verification reports.

**Important:** Detection is probabilistic. The platform must not claim that an AI model can establish authenticity with absolute certainty.

---

## 2. Existing Frontend Structure

The backend should be designed to integrate with the following frontend modules.

| Frontend file | Responsibility |
|---|---|
| `src/App.jsx` | Application routing |
| `src/context/AuthContext.jsx` | Authentication state |
| `src/services/api.js` | Centralized API client |
| `src/services/authService.js` | Login and registration requests |
| `src/services/analysisService.js` | Analysis API requests |
| `src/pages/Login.jsx` | User login |
| `src/pages/Register.jsx` | User registration |
| `src/pages/Dashboard.jsx` | User dashboard |
| `src/pages/Analyze.jsx` | Media upload and analysis |
| `src/pages/Results.jsx` | Analysis result |
| `src/pages/History.jsx` | Previous analyses |
| `src/pages/Report.jsx` | Detailed verification report |
| `src/data/mockData.js` | Currently used demonstration data |

### Current frontend limitations

The existing frontend is primarily a UI implementation.

The backend team must account for these integration changes:

1. The current Analyze page stores file metadata in `sessionStorage`; it does not upload the actual file to a server.
2. The current dashboard and history use sample/mock data.
3. The current demo login is a frontend demonstration, not verified backend authentication.
4. Results currently use demonstration data rather than actual AI model output.
5. The backend must return real analysis IDs and results so the frontend can replace its mock data.

---

## 3. Recommended Backend Architecture

The backend should separate authentication, media handling, AI inference, result aggregation, and report generation.

Suggested architecture:

```text
                 TRUTHLENS FRONTEND
                    React + Vite
                         |
                         | REST API
                         |
                  BACKEND SERVER
                   Express / API
                         |
          +--------------+--------------+
          |              |              |
      Auth Service   Media Service   Analysis Service
          |              |              |
       Database      File Storage    AI Orchestrator
                                         |
                           +-------------+-------------+
                           |             |             |
                       Image Models  Audio Models  Video Models
                           |             |             |
                           +-------------+-------------+
                                         |
                                  Result Aggregator
                                         |
                              Evidence & Confidence
                                         |
                                  Report Service
                                         |
                                      Database
```

### Suggested technology stack

The team can choose its final stack, but the following is a practical option:

| Component | Suggested technology |
|---|---|
| Backend API | Node.js + Express |
| Database | MongoDB |
| Authentication | JWT + secure cookies |
| Password hashing | bcrypt |
| File upload | Multer |
| File storage | Local storage for development; cloud/object storage for deployment |
| AI inference | Python + FastAPI |
| Background jobs | Redis + BullMQ or another job queue |
| API communication | REST + JSON |
| Report generation | PDF generation library |

The Node.js API should coordinate requests while Python-based services can handle machine-learning inference if that matches the AI team's implementation.

These are recommendations, not mandatory dependencies.

---

## 4. Authentication System

The application should support user registration, login, logout, and authenticated access to private workspace data.

### 4.1 Registration

**Endpoint**

`POST /api/auth/register`

**Request**

```json
{
  "name": "Sachin Tiwari",
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

**Expected response — 201**

```json
{
  "success": true,
  "message": "Account created successfully",
  "user": {
    "id": "USER_ID",
    "name": "Sachin Tiwari",
    "email": "user@example.com"
  }
}
```

Requirements:

- Validate name, email, and password.
- Reject duplicate email addresses.
- Hash passwords before storing them.
- Never return passwords or password hashes.
- Validate all user inputs.

### 4.2 Login

**Endpoint**

`POST /api/auth/login`

**Request**

```json
{
  "email": "user@example.com",
  "password": "StrongPassword123"
}
```

**Expected response**

```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "USER_ID",
    "name": "Sachin Tiwari",
    "email": "user@example.com"
  }
}
```

Authentication can use secure, HttpOnly cookies or a properly implemented token strategy.

If cookies are used, configure:

- HttpOnly
- Secure in production
- Appropriate SameSite policy
- Correct CORS credentials
- Access and refresh token expiry

### 4.3 Current user

**Endpoint**

`GET /api/auth/me`

Returns the currently authenticated user.

### 4.4 Logout

**Endpoint**

`POST /api/auth/logout`

Invalidates the session or refresh token and clears authentication cookies.

### Authentication rules

- Dashboard, analysis history, and private reports must require authentication.
- A user must only access their own private analyses.
- Never trust a user ID supplied by the frontend to establish ownership.
- The server must derive the authenticated user's identity from the verified session/token.

### Demo access

The current frontend contains a demo-login shortcut.

The team can implement a dedicated demo account or a restricted demo mode.

If implementing a demo account:

- Use a seeded demo account with non-sensitive sample data.
- Do not bypass authentication middleware.
- Do not expose production user information.
- Clearly distinguish demonstration results from actual AI analysis.

---

## 5. Media Upload System

This is one of the most important backend modules.

The platform must accept:

1. Images
2. Audio recordings
3. Videos

### 5.1 Upload endpoint

**Endpoint**

`POST /api/analysis`

**Content-Type**

`multipart/form-data`

### Expected form fields

| Field | Type | Description |
|---|---|---|
| `file` | File | Actual uploaded media |
| `purpose` | String | Reason for verification |
| `mediaType` | String (optional) | Image, Audio, or Video |

Example purposes:

- General verification
- Check for AI-generated content
- Check for possible manipulation

### Example frontend request

```javascript
const formData = new FormData()

formData.append('file', file)
formData.append('purpose', purpose)

const response = await api.post('/analysis', formData)
```

The API client should allow the browser to set the multipart boundary automatically.

### 5.2 File validation

The backend must independently validate uploaded files.

Frontend validation alone is not sufficient.

Recommended initial limits:

- Maximum file size: 100 MB.
- Accepted categories: image, audio, video.
- Validate actual file signatures/MIME types, not only file extensions.
- Reject unsupported or corrupted files.
- Generate unique storage filenames.
- Never trust the original filename as a storage path.
- Apply request limits and upload timeouts.

Potential supported formats:

| Media | Formats |
|---|---|
| Images | JPG, JPEG, PNG, WEBP |
| Audio | MP3, WAV, M4A, AAC, OGG |
| Video | MP4, MOV, WEBM, MKV |

The AI team should confirm the formats supported by its actual models and preprocessing pipeline.

### 5.3 Upload response

After successful upload, create an analysis record and return an analysis ID.

```json
{
  "success": true,
  "message": "Media uploaded successfully",
  "analysis": {
    "id": "ANALYSIS_ID",
    "status": "queued",
    "fileName": "example-video.mp4",
    "mediaType": "Video",
    "fileSize": 24500000,
    "purpose": "General verification",
    "createdAt": "2026-11-01T10:00:00.000Z"
  }
}
```

The frontend should navigate to the result page using the returned ID:

`/results/ANALYSIS_ID`

Do not assume that upload completion means AI analysis has finished.

---

## 6. AI Detection and Analysis Engine

The AI team should implement a media-specific analysis pipeline.

### 6.1 Image detection

The image pipeline should examine available signals such as:

- AI-generation detection model predictions.
- Image manipulation indicators.
- Visual inconsistencies and artifacts.
- Metadata and EXIF information, when available.
- Compression and image-format characteristics.
- Other applicable forensic indicators.

Possible output:

```json
{
  "mediaType": "Image",
  "models": [
    {
      "modelName": "Image Detection Model A",
      "prediction": "likely_ai_generated",
      "confidence": 0.91
    },
    {
      "modelName": "Image Detection Model B",
      "prediction": "likely_real",
      "confidence": 0.64
    }
  ],
  "forensicChecks": [
    {
      "name": "Metadata examination",
      "status": "completed",
      "finding": "Limited metadata available"
    }
  ]
}
```

### 6.2 Audio detection

The audio pipeline should examine available signals such as:

- Synthetic speech detection.
- Voice-generation artifacts.
- Spectral and frequency characteristics.
- Audio compression artifacts.
- Abnormal speech patterns.
- Applicable metadata and forensic indicators.

The system should distinguish between detecting synthetic speech and proving who spoke.

### 6.3 Video detection

The video pipeline should examine:

- Frame-level AI-generation indicators.
- Face and visual consistency.
- Temporal inconsistencies between frames.
- Audio-video synchronization, when audio is present.
- Deepfake or face-manipulation indicators.
- Video metadata and compression characteristics.

For larger videos, the AI team may need to sample frames and analyze audio separately.

The system should preserve timestamps or frame references for evidence wherever possible.

### Important AI implementation requirement

Do not assume that every model works with every media format.

The orchestrator should select the appropriate pipeline according to the uploaded media type.

If a model is unavailable, fails, or does not support the media, record that condition instead of silently inventing a result.

---

## 7. Multi-Model Verification and Result Aggregation

TruthLens should combine multiple model outputs and forensic checks.

The result aggregator should:

1. Collect predictions from the available models.
2. Normalize model outputs into a consistent schema.
3. Record individual model confidence values.
4. Identify agreement and disagreement.
5. Consider the quality and reliability of each model.
6. Produce an overall assessment.
7. Include supporting evidence.
8. Represent uncertainty explicitly.

### Recommended verdict categories

Use consistent categories throughout the API:

| Verdict | Meaning |
|---|---|
| `likely_ai_generated` | Evidence suggests synthetic generation |
| `likely_manipulated` | Evidence suggests editing or manipulation |
| `likely_authentic` | Available evidence supports authenticity |
| `inconclusive` | Evidence is insufficient or conflicting |

These are assessments, not absolute proof.

### Confidence score

Return a normalized score from 0 to 100.

Example:

```json
{
  "verdict": "likely_ai_generated",
  "confidence": 87,
  "confidenceMeaning": "high",
  "explanation": "Multiple available checks indicate characteristics associated with synthetic media."
}
```

Important:

- Do not simply average all model confidence scores.
- Different models may have different calibration and reliability.
- Account for disagreement, missing results, and unsupported inputs.
- Document the aggregation methodology.
- Avoid describing a model's confidence as the probability that the media is fake unless it has been appropriately calibrated for that interpretation.

---

## 8. Explainable Verification Report

Each completed analysis must produce a structured report.

### Required report sections

1. Analysis identification
2. File information
3. Media type
4. Overall verdict
5. Confidence score
6. Short explanation
7. Individual model results
8. Forensic examination results
9. Supporting evidence
10. Model agreement/disagreement
11. Limitations and uncertainty
12. Analysis timestamp

### Example result response

**Endpoint**

`GET /api/analysis/:id`

```json
{
  "success": true,
  "analysis": {
    "id": "ANALYSIS_ID",
    "fileName": "sample-image.jpg",
    "mediaType": "Image",
    "fileSize": 2500000,
    "purpose": "General verification",
    "status": "completed",
    "result": {
      "verdict": "likely_ai_generated",
      "confidence": 87,
      "confidenceMeaning": "high",
      "summary": "The available models detected multiple characteristics associated with AI-generated imagery.",
      "modelResults": [
        {
          "modelName": "Image Detection Model A",
          "prediction": "likely_ai_generated",
          "confidence": 91,
          "status": "completed"
        },
        {
          "modelName": "Image Detection Model B",
          "prediction": "likely_ai_generated",
          "confidence": 84,
          "status": "completed"
        }
      ],
      "evidence": [
        {
          "title": "Visual artifact examination",
          "description": "Detected visual patterns requiring further verification.",
          "severity": "medium",
          "source": "forensic_check"
        }
      ],
      "limitations": [
        "Automated detection cannot establish authenticity with absolute certainty."
      ]
    },
    "createdAt": "2026-11-01T10:00:00.000Z",
    "completedAt": "2026-11-01T10:00:25.000Z"
  }
}
```

The above values are illustrative examples only. The backend must return actual model outputs.

---

## 9. Asynchronous Analysis and Job Status

AI inference may take several seconds or longer, especially for video.

The API should support asynchronous processing.

### Recommended status lifecycle

```text
UPLOADED
    |
    v
QUEUED
    |
    v
PROCESSING
    |
    +-----------> FAILED
    |
    v
AGGREGATING
    |
    v
COMPLETED
```

Recommended status values:

- `queued`
- `processing`
- `aggregating`
- `completed`
- `failed`

### Status endpoint

`GET /api/analysis/:id/status`

Example:

```json
{
  "success": true,
  "analysisId": "ANALYSIS_ID",
  "status": "processing",
  "progress": 65,
  "message": "Examining media with available detection models."
}
```

Progress is optional. If included, it should represent actual pipeline progress rather than an arbitrary animation.

The frontend can poll this endpoint until the analysis is completed or failed.

Alternative: Server-Sent Events or WebSockets can be introduced later for real-time updates.

---

## 10. Dashboard API

The dashboard must display the authenticated user's actual activity.

**Endpoint**

`GET /api/dashboard`

Example:

```json
{
  "success": true,
  "stats": {
    "totalAnalyses": 24,
    "thisMonth": 8,
    "mediaFormats": 3
  },
  "recentAnalyses": [
    {
      "id": "ANALYSIS_ID",
      "fileName": "sample-video.mp4",
      "mediaType": "Video",
      "verdict": "likely_manipulated",
      "status": "completed",
      "createdAt": "2026-11-01T10:00:00.000Z"
    }
  ]
}
```

Requirements:

- Return data only for the authenticated user.
- Calculate statistics from stored records.
- Include recent analysis records.
- Do not use hardcoded demonstration counts in production.

---

## 11. Analysis History API

**Endpoint**

`GET /api/analysis/history`

Recommended query parameters:

| Parameter | Purpose |
|---|---|
| `page` | Current page |
| `limit` | Number of records |
| `type` | Image, Audio, Video |
| `status` | Analysis status |
| `verdict` | Assessment category |
| `search` | Search by filename |

Example:

`GET /api/analysis/history?page=1&limit=10&type=Image`

Example response:

```json
{
  "success": true,
  "analyses": [
    {
      "id": "ANALYSIS_ID",
      "fileName": "sample-image.png",
      "mediaType": "Image",
      "verdict": "likely_ai_generated",
      "confidence": 87,
      "status": "completed",
      "createdAt": "2026-11-01T10:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 24,
    "totalPages": 3
  }
}
```

History must support searching, filtering, and pagination.

---

## 12. Report API

### Get a detailed report

`GET /api/analysis/:id/report`

Returns the complete report for the selected analysis.

### Download PDF

`GET /api/analysis/:id/report/pdf`

Returns a downloadable PDF report with:

- TruthLens branding.
- Analysis ID.
- File information.
- Verdict and confidence.
- Model results.
- Forensic evidence.
- Limitations.
- Date and time.

Only the analysis owner or an explicitly authorized user should be able to download the report.

---

## 13. Database Design

Suggested MongoDB collections:

### Users

```json
{
  "_id": "USER_ID",
  "name": "Sachin Tiwari",
  "email": "user@example.com",
  "password": "HASHED_PASSWORD",
  "createdAt": "DATE",
  "updatedAt": "DATE"
}
```

Never store plaintext passwords.

### Analyses

```json
{
  "_id": "ANALYSIS_ID",
  "userId": "USER_ID",
  "fileName": "sample-video.mp4",
  "storedFileName": "generated-unique-name",
  "storageKey": "PRIVATE_STORAGE_KEY",
  "mediaType": "Video",
  "mimeType": "video/mp4",
  "fileSize": 24500000,
  "purpose": "General verification",
  "status": "completed",
  "verdict": "likely_manipulated",
  "confidence": 82,
  "createdAt": "DATE",
  "completedAt": "DATE"
}
```

### AnalysisResults

```json
{
  "_id": "RESULT_ID",
  "analysisId": "ANALYSIS_ID",
  "modelResults": [],
  "forensicChecks": [],
  "evidence": [],
  "summary": "Analysis explanation",
  "limitations": [],
  "aggregationMethod": "DOCUMENTED_METHOD",
  "createdAt": "DATE"
}
```

### Suggested database relationships

- One user can have multiple analyses.
- One analysis belongs to one user.
- One analysis can have multiple model results.
- One analysis can have multiple forensic findings.
- One analysis should have one aggregated final result.

Use indexes for email, user ID, analysis creation date, and frequently queried status fields.

---

## 14. Error Handling

All API responses should use a consistent structure.

### Successful response

```json
{
  "success": true,
  "message": "Request completed successfully",
  "data": {}
}
```

### Error response

```json
{
  "success": false,
  "message": "File size exceeds the allowed limit",
  "error": {
    "code": "FILE_TOO_LARGE"
  }
}
```

Recommended HTTP status codes:

| Status | Meaning |
|---|---|
| 200 | Successful request |
| 201 | Resource created |
| 400 | Invalid request |
| 401 | Not authenticated |
| 403 | Access denied |
| 404 | Resource not found |
| 413 | File too large |
| 415 | Unsupported media type |
| 422 | Validation failed |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
| 503 | Analysis service unavailable |

Do not expose stack traces, secrets, internal file paths, or private model service details in production responses.

---

## 15. Security and Privacy

Security must be considered from the beginning.

Required protections:

- Password hashing.
- Authentication and authorization middleware.
- Ownership checks for all analysis and report endpoints.
- File size and MIME validation.
- File-signature verification.
- Randomized storage filenames.
- Rate limiting.
- CORS restricted to approved frontend origins.
- Secure cookie configuration if cookies are used.
- Request validation.
- Safe error handling.
- Private file storage.
- No public exposure of uploaded media by default.
- Temporary file cleanup.
- Protection against malicious file uploads.
- Secrets stored in environment variables.
- HTTPS in production.

### File retention

Define a retention policy with the team.

Uploaded media should not remain on the server indefinitely without a reason. Support deletion and cleanup according to the chosen retention policy.

Do not use user-uploaded media for model training unless users have been explicitly informed and have provided the required consent.

---

## 16. Environment Variables

Example backend `.env`:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string

CLIENT_ORIGIN=http://localhost:5173

JWT_ACCESS_SECRET=your_access_secret
JWT_REFRESH_SECRET=your_refresh_secret

UPLOAD_DIR=uploads
MAX_FILE_SIZE=104857600

AI_SERVICE_URL=http://localhost:8000
```

These are illustrative configuration names. Adapt them to the implementation.

Never commit `.env` to GitHub.

Provide `.env.example` with placeholder values.

---

## 17. Frontend Integration Contract

The frontend currently uses:

```javascript
// src/services/api.js
```

Recommended API base URL:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

The Axios client should handle:

- Base URL configuration.
- Authentication credentials when cookie authentication is used.
- Consistent API errors.
- Appropriate request and response handling.

### Required API endpoint summary

| Method | Endpoint | Purpose |
|---|---|---|
| POST | `/auth/register` | Register |
| POST | `/auth/login` | Login |
| GET | `/auth/me` | Current user |
| POST | `/auth/logout` | Logout |
| POST | `/analysis` | Upload media and create analysis |
| GET | `/analysis/:id` | Fetch analysis result |
| GET | `/analysis/:id/status` | Fetch processing status |
| GET | `/analysis/history` | Fetch user history |
| GET | `/dashboard` | Dashboard statistics |
| GET | `/analysis/:id/report` | Fetch detailed report |
| GET | `/analysis/:id/report/pdf` | Download report |

### Important integration change

The current frontend navigates to:

`/results/new`

After backend integration, replace this with:

`/results/${response.data.analysis.id}`

The frontend should then retrieve the real analysis using the returned ID.

The actual uploaded `File` object must be sent using `FormData`. Storing only its name, type, and size in sessionStorage is not sufficient for backend analysis.

---

## 18. Suggested Backend Folder Structure

One possible Node.js implementation:

```text
backend/
│
├── src/
│   ├── config/
│   │   ├── database.js
│   │   └── environment.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── analysisController.js
│   │   ├── dashboardController.js
│   │   └── reportController.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── uploadMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   ├── Analysis.js
│   │   └── AnalysisResult.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── analysisRoutes.js
│   │   ├── dashboardRoutes.js
│   │   └── reportRoutes.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── mediaService.js
│   │   ├── analysisService.js
│   │   ├── aiOrchestrator.js
│   │   ├── resultAggregator.js
│   │   └── reportService.js
│   │
│   ├── utils/
│   │   ├── ApiError.js
│   │   └── asyncHandler.js
│   │
│   └── app.js
│
├── uploads/
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

If AI inference runs in Python, maintain a separate AI service with its own requirements and deployment configuration.

---

## 19. Testing Requirements

Before frontend integration is considered complete, test:

### Authentication
- Successful registration.
- Duplicate email rejection.
- Successful login.
- Incorrect password rejection.
- Session persistence.
- Logout.
- Unauthorized access rejection.

### Upload
- Valid image upload.
- Valid audio upload.
- Valid video upload.
- Unsupported file rejection.
- Oversized file rejection.
- Corrupted file rejection.
- Unauthorized upload rejection.

### AI processing
- Successful image analysis.
- Successful audio analysis.
- Successful video analysis.
- Individual model failure.
- Model disagreement.
- Missing model output.
- Analysis timeout.
- Inconclusive result.

### Results and reports
- Correct analysis retrieval.
- Correct user ownership.
- Correct dashboard statistics.
- Correct history filters.
- PDF report generation.
- Failed analysis display.

### Security
- User A cannot access User B's analysis.
- Private uploaded files cannot be accessed publicly.
- Secrets are not returned in API responses.
- Upload endpoints are rate-limited.

---

## 20. Development Priorities

Recommended implementation order:

### Phase 1 — Backend foundation
- Set up backend server.
- Connect database.
- Configure environment variables.
- Configure CORS.
- Implement error handling.

### Phase 2 — Authentication
- User registration.
- Login and logout.
- Current-user endpoint.
- Authentication middleware.

### Phase 3 — Media management
- File upload.
- File validation.
- Secure storage.
- Analysis record creation.

### Phase 4 — AI integration
- Image detection.
- Audio detection.
- Video detection.
- Multi-model orchestration.
- Result aggregation.

### Phase 5 — Result processing
- Analysis status tracking.
- Explainable report generation.
- Evidence storage.
- Failure and inconclusive handling.

### Phase 6 — Frontend integration
- Connect dashboard API.
- Connect upload and analysis API.
- Replace mock history.
- Connect result pages.
- Connect PDF report downloads.

### Phase 7 — Testing and deployment
- API testing.
- Security checks.
- Frontend/backend integration testing.
- Production configuration.
- Deployment.

---

## 21. Definition of Done

The backend can be considered ready for frontend integration when:

- [ ] Registration and login work.
- [ ] Authenticated routes are protected.
- [ ] Media files can be securely uploaded.
- [ ] Image, audio, and video pipelines are connected.
- [ ] Multiple model results are collected.
- [ ] Aggregated verdicts are returned.
- [ ] Confidence and supporting evidence are available.
- [ ] Analysis status can be tracked.
- [ ] Analysis records are saved in the database.
- [ ] Dashboard statistics use real data.
- [ ] History supports search and filters.
- [ ] Detailed reports can be retrieved.
- [ ] PDF reports can be downloaded.
- [ ] User ownership and privacy checks pass.
- [ ] Frontend integration has been tested.

---

## 22. Important Notes for the Team

1. Build the backend around the existing frontend requirements rather than changing API response structures independently.
2. Coordinate the final API contract with the frontend developer before implementing all endpoints.
3. Keep AI inference separate from ordinary HTTP request handling so long-running video analysis does not block the API.
4. Do not return fake model outputs as real verification results.
5. If models disagree, preserve that disagreement in the report.
6. If there is insufficient evidence, return `inconclusive`.
7. Every result should be explainable and traceable to the model or forensic check that produced it.
8. Keep uploaded media private and enforce user-level access control.
9. Maintain API documentation and example requests for frontend integration.
10. Communicate changes to endpoint names, response fields, and authentication behavior to the frontend developer before changing the contract.

**The main goal:** TruthLens should provide a reliable, explainable media-verification workflow—not just an upload form followed by a percentage score.