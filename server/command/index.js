const shell = require('shelljs');
const path = require('path');
const backupsPath = '../../backups'
const wwwPath = '../../www'
const logger = require('../logs/index.js');

module.exports = {
    // 拉取项目
    cloneProject: async (git, branch, conn, commitBid) => {
        let message = '拉取项目中...'
        await logger.updateCommit({
            type: 'clone',
            state: false,
            message
        }, commitBid)
        conn.sendText(message)
        let result = await shell.exec(`git clone -b ${branch} ${git}`, {
            cwd: path.join(__dirname, backupsPath),
        })
        // //console.log(result);
        if (result.code === 0) {
            let message = '项目拉取成功！'
            // await logger.updateCommit({
            //     type: 'clone',
            //     state: false,
            //     message
            // }, commitBid)
            // conn.sendText(message)
            console.log(message);
            return true
        } else {
            let message = result.stderr
            await logger.updateCommit({
                type: 'clone',
                state: false,
                message
            }, commitBid)
            conn.sendText(message)
            return false
        }
    },
    //安装依赖文件
    initPackage: async (project, init, conn, commitBid) => {
        // console.log('安装依赖文件中...');

        if (init.indexOf('cnpm') > -1 && !shell.which('cnpm')) {
            let message = 'cnpm 命令不存在，请安装后重新部署！'
            await logger.updateCommit({
                type: 'install',
                state: false,
                message
            }, commitBid)
            conn.sendText(message)
            res.json({ message, result: false, code: 500 });
            shell.exit(1);
        }

        let message = '安装依赖文件中...'
        await logger.updateCommit({
            type: 'install',
            state: false,
            message
        }, commitBid)
        conn.sendText(message)

        let result = await shell.exec(init, {
            cwd: path.join(__dirname, `${backupsPath}/${project}`),
        })

        if (result.code === 0) {
            let message = '依赖包安装成功！'
            // await logger.updateCommit({
            //     type: 'install',
            //     state: false,
            //     message
            // }, commitBid)
            // conn.sendText(message)
            console.log(message);
            return true
        } else {
            let message = result.stderr
            await logger.updateCommit({
                type: 'install',
                state: false,
                message
            }, commitBid)
            conn.sendText(message)
            return false
        }

    },
    //打包文件
    buildProject: async (project, build, conn, commitBid) => {
        let message = '打包项目中...'
        await logger.updateCommit({
            type: 'build',
            state: false,
            message
        }, commitBid)
        conn.sendText(message)

        let result = await shell.exec(build, {
            cwd: path.join(__dirname, `${backupsPath}/${project}`),
        })
        //console.log(result);
        if (result.code === 0) {
            let message = '项目打包成功！'
            // await logger.updateCommit({
            //     type: 'build',
            //     state: false,
            //     message
            // }, commitBid)
            // conn.sendText(message)
            console.log(message);
            return true
        } else {
            let message = result.stderr
            await logger.updateCommit({
                type: 'build',
                state: false,
                message
            }, commitBid)
            conn.sendText(message)
            return false
        }

    },
    //删除项目文件夹
    deleteProject: async (project, conn, commitBid) => {

        let message = '删除项目中...'
        await logger.updateCommit({
            type: 'clone',
            state: false,
            message
        }, commitBid)
        conn.sendText(message)

        let result = await shell.exec(`rm -rf ./${project}`, {
            cwd: path.join(__dirname, backupsPath),
        })
        //console.log(result);
        if (result.code === 0) {
            let message = '项目已删除成功！'
            // await logger.updateCommit({
            //     type: 'clone',
            //     state: false,
            //     message
            // }, commitBid)
            // conn.sendText(message)
            console.log(message);
            return true
        } else {
            let message = result.stderr
            await logger.updateCommit({
                type: 'clone',
                state: false,
                message
            }, commitBid)
            conn.sendText(message)
            return false
        }
    },
    //删除项目依赖包
    deleteNodeModule: async (project, conn, commitBid) => {
        let message = '删除项目依赖包中...'
        await logger.updateCommit({
            type: 'install',
            state: false,
            message
        }, commitBid)
        conn.sendText(message)

        let result = await shell.exec(`rm -rf ./${project}/node_modules`, {
            cwd: path.join(__dirname, backupsPath),
        })
        //console.log(result);
        if (result.code === 0) {
            let message = '项目依赖包已删除成功！'
            // await logger.updateCommit({
            //     type: 'install',
            //     state: false,
            //     message
            // }, commitBid)
            // conn.sendText(message)
            console.log(message);
            return true
        } else {
            let message = result.stderr
            await logger.updateCommit({
                type: 'install',
                state: false,
                message
            }, commitBid)
            conn.sendText(message)
            return false
        }
    },
    //删除www部署文件夹
    deleteRoot: async (www, conn, commitBid) => {
        let message = '删除www部署文件中...'
        await logger.updateCommit({
            type: 'deploy',
            state: false,
            message
        }, commitBid)
        conn.sendText(message)

        let result = await shell.exec(`rm -rf ./${www}`, {
            cwd: path.join(__dirname, wwwPath),
        })
        //console.log(result);
        if (result.code === 0) {
            let message = 'www部署文件已删除成功！'
            // await logger.updateCommit({
            //     type: 'deploy',
            //     state: false,
            //     message
            // }, commitBid)
            // conn.sendText(message)
            console.log(message);
            return true
        } else {
            let message = result.stderr
            await logger.updateCommit({
                type: 'deploy',
                state: false,
                message
            }, commitBid)
            conn.sendText(message)
            return false
        }
    },
    //拷贝文件到部署根目录
    mvProject: async (dist, www, project, conn, commitBid) => {
        let message = '拷贝文件到部署根目录...'
        await logger.updateCommit({
            type: 'deploy',
            state: false,
            message
        }, commitBid)

        dist = dist ? dist : 'dist';
        let result = await shell.exec(`cp -r ./${dist}/* ${path.join(__dirname, `${wwwPath}/${www}`)}`, {
            cwd: path.join(__dirname, `${backupsPath}/${project}`),
        })
        //console.log(result);
        if (result.code === 0) {
            let message = '已将部署文件拷贝到根目录！'
            await logger.updateCommit({
                type: 'deploy',
                state: false,
                message
            }, commitBid)
            conn.sendText(message)
            return true
        } else {
            let message = result.stderr
            await logger.updateCommit({
                type: 'deploy',
                state: false,
                message
            }, commitBid)
            conn.sendText(message)
            return false
        }
    }
}
