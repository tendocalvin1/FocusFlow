# FocusFlow

> **Turn meaningful goals into structured daily execution.**

FocusFlow is a productivity and focus-management platform designed to help users define meaningful goals, break them into actionable tasks, track focused work sessions, maintain productivity streaks, and receive AI-assisted productivity guidance based on their actual activity.

The project is being developed as a production-oriented full-stack application rather than a simple CRUD demonstration. It combines a Django REST API, React frontend, PostgreSQL, JWT authentication, OAuth/SSO, Docker, Nginx, automated testing, cloud deployment, and an AI productivity layer powered by the OpenAI Responses API.

---

## 🌟 Overview

FocusFlow helps users move from **high-level goals → actionable tasks → focused execution → productivity insights**.

The platform currently provides:

* Goal management
* Task management
* Focus-session tracking
* Productivity streaks
* JWT authentication
* Google OAuth / SSO
* Protected REST APIs
* PostgreSQL persistence
* Dockerized backend infrastructure
* Nginx reverse proxy
* OpenAPI / Swagger documentation
* Production-oriented security configuration
* Vercel frontend deployment
* Render backend deployment
* AI-powered productivity planning

The AI layer builds on the existing productivity data instead of replacing the underlying application architecture.

---

# 🌟 Key Features

## 🎯 Goal Management

Goals represent the larger outcomes users want to accomplish.

Implemented capabilities include:

* Create goals
* Retrieve goals
* Update goals
* Delete goals
* Associate goals with authenticated users
* Track goal completion
* Define goal dates
* Define target dates

Goals form the foundation from which actionable tasks are created.

---

## ✅ Task Management

Tasks represent the concrete actions required to achieve a goal.

Implemented capabilities include:

* Create tasks
* Retrieve tasks
* Update tasks
* Delete tasks
* Associate tasks with goals
* Enforce authenticated-user ownership through goals
* Manage task priority

FocusFlow ensures that tasks belong to valid goals owned by the authenticated user.

---

## ⏱️ Focus Session Tracking

FocusFlow allows users to record focused work sessions against their tasks.

Implemented capabilities include:

* Create focus sessions
* Retrieve focus sessions
* Update focus sessions
* Associate sessions with authenticated users
* Associate sessions with specific tasks
* Track session start time
* Track session end time
* Track session duration
* Track completion status

The application also enforces the business rule that a user should not have multiple active focus sessions simultaneously.

---

## 🔥 Productivity Streaks

FocusFlow includes a streak system designed to encourage consistent execution.

The current implementation tracks productivity streaks based on goal completion.

Implemented capabilities include:

* Retrieve a user's streak
* Associate streak information with the authenticated user
* Evaluate productivity completion
* Update streak state based on goal completion

The streak system is designed around the user's daily productivity workflow rather than simply incrementing after an individual action.

---

# 🤖 AI Productivity Coach

FocusFlow now includes an initial AI productivity layer that uses a user's existing productivity data to generate structured productivity guidance.

The AI Productivity Coach is designed around a simple principle:

> **The AI should reason over the user's actual productivity context rather than inventing a plan from generic prompts.**

### Current V1 capabilities

The AI service builds a user-scoped productivity context containing information such as:

* Goals
* Goal completion state
* Goal target dates
* Tasks
* Task priorities
* Focus sessions
* Focus-session metrics
* Productivity streak information
* Deterministic productivity metrics

This context is then provided to the OpenAI Responses API.

The AI is instructed to return a strict structured response containing:

```text
summary
priorities
plan
risks
recommendations
```

The backend validates the returned structure before sending it to the frontend.

### AI workflow

```text
Authenticated User
       │
       ▼
React Dashboard
       │
       ▼
aiService.js
       │
       │ JWT
       ▼
POST /api/ai/productivity-plan/
       │
       ▼
Django AI Endpoint
       │
       ▼
Authenticated User Context
       │
       ├── Goals
       ├── Tasks
       ├── Focus Sessions
       └── Streak
       │
       ▼
Deterministic Productivity Metrics
       │
       ▼
OpenAI Responses API
       │
       ▼
Structured JSON Response
       │
       ▼
Backend Validation
       │
       ▼
ProductivityInsights.jsx
       │
       ▼
AI Productivity Plan
```

### Security boundaries

