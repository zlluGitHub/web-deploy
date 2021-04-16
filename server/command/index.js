const shell = require('shelljs');
const path = require('path');
const backupsPath = '../../backups'
const wwwPath = '../../www'
const logger = require('../logs/index.js');

module.exports = {
    // 拉取项目
    cloneProject: async (git, branch, commitBid, res) => {
        let message = '从 git 仓库中正在拉取项目中...'
        await logger.updateCommit({
            type: 'clone',
            message
        }, commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        let result = await shell.exec(`git clone -b ${branch} ${git}`, {
            cwd: path.join(__dirname, backupsPath),
        })
        // //console.log(result);
        if (result.code === 0) {
            if (result.stdout) {
                await logger.updateCommit({
                    type: 'clone',
                    message: result.stdout
                }, commitBid).catch(err => {
                    // res.json({ message: err, data: null, code: 500 });
                    // logger.exitProcess()
                })
            }

            console.log('项目文件已拉取成功！');
        } else {
            let message = result.stderr;
            let resTip = '项目文件拉取失败！'
            await logger.updateCommit([
                {
                    type: 'clone',
                    message: resTip
                },
                {
                    type: 'clone',
                    message
                }
            ], commitBid).catch(err => {
                // res.json({ message: err, data: null, code: 500 });
                // logger.exitProcess()
            })
            await res.json({ message: resTip, data: null, code: 500 });

            // 改变部署状态
            logger.exitState({
                bid: commitBid,
                deployState: 'start',
                isServer: false,
            })
        }
    },
    //安装依赖文件
    initPackage: async (project, init, commitBid, res) => {
        // console.log('安装依赖文件中...');

        if (init.indexOf('cnpm') > -1 && !shell.which('cnpm')) {
            let message = 'cnpm 命令不存在，请安装后重新部署！'
            await logger.updateCommit({
                type: 'install',
                message
            }, commitBid).catch(err => {
                // res.json({ message: err, data: null, code: 500 });
                // logger.exitProcess()
            })
            res.json({ message, state: "install", code: 500 });
            // 改变部署状态
            logger.exitState({
                bid: commitBid,
                deployState: 'install',
                isServer: false,
            })
            shell.exit(1);
        }

        let message = project + '项目依赖文件正在安装中...'
        await logger.updateCommit({
            type: 'install',
            message
        }, commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        let result = await shell.exec(init, {
            cwd: path.join(__dirname, `${backupsPath}/${project}`),
        })

        if (result.code === 0) {
            if (result.stdout) {
                await logger.updateCommit({
                    type: 'install',
                    message: result.stdout
                }, commitBid).catch(err => {
                    // res.json({ message: err, data: null, code: 500 });
                    // logger.exitProcess()
                })
            }
            console.log(project + '项目依赖文件安装成功！');
        } else {
            let message = result.stderr;
            let resTip = '项目依赖文件安装失败，请重试！'
            await logger.updateCommit([
                {
                    type: 'install',
                    message: resTip
                },
                {
                    type: 'install',
                    message
                }
            ], commitBid).catch(err => {
                // res.json({ message: err, data: null, code: 500 });
                // logger.exitProcess()
            })
            await res.json({ message: resTip, state: 'install', code: 500 });
            // 改变部署状态
            logger.exitState({
                bid: commitBid,
                deployState: 'install',
                isServer: false,
            })
        }

    },
    //打包文件
    buildProject: async (project, build, commitBid, res) => {
        let message = project + '项目正在打包中...'
        await logger.updateCommit({
            type: 'build',
            message
        }, commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        let result = await shell.exec(build, {
            cwd: path.join(__dirname, `${backupsPath}/${project}`),
        })

        if (result.code === 0) {
            if (result.stdout) {
                await logger.updateCommit({
                    type: 'build',
                    message: result.stdout
                }, commitBid).catch(err => {
                    // res.json({ message: err, data: null, code: 500 });
                    // logger.exitProcess()
                })
            }
            console.log(project + '项目打包成功！');
        } else {
            let message = result.stderr;
            let resTip = '项目打包失败，请重试！'
            await logger.updateCommit([
                {
                    type: 'build',
                    message: resTip
                },
                {
                    type: 'build',
                    message
                }
            ], commitBid).catch(err => {
                // res.json({ message: err, data: null, code: 500 });
                // logger.exitProcess()
            })
            await res.json({ message: resTip, state: 'build', code: 500 });
            // 改变部署状态
            logger.exitState({
                bid: commitBid,
                deployState: 'build',
                isServer: false,
            })
        }
    },
    //删除项目文件夹
    deleteProject: async (project, commitBid, res) => {

        let message = project + '项目文件已存在，正在移除中...'
        await logger.updateCommit({
            type: 'rmove',
            message
        }, commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        let result = await shell.exec(`rm -rf ./${project}`, {
            cwd: path.join(__dirname, backupsPath),
        })

        //console.log(result);
        if (result.code === 0) {
            if (result.stdout) {
                await logger.updateCommit({
                    type: 'rmove-project',
                    message: result.stdout
                }, commitBid).catch(err => {
                    // res.json({ message: err, data: null, code: 500 });
                    // logger.exitProcess()
                })
            }
            let message = '项目已移除成功！'
            console.log(message);
        } else {
            let message = result.stderr;
            let resTip = project + '项目文件移除失败！'
            await logger.updateCommit([
                {
                    type: 'rmove-project',
                    message: resTip
                },
                {
                    type: 'rmove-project',
                    message
                }
            ], commitBid).catch(err => {
                // res.json({ message: err, data: null, code: 500 });
                // logger.exitProcess()
            })
            await res.json({ message: resTip, state: 'deploy', code: 500 });
            // 改变部署状态
            logger.exitState({
                bid: commitBid,
                deployState: 'clone',
                isServer: false,
            })
        }
    },
    //删除项目依赖包
    deleteNodeModule: async (project, commitBid, res) => {
        let message = '正在删除' + project + '项目依赖包...'
        await logger.updateCommit({
            type: 'build',
            message
        }, commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        let result = await shell.exec(`rm -rf ./${project}/node_modules`, {
            cwd: path.join(__dirname, backupsPath),
        })
        //console.log(result);
        if (result.code === 0) {
            if (result.stdout) {
                await logger.updateCommit({
                    type: 'build',
                    message: result.stdout
                }, commitBid).catch(err => {
                    // res.json({ message: err, data: null, code: 500 });
                    // logger.exitProcess()
                })
            }
            let message = project + '项目依赖包已删除成功！'
            console.log(message);
        } else {
            let message = result.stderr;
            let resTip = project + '项目依赖包已删除失败！'
            await logger.updateCommit([
                {
                    type: 'build',
                    message: resTip
                },
                {
                    type: 'build',
                    message
                }
            ], commitBid).catch(err => {
                // res.json({ message: err, data: null, code: 500 });
                // logger.exitProcess()
            })
            await res.json({ message: resTip, state: 'build', code: 500 });
            // 改变部署状态
            logger.exitState({
                bid: commitBid,
                deployState: 'build',
                isServer: false,
            })
        }
    },
    //删除www部署文件夹
    deleteRoot: async (project, www, commitBid, res) => {
        let message = '正在删除' + project + '项目部署根目录...'
        await logger.updateCommit({
            type: 'deploy',
            message
        }, commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        let result = await shell.exec(`rm -rf ./${www}`, {
            cwd: path.join(__dirname, wwwPath),
        })


        if (result.code === 0) {
            if (result.stdout) {
                await logger.updateCommit({
                    type: 'deploy',
                    message: result.stdout
                }, commitBid).catch(err => {
                    // res.json({ message: err, data: null, code: 500 });
                    // logger.exitProcess()
                })
            }
            let message = project + '项目部署根目录已删除成功！'
            console.log(message);
        } else {
            let message = result.stderr;
            let resTip = project + '项目部署根目录删除失败！'
            await logger.updateCommit([
                {
                    type: 'deploy',
                    message: resTip
                },
                {
                    type: 'deploy',
                    message
                }
            ], commitBid).catch(err => {
                // res.json({ message: err, data: null, code: 500 });
                // logger.exitProcess()
            })
            await res.json({ message: resTip, state: 'deploy', code: 500 });
            // 改变部署状态
            logger.exitState({
                bid: commitBid,
                deployState: 'deploy',
                isServer: false,
            })
        }
    },
    //拷贝文件到部署根目录
    mvProject: async (dist, www, project, commitBid, res) => {
        let message = '拷贝打包文件到部署根目录...'
        await logger.updateCommit({
            type: 'deploy',
            message
        }, commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        dist = dist ? dist : 'dist';
        let result = await shell.exec(`cp -r ./${dist}/* ${path.join(__dirname, `${wwwPath}/${www}`)}`, {
            cwd: path.join(__dirname, `${backupsPath}/${project}`),
        })

        if (result.code === 0) {
            let message = project + '打包文件已成功拷贝到根目录！'
            if (result.stdout) {
                await logger.updateCommit([
                    {
                        type: 'deploy',
                        message: result.stdout
                    }, {
                        type: 'deploy',
                        message
                    }
                ], commitBid).catch(err => {
                    // res.json({ message: err, data: null, code: 500 });
                    // logger.exitProcess()
                })
            }

            console.log(message);
        } else {
            let message = result.stderr;
            let resTip = project + '打包文件拷贝到根目录发生错误！'
            await logger.updateCommit([
                {
                    type: 'deploy',
                    message: resTip
                },
                {
                    type: 'deploy',
                    message
                }
            ], commitBid).catch(err => {
                // res.json({ message: err, data: null, code: 500 });
                // logger.exitProcess()
            })
            await res.json({ message: resTip, state: 'deploy', code: 500 });
            // 改变部署状态
            logger.exitState({
                bid: commitBid,
                deployState: 'deploy',
                isServer: false,
            })
        }
    }
}
