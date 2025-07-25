from flask import Flask, request
from datetime import datetime

app = Flask(__name__, static_url_path='', static_folder='.')

@app.route('/')
def serve_index():
    return app.send_static_file('index.html')

@app.route('/logCJopen', methods=['POST'])
def log_cj_open():
    now = datetime.now().isoformat()
    with open('cj_log.txt', 'a') as f:
        f.write(f"CJ opened it at {now}\n")
    return {'status': 'logged'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000)
