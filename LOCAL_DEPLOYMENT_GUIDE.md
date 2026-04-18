
# Szczecin SafePoint: Local Deployment Instructions

Use this guide to run a lightweight version of the safety navigator on your local PC for testing or private community use.

## 1. Prerequisites
- **Python 3**: Installed on your system.
- **Project Files**: The `index.html`, `App.tsx`, `index.tsx`, etc., should all be in one folder.

## 2. Local Server Setup (Python)
Standard browser security prevents loading ES6 modules from the file system. You need a simple server. Save this code as `server.py` in your project folder:

```python
from http.server import SimpleHTTPRequestHandler, HTTPServer

class MyHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable COOP and COEP for advanced browser features
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        SimpleHTTPRequestHandler.end_headers(self)

print("Starting SafePoint Local Node on http://localhost:8000...")
HTTPServer(('localhost', 8000), MyHandler).serve_forever()
```

## 3. Running the App
1. Open your terminal/command prompt.
2. Navigate to the project folder.
3. Run `python server.py`.
4. Open your browser and go to `http://localhost:8000`.

## 4. API Configuration
Since this is a local version, ensure you have your Gemini API Key ready. Click the **☢️ logo** five times to enter Admin mode, then use the **CONFIG_API** tool in the Admin panel to set your key.

## 5. Offline Scaling
To make this work completely offline (without CDN dependencies), you would need to download the following libraries and host them locally in a `lib/` folder:
- React & ReactDOM (esm.sh)
- Leaflet CSS & JS
- Google GenAI SDK
- Tailwind CSS (Optional: can be pre-compiled to a static CSS file)

---
*MISSION STATUS: READY FOR LOCAL DEPLOYMENT*
