# simple_api.py
from http.server import HTTPServer, BaseHTTPRequestHandler
import json
import sqlite3
import os

# Données de test
TEST_PROJECTS = [
    {
        "id": 1,
        "title": "Dashboard Admin",
        "description": "Tableau de bord pour gestion de projets",
        "author": 8,
        "author_name": "Alice Martin",
        "author_email": "alice@simplon.com",
        "author_username": "simplon_alice",
        "status": "approved",
        "technologies": "React, Django, PostgreSQL",
        "cohort": "DWWM-2024-01",
        "created_at": "2024-01-15T10:30:00Z"
    },
    {
        "id": 2,
        "title": "Portfolio Personnel",
        "description": "Site portfolio avec projets réalisés",
        "author": 8,
        "author_name": "Alice Martin",
        "author_email": "alice@simplon.com",
        "author_username": "simplon_alice",
        "status": "pending",
        "technologies": "HTML, CSS, JavaScript",
        "cohort": "DWWM-2024-01",
        "created_at": "2024-02-01T14:20:00Z"
    },
    {
        "id": 3,
        "title": "Application E-commerce",
        "description": "Site e-commerce complet avec panier",
        "author": 2,
        "author_name": "Pierre Dubois",
        "author_email": "pierre@simplon.com",
        "author_username": "simplon_pierre",
        "status": "approved",
        "technologies": "React, Express, MongoDB",
        "cohort": "DWWM-2024-02",
        "created_at": "2024-01-20T09:15:00Z"
    }
]

class APIHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/api/projects/':
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.send_header('Access-Control-Allow-Origin', '*')
            self.end_headers()
            self.wfile.write(json.dumps(TEST_PROJECTS).encode())
        else:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b'404 Not Found')
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

def run_server():
    port = 8000
    server_address = ('', port)
    httpd = HTTPServer(server_address, APIHandler)
    
    print(f"""
==========================================
🚀 SERVEUR API DE SECOURS
==========================================
✅ Serveur démarré sur http://localhost:{port}
📡 Endpoints disponibles:
   • GET /api/projects/ - 3 projets de test
📊 Données prêtes pour le frontend React
==========================================
    """)
    
    httpd.serve_forever()

if __name__ == '__main__':
    run_server()