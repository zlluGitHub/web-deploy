#  Web Deploy 前端自动化部署平台

### 简述
Web Deploy 前端自动化部署平台，一个专门部署 Web 前端的自动化部署平台，相较于强大的Jenkins更加配置简单、使用更加方便快捷！支持发布版本回滚、各种Web代码的一键部署发布等。


### 技术栈
- 前端： Vue（全家桶）、font-awesome、view-design
- 后端：Nodejs、Express、Multer
- 数据库：MongoDB

### 功能点
- 项目静态部署
- 一键自动部署
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

## 快速启动项目

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