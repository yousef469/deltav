# NOVA: The Offline Survival & Knowledge Ark (v1.3)

## Project Overview
**Nova** is a high-resilience, offline-first Android application designed for disaster recovery, long-term survival, and educational preservation. It serves as a decentralized "Library of Alexandria" and an active emergency response toolkit.

---

## 🛠️ Core Functional Modules

### 1. 🚨 Emergency & Rescue Sentinel
A mission-critical suite for life-saving actions.
- **Decision Engines**: Branching "Yes/No" logic for Medical Emergencies (Bleeding, CPR, Heat Stroke) and Wilderness Survival (Lost).
- **Signal Sentinel**: A foreground service that monitors network connectivity and triggers a high-volume alarm when a signal is detected, allowing for sleep in survival zones.
- **Global Rescue Index**: Hardcoded database of world-wide civilization centers. The app calculates the nearest rescue point and provides a visual vector on the map.

### 2. 🗺️ Offline Intelligence (Navigator)
- **OSM Mapping**: Full offline map rendering using OpenStreetMap (OSMDroid).
- **Celestial Navigation**: High-contrast compass overlay with real-time solar/lunar position tracking logic.

### 3. 🛠️ Action Tool Suite (The "Swiss Army" Layer)
Active interactions with the physical environment:
- **🔊 Sound Beacon**: Emits a localized acoustic signature for rescue team locating.
- **🧭 Direction Lock**: Allows a user to "Lock" a cardinal direction (e.g., base camp) and receive directional offset guidance ("Turn 45° Left") without needing GPS or Data.
- **💧 Hydration Timer**: A background coroutine-based system that manages consistent water intake reminders.

### 4. 📚 Education & Rebuilding Suite
A comprehensive knowledge vault for maintaining human progress:
- **Math**: Educational curriculum spanning from Grade 5 basics to Advanced Calculus and Linear Algebra.
- **Physics & Engineering**: Coverage of Newton's Laws, Thermodynamics, and Mechanical Engineering (Stress, Strain, Torque).
- **Coding Bootcamp**: 
    - **Python**: Variables, Loops, Functions, and OOP principles.
    - **Java**: Statically typed syntax, Methods, and Classes.
- **Logic Training**: A fully functional 2-player local **Chess Engine** with move validation and capture logic.

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
