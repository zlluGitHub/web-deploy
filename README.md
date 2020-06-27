<p align="center"><a href="http://swd.zhenglinglu.cn" target="_blank"><img width="160"src="https://zllugithub.github.io/web-deploy/images/logo.png"></a></p>
<h2 align="center">Web Deploy 前端自动化部署平台</h2>

---
### 简述
Web Deploy 前端自动化部署平台，一个专门部署 Web 前端的自动化部署平台，相较于强大的Jenkins更加配置简单、使用更加方便快捷！支持发布版本回滚、各种Web代码的一键部署发布等，另外此平台中包含基于 vue-cli3.0 开发的 vue 项目开发脚手架 swt-cli ,此脚手架中已安装好我们经常用的一些包并对目录结构进行了部分整改，以便利于后期开发。若有任何疑问欢迎在  [Issues](https://github.com/zlluGitHub/web-deploy/issues)  留言一起讨论。本项目持续更新中...  ٩(๑>◡<๑)۶ 
- 演示地址：[http://swd.zhenglinglu.cn](http://swd.zhenglinglu.cn)
- 说明文档：[https://zllugithub.github.io/web-deploy/README.html](https://zllugithub.github.io/web-deploy/README.html)

### 主要技术栈
- 前端： Vue（全家桶）、font-awesome、view-design
- 后端：Nodejs、Express、Multer、MongoDB、git、pm2

### 主要功能点
- 项目静态部署
- Git自动部署
- 项目版本回滚部署
- 支持多个项目部署

### 示意图
![image](https://zllugithub.github.io/web-deploy/images/20200626121718.jpg)

## 快速开始配置环境

### 环境要求
- 操作系统 Centos 或者 Ubuntu

### 安装（以 Centos 为例）

#### 1、安装Git
````bash
yum install git
````
确认Git已经安装成功
````bash
git version
````
若出现版本号则安装成功！
#### 2、安装 Nodejs LTS版本
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
参考资料：[CentOS 7上安装 Node.js 的 4 种方法（包含npm）](http://zhenglinglu.cn/detail?id=fHPUroAoogKKOczW613W)
#### 3、安装cnpm
````bash
npm install cnpm -g --registry=https://r.npm.taobao.org
````
参考资料：https://developer.aliyun.com/mirror/npm/package/cnpm

#### 4、安装pm2
````bash
npm install -g pm2
````
确认pm2已经安装成功
````bash
git -v
````
若出现版本号则安装成功！参考资料：[Linux（centos7）下 pm2 的安装步骤及问题总结](http://zhenglinglu.cn/detail?id=826b0a9ae0219362495a27de03847f)

#### 5、安装 MongoDB
````bash
//下载mongodb包 
wget http://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel70-4.0.1.tgz
//解压mongodb包
tar xzvf mongodb-linux-x86_64-rhel70-4.0.1.tgz
//重命名
mv mongodb-linux-x86_64-rhel70-4.0.1 mongodbserver
````
参考资料：[linux 下 mongodb 的安装及配置](http://zhenglinglu.cn/detail?id=76174b6ab88f388ff08db75f06e2e3)

## 快速安装平台

#### 1、全局安装构建 Web Deploy 的脚手架 swd-cli
````bash
npm install swd-cli -g
````
判断是否安装成功
````bash
swd -v
````
若出现版本号，则安装成功！

#### 2、使用 swd 命令构建 Web Deploy 平台
````bash
swd install web-deploy
````
其中 web-deploy 为项目存放的文件夹，可以随意命名。
#### 3、快速运行
测试
````bash
cd web-deploy/bin
node ./www
````
若测试没有问题，则可以使用 pm2 使进程常驻后台
````bash
cd web-deploy/bin
pm2 start ./www
````
## 安装示意图
以 Linux CentOS 7 为例
![image](https://zllugithub.github.io/web-deploy/images/20200627070846.jpg)
## 快速构建项目模板
#### 1、其中 my-template 为需要构建的项目名称，可随意更改。
````bash
swt install my-template
````
#### 2、所包含的安装包
````json
{
    "dependencies": {
    "axios": "^0.19.2",
    "core-js": "^3.6.4",
    "echarts": "^4.7.0",
    "echarts-liquidfill": "^2.0.6",
    "font-awesome": "^4.7.0",
    "mockjs": "^1.1.0",
    "postcss-px2rem": "^0.3.0",
    "view-design": "^4.0.2",
    "vue": "^2.6.11",
    "vue-router": "^3.1.3",
    "vuex": "^3.1.2"
  },
  "devDependencies": {
    "@vue/cli-plugin-babel": "^4.3.0",
    "@vue/cli-plugin-eslint": "^4.3.0",
    "@vue/cli-service": "^4.3.0",
    "babel-eslint": "^10.1.0",
    "compression-webpack-plugin": "^3.1.0",
    "cross-env": "^6.0.3",
    "eslint": "^6.7.2",
    "eslint-plugin-vue": "^6.2.2",
    "lib-flexible": "^0.3.2",
    "node-sass": "^4.13.0",
    "sass-loader": "^8.0.0",
    "vue-template-compiler": "^2.6.11",
    "webpack-bundle-analyzer": "^3.6.0"
  }
}
````
#### 3、目录结构示意图
![image](https://zllugithub.github.io/web-deploy/images/20200627073035.jpg)

## 界面示例
##### 登录界面
![image](https://zllugithub.github.io/web-deploy/images/index.jpg)
##### 首页
![image](https://zllugithub.github.io/web-deploy/images/0200625145438.jpg)
##### 静态部署界面
![image](https://zllugithub.github.io/web-deploy/images/20200625145514.jpg)
##### 自动化部署界面
![image](https://zllugithub.github.io/web-deploy/images/20200625145530.png)
##### 项目列表界面
![image](https://zllugithub.github.io/web-deploy/images/20200625145547.jpg)