The AI implementation is designed around authenticated, user-scoped data.

Productivity queries are scoped to the authenticated user:

```text
Goal
    ↓
authenticated user

Task
    ↓
user-owned Goal

FocusSession
    ↓
authenticated user

Streak
    ↓
authenticated user
```

The frontend does not provide a `user_id` to the AI endpoint.

The backend uses `request.user` to determine which productivity data can be included in the AI context.

Returned goal and task IDs are also validated against the authenticated user's available context before the response is returned.

### Current limitations

The current AI V1 does **not** calculate task overdue status because the current task model does not expose a task-level due date.

Goal target dates are supported.

Future AI iterations can build on this foundation with richer task scheduling and deadline awareness.

---

# 🔐 Authentication & Authorization

FocusFlow uses JWT-based authentication alongside `django-allauth` for Google OAuth / SSO integration.

Implemented authentication capabilities include:

* User registration
* JWT login
* Google OAuth / SSO
* Access tokens
* Refresh tokens
* Token verification
* Token refresh
* Refresh-token blacklisting on logout
* Authenticated API requests using DRF `IsAuthenticated`
* Protected Goals endpoints
* Protected Tasks endpoints
* Protected Focus Session endpoints
* Protected Streak endpoints
* Protected AI productivity endpoint
* Password change
* Profile access

### JWT login flow

```text
React Login.jsx
     │
     │ email + password
     ▼
authService.login()
     │
     ├── POST /api/token/
     │
     ├── store access + refresh tokens
     │
     └── GET /api/auth/profile/
            │
            │ Authorization: Bearer <access>
            ▼
        AuthContext
            │
            ▼
      ProtectedRoute
            │
            ▼
        Dashboard
```

### Axios interceptor

The centralized Axios client:

* Adds the JWT access token to API requests
* Detects `401` responses
* Attempts a single refresh-token request
* Stores the new access/refresh pair
* Retries the failed request once
* Clears tokens if refresh fails
* Dispatches the application logout event
* Redirects the user to the login page

---

# 🌐 Google OAuth / SSO

FocusFlow integrates Google authentication through `django-allauth`.

The high-level flow is:

```text
FocusFlow Login Page
        │
        │ Continue with Google
        ▼
/accounts/google/login/
        │
        ▼
Google OAuth
        │
        ▼
Google callback
        │
        ▼
django-allauth
        │
        ▼
Authenticated Django User
        │
        ▼
JWT generation
        │
        ▼
Frontend OAuth callback
        │
        ▼
Tokens stored
        │
        ▼
Authenticated Dashboard
```

The Google OAuth callback must be registered in Google Cloud Console.

Example production callback:

```text
https://focusflow-3n3u.onrender.com/accounts/google/login/callback/
```

Local development callback:

```text
http://localhost:8000/accounts/google/login/callback/
```

The callback URL must match the configured OAuth client exactly.

---

# 🔑 Environment Variables

Create:

```text
Backend/.env
```

Never commit this file.

### Backend

```env
# ===== Django =====
SECRET_KEY=<django-secret-key>
DEBUG=False
ALLOWED_HOSTS=*

# Frontend
FRONTEND_URL=https://focus-flow-bay-zeta.vercel.app

# ===== Database =====
DATABASE_URL=postgres://user:password@host:port/dbname

# Legacy database variables if required
DB_NAME=focusflow
DB_USER=focusflow
DB_PASSWORD=focusflow
DB_HOST=localhost
DB_PORT=5432

# ===== SimpleJWT =====
ACCESS_TOKEN_LIFETIME_MINUTES=5
REFRESH_TOKEN_LIFETIME_DAYS=7

# ===== CORS =====
CORS_ALLOWED_ORIGINS=http://localhost:5173,https://focus-flow-bay-zeta.vercel.app
CSRF_TRUSTED_ORIGINS=http://localhost:5173,https://focus-flow-bay-zeta.vercel.app

# ===== Google OAuth =====
GOOGLE_CLIENT_ID=<your-client-id>.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=<your-google-client-secret>

# ===== OpenAI =====
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_MODEL=gpt-4o-mini
```

### OpenAI security requirements

`OPENAI_API_KEY` must remain server-side.

Do **not**:

* Put it in the React `.env`
* Prefix it with `VITE_`
* Send it to the browser
* Commit it to Git
* Return it from an API response
* Hard-code it into application source code

