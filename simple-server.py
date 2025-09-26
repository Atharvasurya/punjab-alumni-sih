#!/usr/bin/env python3
"""
Simple HTTP Server for Punjab Government Alumni System
Alternative solution when Next.js has issues
"""

import http.server
import socketserver
import webbrowser
import os
import sys
from pathlib import Path

# Configuration
PORT = 8080
DIRECTORY = "."

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        super().end_headers()

def find_available_port(start_port=8080):
    """Find an available port starting from start_port"""
    import socket
    for port in range(start_port, start_port + 100):
        try:
            with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
                s.bind(('localhost', port))
                return port
        except OSError:
            continue
    return None

def main():
    # Find available port
    port = find_available_port(8080)
    if not port:
        print("❌ No available ports found!")
        return
    
    print("=" * 50)
    print("  GOVERNMENT OF PUNJAB ALUMNI SYSTEM")
    print("        SIMPLE SERVER STARTUP")
    print("=" * 50)
    print()
    
    # Change to project directory
    os.chdir(Path(__file__).parent)
    
    try:
        with socketserver.TCPServer(("", port), CustomHTTPRequestHandler) as httpd:
            print(f"✅ Server starting on port {port}")
            print()
            print("🌐 Your Punjab Government Alumni System is available at:")
            print(f"   http://localhost:{port}")
            print(f"   http://127.0.0.1:{port}")
            print()
            print("📁 Serving files from:", os.getcwd())
            print()
            print("💡 Note: This is a simple file server.")
            print("   For full functionality, use the Next.js server.")
            print()
            print("Press Ctrl+C to stop the server")
            print("=" * 50)
            
            # Try to open browser
            try:
                webbrowser.open(f'http://localhost:{port}')
                print(f"🌐 Opening browser at http://localhost:{port}")
            except:
                print("⚠️  Could not open browser automatically")
            
            print()
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n👋 Server stopped by user")
    except Exception as e:
        print(f"❌ Server error: {e}")

if __name__ == "__main__":
    main()
