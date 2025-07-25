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


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)