The React application communicates with the Django AI endpoint rather than directly with OpenAI.

The current OpenAI SDK dependency is pinned in `requirements.txt`:

```text
openai==3.3.1
```

---

# 🖥️ Frontend Environment Variables

Create:

```text
Frontend/focusflow-frontend/.env
```

Example:

```env
VITE_API_BASE_URL=https://focusflow-3n3u.onrender.com
```

For local development:

```env
VITE_API_BASE_URL=http://localhost:8000
```

The variable is consumed by the centralized Axios API client.

---

# 🌐 REST API

The backend exposes RESTful endpoints for the core productivity system.

### Core resources

```text
/api/goals/
/api/tasks/
/api/focus-sessions/
/api/streaks/
```

### Authentication

```text
/api/auth/register/
/api/auth/change-password/
/api/auth/logout/
/api/profile/

/api/token/
/api/token/refresh/
/api/token/verify/
```

### AI

```text
/api/ai/productivity-plan/
```

---

# 📚 API Documentation

FocusFlow uses **drf-spectacular** to generate an OpenAPI schema and interactive API documentation.

Available endpoints:

```text
/api/schema/
/api/docs/
```

Swagger UI provides an interactive interface for inspecting and testing the backend API.

---

# 🏗️ Architecture Overview

FocusFlow separates frontend, backend, AI, persistence, and infrastructure responsibilities.

```mermaid
graph TD

    subgraph Client["Frontend"]
        A["React + Vite"]
        B["Axios API Client"]
        C["Productivity Insights"]
    end

    subgraph Backend["Django Backend"]
        D["Django 6"]
        E["Django REST Framework"]
        F["JWT Authentication"]
        G["Goals API"]
        H["Tasks API"]
        I["Focus Sessions API"]
        J["Streak API"]
        K["AI Productivity Service"]
        L["OpenAPI / Swagger"]
    end

    subgraph AI["AI Provider"]
        M["OpenAI Responses API"]
    end

    subgraph Infrastructure["Infrastructure"]
        N["Nginx"]
        O["Docker"]
    end

    subgraph Database["Persistence"]
        P[("PostgreSQL")]
    end

    subgraph Deployment["Cloud Deployment"]
        Q["Vercel"]
        R["Render"]
    end

    A --> B
    B --> N
    N --> D

    D --> E
    D --> F

    E --> G
    E --> H
    E --> I
    E --> J
    E --> K
    E --> L

    K --> M
    K --> P

    D --> P

    A --> Q
    D --> R

    O --> N
    O --> D
    O --> P
```

---

# 🔄 Standard API Request Flow

A normal authenticated productivity request follows:

```text
React Frontend
      │
      ▼
Axios API Client
      │
      │ JWT Access Token
      ▼
Nginx
      │
      ▼
Django / DRF
      │
      ▼
Authentication
      │
      ▼
Business Logic
      │
      ▼
PostgreSQL
```

---

# 🤖 AI Request Flow

The AI productivity request follows a separate service boundary:

```text
React Dashboard
      │
      ▼
aiService.js
      │
      │ JWT
      ▼
POST /api/ai/productivity-plan/
      │
      ▼
Django View
      │
      ▼
request.user
      │
      ▼
AI Productivity Service
      │
      ├── Goals
      ├── Tasks
      ├── Focus Sessions
      └── Streak
      │
      ▼
Curated Productivity Context
      │
      ▼
OpenAI Responses API
      │
      ▼
Structured JSON
      │
      ▼
Validation
      │
      ▼
React ProductivityInsights
```

---

# 🛠️ Technology Stack

| Layer                   | Technologies                                 |
| ----------------------- | -------------------------------------------- |
| **Frontend**            | React, Vite, Axios                           |
| **Backend**             | Python, Django 6, Django REST Framework      |
| **AI**                  | OpenAI Responses API, OpenAI Python SDK      |
| **Authentication**      | JWT, SimpleJWT, django-allauth               |
| **OAuth**               | Google OAuth / SSO                           |
| **Database**            | PostgreSQL 17                                |
| **API Documentation**   | drf-spectacular, OpenAPI, Swagger UI         |
| **Static Files**        | WhiteNoise                                   |
| **Reverse Proxy**       | Nginx                                        |
| **Containerization**    | Docker, Docker Compose                       |
| **Frontend Deployment** | Vercel                                       |
| **Backend Deployment**  | Render                                       |
| **Testing**             | Django test framework, mocked provider tests |
| **Version Control**     | Git, GitHub                                  |

