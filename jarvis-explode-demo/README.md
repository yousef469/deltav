# Jarvis Explode Mode Standalone Demo

This is a standalone demo of the **Jarvis Explode Mode** with **Gemini AI** integration.

## Features

- **3D Viewer**: Upload and view GLTF/GLB or FBX models.
- **Explode/Implode**: Visually "explode" the model into its constituent parts to see internal components.
- **AI Analysis**: Click on any part to receive a deep engineering analysis from Gemini AI.
- **Sci-Fi HUD**: Immersive UI with crosshairs, tech corners, and floating labels.

## How to Run

1.  **Install Dependencies**: Ensure you have `node_modules` installed in the root directory.
2.  **Start the Demo**:
    ```bash
    npx vite jarvis-explode-demo --port 5174
    ```
3.  **Open in Browser**: Navigate to `http://localhost:5174`.

## Project Structure

- `index.html`: Entry point.
- `src/App.jsx`: Main React component.
- `src/components/ExplodeViewer.jsx`: The core 3D viewer and explode logic.
- `src/services/gemini.js`: Service for interacting with the Gemini AI backend.

## Gemini Integration

The demo uses the existing backend API at `/api/gemini`. Make sure your backend server is running if you want to use the AI analysis feature.
