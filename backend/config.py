# config.py

class Config:
    """默认配置"""
    DEBUG = False
    SECRET_KEY = 'your_secret_key'
    # 其他通用配置项

class DevelopmentConfig(Config):
    """开发环境配置"""
    DEBUG = True
    # Flask监听的地址和端口
    SERVER_NAME = '0.0.0.0:5501'