---

# 🔐 Security & Production Configuration

FocusFlow includes production-oriented security configuration.

Current security-related configuration includes:

* JWT authentication
* Protected API endpoints
* Refresh-token handling
* Refresh-token blacklisting
* Secure session cookies
* Secure CSRF cookies
* HTTPS-aware Django configuration
* `SECURE_SSL_REDIRECT`
* `SECURE_PROXY_SSL_HEADER`
* HTTP-only session cookies
* SameSite cookie configuration
* HSTS configuration
* `X-Frame-Options`
* `X-Content-Type-Options`
* Configurable `ALLOWED_HOSTS`
* CORS configuration
* Environment-based secrets
* User-scoped AI data access
* Server-side OpenAI API key handling
* Structured AI response validation

The application is designed to operate behind a reverse proxy in production.

---

# 🐳 Docker Architecture

FocusFlow uses Docker Compose to reproduce a production-style backend environment locally.

Current services:

```text
┌───────────────────────────┐
│           Nginx           │
│          Port 80          │
│       Reverse Proxy       │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│       Django / DRF        │
│         Port 8000         │
│         Backend API       │
└─────────────┬─────────────┘
              │
              ▼
┌───────────────────────────┐
│        PostgreSQL         │
│         Port 5432         │
└───────────────────────────┘
```

Docker Compose manages service networking and dependencies.

Nginx acts as the public entry point and forwards requests to Django.

The same architecture is used to provide a production-like local development environment.

---

# ☁️ Deployment

## Frontend

The FocusFlow frontend is deployed using **Vercel**.

```text
Framework: Vite
Root Directory: Frontend/focusflow-frontend
Install Command: npm install
Build Command: npm run build
Output Directory: dist
Development Command: npm run dev
```

---

## Backend

The Django backend is deployed using **Render**.

Production backend:

```text
https://focusflow-3n3u.onrender.com
```

The backend uses PostgreSQL and runs behind the deployment infrastructure.

---

# 🔄 Frontend ↔ Backend Integration

The frontend communicates with Django through a centralized Axios client.

The API client provides:

* Centralized API configuration
* Request timeouts
* JWT authorization headers
* Access-token handling
* Refresh-token handling
* Automatic token refresh
* Authentication error handling
* API error normalization
* Automatic logout when refresh fails

The AI service uses the same authenticated API architecture.

The browser never communicates directly with OpenAI.

---

# 🧪 Testing

FocusFlow includes backend testing for core productivity functionality as well as the AI layer.

## Authentication testing

Testing covers:

* User registration
* User login
* JWT generation
* Protected endpoint access
* Token refresh
* Logout

## Core productivity testing

### Goals

* Retrieve goals
* Create goals
* Update goals
* Delete goals

### Tasks

* Retrieve tasks
* Create tasks
* Update tasks
* Delete tasks
* Validate goal relationships
* Validate authenticated-user ownership

### Focus Sessions

* Retrieve focus sessions
* Create focus sessions
* Validate task relationships
* Validate authenticated-user ownership
* Validate focus-session business rules

### Streaks

* Retrieve streak information
* Validate streak ownership
* Validate streak business logic

---

# 🤖 AI Testing

The AI Productivity Coach includes focused tests covering:

* Authentication requirements
* User-scoped response generation
* User isolation
* Missing OpenAI configuration
* Malformed AI responses
* Provider failures
* Empty productivity data

The focused AI test suite currently contains six tests:

```text
test_plan_requires_authentication
test_plan_returns_structured_user_scoped_response
test_missing_ai_configuration_is_safe
test_invalid_ai_response_is_safe
test_provider_failure_is_safe
test_empty_productivity_data_is_safe
```

### Real AI integration verification

The real integration flow was also successfully verified locally:

```text
JWT Authentication
       ↓
POST /api/token/
       ↓
JWT obtained
       ↓
POST /api/ai/productivity-plan/
       ↓
HTTP 200
       ↓
OpenAI request successful
       ↓
gpt-4o-mini
       ↓
Structured response received
```

