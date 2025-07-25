from flask import Flask, request
from datetime import datetime

app = Flask(__name__, static_url_path='', static_folder='.')

@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

@app.route('/logCJopen', methods=['POST'])
def log_cj():
    now = datetime.now().isoformat()
    with open('logs/cjAccessLog.txt', 'a') as f:
        f.write(f"CJ opened site at {now}\n")
    print(f"CJ access logged at {now}")
    return 'Logged', 200

@app.route('/logAbbyAccess', methods=['POST'])
def log_abby():
    now = datetime.now().isoformat()
    ip = request.remote_addr
    ua = request.headers.get("User-Agent", "Unknown")
    
    os.makedirs("logs", exist_ok=True)  # ensure logs directory exists
    
    with open("logs/abbyAccessLog.txt", "a") as f:
        f.write(f"Abby opened site at {now} from {ip} with UA: {ua}\n")
    
    print(f"Abby access logged at {now}")
    return 'Logged Abby', 200


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)


