# B站动态转发抽奖小程序
本应用是 使用node.js+html+Jquery+bootstrap完成, 需要node环境支持, 通过抓取B站特定动态的都转换列表, 来实现抽奖功能, 抽奖过程 因为个人爱好变得游戏化了, 感觉很有趣

## 开发原因
卑微的UP主竟然用不了官方的抽奖工具, 只能自己写一个了

## 优化问题
因为时间紧, 代码写的很魔幻, 也没打算后续再花时间优化, 有人感兴趣的话, 可以接手整改下

## 运行方法
1. 安装nodejs环境
2. 在本项目文件夹里打开命令行 运行 `npm install` 安装下载依赖文件
3. 运行 `npm start` 启动项目
4. 用游览器访问 [http://localhost:3000/ ](http://localhost:3000/  "http://localhost:3000/ ").

## 如何更改默认端口和b站api地址
1. 重命名 `.env.sample` 改成 `.env` 
2. 替换掉里面的变量即可

# bilibili_dynamic_lottery
This application is completed using node.js+html+Jquery+bootstrap, needs node environment support, the lottery function is base on the repost list of a specific dynamic message of Bilibili, the program is going the get the list and select a winner by random, the process of select is a simple game. 

## Reason for development
Because my bilibili account can't use the official lottery tool of Bilibili, so I wrote one by himself


## Optimization
Because the time is tight, the code written are very unordered and unoptimized, and I don't plan to spend another time to rewrite it . If anyone is interested, please help me optimize.

## how to use
1. Install nodejs environment
2. Open the command line in the project folder and run `npm install` to install and download dependent files
3. Run `npm start` to start the project
4. Use the browser to access [http://localhost:3000/ ](http://localhost:3000/ "http://localhost:3000/ ").

## How to change the default port and Bilibili API address
1. Rename `.env.sample` to `.env`
2. Just replace the variables inside
