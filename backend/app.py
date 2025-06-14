from flask import Flask
from config import DevelopmentConfig

app = Flask(__name__)

# 根据需要加载不同环境的配置
# 这里以开发环境为例
app.config.from_object(DevelopmentConfig)

@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    # 如果你已经在配置中指定了SERVER_NAME，可以直接运行。
    # 注意：如果设置了SERVER_NAME，则host和port参数在app.run()中会被忽略。
    app.run()