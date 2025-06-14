# 谷鸽 - Cookgle
> 此项目仅为作业建业，无意抄袭 Google 的名字。

![Static Badge](https://img.shields.io/badge/%E8%B0%B7-%E9%B8%BD-orange)
![GitHub commit activity](https://img.shields.io/github/commit-activity/w/xu-fencer/cookgle)

<!-- [TOC] -->

## 前言

前端使用AI编写的代码，参考某同学设计的 UI。后端（目前计划）使用 PHP 与 mysql 数据库。通过 API或 Web wSDK 连接 [Coze](https://www.coze.com/)，~~通过 Coze 设计工作流，此项目仅包含前后端，（目前计划）不对 Coze 工作流进行记录。~~

在[Coze Learn文件](CozeLearn.md)中包含使用 Coze的相关信息

## Todo list

- [x] 使用 jQuery 代替原生 JS
- [ ] 修改页面主体`container` css 属性以防止 web sdk将其挤开
- [ ] （或）自制 coze 聊天页面
- [ ] 使用 Flask 制作后端接口连接数据库
- [ ] 使用 Flask 制作后端接口连接 Coze 工作流


## 文件结构

```
cookgle_____ 网站主要静态页面（包含文件夹）
        |___ index.html
        |___ backend _____ Flask
                |_________ run.py
```

## 技术栈

（目前计划）使用 jQuery，~~PHP7.4~~，Flask，MySQL

## 表结构
```
+--------------------+-----------+--------------------------+-------------+----------------+
| COLUMN_NAME        | DATA_TYPE | CHARACTER_MAXIMUM_LENGTH | IS_NULLABLE | COLUMN_DEFAULT |
+--------------------+-----------+--------------------------+-------------+----------------+
| id                 | int       |                     NULL | NO          | NULL           |
| recipe_id          | varchar   |                      255 | NO          | NULL           |
| name               | varchar   |                      255 | NO          | NULL           |
| description        | text      |                    65535 | NO          | NULL           |
| source_path        | varchar   |                      255 | NO          | NULL           |
| image_path         | varchar   |                      255 | YES         | NULL           |
| category           | varchar   |                       50 | NO          | NULL           |
| difficulty         | int       |                     NULL | NO          | NULL           |
| tags               | varchar   |                      255 | NO          | NULL           |
| servings           | int       |                     NULL | NO          | NULL           |
| ingredients        | text      |                    65535 | NO          | NULL           |
| steps              | text      |                    65535 | YES         | NULL           |
| prep_time_minutes  | int       |                     NULL | YES         | NULL           |
| cook_time_minutes  | int       |                     NULL | YES         | NULL           |
| total_time_minutes | int       |                     NULL | YES         | NULL           |
| additional_notes   | text      |                    65535 | NO          | NULL           |
+--------------------+-----------+--------------------------+-------------+----------------+
```

| COLUMN_NAME        | DATA_TYPE | CHARACTER_MAXIMUM_LENGTH | IS_NULLABLE | COLUMN_DEFAULT |
|--------------------|-----------|--------------------------|-------------|----------------|
| id                 | int       | NULL                     | NO          | NULL           |
| recipe_id          | varchar   | 255                      | NO          | NULL           |
| name               | varchar   | 255                      | NO          | NULL           |
| description        | text      | 65535                    | NO          | NULL           |
| source_path        | varchar   | 255                      | NO          | NULL           |
| image_path         | varchar   | 255                      | YES         | NULL           |
| category           | varchar   | 50                       | NO          | NULL           |
| difficulty         | int       | NULL                     | NO          | NULL           |
| tags               | varchar   | 255                      | NO          | NULL           |
| servings           | int       | NULL                     | NO          | NULL           |
| ingredients        | text      | 65535                    | NO          | NULL           |
| steps              | text      | 65535                    | YES         | NULL           |
| prep_time_minutes  | int       | NULL                     | YES         | NULL           |
| cook_time_minutes  | int       | NULL                     | YES         | NULL           |
| total_time_minutes | int       | NULL                     | YES         | NULL           |
| additional_notes   | text      | 65535                    | NO          | NULL           |

## 许可证

本项目使用 GNU General Public License v3.0 (GPLv3) 许可证。

请查看 [LICENSE](LICENSE) 文件获取完整许可证文本。