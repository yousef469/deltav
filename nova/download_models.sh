#!/bin/bash

# Nova Model Downloader Script
# Run this from the root of your project

ASSETS_DIR="app/src/main/assets/models"
mkdir -p $ASSETS_DIR

echo "🚀 Downloading Nova Model Assets..."

# Note: These URLs are illustrative. Users should replace them with actual direct download links
# to quantized models like Gemma-2-2b-it-TFLite-int8 etc.

# 1. Gemma2 500M (Placeholder URL)
# curl -L "https://huggingface.co/google/gemma-2b-it-tflite/resolve/main/gemma-2b-it-int8.tflite" -o "$ASSETS_DIR/gemma2_500m_q4.tflite"

# 2. Whisper Tiny ONNX
echo "Please manually download the Whisper Tiny INT8 ONNX model from Microsoft ONNX Runtime GitHub"
echo "and place it at $ASSETS_DIR/whisper_tiny_en_int8.onnx"

# 3. Piper TTS
echo "Please manually download the Piper en_tiny ONNX model"
echo "and place it at $ASSETS_DIR/piper_en_tiny.onnx"

echo "✅ Assets folder prepared. Please ensure all 4 files are present before building."
