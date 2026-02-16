# ◈ ATLAS
### Offline AI Assistant for Engineers, Researchers & Creators

Atlas (formerly JARVIS) is a sophisticated, offline-first AI ecosystem designed to provide high-performance assistance without relying on external cloud services. It integrates real-time voice interaction, computer vision, 3D modeling, and automation into a unified cognitive architecture.

---

## 🏛️ Core Architecture

Atlas is built on a distributed engine model that prioritizes low latency and local execution:

- **Frontend**: A sleek, high-fidelity React application wrapped in Electron for native desktop capabilities (macOS/Windows).
- **Backend**: A FastAPI-powered Python hub orchestrating state-of-the-art AI models.
- **Communication**: Real-time bidirectional streaming via WebSocket.

---

## 🔄 The V24.5 Cognitive Loop

The heart of Atlas is the **6-Step Cognitive Pipeline**, which ensures every action is grounded in context and memory:

1.  **Step 0: Memory Pre-fetch**: Loads relevant facts, preferences, and past lessons from ChromaDB before planning.
2.  **Step 1: Planning**: A memory-informed routing step where the Brain (Qwen 2.5 Coder) selects the appropriate worker.
3.  **Step 2: Execution**: The selected specialized worker performs the task (Web, Vision, Automation).
4.  **Step 3: Review**: The Brain critiques the worker's output for quality and accuracy.
5.  **Step 4: Update Memory**: Lessons learned and mistakes made are committed to long-term memory.
6.  **Step 5: Synthesis**: A final, emotive response is generated for the user (Piper/Coqui TTS).

---

## 🛠️ Specialized Engines

### 🧠 The Brain (Reasoning & Memory)
Powered by **Qwen 2.5 Coder 7B** (via Ollama). Atlas features **Infinite Long-Term Memory** via ChromaDB—it remembers every fact, preference, and lesson learned across sessions, ensuring it grows more personalized over time.

### 🎙️ Speech (Voice & Audio)
- **STT**: `whisper.cpp` (CoreML optimized) for near-instant transcription.
- **TTS**: `Piper` and `Coqui V3` for natural, emotive vocal feedback.
- **Wake Word**: `openWakeWord` for local, low-power detection.

### 👁️ Vision (OmniParser)
Utilizes a custom Vision-Language Model pipeline (Qwen-VL) to understand the user's screen, identify UI elements, and perform OCR with spatial awareness.

### 🖼️ Image Generation (ComfyUI & SDXL)
Atlas integrates directly with **ComfyUI** and **SDXL** to generate high-fidelity images locally. It handles complex prompt engineering and model selection to produce professional-grade visual assets on demand.

### 🏗️ 3D Generation
A custom procedural modeling engine that converts natural language descriptions into valid 3D hierarchies and GLTF models.

---

## 📂 Project Structure

```text
atlas/
├── src/                # React Frontend (TypeScript, Three.js)
├── backend/            # Python FastAPI Server & Cognitive Logic
│   ├── atlas_brain_v245.py    # Cognitive Pipeline
│   ├── atlas_dispatcher.py    # Worker Orchestrator
│   ├── server.py              # Main Entry Point
│   └── workers/               # Specialized Task Workers
├── workers/            # Multi-language code execution workers
└── electron/           # Desktop App configuration
```

---

## 🚀 Getting Started

1.  **Dependencies**:
    - [Ollama](https://ollama.com/) (Download `qwen2.5-coder:7b`)
    - Python 3.10+
    - Node.js 18+
2.  **Backend Setup**:
    ```bash
    cd atlas/backend
    pip install -r requirements.txt
    python server.py
    ```
3.  **Frontend Setup**:
    ```bash
    cd atlas
    npm install
    npm run dev
    ```

---

*“Precision Engineering. Infinite Intelligence.”*
