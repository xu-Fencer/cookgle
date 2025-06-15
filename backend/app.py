from flask import Flask, request, jsonify
from config import DevelopmentConfig
from dotenv import load_dotenv
import os

import mysql.connector
from mysql.connector import Error

# ===== 加载 .env =====
load_dotenv()              # 默认会在项目根目录寻找 .env

# 从环境变量读取配置
DB_CONFIG = dict(
    host=os.getenv("DB_HOST"),
    port=int(os.getenv("DB_PORT", "3306")),
    user=os.getenv("DB_USER"),
    password=os.getenv("DB_PASSWORD"),
    database=os.getenv("DB_NAME"),
    auth_plugin="caching_sha2_password",
    charset="utf8mb4",
)

app = Flask(__name__)

# 根据需要加载不同环境的配置
# 这里以开发环境为例
app.config.from_object(DevelopmentConfig)

@app.route('/')
def hello_world():
    return 'Hello, World!'

# === 数据库连接函数 ===
def get_db_connection():
    """
    获取 MySQL 连接（MySQL ≥ 8，默认开启 caching_sha2_password）
    如需使用 TLS，可在 connect() 中加入 ssl_ca / ssl_cert / ssl_key 等参数
    """
    return mysql.connector.connect(
        host="127.0.0.1",
        port=3306,
        user="root",
        password="123456",
        database="recipe1",
        auth_plugin="caching_sha2_password",  # 明确指定插件，兼容较旧服务器
        charset="utf8mb4",                    # 和 PyMySQL 保持一致
    )

# === API: /api/search_name ===
@app.route("/api/search_name", methods=["GET"])
def search_name():
    """
    按菜谱名关键字模糊检索 recipes1 表
    GET 参数:
        name —— 要搜索的菜谱名关键字（必填）
    返回:
        HTTP 200, JSON 列表，每条记录包含:
        id, name, description, image_path, category
    """
    keyword = request.args.get("name", "").strip()
    if not keyword:
        return jsonify({"error": "必须提供非空的 name 参数"}), 400

    sql = """
        SELECT id, name, description, image_path, category
        FROM recipes1
        WHERE name LIKE %s
    """
    like_pattern = f"%{keyword}%"

    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(dictionary=True) as cur:   # dictionary=True 自动映射为 dict
            cur.execute(sql, (like_pattern,))
            results = cur.fetchall()
        
        return jsonify(results), 200
    except Error as e:
        # 更详细的错误信息方便排查（生产环境可替换成统一日志）
        return jsonify({"error": str(e)}), 500
    finally:
        if conn and conn.is_connected():
            conn.close()

if __name__ == '__main__':
    # 如果你已经在配置中指定了SERVER_NAME，可以直接运行。
    # 注意：如果设置了SERVER_NAME，则host和port参数在app.run()中会被忽略。
    app.run()