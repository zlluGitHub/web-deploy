const shell = require('shelljs');
const path = require('path');
const backupsPath = '../../backups'
const wwwPath = '../../www'
const logger = require('../logs/index.js');
module.exports = {
    // 拉取项目
    cloneProject: async (git, branch) => {
        // console.log('拉取项目中...');
        logger.info('拉取项目中...')
        let result = await shell.exec(`git clone -b ${branch} ${git}`, {
            cwd: path.join(__dirname, backupsPath),
        })
        // //console.log(result);
        if (result.code === 0) {
            // logger.info("项目拉取成功！")
            return true
        } else {
            logger.error(result.stderr)
            return false
        }
    },
    //安装依赖文件
    initPackage: async (project, npm) => {
        // console.log('安装依赖文件中...');
        logger.info('安装依赖文件中...');
        let result = await shell.exec(`${npm ? npm : 'cnpm'} i`, {
            cwd: path.join(__dirname, `${backupsPath}/${project}`),
        })

        if (result.code === 0) {
            // logger.info('依赖包安装成功！')
            return true
        } else {
            logger.error(result.stderr)
            return false
        }
    },
    //打包文件
    buildProject: async (project) => {
        // console.log('打包项目中...');
        logger.info('打包项目中...')
        let result = await shell.exec('npm run build', {
            cwd: path.join(__dirname, `${backupsPath}/${project}`),
        })
        //console.log(result);
        if (result.code === 0) {
            // logger.info('项目打包成功！')
            return true
        } else {
            logger.error(result.stderr)
            return false
        }

    },
    //删除项目文件夹
    deleteProject: async (project) => {
        // console.log('删除项目中...');
        logger.info('删除项目中...')
        let result = await shell.exec(`rm -rf ./${project}`, {
            cwd: path.join(__dirname, backupsPath),
        })
        //console.log(result);
        if (result.code === 0) {
            // logger.info('项目已删除成功！')
            return true
        } else {
            logger.error(result.stderr)
            return false
        }
    },
    //删除项目依赖包
    deleteNodeModule: async (project) => {
        // console.log('删除项目依赖包中...');
        logger.info('删除项目依赖包中...')
        let result = await shell.exec(`rm -rf ./${project}/node_modules`, {
            cwd: path.join(__dirname, backupsPath),
        })
        //console.log(result);
        if (result.code === 0) {
            // logger.info('项目依赖包已删除成功！')
            return true
        } else {
            logger.error(result.stderr)
            return false
        }
    },
    //删除www部署文件夹
    deleteRoot: async (www) => {
        // console.log('删除www部署文件中...');
        logger.info('删除www部署文件中...')
        let result = await shell.exec(`rm -rf ./${www}`, {
            cwd: path.join(__dirname, wwwPath),
        })
        //console.log(result);
        if (result.code === 0) {
            // logger.info('www部署文件已删除成功！')
            return true
        } else {
            logger.error(result.stderr)
            return false
        }
    },
    //拷贝文件到部署根目录
    mvProject: async (dist, www, project) => {
        // console.log('拷贝文件到部署根目录...');
        logger.info('拷贝文件到部署根目录...')
        dist = dist ? dist : 'dist';
        let result = await shell.exec(`cp -r ./${dist}/* ${path.join(__dirname, `${wwwPath}/${www}`)}`, {
            cwd: path.join(__dirname, `${backupsPath}/${project}`),
        })
        //console.log(result);
        if (result.code === 0) {
            // logger.info('已将部署文件拷贝到根目录！')
            return true
        } else {
            logger.error(result.stderr)
            return false
        }
    }
}
