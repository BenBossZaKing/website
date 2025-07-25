from flask import Flask, request
from datetime import datetime
import os

app = Flask(__name__, static_url_path='', static_folder='.')

# Create logs directory if it doesn't exist
LOG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs")
os.makedirs(LOG_DIR, exist_ok=True)

@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

@app.route('/logCJopen', methods=['POST'])
def log_cj():
    now = datetime.now().isoformat()
    log_path = os.path.join(LOG_DIR, "cjAccessLog.txt")
    with open(log_path, 'a') as f:
        f.write(f"CJ opened site at {now}\n")
    print(f"CJ access logged at {now}")
    return 'Logged CJ', 200

@app.route('/logAbbyAccess', methods=['POST'])
def log_abby():
    now = datetime.now().isoformat()
    ip = request.remote_addr
    ua = request.headers.get("User-Agent", "Unknown")
    log_path = os.path.join(LOG_DIR, "abbyAccessLog.txt")
    with open(log_path, 'a') as f:
        f.write(f"Abby opened site at {now} from {ip} with UA: {ua}\n")
    print(f"Abby access logged at {now}")
    return 'Logged Abby', 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
