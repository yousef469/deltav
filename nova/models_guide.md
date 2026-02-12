# Nova Model Acquisition Guide

To run Nova v1.0, you must place the following quantized models in `app/src/main/assets/models/`.

## 1. AI Models (TFLite)
- **Gemma2 500M Q4_K_M**: Recommended for 3GB+ devices.
- **TinyLlama 1.1B Q4_0**: Fallback for 2GB devices.
- *Source*: [Hugging Face (GGUF or TFLite)](https://huggingface.co/models?search=gemma2-500m-tflite)

## 2. STT Models
- **Whisper Tiny INT8 (ONNX)**: For 3GB+ devices.
- **Vosk Small English Model**: For 2GB devices.
- *Source*: [Whisper ONNX](https://github.com/microsoft/onnxruntime-extensions), [Vosk Models](https://alphacephei.com/vosk/models)

## 3. TTS Model
- **Piper en_tiny (ONNX)**: Lightweight voice model.
- *Source*: [Piper GitHub](https://github.com/rhasspy/piper)

---

### File Structure Check
```
app/src/main/assets/models/
├── gemma2_500m_q4.tflite
├── tinyllama_1b_q4.tflite
├── whisper_tiny_en_int8.onnx
└── piper_en_tiny.onnx
```
