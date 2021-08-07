<p align="center"><a href="http://swd.zhenglinglu.cn" target="_blank"><img width="160"src="./images/logo.png"></a></p>

<!-- # Web Deploy 前端自动化部署平台 -->
<h1 align="center">Web Deploy 前端自动化部署平台</h1>

---

## 简述
Web Deploy 前端自动化部署平台，一个专门部署 Web 前端的自动化部署平台，相较于强大的 Jenkins 配置更加简单、使用更加方便快捷！支持发布版本回滚、各种 Web 的跨域部署等，目前此平台支持静态资源、 Vue、React 项目部署，以及自动远程服务部署。若有任何疑问欢迎在  [Issues](https://github.com/zlluGitHub/web-deploy/issues)  留言一起讨论。本项目将持续更新中...  ٩(๑>◡<๑)۶ 
<!-- - 演示地址：[http://swd.zhenglinglu.cn](http://swd.zhenglinglu.cn) -->
<!-- - GitHub：[https://github.com/zlluGitHub/web-deploy](https://github.com/zlluGitHub/web-deploy) -->
<!-- - 说明文档：[https://zllugithub.github.io/web-deploy/](https://zllugithub.github.io/web-deploy/) -->

## 主要技术栈
- 前端：Vue（全家桶）、font-awesome、view-design
- 后端：Nodejs、MongoDB、Express
- 工具：npm、git、pm2

## 主要功能点
【✔】前端项目静态部署，指部署打包后的静态资源（已完成）

【✔】Git 自动部署，包括 GitHub、GitLab、Gitee、Gitea代码托管平台关联部署（已完成）

【✔】项目版本回滚部署，每个版本间可以进行切换部署（已完成）

【✔】支持多个项目部署，各项目之间互不影响（已完成）

【✔】各项目支持跨域（多个）请求部署（已完成）

【✔】支持 OAuth（github、gitlab、gitee）第三方登录（已完成）

【✔】支持项目部署服务的暂停/启动（已完成）

【✔】支持自动部署服务的暂停/启动（已完成）

【✔】支持部署项目的 history/hash 访问模式（已完成）

【新增】Gitea代码托管平台关联部署

【新增】支持私有仓库自动化部署

【新增】支持远程静态部署、Git 自动部署（已完成）

## 更新日志
#### 2021-8-07 更新：
1. 新增 Gitea OAuth2 应用第三方登录

#### 2021-7-18 更新：
1. 更新优化服务端构建流程

2. 新增支持私有仓库自动化部署功能

3. 新增 Gitea 代码托管平台关联部署、远程静态部署


## 简易示意图
![image](./images/20200626121718.jpg)

## 部分截图

- 登录部分

![image](./images/9.png)

- 首页部分

![image](./images/6.png)

- 自动部署

![image](./images/7.png)

- 静态部署

![image](./images/8.png)

- 远程部署

![image](./images/20210718184133.png)

- 部署列表

![image](./images/4.png)

- 部署日志部分

![image](./images/2.png)

![image](./images/3.png)

## 快速开始配置环境

### 环境要求
操作系统 Centos 或者 Ubuntu

### 安装（以 Centos 为例）

#### 安装Git
````bash
yum install git
````
确认Git已经安装成功
````bash
git version
````
若出现版本号则安装成功！
#### 安装 Nodejs LTS版本
````bash
wget https://nodejs.org/dist/v13.1.0/node-v13.1.0-linux-x64.tar.xz
xz -d node-v13.1.0-linux-x64.tar.xz
tar -xvf node-v13.1.0-linux-x64.tar.xz
````
Nodejs 安装成功后配置一下环境变量，即可。
````bash
node -v
npm -v
````
若出现版本号则安装成功！
参考资料：[CentOS 7上安装 Node.js 的 4 种方法（包含npm）](http://zhenglinglu.cn/artical?bid=5bda9b07-5810-4c51-aad1-8121e22c3858&pwd=%2Fnode)
#### 安装cnpm
````bash
npm install cnpm -g --registry=https://r.npm.taobao.org
````
参考资料：https://developer.aliyun.com/mirror/npm/package/cnpm

#### 安装pm2
````bash
npm install -g pm2
````
确认pm2已经安装成功
````bash
git -v
````
若出现版本号则安装成功！参考资料：[Linux（centos7）下 pm2 的安装步骤及问题总结](http://zhenglinglu.cn/artical?bid=1c5089d6-c82b-4253-9201-52600d6006e1&pwd=%2Fweb)

#### 安装 MongoDB
````bash
//下载mongodb包 
wget http://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel70-4.0.1.tgz
//解压mongodb包
tar xzvf mongodb-linux-x86_64-rhel70-4.0.1.tgz
//重命名
mv mongodb-linux-x86_64-rhel70-4.0.1 mongodbserver
````
参考资料：[linux 下 mongodb 的安装及配置](http://zhenglinglu.cn/artical?bid=da0e9ecf-0560-4588-8278-97ed88847549&pwd=%2Fmongodb)

## 快速安装使用
以 Linux CentOS 7 为例
```bash
git clone https://github.com/zlluGitHub/web-deploy.git
node ./lib/www
```
或者使用 pm2 使进程常驻后台
```bash
git clone https://github.com/zlluGitHub/web-deploy.git
pm2 start ./lib/www --name=web-deploy
```
### 配置文件 config.json 说明
```js
{
    "database": {
      "name": "SimpleDesignNew", //数据库名称
      "port": "27017",  //数据库端口
      "ip": "127.0.0.1",  //数据库ip 
      "username": "",  //用户名
      "password": ""  //用户密码 
    },
    "port": 80, //项目启动端口
    "oauth": { // 第三方登录相关配置
        "github": {
            "state": false, //如需开启请设置成 true ,默认 false
            "client_ID": "", // 客户ID
            "client_Secret": "", // 客户密匙
            "access_token_url": "https://github.com/login/oauth/access_token", // 获取 access_token 地址
            "authorize_url":"",
            "user_info_url": "https://api.github.com/user", // 获取用户信息
            "name": "你的github账号名称" 
        },
        "gitee": {
            "state": false, //如需开启请设置成 true ,默认 false
            "client_ID": "", // 客户ID
            "client_Secret": "", // 客户密匙
            "headers": {  //请求头配置
                "User-Agent": "你的gitee用户名" 
            },
            "authorize_url":"",
            "access_token_url": "https://gitee.com/oauth/token",// 获取 access_token 地址
            "user_info_url": "https://gitee.com/api/v5/user" // 获取用户信息
        },
        "gitlab": {
            "state": false, //如需开启请设置成 true ,默认 false
            "client_ID": "", // 客户ID
            "client_Secret": "", // 客户密匙
            "authorize_url":"", 
            "access_token_url": "", // 获取 access_token 地址
            "user_info_url": "" // 获取用户信息
        }
    }
}
```

### 开启第三方登录
此平台已支持 `github`、`gitlab`、`gitee` 这三种登录方式，首先，需要在根目录下找到 config.json 配置文件，添加如下内容（根据自身需求添加即可）
````js
{
  ...
  ...

  "oauth": {
    "github": {
      "state": true, 
      "client_ID": "",
      "client_Secret": "",
      "authorize_url":"",
      "access_token_url": "",
      "user_info_url": "",
      "name": ""
    },
    "gitee": {
      "state": true, 
      "headers": {  
        "User-Agent": "" 
      },
      "client_ID": "",
      "client_Secret": "",
      "authorize_url":"",
      "access_token_url": "",
      "user_info_url": ""
    },
    "gitlab": { 
      "state": true,
      "client_ID": "",
      "client_Secret": "",
      "authorize_url":"",
      "access_token_url": "",
      "user_info_url": ""
    }
  }
}
````
**属性说明**
| 属性             | 说明                                          |
|------------------|-----------------------------------------------|
| state            | 开启状态（ `true` 或 `false` ）               |
| client_ID        | 用户编号。在自己的 `git` 上获取               |
| client_Secret    | 用户秘钥。在自己的 `git` 上获取               |
| authorize_url    | 获取 authorize 的 `url`                       |
| access_token_url | 获取令牌 `access_token` 的 `url`              |
| user_info_url    | 获取用户信息的 `url`                          |
| name             | `github` 账号名称（只有 `github` 需要此配置） |
根据自身需求添加对应第三方配置即可。
 

## 项目部署说明
### 静态部署
这种部署适用于一些静态资源的部署，部署方式如下：
1、填写（选择）项目名称；
2、填写你要部署的根目录；
3、若部署项目存在跨域问题，可在这里填写代理地址（选填）；
4、点击上传你要部署的项目打包目录文件；
5、填写项目的部署摘要内容；
6、点击提交部署即可；

![image](./images/8.png)

### 自动化部署
1、填写（选择）项目名称；
2、填写你要部署的根目录；
3、若部署项目存在跨域问题，可在这里填写代理地址（选填）；
4、填写你要部署的项目的 Git 地址；
5、填写你要部署的项目的 Git 分支，默认 master；
6、填写项目的打包部署命令，例如：npm run build；
7、根据项目实际的打包目录为准，默认：dist；
8、填写项目的部署摘要内容；
9、点击提交部署即可；

![image](./images/7.png)

注意：此部署方式部署时间会根据项目的大小而不同，请耐心等待即可，另外，部署成功之后会返回一个 key 值，此 key 值将用于关联Git。

<!-- ![image](./images/5.png) -->

### 关联 Git 实现自动部署
#### 关联 gitea 
1、配置 webhook 相关钩子链接，打开 gitea 找到需要部署的项目仓库 -> Settings -> Webhooks -> Add webhook；

![image](./images/b_20200705163216.jpg)

2、填入相关配置信息

![image](./images/b_20200705164219.jpg)

3、点击 Add Webhook 配置成功

![image](./images/b_20200705164637.jpg)

#### 关联 gitlab
1、由于仓库的公开程度是 Private 需将其设置成 Public，打开 gitlab 找到需要部署的项目仓库 -> Settings -> General

![image](./images/l_20200705172837.jpg)

2、配置 webhook 相关钩子链接，打开 gitlab 找到需要部署的项目仓库 -> Settings -> Integrations；

![image](./images/l_20200705172359.jpg)

3、填入相关配置信息

![image](./images/l_20200705171905.jpg)

4、点击 Add Webhook 配置成功

![image](./images/l_20200705172240.jpg)

#### 关联 github 
1、配置 webhook 相关钩子链接，打开 github 找到需要部署的项目仓库 -> Settings -> Webhooks -> Add webhook；

![image](./images/g_20200705165340.jpg)

2、填入相关配置信息

![image](./images/g_20200705170758.jpg)

3、点击 Add Webhook 配置成功

![image](./images/g_20200705171043.jpg)

