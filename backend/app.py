from flask import Flask, request, jsonify, render_template, abort, redirect, url_for, session
from werkzeug.security import generate_password_hash, check_password_hash
from config import DevelopmentConfig
from dotenv import load_dotenv
import os
import markdown
import mysql.connector
from mysql.connector import Error
from functools import wraps

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

# @app.route('/')
# def hello_world():
#     return 'Hello, World!'

# === 数据库连接函数 ===
def get_db_connection():
    """
    获取 MySQL 连接（MySQL ≥ 8，默认开启 caching_sha2_password）
    如需使用 TLS，可在 connect() 中加入 ssl_ca / ssl_cert / ssl_key 等参数
    """
    return mysql.connector.connect(**DB_CONFIG)

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

# 菜谱详情页面
@app.route('/recipe/<int:recipe_id>')
def recipe_detail(recipe_id):
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(dictionary=True) as cur:
            cur.execute(
                "SELECT * FROM recipes1 WHERE id = %s",
                (recipe_id,)
            )
            recipe = cur.fetchone()
        if not recipe:
            abort(404, description="菜谱不存在")

        # markdown 字段转 html
        for field in ['description', 'ingredients', 'steps', 'additional_notes']:
            value = recipe.get(field) or ''
            recipe[f"{field}_html"] = markdown.markdown(value, extensions=['extra', 'nl2br'])

        # 假设点赞/收藏状态和数量也查出来了（这里用假数据演示）
        recipe['liked'] = False  # 实际应查用户状态
        recipe['collected'] = False
        recipe['like_count'] = 10  # 实际应查数据库
        recipe['collect_count'] = 5

        return render_template('recipe_detail.html', recipe=recipe)
    except Error as e:
        abort(500, description=f"数据库错误: {e}")
    finally:
        if conn and conn.is_connected():
            conn.close()

# 搜索结果页
@app.route('/search')
def search():
    keyword = request.args.get("name", "").strip()
    results = []
    if keyword:
        sql = """
            SELECT id, name, description, image_path, category
            FROM recipes1
            WHERE name LIKE %s
            ORDER BY id DESC
        """
        like_pattern = f"%{keyword}%"
        conn = None
        try:
            conn = get_db_connection()
            with conn.cursor(dictionary=True) as cur:
                cur.execute(sql, (like_pattern,))
                results = cur.fetchall()
        except Error as e:
            # 你可以渲染一个错误页面
            return f"数据库错误: {e}", 500
        finally:
            if conn and conn.is_connected():
                conn.close()
    return render_template('search_results.html', keyword=keyword, results=results)


# 允许的分类
ALLOWED_CATEGORIES = [
    "半成品", "调味料", "荤菜", "水产", "素菜", "汤羹", "甜品", "饮品", "早餐", "主食"
]

# 分类页面
@app.route('/category/<category>')
def category_page(category):
    if category not in ALLOWED_CATEGORIES:
        abort(404)
    sql = """
        SELECT id, name, description, image_path, category
        FROM recipes1
        WHERE category = %s
        ORDER BY id DESC
    """
    results = []
    conn = None
    try:
        conn = get_db_connection()
        with conn.cursor(dictionary=True) as cur:
            cur.execute(sql, (category,))
            results = cur.fetchall()
    except Error as e:
        return f"数据库错误: {e}", 500
    finally:
        if conn and conn.is_connected():
            conn.close()
    return render_template('category.html', category=category, results=results)

# @app.errorhandler(404)
# def page_not_found(e):
#     return render_template('404.html'), 404

@app.route('/register', methods=['GET', 'POST'])
def register():
    error = None
    if request.method == 'POST':
        username = request.form['username'].strip()
        email = request.form['email'].strip()
        password = request.form['password']
        confirm_password = request.form['confirm_password']
        if password != confirm_password:
            error = "两次输入的密码不一致"
        elif len(password) < 6:
            error = "密码长度不能小于6位"
        else:
            conn = get_db_connection()
            try:
                with conn.cursor(dictionary=True) as cur:
                    cur.execute("SELECT id FROM users WHERE username=%s OR email=%s", (username, email))
                    if cur.fetchone():
                        error = "用户名或邮箱已被注册"
                    else:
                        password_hash = generate_password_hash(password)
                        cur.execute("INSERT INTO users (username, email, password_hash) VALUES (%s, %s, %s)",
                                    (username, email, password_hash))
                        conn.commit()
                        return redirect(url_for('login'))
            finally:
                if conn and conn.is_connected():
                    conn.close()
    return render_template('register.html', error=error)

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username_or_email = request.form['username_or_email'].strip()
        password = request.form['password']
        conn = get_db_connection()
        try:
            with conn.cursor(dictionary=True) as cur:
                cur.execute("SELECT * FROM users WHERE username=%s OR email=%s", (username_or_email, username_or_email))
                user = cur.fetchone()
                if user and check_password_hash(user['password_hash'], password):
                    session['user_id'] = user['id']
                    session['username'] = user['username']
                    return redirect(url_for('profile'))  # 登录后跳转到个人中心
                else:
                    error = "用户名/邮箱或密码错误"
        finally:
            if conn and conn.is_connected():
                conn.close()
    return render_template('login.html', error=error)

def login_required(view_func):
    @wraps(view_func)
    def wrapper(*args, **kwargs):
        if 'user_id' not in session:
            return redirect(url_for('login'))
        return view_func(*args, **kwargs)
    return wrapper

@app.route('/profile')
@login_required
def profile():
    user_id = session['user_id']
    conn = get_db_connection()
    try:
        with conn.cursor(dictionary=True) as cur:
            # 用户基本信息
            cur.execute("SELECT id, username FROM users WHERE id=%s", (user_id,))
            user = cur.fetchone()

            # 最近发送的文章（最新5篇）
            cur.execute("""
                SELECT id, title, created_at
                FROM articles
                WHERE user_id=%s
                ORDER BY created_at DESC
                LIMIT 5
            """, (user_id,))
            articles = cur.fetchall()

            # 收藏的菜谱（最新5个）
            cur.execute("""
                SELECT r.id, r.name, r.description, r.image_path, r.category, rc.collected_at
                FROM recipe_collections rc
                JOIN recipes1 r ON rc.recipe_id = r.id
                WHERE rc.user_id=%s
                ORDER BY rc.collected_at DESC
                LIMIT 5
            """, (user_id,))
            collections = cur.fetchall()
    finally:
        if conn and conn.is_connected():
            conn.close()
    return render_template('profile.html', user=user, articles=articles, collections=collections)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('login'))

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/discover')
def discover():
    return render_template('discover.html')

@app.route('/share')
def share():
    return render_template('share.html')

@app.route('/square')
def square():
    return render_template('square.html')


@app.route('/camera')
def camera():
    return render_template('camera.html')

@app.route('/notification')
def notification():
    return render_template('notification.html')



if __name__ == '__main__':
    # 如果你已经在配置中指定了SERVER_NAME，可以直接运行。
    # 注意：如果设置了SERVER_NAME，则host和port参数在app.run()中会被忽略。
    app.run()