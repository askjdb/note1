# 1. NexT主题配置文件详解

**Hexo版本-3.8.0**，**NexT版本-5.1.4**

NexT主题配置文件详解

```
# ---------------------------------------------------------------
# 主题核心配置
# ---------------------------------------------------------------
override: false    # 设置为true，则完全重载默认配置，当你完全不想继承主题配置时很有用

# ---------------------------------------------------------------
# 站点信息设置
# ---------------------------------------------------------------
favicon:     # favicon升级了，细化各种规格。
  small: /images/favicon-16x16-next.png                
  medium: /images/favicon-32x32-next.png    # medium类型应用`/favicon.ico`，否则网站图标异常
  apple_touch_icon: /images/apple-touch-icon-next.png
  safari_pinned_tab: /images/logo.svg
  #android_manifest: /images/manifest.json
  #ms_browserconfig: /images/browserconfig.xml

keywords: "Hexo, NexT"                        # 网站默认关键词
rss:                            # rss配置。false禁止；留空提供站点提供的；也可以自己指定

footer:                        # footer块配置                                                
  #since: 2015        # 网站建站年份，如果不配，采用当前年份
  icon: user            # 年份和版权声明之间的图标
  copyright:            # 版权声明。如为空，则取站点配置的`author`值。  
  powered: true        # 显示Hexo的链接（Power by Hexo）
  theme:                    # 在footer块中显示主题信息
    enable: true    # 显示主题信息    
    version: true    # 显示主题的版本。
  # 可以采用下面定制的文本
  #custom_text: Hosted by <a target="_blank" href="https://pages.github.com">GitHub Pages</a>

# ---------------------------------------------------------------
# SEO设置
# ---------------------------------------------------------------

# 标记为权威网站，有利于SEO搜索。如果打开该标签，务必在站点配置中设置url。
canonical: true
seo: false

# 如果index_with_subtitle为true，则在主页标题中增加subtitle。
# subtitle: Subtitle # 此处也可以覆写，它会替代站点配置文件中的内容
index_with_subtitle: false

# ---------------------------------------------------------------
# 菜单设置
# ---------------------------------------------------------------
# 用法: `Key: /link/ || icon`
# Key 菜单名，如果语言文件中有对应项，则用对应项，否则就用菜单名。
# `||` 前面部分，表示目标链接。
# `||` 后面部分，表示菜单的FontAwesome图标名。默认为question图标。
menu:
  home: / || home                        # 主页链接及其图标
  #about: /about/ || user                # 关于页链接及其图标
  #tags: /tags/ || tags                  # 标签页链接及其图标
  #categories: /categories/ || th        # 分类页链接及其图标
  archives: /archives/ || archive        # 归档页及其图标
  #schedule: /schedule/ || calendar
  #sitemap: /sitemap.xml || sitemap
  #commonweal: /404/ || heartbeat
menu_icons:
  enable: true                           # 是否启用图标


# ---------------------------------------------------------------
# 主题的主题设置
# ---------------------------------------------------------------
# 只能选择一套。
# Schemes
scheme: Muse
#scheme: Mist
#scheme: Pisces
#scheme: Gemini

# ---------------------------------------------------------------
# 侧边栏设置
# ---------------------------------------------------------------

# 社交链接
# 用法: `Key: permalink || icon`
# Key 是最终显示的标签，`||` 前是永久链接,`||` 后面是标签的FontAwesome图标，默认glob
#social:
  #GitHub: https://github.com/yourname || github
  #E-Mail: mailto:yourname@gmail.com || envelope
  #Google: https://plus.google.com/yourname || google
  #Twitter: https://twitter.com/yourname || twitter
  #FB Page: https://www.facebook.com/yourname || facebook
  #VK Group: https://vk.com/yourname || vk
  #StackOverflow: https://stackoverflow.com/yourname || stack-overflow
  #YouTube: https://youtube.com/yourname || youtube
  #Instagram: https://instagram.com/yourname || instagram
  #Skype: skype:yourname?call|chat || skype

social_icons:
  enable: true             # 是否在社交链接标签上显示图标
  icons_only: false        # 只显示图标
  transition: false        # 是否显示过渡效果

# 友情链接
links_icon: link                              # 链接图标
links_title: Links                            # 链接标签文字
links_layout: block                           # 链接样式
#links_layout: inline
#links:                                       # 一个一个的友情链接。用法为`标题： 链接`
  #Title: http://example.com/

# Sidebar Avatar                              # 侧边栏上个人头像图片。也支持是动态gif。
#avatar: /images/avatar.gif

# 在侧边栏中是否显示文章标题目录。
toc:
  enable: true                                # 是否
  number: true                                # 是否自动编号
  wrap: false                                 # 标题目录是否自动换行


# 创作声明
# http://creativecommons.org/
# Available: by | by-nc | by-nc-nd | by-nc-sa | by-nd | by-sa | zero
#creative_commons: by-nc-sa
#creative_commons:

sidebar:
  # 侧边栏位置: left | right (只有Pisces、Gemini有效).
  position: left
  #position: right

  # 侧边栏显示 (只对Muse、Mist有效)  
  display: post                               # 默认，在post文章扩展时显示。
  #display: always                            # 对所有页面都显示
  #display: hide                              # 只有点击按钮显示
  #display: remove                            # 完全删除，不显示

  # 侧边栏距离顶部菜单条的距离，单位像素(只对Pisces、Gemini有效).
  offset: 12
  b2t: false            # 在侧边栏下方是否显示回到顶部(只对Pisces、Gemini有效).
  scrollpercent: false  # 是否显示滚动百分比
  onmobile: false       # 是否在窄屏设备上显示侧边栏 (只对 Muse | Mist有效).

# ---------------------------------------------------------------
# 文章设置（post类型）
# ---------------------------------------------------------------
scroll_to_more: true      # 自动折叠<!--more-->下面的正文部分
save_scroll: false        # 自动为每篇文章保存滚动位置

# Automatically excerpt description in homepage as preamble text.
excerpt_description: true

# 自动摘要，不建议。请使用<!-- more -->精确控制
auto_excerpt:
  enable: false         # 启动开关
  length: 150           # 从开始往后选取的摘要文字数量。

# 摘要元数据
post_meta:
  item_text: true              # 是否显示“发表于”这几个文字
  created_at: true             # 文章创建日期
  updated_at: false            # 文章修改日期
  categories: true             # 文章所属分类

post_wordcount:                # 字数统计。依赖https://github.com/willin/hexo-wordcount
  item_text: true              # 是否显示文字
  wordcount: false             # 显示字数
  min2read: false              # 显示阅读时间
  totalcount: false            # 显示总数
  separated_meta: true         # 是否分开

#wechat_subscriber:            # 微信公众号订阅
  #enabled: true               # 是否启用
  #qcode:                      # 二维码图片链接
  #description:                # 描述性文字，会放在二维码上方

# 打赏
#reward_comment: # 打赏文字
#wechatpay: /images/wechatpay.jpg   # 微信打赏二维码
#alipay: /images/alipay.jpg         # 支付宝打赏二维码
#bitcoin: /images/bitcoin.png       # 比特币打赏二维码

post_copyright:
  enable: false                     # 文档许可声明
  license: CC BY-NC-SA 3.0          # 文档声明协议
  license_url: https://creativecommons.org/licenses/by-nc-sa/3.0/


# ---------------------------------------------------------------
# Misc 主题专用设置
# ---------------------------------------------------------------
# Reduce padding / margin indents on devices with narrow width.
mobile_layout_economy: false

# Android Chrome header panel color ($black-deep).
android_chrome_color: "#222"

# 定制Logo，只对默认Muse有效。
# Options:
#   enabled: [true/false] - # 是否启用
#   image: url-of-image   - # 图片url
custom_logo:
  enabled: false
  image:

# 代码高亮主题。可选值normal | night | night eighties | night blue | night bright
highlight_theme: normal

# ---------------------------------------------------------------
# 字体设置儿
# - 请从谷歌查找字体
# - 所有字体必须具有下列样式
#     light, light italic, normal, normal italic, bold, bold italic
font:
  enable: false                  # 是否启用
  host:                          # 字体host地址
  # Font options:                # 字体选项
  # `external: true`             # true，则会从上面的host地址装载
  # `family: Times New Roman`. 
  # `size: xx`. 单位是`px`.

  # 在<body>元素中设置全局字体
  global:
    external: true
    family: Lato
    size:

  # 标题（h1~h6字体，有global字体设置托底）
  headings:
    external: true
    family:
    size:

  # post文章字体，有global字体设置托底
  posts:
    external: true
    family:

   # logo字体设置，有global字体设置托底
  logo:
    external: true
    family:
    size:

  # 代码块字体
  codes:
    external: true
    family:
    size:


# ---------------------------------------------------------------
# 第三方服务设置
# ---------------------------------------------------------------

# MathJax数学公式设置
mathjax:
  enable: false
  per_page: false
  cdn: //cdn.bootcss.com/mathjax/2.7.1/latest.js?config=TeX-AMS-MML_HTMLorMML

# Han Support docs: https://hanzi.pro/
han: false

# Swiftype Search API Key
#swiftype_key:

#baidu_analytics:          # 百度分析的id
#duoshuo_shortname:        # 多说的shorname

# Disqus Disqus评论支持
disqus:
  enable: false
  shortname:
  count: true

# Hypercomments
#hypercomments_id:

# 畅言
changyan:                                        
  enable: false
  appid:
  appkey:


# 韩国来必力网站评论系统.https://valine.js.org
valine:
  enable: false
  appid:  # your leancloud application appid
  appkey:  # your leancloud application appkey
  notify: false # mail notifier , https://github.com/xCss/Valine/wiki
  verify: false # Verification code
  placeholder: Just go go # comment box placeholder
  avatar: mm # gravatar style
  guest_info: nick,mail,link # custom comment header
  pageSize: 10 # pagination size


# 友言评论
#youyan_uid: your uid

# LiveRe评论系统。从https://livere.com/insight/myCode获取uid
#livere_uid: your uid

# Gitment评论系统。https://imsun.net/posts/gitment-introduction/
# You can get your Github ID from https://api.github.com/users/<Github username>
gitment:
  enable: false
  mint: true # RECOMMEND, A mint on Gitment, to support count, language and proxy_gateway
  count: true # Show comments count in post meta area
  lazy: false # Comments lazy loading with a button
  cleanly: false # Hide 'Powered by ...' on footer, and more
  language: # Force language, or auto switch by theme
  github_user: # MUST HAVE, Your Github ID
  github_repo: # MUST HAVE, The repo you use to store Gitment comments
  client_id: # MUST HAVE, Github client id for the Gitment
  client_secret: # EITHER this or proxy_gateway, Github access secret token for the Gitment
  proxy_gateway: # Address of api proxy, See: https://github.com/aimingoo/intersect
  redirect_protocol: # Protocol of redirect_uri with force_redirect_protocol when mint enabled

# Baidu Share
# Available value:
#    button | slide
# Warning: Baidu Share does not support https.
#baidushare:
##  type: button

# Share
# This plugin is more useful in China, make sure you known how to use it.
# And you can find the use guide at official webiste: http://www.jiathis.com/.
# Warning: JiaThis does not support https.
#jiathis:
  ##uid: Get this uid from http://www.jiathis.com/
#add_this_id:

# Share
#duoshuo_share: true

# NeedMoreShare2
# This plugin is a pure javascript sharing lib which is useful in China.
# See: https://github.com/revir/need-more-share2
# Also see: https://github.com/DzmVasileusky/needShareButton
# iconStyle: default | box
# boxForm: horizontal | vertical
# position: top / middle / bottom + Left / Center / Right
# networks: Weibo,Wechat,Douban,QQZone,Twitter,Linkedin,Mailto,Reddit,
#           Delicious,StumbleUpon,Pinterest,Facebook,GooglePlus,Slashdot,
#           Technorati,Posterous,Tumblr,GoogleBookmarks,Newsvine,
#           Evernote,Friendfeed,Vkontakte,Odnoklassniki,Mailru
needmoreshare2:
  enable: false
  postbottom:
    enable: false
    options:
      iconStyle: box
      boxForm: horizontal
      position: bottomCenter
      networks: Weibo,Wechat,Douban,QQZone,Twitter,Facebook
  float:
    enable: false
    options:
      iconStyle: box
      boxForm: horizontal
      position: middleRight
      networks: Weibo,Wechat,Douban,QQZone,Twitter,Facebook

# Google Webmaster tools verification setting
# See: https://www.google.com/webmasters/
#google_site_verification:

# Google Analytics
#google_analytics:

# Bing Webmaster tools verification setting
# See: https://www.bing.com/webmaster/
#bing_site_verification:

# Yandex Webmaster tools verification setting
# See: https://webmaster.yandex.ru/
#yandex_site_verification:

# CNZZ count
#cnzz_siteid:

# Application Insights
# See https://azure.microsoft.com/en-us/services/application-insights/
# application_insights:

# Make duoshuo show UA
# user_id must NOT be null when admin_enable is true!
# you can visit http://dev.duoshuo.com get duoshuo user id.
duoshuo_info:
  ua_enable: true
  admin_enable: false
  user_id: 0
  #admin_nickname: Author

# Post widgets & FB/VK comments settings.
# ---------------------------------------------------------------
# Facebook SDK Support.
# https://github.com/iissnan/hexo-theme-next/pull/410
facebook_sdk:
  enable:       false
  app_id:       #<app_id>
  fb_admin:     #<user_id>
  like_button:  #true
  webmaster:    #true

# Facebook comments plugin
# This plugin depends on Facebook SDK.
# If facebook_sdk.enable is false, Facebook comments plugin is unavailable.
facebook_comments_plugin:
  enable:       false
  num_of_posts: 10    # min posts num is 1
  width:        100%  # default width is 550px
  scheme:       light # default scheme is light (light or dark)

# VKontakte API Support.
# To get your AppID visit https://vk.com/editapp?act=create
vkontakte_api:
  enable:       false
  app_id:       #<app_id>
  like:         true
  comments:     true
  num_of_posts: 10

# Star rating support to each article.
# To get your ID visit https://widgetpack.com
rating:
  enable: false
  id:     #<app_id>
  color:  fc6423
# ---------------------------------------------------------------

# Show number of visitors to each article.
# You can visit https://leancloud.cn get AppID and AppKey.
leancloud_visitors:
  enable: false
  app_id: #<app_id>
  app_key: #<app_key>

# Another tool to show number of visitors to each article.
# visit https://console.firebase.google.com/u/0/ to get apiKey and projectId
# visit https://firebase.google.com/docs/firestore/ to get more information about firestore
firestore:
  enable: false
  collection: articles #required, a string collection name to access firestore database
  apiKey: #required
  projectId: #required
  bluebird: false #enable this if you want to include bluebird 3.5.1(core version) Promise polyfill

# Show PV/UV of the website/page with busuanzi.
# Get more information on http://ibruce.info/2015/04/04/busuanzi/
busuanzi_count:
  # count values only if the other configs are false
  enable: false
  # custom uv span for the whole site
  site_uv: true
  site_uv_header: <i class="fa fa-user"></i>
  site_uv_footer:
  # custom pv span for the whole site
  site_pv: true
  site_pv_header: <i class="fa fa-eye"></i>
  site_pv_footer:
  # custom pv span for one page only
  page_pv: true
  page_pv_header: <i class="fa fa-file-o"></i>
  page_pv_footer:


# Tencent analytics ID
# tencent_analytics:

# Tencent MTA ID
# tencent_mta:


# Enable baidu push so that the blog will push the url to baidu automatically which is very helpful for SEO
baidu_push: false

# Google Calendar
# Share your recent schedule to others via calendar page
#
# API Documentation:
# https://developers.google.com/google-apps/calendar/v3/reference/events/list
calendar:
  enable: false
  calendar_id: <required>
  api_key: <required>
  orderBy: startTime
  offsetMax: 24
  offsetMin: 4
  timeZone:
  showDeleted: false
  singleEvents: true
  maxResults: 250

# Algolia Search
algolia_search:
  enable: false
  hits:
    per_page: 10
  labels:
    input_placeholder: Search for Posts
    hits_empty: "We didn't find any results for the search: ${query}"
    hits_stats: "${hits} results found in ${time} ms"

# Local search
# Dependencies: https://github.com/flashlab/hexo-generator-search
local_search:
  enable: false
  # if auto, trigger search by changing input
  # if manual, trigger search by pressing enter key or search button
  trigger: auto
  # show top n results per article, show all results by setting to -1
  top_n_per_article: 1


# ---------------------------------------------------------------
# 标签设置
# ---------------------------------------------------------------
# 对外链采用BASE64进行加密解密
# 用法: {% exturl text url "title" %}
# 别名: {% extlink text url "title" %}
exturl: false    # 是否对外链进行加密解密

# Note tag (bs-callout).
note:
  # Note tag style values:
  #  - simple    bs-callout old alert style. Default.
  #  - modern    bs-callout new (v2-v3) alert style.
  #  - flat      flat callout style with background, like on Mozilla or StackOverflow.
  #  - disabled  disable all CSS styles import of note tag.
  style: simple
  icons: false
  border_radius: 3
  # Offset lighter of background in % for modern and flat styles (modern: -12 | 12; flat: -18 | 6).
  # Offset also applied to label tag variables. This option can work with disabled note tag.
  light_bg_offset: 0

# Label tag.
label: true

# Tabs tag.
tabs:
  enable: true
  transition:
    tabs: false
    labels: true
  border_radius: 0


#! ---------------------------------------------------------------
#! 下面慎重修改，除非你指定它的意义
#! ---------------------------------------------------------------

# Use velocity to animate everything.
motion:
  enable: true
  async: false
  transition:
    # Transition variants:
    # fadeIn | fadeOut | flipXIn | flipXOut | flipYIn | flipYOut | flipBounceXIn | flipBounceXOut | flipBounceYIn | flipBounceYOut
    # swoopIn | swoopOut | whirlIn | whirlOut | shrinkIn | shrinkOut | expandIn | expandOut
    # bounceIn | bounceOut | bounceUpIn | bounceUpOut | bounceDownIn | bounceDownOut | bounceLeftIn | bounceLeftOut | bounceRightIn | bounceRightOut
    # slideUpIn | slideUpOut | slideDownIn | slideDownOut | slideLeftIn | slideLeftOut | slideRightIn | slideRightOut
    # slideUpBigIn | slideUpBigOut | slideDownBigIn | slideDownBigOut | slideLeftBigIn | slideLeftBigOut | slideRightBigIn | slideRightBigOut
    # perspectiveUpIn | perspectiveUpOut | perspectiveDownIn | perspectiveDownOut | perspectiveLeftIn | perspectiveLeftOut | perspectiveRightIn | perspectiveRightOut
    post_block: fadeIn
    post_header: slideDownIn
    post_body: slideDownIn
    coll_header: slideLeftIn
    # Only for Pisces | Gemini.
    sidebar: slideUpIn

# Fancybox
fancybox: true

# Progress bar in the top during page loading.
pace: false
# Themes list:
#pace-theme-big-counter
#pace-theme-bounce
#pace-theme-barber-shop
#pace-theme-center-atom
#pace-theme-center-circle
#pace-theme-center-radar
#pace-theme-center-simple
#pace-theme-corner-indicator
#pace-theme-fill-left
#pace-theme-flash
#pace-theme-loading-bar
#pace-theme-mac-osx
#pace-theme-minimal
# For example
# pace_theme: pace-theme-center-simple
pace_theme: pace-theme-minimal

# Canvas-nest
canvas_nest: false

# three_waves
three_waves: false

# canvas_lines
canvas_lines: false

# canvas_sphere
canvas_sphere: false

# Only fit scheme Pisces
# Canvas-ribbon
# size: The width of the ribbon.
# alpha: The transparency of the ribbon.
# zIndex: The display level of the ribbon.
canvas_ribbon:
  enable: false
  size: 300
  alpha: 0.6
  zIndex: -1

# 脚本提供者设置。
# 为js文件指定CDN，加快加载速度
# 注意，CDN版本一致。如果CDN提供https，无别加上https协议。
vendors:
  _internal: lib    # 本网站提供脚本的路径，不要轻易修改。
  
  jquery:    https://cdn.bootcss.com/jquery/2.1.3/jquery.min.js # 内部版本2.1.3。CDN版本应一致

  fancybox:        # 内部版本2.1.5。
  fancybox_css:
  fastclick:       # 内部版本1.0.6。
  lazyload:        # 内部版本1.9.7。
  velocity:        # 内部版本1.2.1。
  velocity_ui:     # 内部版本1.2.1。
  ua_parser:       # 内部版本0.7.9。
  fontawesome:     # 内部版本4.6.2
  algolia_instant_js:    fontawesome:    # 内部版本 1
  algolia_instant_css:
  pace:            # 内部版本 1.0.2。
  pace_css:
  canvas_nest:     # 内部版本 1.0.0
  three:           # 3D脚本库，未指定内部版本
  three_waves:     # 未指定内部版本
  canvas_lines:    # 未指定内部版本
  canvas_sphere:   # 未指定内部版本
  canvas_ribbon:   # 内部版本 1.0.0
  han:             # 内部版本 3.3.0
  needMoreShare2:  # 未指定内部版本

# 资源种类
css: css
js: js
images: images

# Theme version
version: 5.1.4    

```

