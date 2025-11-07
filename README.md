<p align="center">
    <img src="./vue/public/logo.png" width="250" height="250">
</p>

# B站在线抽奖工具

本工具可以从B站 (视频/动态) 中提取出 (评论/转发/点赞) 用户列表, 然后随机选出中奖者。

支持以下功能：
- 从视频或动态中提取评论、转发、点赞用户
- 随机抽取中奖用户
- 检测用户是否完成评论+点赞+转发全部要求
- 登陆B站账号后查询，可降低触发风控的概率
- 一键查询目标用户是否为自己的粉丝

## 在线使用地址
[https://bilibili.mikuclub.cc/](https://bilibili.mikuclub.cc/ "https://bilibili.mikuclub.cc/")

## 浏览器插件版本

为了进一步降低触发B站风控的概率，我们还提供了浏览器插件版本。插件通过本地浏览器读取互动数据，避免服务器高频请求，具有以下优势：

- 减少接口限流风险
- 保留与在线工具一致的操作体验
- 支持离线保存抽奖过程，方便日后复盘与公示

### 支持的浏览器
- Chrome / Edge / 360 等 Chromium 浏览器
- Firefox

### 安装方法
1. 下载 `Bilibili-Lottery-Local-Extension.zip` 并解压
2. 在浏览器中加载已解压的扩展程序
   - Chrome/Edge: 打开 `chrome://extensions` 或 `edge://extensions`，开启「开发者模式」，点击「加载已解压的扩展程序」
   - Firefox: 将文件夹压缩为 `.xpi` 文件，在 `about:debugging` 中加载

## 参考文档
[SocialSisterYi/bilibili-API-collect](https://github.com/SocialSisterYi/bilibili-API-collect/tree/master "SocialSisterYi/bilibili-API-collect")

## 贡献名单
| 头像 | 用户名 |
| ---- | ------ |
| <a href="https://github.com/monoglo"><img src="https://avatars.githubusercontent.com/u/26409918?v=4" width="50" /></a> | [monoglo](https://github.com/monoglo) |
| <a href="https://github.com/sakmist"><img src="https://avatars.githubusercontent.com/u/123816165?v=4" width="50" /></a> | [sakmist](https://github.com/sakmist) |


## 后端的部署方法
1. 需要一台支持PHP环境的服务器
2. 把项目除了 `vue` 目录以外的文件部署到网站的目录下
3. 重命名`api`目录里的 `.env.example.php` 改成 `.env.php`
4. 重命名`config`目录里的 `cookie.example.txt` 改成 `cookie.txt` 
5. 然后创建一个B站小号登陆B站, 把账号使用的cookie字符串复制到 `cookie.txt` 文件内
6. 项目的访问入口为api目录里的 `index.php` , 部署完成后就能通过 api路径访问 例子: https://www.abcd/api/index.php

## 前端的部署方法
1. 安装Nodejs+npm
2. 在`vue`目录里打开命令行 运行 `npm install` 安装下载依赖文件
3. 重命名vue目录里的 `.env.example` 改成 `.env`
4. 根据注释 修改 `.env` 文件里的变量数值
5. 运行 `npm run dev` 可以本地调试前端项目
6. 运行  `npm run build` 可以生成 `dist` 目录, 里面包含构建好的前端代码
7. 把 `dist` 目录里的文件部署到前端的服务器

## 注意事项
1. 记得手动修改Web服务器软件（Nginx/Apache2）的PHP Fast CGI请求超时时间，不然容易在抓取B站数据的过程中后台返回网关504错误，导致请求被中断 Network response was not ok.
2. 如果有使用PHP-FPM, 也需要修改单个FPM进程允许的最大执行时间 (request_terminate_timeout)， 避免PHP脚本被强行关闭.

