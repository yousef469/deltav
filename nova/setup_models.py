import os
import urllib.request
import sys

# Nova Model Setup Script (Version 2.5 - Gemma Support)
# To download Gemma, you MUST accept the license at huggingface.co/google/gemma-3-1b-it
# and then paste your Read Token below.

HF_TOKEN = "" # <--- PASTE YOUR HUGGING FACE TOKEN HERE

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ASSETS_DIR = os.path.join(BASE_DIR, "app/src/main/assets/models")

# URLs (Some require HF_TOKEN)
MODELS = {
    "gemma3_1b_it_int4.tflite": "https://huggingface.co/litert-community/Gemma3-1B-IT/resolve/main/Gemma3-1B-IT_multi-prefill-seq_q4_ekv2048.task",
    "whisper_tiny_en_int8.tflite": "https://huggingface.co/nyadla-sys/whisper-tiny.en.tflite/resolve/main/whisper-tiny-en.tflite",
    "piper_en_tiny.onnx": "https://huggingface.co/rhasspy/piper-voices/resolve/main/en/en_US/lessac/low/en_US-lessac-low.onnx"
}

def download_progress(block_num, block_size, total_size):
    read_so_far = block_num * block_size
    if total_size > 0:
        percent = read_so_far * 1e2 / total_size
        s = "\r%5.1f%% %*d / %d" % (
            percent, len(str(total_size)), read_so_far, total_size)
        sys.stderr.write(s)
        if read_so_far >= total_size:
            sys.stderr.write("\n")
    else:
        sys.stderr.write("read %d\n" % (read_so_far,))

def setup():
    if not os.path.exists(ASSETS_DIR):
        print(f"Creating directory: {ASSETS_DIR}")
        os.makedirs(ASSETS_DIR)

    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    }
    
    if HF_TOKEN:
        headers['Authorization'] = f'Bearer {HF_TOKEN}'
        print("🔑 Using Hugging Face token for download...")

    for filename, url in MODELS.items():
        destination = os.path.join(ASSETS_DIR, filename)
        if os.path.exists(destination) and os.path.getsize(destination) > 1000000:
            print(f"✅ {filename} already exists and looks valid. Skipping.")
            continue
        
        print(f"🚀 Downloading {filename}...")
        try:
            req = urllib.request.Request(url, headers=headers)
            with urllib.request.urlopen(req) as response, open(destination, 'wb') as out_file:
                total_size = int(response.info().get('Content-Length', -1))
                block_size = 8192
                block_num = 0
                while True:
                    block = response.read(block_size)
                    if not block:
                        break
                    out_file.write(block)
                    block_num += 1
                    download_progress(block_num, block_size, total_size)
            print(f"✅ Successfully downloaded {filename}")
        except urllib.error.HTTPError as e:
            if e.code == 401:
                print(f"❌ Error 401: {filename} is GATED. You must provide a valid HF_TOKEN in this script.")
            else:
                print(f"❌ Failed to download {filename}: {e}")
        except Exception as e:
            print(f"❌ Failed to download {filename}: {e}")

if __name__ == "__main__":
    print("--- Nova AI Model Downloader (Authenticated) ---")
    setup()
    print("--- Setup Complete ---")
