from flask import Flask, jsonify, request
from flask_cors import CORS 
import json
import os

app = Flask(__name__)
# CORS ruxsatini hamma uchun ochdik (HTML fayl istalgan joydan ulanishi uchun)
CORS(app)

DB_FILE = 'edu_data.json'

def load_db():
    if not os.path.exists(DB_FILE):
        return {
            "users": [],
            "tasks": [],
            "attendance": {},
            "grades": []
        }
    try:
        with open(DB_FILE, 'r', encoding='utf-8') as f:
            return json.load(f)
    except Exception:
        return {"users": [], "tasks": [], "attendance": {}, "grades": []}

def save_db(data):
    with open(DB_FILE, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=4, ensure_ascii=False)

# --- LOGIN ---
@app.route('/api/login', methods=['POST'])
def login():
    db = load_db()
    data = request.json or {}
    # Bo'sh joylarni olib tashlaymiz (Frontenddan kelgan formatni tozalash)
    phone = data.get('phone', '').replace(' ', '')
    code = data.get('code', '')
    
    if not phone or not code:
        return jsonify({"status": "error", "message": "Telefon yoki kod kiritilmadi"}), 400

    user = next((u for u in db['users'] if u['phone'] == phone and u['code'] == code), None)
    
    if user:
        return jsonify({"status": "success", "user": user}), 200
    else:
        new_user = {
            "phone": phone,
            "code": code,
            "name": data.get('name', 'Asrorbek M.'),
            "role": data.get('role', 'teacher')
        }
        db['users'].append(new_user)
        save_db(db)
        return jsonify({"status": "registered", "user": new_user}), 201

# --- VAZIFALAR ---
@app.route('/api/tasks', methods=['GET', 'POST'])
def handle_tasks():
    db = load_db()
    if request.method == 'POST':
        new_task = request.json or {}
        db['tasks'].append(new_task)
        save_db(db)
        return jsonify({"status": "success", "message": "Vazifa saqlandi"}), 201
    return jsonify(db['tasks'])

if __name__ == '__main__':
    print("Backend ishga tushdi: http://localhost:5000")
    app.run(port=5000, debug=True)