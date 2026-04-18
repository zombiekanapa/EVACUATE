from http.server import SimpleHTTPRequestHandler, HTTPServer

class MyHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable COOP and COEP for advanced browser features
        self.send_header('Cross-Origin-Opener-Policy', 'same-origin')
        self.send_header('Cross-Origin-Embedder-Policy', 'require-corp')
        SimpleHTTPRequestHandler.end_headers(self)

print("Starting SafePoint Local Node on http://localhost:8000...")
HTTPServer(('localhost', 8000), MyHandler).serve_forever()
