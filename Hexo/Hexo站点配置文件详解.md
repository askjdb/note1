# 1. Hexo站点配置文件详解

**Hexo版本为3.8.0，版本不同可能有不同**

```
# Hexo Configuration
## Docs: https://hexo.io/docs/configuration.html
## Source: https://github.com/hexojs/hexo/

# Site
title: Hexo          # 网站的标题，可能用在各种布局的页面中
subtitle:            # 网站子标题
description:         # 网站的描述性
keywords:            # 网站的关键字
author: John Doe     # 网站的作者
language:            # 网站采用语言，要跟/theme/***/languages/**.yml下的文件名对应。
timezone:            # 网站的时区

# URL
## If your site is put in a subdirectory, set url as 'http://yoursite.com/child' and root as '/child/'
url: http://yoursite.com              # 网站的url，如果不在域名根目录，应包含子目录，且root要设置为`/子目录/`
root: /                               # 网站的根目录
permalink: :year/:month/:day/:title/  #文章永久链接的形成模版。每一篇文章都有唯一的url。
permalink_defaults:                   #文章永久链接中，各部分的默认值。

# Directory
source_dir: source          # 网站中源文件（比如Markdown啊什么的所在的文件夹）
public_dir: public          # 生成的静态网站的目录
tag_dir: tags               # 标签页所在的文件夹。
archive_dir: archives       # 文档页所在的文件夹
category_dir: categories    # 类别也所在的文件夹
code_dir: downloads/code    # 代码也所在的文件夹
i18n_dir: :lang             # 国际语言所在的文件夹
skip_render:                # 忽略文档清单

# Writing 写作
new_post_name: :title.md    # 默认新建文档名，`:title`为变量，指文档标题，也可用其他变量
default_layout: post        # 新建文档的默认布局
titlecase: false            # 是否要把标题中的首字符大写
external_link: true         # 是否要在新开tab中打开外链
filename_case: 0            # 文件名是否小写敏感
render_drafts: false        # 是否渲染草稿
post_asset_folder: false    # 是否启用资源文件夹。如启用，新建文档同时建立同名的资源文件夹
relative_link: false        # 是否把站内资源的链接改为站内相对链接。建议关闭。
future: true                # 文档中指定为未来时间创建
highlight:
  enable: true              # 是否开启代码高亮功能
  line_number: true         # 代码块中是否在前面加上行号
  auto_detect: false        # 是否自动检测代码块的语言（比如xml、JavaScript、mermaid等）
  tab_replace:              # 用什么字符来代替tab(`\t`)字符。
  
# Home page setting
# path: Root path for your blogs index page. (default = '')
# per_page: Posts displayed per page. (0 = disable pagination)
# order_by: Posts order. (Order by date descending by default)
index_generator:       
  path: ''              # 主页所在路径，默认为''
  per_page: 10          # 主页的索引页包含文章数量，如未定义，则采用根目录下的`per_page`值
  order_by: -date       # 文章（Post类型）排序属性，`-`为降序
  
# Category & Tag
default_category: uncategorized      # 对文档的默认分类
category_map:                        # 对文档中的分类字段进行映射。建立分类文件夹时采用映射后的字符串
tag_map:                             # 对文档中的标签字段进行映射。建立标签文件夹时采用映射后的字符串

# Date / Time format
## Hexo uses Moment.js to parse and display date
## You can customize the date format as defined in
## http://momentjs.com/docs/#/displaying/format/
date_format: YYYY-MM-DD   # 日期格式
time_format: HH:mm:ss     # 时间格式

# Pagination
## Set per_page to 0 to disable pagination
per_page: 10                      # 主页/分类/标签/存档等类型索引页包含文章数量
pagination_dir: page              # 分页所在文件夹

# Extensions                      # 扩展。放置插件和主题
## Plugins: https://hexo.io/plugins/
## Themes: https://hexo.io/themes/
theme: landscape                                # 默认主题landscape

# Deployment
## Docs: https://hexo.io/docs/deployment.html    
deploy:                                         # 定义部署
  type:

```