The verified response contains:

```text
summary
priorities
plan
risks
recommendations
```

The integration test also confirmed that:

* The API key was not exposed
* The JWT was not exposed
* Stack traces were not returned
* The AI endpoint required authentication
* Productivity data was scoped to the authenticated user

The real integration test was performed against the local Dockerized PostgreSQL environment.

---

# 📖 API Endpoints

## Authentication

| Method | Endpoint                     | Description                           |
| ------ | ---------------------------- | ------------------------------------- |
| `POST` | `/api/auth/register/`        | Register a new user                   |
| `POST` | `/api/token/`                | Authenticate and obtain JWT tokens    |
| `POST` | `/api/token/refresh/`        | Refresh an access token               |
| `POST` | `/api/token/verify/`         | Verify a JWT token                    |
| `GET`  | `/api/profile/`              | Retrieve authenticated user's profile |
| `POST` | `/api/auth/change-password/` | Change user password                  |
| `POST` | `/api/auth/logout/`          | Logout and blacklist refresh token    |

---

## Goals

| Method   | Endpoint           | Description    |
| -------- | ------------------ | -------------- |
| `GET`    | `/api/goals/`      | Retrieve goals |
| `POST`   | `/api/goals/`      | Create a goal  |
| `PUT`    | `/api/goals/<id>/` | Update a goal  |
| `DELETE` | `/api/goals/<id>/` | Delete a goal  |

---

## Tasks

| Method   | Endpoint           | Description    |
| -------- | ------------------ | -------------- |
| `GET`    | `/api/tasks/`      | Retrieve tasks |
| `POST`   | `/api/tasks/`      | Create a task  |
| `PUT`    | `/api/tasks/<id>/` | Update a task  |
| `DELETE` | `/api/tasks/<id>/` | Delete a task  |

---

## Focus Sessions

| Method   | Endpoint                    | Description             |
| -------- | --------------------------- | ----------------------- |
| `GET`    | `/api/focus-sessions/`      | Retrieve focus sessions |
| `POST`   | `/api/focus-sessions/`      | Create a focus session  |
| `PUT`    | `/api/focus-sessions/<id>/` | Update a focus session  |
| `DELETE` | `/api/focus-sessions/<id>/` | Delete a focus session  |

---

## Streaks

| Method | Endpoint        | Description                          |
| ------ | --------------- | ------------------------------------ |
| `GET`  | `/api/streaks/` | Retrieve authenticated user's streak |

---

## AI Productivity

| Method | Endpoint                     | Description                                           |
| ------ | ---------------------------- | ----------------------------------------------------- |
| `POST` | `/api/ai/productivity-plan/` | Generate an authenticated user's AI productivity plan |

The AI endpoint uses the authenticated user's existing productivity context and returns a structured productivity plan.

---

# 📁 Project Structure

```text
FocusFlow/
│
├── Backend/
│   │
│   ├── Backend/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   ├── views.py
│   │   ├── wsgi.py
│   │   └── ...
│   │
│   ├── accounts/
│   │   ├── urls.py
│   │   ├── views.py
│   │   ├── serializers.py
│   │   └── ...
│   │
│   ├── productivity/
│   │   ├── urls.py
│   │   ├── views.py
│   │   ├── ai_services.py
│   │   ├── serializers.py
│   │   ├── models.py
│   │   └── tests.py
│   │
│   ├── nginx/
│   │   └── default.conf
│   │
│   ├── Dockerfile
│   ├── docker-compose.yml
│   ├── entrypoint.sh
│   ├── requirements.txt
│   └── manage.py
│
├── Frontend/
│   │
│   └── focusflow-frontend/
│       ├── src/
│       │   ├── components/
│       │   │   └── dashboard/
│       │   │       └── ProductivityInsights.jsx
│       │   │
│       │   ├── pages/
│       │   ├── services/
│       │   │   ├── api.js
│       │   │   └── aiService.js
│       │   ├── lib/
│       │   └── ...
│       │
│       ├── public/
│       ├── package.json
│       ├── vite.config.js
│       └── ...
│
└── README.md
```

---

# 🚧 Current Status

FocusFlow currently has the following implemented:

### Core Platform

