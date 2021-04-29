const shell = require('shelljs');
const path = require('path');
const backupsPath = '../../backups'
const wwwPath = '../../www'
// const tools = require("../public/javascripts/tools");
const logger = require('../logs/index.js');

module.exports = {
    // 拉取项目
    cloneProject: async (bid, git, branch, commitBid, res) => {
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


            // 改变部署状态
            let deployState = {
                state: false,
                type: 'clone'
            }
            res.json({ message: resTip, state: deployState, code: 500 });
            logger.exitState({
                commitBid,
                deployState,
            })

        }
    },
    //安装依赖文件
    initPackage: async (bid, project, init, commitBid, res) => {
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

            // 改变部署状态
            let deployState = {
                state: false,
                type: 'install'
            }
            await logger.exitState({
                commitBid,
                deployState,
            })

            res.json({ message, state: deployState, code: 500 });

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
            // 改变部署状态
            let deployState = {
                state: false,
                type: 'install'
            }
            res.json({ message: resTip, state: deployState, code: 500 });
            logger.exitState({
                commitBid,
                deployState,
            })


        }

    },
    //打包文件
    buildProject: async (bid, project, build, commitBid, res) => {
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

            let deployState = {
                state: false,
                type: 'build'
            }
            res.json({ message: resTip, state: deployState, code: 500 });
            logger.exitState({
                commitBid,
                deployState,
            })


        }
    },
    //删除项目文件夹
    deleteProject: async (bid, project, commitBid, res) => {

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

            let deployState = {
                state: false,
                type: 'deploy'
            }
            res.json({ message: resTip, state: deployState, code: 500 });
            logger.exitState({
                commitBid,
                deployState,
            })

        }
    },
    //删除项目依赖包
    deleteNodeModule: async (bid, project, commitBid, res) => {
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
            let deployState = {
                state: false,
                type: 'build'
            }
            res.json({ message: resTip, state: deployState, code: 500 });
            logger.exitState({
                commitBid,
                deployState,
            })


        }
    },
    //删除www部署文件夹
    deleteRoot: async (bid, project, www, commitBid, res) => {
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

            let deployState = {
                state: false,
                type: 'deploy'
            }
            res.json({ message: resTip, state: deployState, code: 500 });
            logger.exitState({
                commitBid,
                deployState,
            })

        }
    },
    //拷贝git打包文件到部署根目录
    mvProject: async (bid, dist, www, project, commitBid, res) => {
        let message = '拷贝打包文件到部署根目录...'
        await logger.updateCommit({
            type: 'deploy',
            message
        }, commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        dist = dist ? dist : 'dist';
        let result = await shell.exec(`cp -rf ./${dist}/* ${path.join(__dirname, `${wwwPath}/${www}`)}`, {
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
            let deployState = {
                state: false,
                type: 'deploy'
            }
            res.json({ message: resTip, state: deployState, code: 500 });
            logger.exitState({
                commitBid,
                deployState,
            })


        }
    },


    // webhook部分
    gitPull: async (bid, project, commitBid, res) => {
        let message = '远程Git仓库与本地项目同步中，请稍后...'
        await logger.updateCommit({
            type: 'clone',
            message
        }, commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        let result = await shell.exec(`git pull`, {
            cwd: path.join(__dirname, `${backupsPath}/${project}`),
        })

        if (result.code === 0) {
            let message = '远程Git仓库与本地项目同步成功！'
            if (result.stdout) {
                await logger.updateCommit([
                    {
                        type: 'clone',
                        message: result.stdout
                    }, {
                        type: 'clone',
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
            let resTip = project + '远程Git仓库与本地项目同步失败！'
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
            let deployState = {
                state: false,
                type: 'clone'
            }
            res.json({ message: resTip, state: deployState, code: 500 });
            logger.exitState({
                commitBid,
                deployState,
            })


        }
    },

    gitReset: async (bid, project, commitBid, versionNumber, res) => {
        let message = '从远程Git仓库拉取' + versionNumber + '版本中，请稍后...'
        await logger.updateCommit({
            type: 'clone',
            message
        }, commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        let result = await shell.exec(`git reset --hard ${versionNumber}`, {
            cwd: path.join(__dirname, `${backupsPath}/${project}`),
        })

        if (result.code === 0) {
            let message = '拉取' + versionNumber + '版本成功！'
            if (result.stdout) {
                await logger.updateCommit([
                    {
                        type: 'clone',
                        message: result.stdout
                    }, {
                        type: 'clone',
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
            let resTip = project + '远程Git仓库与本地项目同步失败！'
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
            let deployState = {
                state: false,
                type: 'clone'
            }
            res.json({ message: resTip, state: deployState, code: 500 });
            logger.exitState({
                commitBid,
                deployState,
            })
        }
    },
    // // 静态备份
    // backupsWww: async (body, res) => {
    //     let message = '正在备份' + body.title + '项目到backups目录下，请稍后...'
    //     await logger.updateCommit({
    //         type: 'clone',
    //         message
    //     }, body.commitBid).catch(err => {
    //         // res.json({ message: err, data: null, code: 500 });
    //         // logger.exitProcess()
    //     })

    //     let backPath = `${backupsPath}/${body.www}/${body.commitBid}`

    //     tools.mkdirsSync(path.join(__dirname, backPath))


    //     let result = await shell.exec(`mv -f ./${body.www}/* ${path.join(__dirname, backPath)}`, {
    //         cwd: path.join(__dirname, wwwPath),
    //     })

    //     if (result.code === 0) {
    //         let message = '已将' + body.title + '项目成功备份到backups目录下。'
    //         if (result.stdout) {
    //             await logger.updateCommit([
    //                 {
    //                     type: 'clone',
    //                     message: result.stdout
    //                 }, {
    //                     type: 'clone',
    //                     message
    //                 }
    //             ], body.commitBid).catch(err => {
    //                 // res.json({ message: err, data: null, code: 500 });
    //                 // logger.exitProcess()
    //             })
    //         }

    //         console.log(message);
    //     } else {
    //         let message = result.stderr;
    //         let resTip = body.title + '项目备份失败！'
    //         await logger.updateCommit([
    //             {
    //                 type: 'clone',
    //                 message: resTip
    //             },
    //             {
    //                 type: 'clone',
    //                 message
    //             }
    //         ], body.commitBid).catch(err => {
    //             // res.json({ message: err, data: null, code: 500 });
    //             // logger.exitProcess()
    //         })
    //         let deployState = {
    //             state: false,
    //             type: 'clone'
    //         }
    //         res.json({ message: resTip, state: deployState, code: 500 });
    //         logger.exitState({
    //             commitBid: body.commitBid,
    //             deployState,
    //         })
    //     }
    // },
    // 还原静态备份
    mvReductionWww: async (body, res) => {
        let message = '正在将' + body.title + '项目部署到根目录下，请稍后...'
        await logger.updateCommit({
            type: 'clone',
            message
        }, body.commitBid).catch(err => {
            // res.json({ message: err, data: null, code: 500 });
            // logger.exitProcess()
        })

        let result = await shell.exec(`cp -rf ./${body.commitBid}/* ${path.join(__dirname, `${wwwPath}/${body.www}`)}`, {
            cwd: path.join(__dirname, `${backupsPath}/${body.www}`),
        })

        if (result.code === 0) {
            let message = body.title + '项目文件已成功拷贝到根目录！'
            if (result.stdout) {
                await logger.updateCommit([
                    {
                        type: 'deploy',
                        message: result.stdout
                    }, {
                        type: 'deploy',
                        message
                    }
                ], body.commitBid).catch(err => {
                    // res.json({ message: err, data: null, code: 500 });
                    // logger.exitProcess()
                })
            }

            console.log(message);
        } else {
            let message = result.stderr;
            let resTip = body.title + '项目文件拷贝到根目录发生错误！'
            await logger.updateCommit([
                {
                    type: 'deploy',
                    message: resTip
                },
                {
                    type: 'deploy',
                    message
                }
            ], body.commitBid).catch(err => {
                // res.json({ message: err, data: null, code: 500 });
                // logger.exitProcess()
            })
            let deployState = {
                state: false,
                type: 'deploy'
            }
            res.json({ message: resTip, state: deployState, code: 500 });
            logger.exitState({
                commitBid: body.commitBid,
                deployState,
            })


        }
    },
}
