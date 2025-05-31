<p align="center">
    <img src="./vue/public/logo.png" width="250" height="250">
</p>

# B站在线抽奖工具
本工具可以从B站 (视频/动态) 中提取出 (评论/转发/点赞) 用户列表, 然后随机选出中奖者


# 在线使用地址
[https://bilibili.mikuclub.cc/](https://bilibili.mikuclub.cc/ "https://bilibili.mikuclub.cc/")

# 参考文档
[SocialSisterYi/bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect/tree/master "SocialSisterYi/bilibili-API-collect")

# 贡献名单
| 头像 | 用户名 |
| ---- | ------ |
| <a href="https://github.com/monoglo"><img src="https://avatars.githubusercontent.com/u/26409918?v=4" width="50" /></a> | [monoglo](https://github.com/monoglo) |
| <a href="https://github.com/sakmist"><img src="https://avatars.githubusercontent.com/u/123816165?v=4" width="50" /></a> | [sakmist](https://github.com/sakmist) |


# 后端的部署方法
1. 需要一台支持PHP环境的服务器
2. 把项目除了 `vue` 目录以外的文件部署到网站的目录下
3. 重命名`api`目录里的 `.env.example.php` 改成 `.env.php`
4. 重命名`config`目录里的 `cookie.example.txt` 改成 `cookie.txt` 
5. 然后创建一个B站小号登陆B站, 把账号使用的cookie字符串复制到 `cookie.txt` 文件内
6. 项目的访问入口为api目录里的 `index.php` , 部署完成后就能通过 api路径访问 例子: https://www.abcd/api/index.php

# 前端的部署方法
1. 安装Nodejs+npm
2. 在`vue`目录里打开命令行 运行 `npm install` 安装下载依赖文件
3. 重命名vue目录里的 `.env.example` 改成 `.env`
4. 根据注释 修改 `.env` 文件里的变量数值
4. 运行 `npm run dev` 可以本地调试前端项目
5. 运行  `npm run build` 可以生成 `dist` 目录, 里面包含构建好的前端代码
6. 把 `dist` 目录里的文件部署到前端的服务器