* [x] React frontend
* [x] Django backend
* [x] PostgreSQL database
* [x] User registration
* [x] JWT authentication
* [x] Token refresh
* [x] Token blacklisting on logout
* [x] Protected API endpoints
* [x] Google OAuth / SSO
* [x] Goal management
* [x] Task management
* [x] Focus-session tracking
* [x] Productivity streaks
* [x] API documentation
* [x] Dockerized backend environment
* [x] Nginx reverse proxy
* [x] Production-oriented security configuration
* [x] Backend deployment on Render
* [x] Frontend deployment on Vercel
* [x] Frontend ↔ backend production integration
* [x] Core API testing

### AI Productivity Coach V1

* [x] OpenAI SDK integration
* [x] Pinned OpenAI dependency
* [x] Authenticated AI endpoint
* [x] User-scoped productivity context
* [x] Goal/task/focus/streak context generation
* [x] Deterministic productivity metrics
* [x] OpenAI Responses API integration
* [x] Structured JSON output
* [x] AI response validation
* [x] Goal/task ID validation
* [x] Provider failure handling
* [x] Missing configuration handling
* [x] Empty productivity-state handling
* [x] Frontend AI service
* [x] Productivity insights UI
* [x] Loading state
* [x] Empty state
* [x] Error state
* [x] Success state
* [x] Refresh/generate workflow
* [x] Mocked AI tests
* [x] Real local OpenAI integration test

---

# 🗺️ Roadmap

The next development stage is to move from **AI-generated productivity plans** toward a more complete intelligent productivity system.

Potential future capabilities include:

* [ ] AI task decomposition
* [ ] AI-powered task prioritization
* [ ] Intelligent deadline awareness
* [ ] Task-level due dates
* [ ] Personalized productivity recommendations
* [ ] Focus-session pattern analysis
* [ ] AI-powered weekly reviews
* [ ] Historical productivity analysis
* [ ] Goal progress forecasting
* [ ] AI planning workflows
* [ ] AI evaluation and quality monitoring
* [ ] Production AI observability
* [ ] Rate-limit and quota handling
* [ ] More advanced AI context construction

The objective is to evolve the AI layer without compromising the reliability and security of the underlying productivity platform.

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Python 3.12+
* Node.js 20+
* npm
* Docker
* Docker Compose
* Git
* PostgreSQL-compatible environment

For AI functionality:

* An OpenAI API key

---

## Clone the Repository

```bash
git clone https://github.com/tendocalvin1/FocusFlow.git
cd FocusFlow
```

---

# Backend Setup

```bash
cd Backend
```

Create a virtual environment:

```bash
python -m venv venv
```

Activate it on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create:

```text
Backend/.env
```

Configure the required environment variables, including:

```env
OPENAI_API_KEY=<your-openai-api-key>
OPENAI_MODEL=gpt-4o-mini
```

Run migrations:

```bash
python manage.py migrate
```

Start Django:

```bash
python manage.py runserver
```

---

# Frontend Setup

```bash
cd Frontend/focusflow-frontend
```

Install dependencies:

```bash
npm install
```

Configure:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Start the frontend:

```bash
npm run dev
```

---

# Docker Development

From the backend directory:

```bash
docker compose up -d
```

Check services:

```bash
docker compose ps
```

Stop services:

```bash
docker compose down
```

---

# 📄 License

This project is currently available for development and portfolio purposes.

---

# 👤 Author

**Tendo Calvin**

Full-Stack Software Engineer

* GitHub: [@tendocalvin1](https://github.com/tendocalvin1)
* LinkedIn: Tendo Calvin
* Based in Uganda

---

# ⭐ Project Philosophy

FocusFlow is being built as more than a demonstration CRUD application.

The project is being developed incrementally around real software engineering concerns:

```text
Product Requirements
        ↓
Database Design
        ↓
REST API
        ↓
Authentication
        ↓
Business Logic
        ↓
Testing
        ↓
Docker
        ↓
Nginx
        ↓
Production Deployment
        ↓
Frontend Integration
        ↓
AI Integration
        ↓
AI Evaluation
        ↓
Production AI Hardening
```

The current milestone is the completion of the **core productivity platform, production deployment foundation, and first AI productivity integration**.

The next milestone is to make the AI layer more intelligent, measurable, and production-ready while preserving the reliability, security, and user ownership guarantees of the underlying application.
