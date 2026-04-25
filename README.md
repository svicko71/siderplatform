📚 Sider Platform — AI-Powered Educational Platform

Full-stack education platform combining AI-driven recommendations, payment integration, and teacher analytics to solve real engagement problems in online learning


🎯 Problem
Online learning platforms lose students to content-skipping and low engagement. Teachers lack unified tools to create, manage, and monetize their courses. Payment friction — especially for Egypt-based learners — prevents scale.
Sider was built to fix all three

🧠 What Sider Does
Sider is a full-stack educational platform with an AI recommendation engine at its core. It adapts content delivery to each student's learning pattern, enforces engagement through gamification, and gives teachers a complete dashboard to run their courses like a business.
Real-World Impact

64 students actively used the platform
Measurable reduction in content-skipping behavior
AI recommendations improved time-on-task engagement


✨ Core Features
🤖 AI Recommendation Engine

Analyzes student learning patterns and history
Recommends the most relevant next lesson dynamically
Anti-skip enforcement — students can't bypass content below engagement thresholds

🎮 Gamification Layer

Points and leaderboard system driving healthy competition
Badges and progress milestones
Engagement metrics visible to both students and teachers

👨‍🏫 Teacher Dashboard

Course creation and lesson management
Video upload with progress tracking
Revenue analytics, student ratings, and feedback insights

💳 Egypt-First Payment System

Paymob integration (credit cards, mobile wallets, Fawry)
Seamless checkout without leaving the platform

🔐 Authentication

Email/password login
Google OAuth + Facebook OAuth
Parent accounts with student-parent linking via phone number


🏗️ Architecture
Client (Browser)
      ↓
Frontend (HTML / CSS / JS)
      ↓
Backend API (Node.js / Express)
      ↓
Database (PostgreSQL)
      ↓
External Services:
  ├── Paymob (payments)
  ├── Google OAuth
  └── Facebook OAuth

🛠️ Tech Stack
LayerTechnologyBackendNode.js, Express.jsDatabasePostgreSQLAuthJWT, Passport.js (OAuth)File UploadsMulterFrontendHTML5, CSS3, Vanilla JSPaymentsPaymob APIDeploymentDocker

🚀 Getting Started
bash# Clone the repo
git clone https://github.com/svicko71/siderplatform.git
cd siderplatform

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Fill in your PostgreSQL URL, OAuth credentials, Paymob API key

# Run database setup
node setup.js

# Start the server
node server.js
Or with Docker:
bashdocker build -t sider .
docker run -p 3000:3000 sider

🔮 Roadmap

 Real-time notifications (WebSockets)
 Live streaming classes
 Quiz & exam engine with auto-grading
 Certificates of completion
 Mobile app (React Native)
 Advanced ML-based recommendation improvements


👤 Author
Youssef Salama — Computer Vision & Edge AI Engineer
LinkedIn · GitHub

