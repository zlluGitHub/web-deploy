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

## 快速开始

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
参考资料：[CentOS 7上安装 Node.js 的 4 种方法（包含npm）](http://zhenglinglu.cn/detail?id=fHPUroAoogKKOczW613W)
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
#### 3、安装cnpm
参考资料：https://developer.aliyun.com/mirror/npm/package/cnpm
````bash
npm install cnpm -g
````

#### 4、安装 MongoDB
参考资料：[linux 下 mongodb 的安装及配置](http://zhenglinglu.cn/detail?id=76174b6ab88f388ff08db75f06e2e3)
````bash
//下载mongodb包 
wget http://fastdl.mongodb.org/linux/mongodb-linux-x86_64-rhel70-4.0.1.tgz
//解压mongodb包
tar xzvf mongodb-linux-x86_64-rhel70-4.0.1.tgz
//重命名
mv mongodb-linux-x86_64-rhel70-4.0.1 mongodbserver
````
#### 5、启动项目
4.1、打开 shell 工具 git clone 项目
````bash
git clone https://github.com/zlluGitHub/swd-server.git
cd swd-server
````
4.2、安装依赖
````bash
cnpm install 或 npm i
````
4.3、运行
````bash
node ./bin/www
````
启动后若无报错则说明Node服务运行在82端口上。