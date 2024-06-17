from flask import Flask , jsonify , request 
from flask_cors import CORS
from chat import get_res

app = Flask(__name__)
CORS(app, origins='*')

@app.route('/', methods = ['POST'])
def index():
    req = request.get_json()
    res = get_res(req.get('body'))
    return jsonify(res)
    

if __name__ == "__main__":
    app.run(debug=True)