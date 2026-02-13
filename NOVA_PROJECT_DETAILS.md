# NOVA: The Offline Survival & Knowledge Ark (v1.7)

> [!IMPORTANT]
> **Disclaimer**: Nova provides guidance, not professional medical advice. In emergencies, contact local authorities when possible.

## Project Overview
**Nova** is a high-resilience, offline-first Android application designed for disaster recovery, long-term survival, and educational preservation. It serves as a decentralized "Library of Alexandria" and an active emergency response toolkit.

---

## 🛠️ Core Functional Modules

### 1. 🚨 Emergency & Rescue Sentinel
A mission-critical suite for life-saving actions.
- **Decision Engines**: Branching "Yes/No" logic for Medical Emergencies (Bleeding, CPR, Heat Stroke) and Wilderness Survival (Lost).
- **Signal Sentinel**: Monitors network connectivity and triggers a high-volume alarm when a signal is detected.
- **Global Rescue Index**: Calculates nearest rescue point with a visual vector on the map.

### 2. 🗺️ Offline Intelligence (Navigator)
- **OSM Mapping**: Full offline map rendering using OpenStreetMap.
- **✨ Celestial Guidance**: Integrated star-based bearing logic. It guides users to rescue points by referencing the **North Star (Polaris)** or **Southern Cross**, providing simple "Right/Left" instructions.

### 3. 📚 Knowledge & Survival Vaults
- **🌾 Farming**: Deep knowledge on soil nitrogen fix, high-yield survival crops (Potatoes), and drip irrigation.
- **⚙️ Repairing**: Survival mechanics including rope knots, shelter frame building, and charcoal water filtration.
- **📐 Education**: Curriculum spanning Grade 5 to Advanced Calculus and Mechanical Engineering.
- **💻 Coding Bootcamp**: Python and Java basics.
- **♟️ Logic Training**: 2-player local Chess engine.

---

## 🌍 Polyglot Core (Multilingual)
Nova is accessible to a global audience with its dynamic translation manager supporting:
- **English 🇺🇸**
- **Mandarin Chinese 🇨🇳**
- **Hindi 🇮🇳**
- **Spanish 🇪🇸**
- **Arabic 🇸🇦**
- **French 🇫🇷**

---

## 🏗️ Technical Architecture

### Architecture Pattern
- **Language**: 100% Kotlin.
- **Data Persistence**: SQLite-based hardcoded survival database.
- **UI System**: ConstraintLayout with custom View rendering for high-performance elements (Chess, Compass).
- **Service Layer**: Foreground services for signal monitoring and alarm triggers.

### Hardware Optimization (`DeviceProfile.kt`)
Nova is built to run on "The Last Device."
- **RAM Categories**: Automatically detects 2GB, 3GB, or 4GB+ RAM.
- **Thread Scaling**: Adjusts internal processing threads based on detected hardware profile to prevent UI freezing on low-power legacy devices.
- **Battery Optimization**: Permanent dark-mode theme and zero-wake-lock policy (except for critical alarms).

---

## 📊 Final Performance Metrics (v1.3)
- **Binary Size (APK)**: **6.7 MB**
- **Cold Boot Time**: < 1.2 Seconds
- **RAM Footprint**: **~150MB** (Runtime Average)
- **Dependencies**: 0 External API reliance (All AI and logic is Local).

---

## 🚀 Versional Journey (Last 48 Hours)
- **v25.0**: Established Offline Mapping and Database core.
- **v26.0**: Integrated "Emergency Sentinel" and Decision Trees.
- **v27.0**: Deployed "Action Tools" and Multi-language support.
- **v28.0 (Internal)**: Final Education and Chess expansion.
- **v1.3 (Final)**: Rebranded, Optimized, and Documented.

**Nova is the definitive tool for the resilient human.** Amaze. 🌌
