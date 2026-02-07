#  CropIQ - AI-Powered Smart Farming Assistant

<div align="center">

![CropIQ Banner](https://img.shields.io/badge/CropIQ-Smart%20Farming-green?style=for-the-badge&logo=leaf)
[![React](https://img.shields.io/badge/React-18.3-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

**Transforming Agriculture with AI-Driven Intelligence**

[Features](#-key-features) • [Architecture](#-system-architecture) • [Getting Started](#-quick-start) • [Roadmap](#-future-scope)

</div>

---

## 🎯 What Makes CropIQ Unique?

CropIQ goes **beyond traditional farm advisory systems** by providing:

```mermaid
graph LR
    A[Traditional Systems] -->|Basic Advice| B[Generic Recommendations]
    C[CropIQ AI] -->|Intelligent Analysis| D[Predictive Insights]
    C --> E[Early Warnings]
    C --> F[Economic Impact Analysis]
    C --> G[Community Intelligence]
    
    style C fill:#10b981,stroke:#059669,stroke-width:3px,color:#fff
    style D fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
    style E fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    style F fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
    style G fill:#ec4899,stroke:#db2777,stroke-width:2px,color:#fff
```

### 🔥 Unique Value Propositions

| Feature | Traditional Systems | CropIQ |
|---------|-------------------|---------|
| **Prediction Window** | Reactive (post-damage) | 3-7 days advance warning ⚡ |
| **Financial Clarity** | Generic advice | Exact ROI & loss prevention 💰 |
| **Community Data** | Individual only | Area-wide intelligence 🌍 |
| **Decision Support** | Basic tips | Wrong-decision warnings ⚠️ |
| **Seasonal Intelligence** | Static advice | Dynamic deviation analysis 📊 |

---

## ✨ Key Features

```mermaid
mindmap
  root((CropIQ))
    Pre-Damage Alerts
      Disease Outbreak Prediction
      Pest Activity Forecasting
      Weather Extreme Warnings
      Stress Detection
    Financial Intelligence
      ROI Calculations
      Loss Prevention Estimates
      Cost-Benefit Analysis
      Time-Sensitive Actions
    Community Insights
      Regional Risk Mapping
      Anonymized Data Aggregation
      Collective Defense
      Area Threat Alerts
    Smart Recommendations
      Crop Rotation Warnings
      Climate Mismatch Alerts
      Harvest Timing Optimization
      Market Intelligence
```

### 🚨 **1. Pre-Damage Alert System**
- **Disease Outbreak Prediction**: 3-7 days before visible symptoms
- **Pest Breeding Forecasts**: Based on temperature trends
- **Water/Heat Stress Detection**: Before crop damage occurs
- **Example**: *"High disease risk detected. Acting now saves ₹8,000 vs ₹1,500 prevention cost (433% ROI)"*

### 💰 **2. Financial Impact Analysis**
Every recommendation includes:
- Immediate action cost
- Loss prevention amount
- ROI calculation
- Cost of inaction timeline

### 🌍 **3. Area-Level Community Intelligence**
- Anonymized data from nearby farms (10km radius)
- Regional pest/disease pressure mapping
- Community early warning system
- Collective defense coordination

### ⚠️ **4. Wrong Decision Warnings**
- Crop rotation risk detection
- Climate-practice mismatch alerts
- Poor market timing warnings
- Suboptimal harvest timing

### 📊 **5. Seasonal Deviation Analysis**
- Rainfall deviation from historical averages
- Temperature pattern changes
- Timing shift detection
- Yield impact assessment

---

## 🏗️ System Architecture

```mermaid
graph TB
    subgraph "Frontend - React + TypeScript"
        A[User Interface] --> B[Dashboard]
        A --> C[Crop Management]
        A --> D[Advisories]
        A --> E[Weather Intelligence]
    end
    
    subgraph "State Management"
        B --> F[React Query]
        C --> F
        D --> F
        E --> F
    end
    
    subgraph "Backend - Supabase"
        F --> G[PostgreSQL Database]
        F --> H[Edge Functions]
        F --> I[Real-time Subscriptions]
    end
    
    subgraph "Intelligence Layer"
        G --> J[AI Advisory Engine]
        G --> K[Risk Prediction Engine]
        G --> L[Economic Analysis]
        G --> M[Area Intelligence]
    end
    
    subgraph "External APIs"
        H --> N[Weather API]
        H --> O[Market Data]
    end
    
    J --> P[Personalized Recommendations]
    K --> Q[Early Warnings]
    L --> R[ROI Calculations]
    M --> S[Community Insights]
    
    style A fill:#3b82f6,stroke:#2563eb,stroke-width:2px,color:#fff
    style J fill:#10b981,stroke:#059669,stroke-width:2px,color:#fff
    style K fill:#f59e0b,stroke:#d97706,stroke-width:2px,color:#fff
    style L fill:#8b5cf6,stroke:#7c3aed,stroke-width:2px,color:#fff
    style M fill:#ec4899,stroke:#db2777,stroke-width:2px,color:#fff
```

### Technology Stack

**Frontend**
- ⚛️ React 18.3 + TypeScript 5.8
- 🎨 Tailwind CSS + shadcn/ui
- 📊 Recharts for data visualization
- 🌐 i18next for multi-language support
- 🔄 React Query for state management

**Backend**
- 🗄️ Supabase (PostgreSQL)
- ⚡ Edge Functions (TypeScript)
- 🔐 Row Level Security (RLS)
- 📡 Real-time subscriptions

**Intelligence**
- 🤖 AI-driven advisory engine
- 📈 ML-ready yield prediction
- 🌦️ Weather data caching & forecasting
- 💹 Market intelligence analysis

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone <your-repository-url>
cd crop-iq-smart-farming-assistant-main

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will open at `http://localhost:8080`

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Production build
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run test         # Run tests
```

---

## 📊 Data Flow Diagram

```mermaid
sequenceDiagram
    participant F as Farmer
    participant UI as CropIQ UI
    participant API as Edge Functions
    participant DB as Database
    participant AI as AI Engine
    participant EXT as External APIs

    F->>UI: Input crop data
    UI->>API: Create crop cycle
    API->>DB: Store crop data
    
    loop Every 6 hours
        API->>EXT: Fetch weather data
        EXT-->>API: Weather forecast
        API->>DB: Cache weather data
    end
    
    loop Daily at 8 AM
        DB->>AI: Trigger analysis
        AI->>AI: Generate risk predictions
        AI->>AI: Calculate ROI
        AI->>AI: Analyze area intelligence
        AI->>DB: Store advisories
        DB->>UI: Real-time notification
        UI->>F: Show advisory with ROI
    end
    
    F->>UI: View harvest timing
    UI->>API: Request optimization
    API->>AI: Analyze maturity + weather
    AI-->>API: Optimal harvest window
    API-->>UI: Display recommendation
    UI->>F: Show timing + quality risks
```

---

## 🗺️ Future Scope

```mermaid
gantt
    title CropIQ Development Roadmap
    dateFormat YYYY-MM
    section Phase 1 (Current)
    Core Features & UI: done, 2024-01, 2024-06
    Basic Intelligence: done, 2024-04, 2024-06
    
    section Phase 2 (Q2 2024)
    ML Yield Prediction: active, 2024-06, 2024-09
    Mobile App (iOS/Android): active, 2024-07, 2024-10
    Offline Mode: 2024-08, 2024-11
    
    section Phase 3 (Q4 2024)
    Image Recognition (Pest/Disease): 2024-10, 2025-01
    IoT Sensor Integration: 2024-11, 2025-02
    Voice Assistance (Regional): 2024-12, 2025-03
    
    section Phase 4 (2025)
    Drone Integration: 2025-01, 2025-04
    Blockchain Supply Chain: 2025-02, 2025-06
    Carbon Credit Tracking: 2025-03, 2025-07
    AI-Powered Marketplace: 2025-04, 2025-08
```

### 🎯 Planned Features

#### **Q2 2024**
- 📱 Native mobile apps (iOS & Android)
- 🤖 Advanced ML yield prediction models
- 📡 Offline-first architecture with sync

#### **Q4 2024**
- 📸 Image recognition for pest/disease identification
- 🌡️ IoT sensor integration (soil moisture, pH, NPK)
- 🎙️ Voice assistance in 10+ regional languages

#### **2025**
- 🚁 Drone integration for field mapping
- ⛓️ Blockchain-based supply chain tracking
- 🌱 Carbon credit calculation & marketplace
- 🛒 AI-powered direct-to-consumer marketplace
- 🔬 Soil health scoring with recommendations
- 💧 Automated irrigation control

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

## 📧 Contact & Support

- **GitHub Issues**: [Report bugs or request features](../../issues)
- **Documentation**: Check the `/docs` folder for detailed guides
- **Backend Setup**: See [README_BACKEND.md](README_BACKEND.md)
- **Intelligence Features**: See [README_INTELLIGENCE_FEATURES.md](README_INTELLIGENCE_FEATURES.md)

---

<div align="center">

**Made with ❤️ for farmers worldwide**

*Empowering agriculture through AI-driven intelligence*

</div>
