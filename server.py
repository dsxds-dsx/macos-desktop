#!/usr/bin/env python3
"""Combined static file server + Bing Maps proxy to bypass X-Frame-Options."""

import http.server
import socketserver
import urllib.request
import urllib.error
import ssl
import os
import re
import gzip
from io import BytesIO

PORT = 8080
PROXY_PREFIX = "/proxy/"
TARGET_HOST = "https://cn.bing.com"
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

# Headers to strip from proxied responses
STRIP_HEADERS = {
    "x-frame-options",
    "content-security-policy",
    "x-content-security-policy",
    "x-webkit-csp",
}

# Headers to strip from proxied requests
STRIP_REQ_HEADERS = {
    "host",
    "origin",
    "referer",
    "cookie",
}

class ProxyHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def do_GET(self):
        if self.path.startswith(PROXY_PREFIX):
            self.handle_proxy()
        else:
            super().do_GET()

    def do_HEAD(self):
        if self.path.startswith(PROXY_PREFIX):
            self.handle_proxy(head_only=True)
        else:
            super().do_HEAD()

    def handle_proxy(self, head_only=False):
        # Extract the target path after /proxy/
        target_path = self.path[len(PROXY_PREFIX):]
        if not target_path:
            target_path = "maps"
        target_url = f"{TARGET_HOST}/{target_path}"

        # Also forward query string
        if self.path.find("?") != -1:
            qs = self.path[self.path.find("?"):]
            if "?" not in target_url:
                target_url += qs

        try:
            # Create request
            req = urllib.request.Request(target_url, method="GET")

            # Forward some headers from the original request
            for header, value in self.headers.items():
                hl = header.lower()
                if hl not in STRIP_REQ_HEADERS:
                    if hl in ("user-agent", "accept", "accept-language", "accept-encoding"):
                        req.add_header(header, value)

            # Make the request
            ctx = ssl.create_default_context()
            ctx.check_hostname = False
            ctx.verify_mode = ssl.CERT_NONE

            resp = urllib.request.urlopen(req, context=ctx, timeout=30)

            # Read response
            content = resp.read()

            # Handle gzip
            if resp.headers.get("Content-Encoding") == "gzip":
                try:
                    content = gzip.decompress(content)
                except Exception:
                    pass

            # Rewrite URLs in HTML content
            content_type = resp.headers.get("Content-Type", "")
            if "text/html" in content_type or "application/javascript" in content_type:
                content = self.rewrite_content(content, content_type)

            # Send response
            self.send_response(resp.status)

            # Copy headers, stripping problematic ones
            for header, value in resp.headers.items():
                hl = header.lower()
                if hl not in STRIP_HEADERS:
                    if hl == "content-encoding" and "gzip" in str(value).lower():
                        continue  # We decompressed it
                    if hl not in ("transfer-encoding", "content-length"):
                        self.send_header(header, value)

            self.send_header("Content-Length", str(len(content)))
            self.end_headers()

            if not head_only:
                self.wfile.write(content)

        except urllib.error.HTTPError as e:
            self.send_response(e.code)
            self.end_headers()
            if not head_only:
                self.wfile.write(e.read() or b"")
        except Exception as e:
            self.send_response(502)
            self.end_headers()
            if not head_only:
                self.wfile.write(f"Proxy error: {e}".encode())

    def rewrite_content(self, content, content_type):
        """Rewrite absolute Bing URLs to go through our proxy."""
        try:
            text = content.decode("utf-8", errors="replace")

            # Replace https://cn.bing.com/ with /proxy/
            text = text.replace("https://cn.bing.com/", "/proxy/")
            text = text.replace("http://cn.bing.com/", "/proxy/")

            # Also replace protocol-relative URLs //cn.bing.com/
            # (but be careful not to break other protocol-relative URLs)

            return text.encode("utf-8")
        except Exception:
            return content

    def log_message(self, format, *args):
        # Suppress log noise for proxy requests
        if "/proxy/" in str(args[0]):
            pass
        else:
            super().log_message(format, *args)


class ThreadingHTTPServer(socketserver.ThreadingMixIn, http.server.HTTPServer):
    """Threaded HTTP server."""
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":
    os.chdir(DIRECTORY)
    server = ThreadingHTTPServer(("0.0.0.0", PORT), ProxyHandler)
    print(f"Serving on port {PORT} with Bing Maps proxy at /proxy/...")
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        server.shutdown()