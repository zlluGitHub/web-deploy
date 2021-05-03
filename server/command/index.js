const shell = require('shelljs');
const path = require('path');
const backupsPath = '../../backups'
const wwwPath = '../../www'
const tools = require("../public/javascripts/tools");
const logger = require('../logs/index.js');

// state 0：进行中  1：成功  2：失败
module.exports = {
    // 拉取项目
    cloneProject: (body, res) => {
        return new Promise(async (resolve, reject) => {
            await logger.setlog({
                bid: body.commitBid,
                deployState: {
                    state: 0,
                    type: 'clone'
                },
                log: {
                    message: `从 git 仓库中正在拉取【${body.projectName}】项目中，请稍后...`
                }
            }, true, res)

            let log = [];
            let deployState = {};

            await tools.mkdirsSync(path.join(__dirname, `${backupsPath}/${body.www}`))
            let result = await shell.exec(`git clone -b ${body.branch} ${body.git}`, {
                cwd: path.join(__dirname, `${backupsPath}/${body.www}`),
            })

            if (result.stdout) {
                log.push({
                    message: result.stdout
                })
            }
            if (result.stderr) {
                log.push({
                    message: result.stderr
                })
            }

            if (result.code === 0) {
                log.push({
                    message: `项目${body.projectName}拉取成功！`
                })
                deployState = {
                    state: 1,
                    type: 'clone'
                }
                await logger.setlog({
                    log,
                    deployState,
                    bid: body.commitBid
                }, true, res)
                resolve();
            } else {
                let resTip = `项目${body.projectName}拉取失败！`
                log.push({
                    message: resTip
                })
                deployState = {
                    state: 2,
                    type: 'clone'
                }
                await logger.setlog({
                    log,
                    deployState,
                    bid: body.commitBid
                }, true, res)
                res.json({ message, state: deployState, code: 500 });
            }
        })
    },

    //安装依赖文件
    initPackage: (body, res) => {
        return new Promise(async (resolve, reject) => {
            if (body.install.indexOf('cnpm') > -1 && !shell.which('cnpm')) {
                let deployState = {
                    state: 2,
                    type: 'install'
                }
                let message = 'cnpm 命令不存在，请安装后重新部署！'
                await logger.setlog({
                    log: { message },
                    bid: body.commitBid,
                    deployState
                }, true, res)
                res.json({ message, state: deployState, code: 500 });
            } else {

                await logger.setlog({
                    log: {
                        message: `正在安装【${body.projectName}】项目依赖中，请稍后...`,
                    },
                    bid: body.commitBid,
                    deployState: {
                        state: 0,
                        type: 'install'
                    }
                }, true, res)


                let log = [];
                let deployState = {};

                let result = await shell.exec(body.install, {
                    cwd: path.join(__dirname, `${backupsPath}/${body.www}/${body.projectName}`),
                })

                if (result.stdout) {
                    log.push({
                        message: result.stdout
                    })
                }
                if (result.stderr) {
                    log.push({
                        message: result.stderr
                    })
                }

                if (result.code === 0) {
                    log.push({
                        message: `项目${body.projectName}依赖安装成功！`,
                    })
                    deployState = {
                        state: 1,
                        type: 'install'
                    }
                    await logger.setlog({
                        log,
                        deployState,
                        bid: body.commitBid
                    }, true, res)
                    resolve();
                } else {
                    let resTip = `项目${body.projectName}依赖安装失败！`
                    log.push({
                        message: resTip
                    })
                    deployState = {
                        state: 2,
                        type: 'install'
                    }
                    await logger.setlog({
                        log,
                        deployState,
                        bid: body.commitBid
                    }, true, res)
                    res.json({ message: resTip, state: deployState, code: 500 });
                }
            }
        })
    },

    //打包文件
    buildProject: (body, res) => {

        return new Promise(async (resolve, reject) => {
            await logger.setlog({
                log: {
                    message: `项目【${body.projectName}】正在打包中，请稍后...`,
                },
                bid: body.commitBid,
                deployState: {
                    state: 0,
                    type: 'build'
                }
            }, true, res)

            let log = [];
            let deployState = {};

            let result = await shell.exec(body.build, {
                cwd: path.join(__dirname, `${backupsPath}/${body.www}/${body.projectName}`),
            })

            if (result.stdout) {
                log.push({
                    message: result.stdout
                })
            }
            if (result.stderr) {
                log.push({
                    message: result.stderr
                })
            }

            if (result.code === 0) {
                log.push({
                    message: `项目${body.projectName}打包成功！`,
                })
                deployState = {
                    state: 1,
                    type: 'build'
                }
                await logger.setlog({
                    log,
                    deployState,
                    bid: body.commitBid
                }, true, res)
                resolve();
            } else {
                let resTip = `项目${body.projectName}打包失败！`
                log.push({
                    message: resTip
                })
                deployState = {
                    state: 2,
                    type: 'build'
                }
                await logger.setlog({
                    log,
                    deployState,
                    bid: body.commitBid
                }, true, res)
                res.json({
                    message: resTip, state: deployState, code: 500
                });
            }
        });
    },

    //删除项目文件夹
    deleteProject: (body, res) => {
        return new Promise(async (resolve, reject) => {
            await logger.setlog({
                log: {
                    message: `项目${body.projectName}文件已存在，正在移除中...`,
                },
                bid: body.commitBid
            }, true, res)

            let log = []

            let result = await shell.exec(`rm -rf ./${body.projectName}`, {
                cwd: path.join(__dirname, `${backupsPath}/${body.www}`),
            })

            if (result.stdout) {
                log.push({
                    message: result.stdout
                })
            }
            if (result.stderr) {
                log.push({
                    message: result.stderr
                })
            }

            if (result.code === 0) {
                log.push({
                    message: `项目${body.projectName}移除成功！`
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, false, true)
                resolve();
            } else {
                let resTip = `项目${body.projectName}移除失败！`
                log.push({
                    message: resTip
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, false, true)
                res.json({
                    message: resTip, code: 500
                });
            }
        });
    },

    //删除项目依赖包
    deleteNodeModule: (body, res) => {
        return new Promise(async (resolve, reject) => {
            await logger.setlog({
                log: {
                    message: `正在删除${body.projectName}项目依赖，请稍后...`,
                },
                bid: body.commitBid
            }, true, res)

            let log = []

            let result = shell.exec(`rm -rf ./${body.projectName}/node_modules`, {
                cwd: path.join(__dirname, `${backupsPath}/${body.www}`),
            })

            if (result.stdout) {
                log.push({
                    message: result.stdout
                })
            }
            if (result.stderr) {
                log.push({
                    message: result.stderr
                })
            }

            if (result.code === 0) {
                log.push({
                    message: `项目${body.projectName}依赖包移除成功！`
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, true, res)
                resolve();
            } else {
                let resTip = `项目${body.projectName}依赖包移除失败！`
                log.push({
                    message: resTip
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, true, res)
                res.json({
                    message: resTip, code: 500
                });
            }

        });

    },
    //删除www部署文件夹
    deleteRoot: (body, res) => {
        return new Promise(async (resolve, reject) => {
            await logger.setlog({
                log: {
                    message: `正在删除${body.projectName}项目部署根目录，请稍后...`,
                },
                bid: body.commitBid
            }, true, res)

            let log = []

            let result = await shell.exec(`rm -rf ./${body.www}`, {
                cwd: path.join(__dirname, wwwPath),
            })

            if (result.stdout) {
                log.push({
                    message: result.stdout
                })
            }
            if (result.stderr) {
                log.push({
                    message: result.stderr
                })
            }

            if (result.code === 0) {
                log.push({
                    message: `项目${body.projectName}部署根目录移除成功！`
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, true, res)
                resolve();
            } else {
                let resTip = `项目${body.projectName}部署根目录移除失败！`
                log.push({
                    message: resTip
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, true, res)
                res.json({
                    message: resTip, code: 500
                });
            }

        });
    },


    // 备份 package.json 比较文件内容是否发生变化
    copyPackage: (body, res) => {
        return new Promise(async (resolve, reject) => {
            await logger.setlog({
                log: {
                    message: `正在复制 package.json 文件，请稍后...`,
                },
                bid: body.commitBid
            }, true, res)

            let log = []
            let result = await shell.exec(`cp -rf ./${body.projectName}/package.json ./`, {
                cwd: path.join(__dirname, `${backupsPath}/${body.www}`),
            })

            if (result.stdout) {
                log.push({
                    message: result.stdout
                })
            }
            if (result.stderr) {
                log.push({
                    message: result.stderr
                })
            }

            if (result.code === 0) {
                log.push({
                    message: `项目中的 package.json 文件拷贝成功！`
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, true, res)
                resolve();
            } else {
                let resTip = `项目中的 package.json 文件拷贝失败！`
                log.push({
                    message: resTip
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, true, res)
                res.json({
                    message: resTip, code: 500
                });
            }

        });
    },
    // 删除 package.json 比较文件内容是否发生变化
    deletePackage: (body, res) => {
        return new Promise(async (resolve, reject) => {
            await logger.setlog({
                log: {
                    message: `正在删除旧的 package.json 文件，请稍后...`,
                },
                bid: body.commitBid
            }, true, res)

            let log = []
            let result = await shell.exec(`rm -rf ./package.json`, {
                cwd: path.join(__dirname, `${backupsPath}/${body.www}`),
            })

            if (result.stdout) {
                log.push({
                    message: result.stdout
                })
            }
            if (result.stderr) {
                log.push({
                    message: result.stderr
                })
            }

            if (result.code === 0) {
                log.push({
                    message: `项目中的 package.json 备份文件删除成功！`
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, true, res)
                resolve();
            } else {
                let resTip = `项目中的 package.json 备份文件删除失败！`
                log.push({
                    message: resTip
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, true, res)
                res.json({
                    message: resTip, code: 500
                });
            }

        });
    },
    //拷贝git打包文件到部署根目录
    mvProject: (body, res) => {
        return new Promise(async (resolve, reject) => {
            await logger.setlog({
                log: {
                    message: `正在拷贝打包${body.projectName}项目文件到部署根目录，请稍后...`,
                },
                bid: body.commitBid
            }, true, res)

            let log = []
            let result = await shell.exec(`cp -rf ./${body.dist}/* ${path.join(__dirname, `${wwwPath}/${body.www}`)}`, {
                cwd: path.join(__dirname, `${backupsPath}/${body.www}/${body.projectName}`),
            })

            if (result.stdout) {
                log.push({
                    message: result.stdout
                })
            }
            if (result.stderr) {
                log.push({
                    message: result.stderr
                })
            }

            if (result.code === 0) {
                log.push({
                    message: `项目${body.projectName}文件拷贝成功！`
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, true, res)
                resolve();
            } else {
                let resTip = `项目${body.projectName}文件拷贝失败！`
                log.push({
                    message: resTip
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, true, res)
                res.json({
                    message: resTip, code: 500
                });
            }

        });
    },

    //拷贝打包文件到备份目录
    mvToBackups: (body, res) => {
        return new Promise(async (resolve, reject) => {
            await logger.setlog({
                log: {
                    message: `正在拷贝打包【${body.projectName}】项目文件到备份目录，请稍后...`,
                },
                bid: body.commitBid
            }, true, res)

            let log = []
            await tools.mkdirsSync(path.join(__dirname, `${backupsPath}/${body.www}/${body.commitBid}`))
            let result = await shell.exec(`cp -rf ./${body.projectName}/${body.dist}/* ./${body.commitBid}`, {
                cwd: path.join(__dirname, `${backupsPath}/${body.www}`),
            })

            if (result.stdout) {
                log.push({
                    message: result.stdout
                })
            }
            if (result.stderr) {
                log.push({
                    message: result.stderr
                })
            }

            if (result.code === 0) {
                log.push({
                    message: `项目${body.projectName}文件备份成功！`
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, true, res)
                resolve();
            } else {
                let resTip = `项目${body.projectName}文件备份失败！`
                log.push({
                    message: resTip
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, true, res)
                res.json({
                    message: resTip, code: 500
                });
            }

        });

    },


    // 还原静态备份
    mvReductionWww: (body, res) => {
        return new Promise(async (resolve, reject) => {
            await logger.setlog({
                log: {
                    message: '正在将项目部署到根目录下，请稍后...',
                },
                bid: body.commitBid
            }, true, res)


            let log = [];
            let result = await shell.exec(`cp -rf ./${body.commitBid}/* ${path.join(__dirname, `${wwwPath}/${body.www}`)}`, {
                cwd: path.join(__dirname, `${backupsPath}/${body.www}`),
            })

            if (result.stdout) {
                log.push({
                    message: result.stdout
                })
            }
            if (result.stderr) {
                log.push({
                    message: result.stderr
                })
            }

            if (result.code === 0) {
                log.push({
                    message: `项目文件已成功拷贝到根目录！`
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, true, res)
                resolve();
            } else {
                let resTip = `项目文件拷贝到根目录发生错误！`
                log.push({
                    message: resTip
                })
                await logger.setlog({
                    log,
                    bid: body.commitBid
                }, true, res)
                res.json({
                    message: resTip, code: 500
                });
            }

        });
    },

    // webhook部分
    gitPull: (body, res) => {
        return new Promise(async (resolve, reject) => {
            await logger.setlog({
                bid: body.commitBid,
                deployState: {
                    state: 0,
                    type: 'clone'
                },
                log: {
                    message: '远程Git仓库与本地项目同步中，请稍后...'
                }
            }, true, res)

            let log = [];
            let deployState = {};

            let result = await shell.exec(`git pull`, {
                cwd: path.join(__dirname, `${backupsPath}/${body.www}/${body.projectName}`),
            })

            if (result.stdout) {
                log.push({
                    message: result.stdout
                })
            }
            if (result.stderr) {
                log.push({
                    message: result.stderr
                })
            }

            if (result.code === 0) {
                log.push({
                    message: `远程Git仓库与本地项目同步成功！`
                })
                deployState = {
                    state: 1,
                    type: 'clone'
                }
                await logger.setlog({
                    log,
                    deployState,
                    bid: body.commitBid
                }, true, res)
                resolve();
            } else {
                let resTip = `远程Git仓库与本地项目同步失败！`
                log.push({
                    message: resTip
                })
                deployState = {
                    state: 2,
                    type: 'clone'
                }
                await logger.setlog({
                    log,
                    deployState,
                    bid: body.commitBid
                }, true, res)
                res.json({ message, state: deployState, code: 500 });
            }
        })

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

}
