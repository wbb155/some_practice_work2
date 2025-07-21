from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # 允许跨域请求

@app.route("/get", methods=["GET"])
def get_data():
    param = request.args.get("param")
    return jsonify({"message": f"参数是 {param}"})


@app.route("/post/<param>", methods=["POST"])
def post_data(param):
    data = request.get_json()
    body_value = data.get("body_param")
    return jsonify({"message": f"body中的参数是 {body_value}，param中的参数是 {param}"})


if __name__ == "__main__":
    app.run(debug=True)
