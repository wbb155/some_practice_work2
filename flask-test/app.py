from flask import Flask, request, jsonify
from flask_cors import CORS
from MySqlHelper import MySqlHelper

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}},supports_credentials=True)

@app.route("/get", methods=["GET"])
def get_data():
    param = request.args.get("param")
    return jsonify({"message": f"参数是 {param}"})


@app.route("/post/<param>", methods=["POST"])
def post_data(param):
    data = request.get_json()
    body_value = data.get("body_param")
    return jsonify({"message": f"body中的参数是 {body_value}，param中的参数是 {param}"})

@app.route("/data", methods=["GET"])
def Crawler_Data():
    try:
        db = MySqlHelper(
            host="localhost",
            user="",
            password="",
            database="online_information",
            port=3306,
            charset='utf8mb4',
        )
        db.connect()
        data = db.execute_quick_query(
            Select=['item_rank', 'chinese_name', 'original_name', 'director', 'score', 'countries', 'genres'],
            From=['Films']
        )
        db.close()
        return jsonify(data)
    except Exception as e:
        print("数据库查询失败：", e)
        return jsonify({"error": "数据库连接失败", "details": str(e)}), 500



if __name__ == "__main__":
    # Crawler_Data()
    app.run(debug=True, host='0.0.0.0', port=5001)
