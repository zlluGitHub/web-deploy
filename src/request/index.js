import Axios from 'axios';
import qs from 'qs';
import { Notice, Modal, Message, LoadingBar } from "view-design";
// import router from "../router/index";
const axios = Axios.create();
// axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8';
// axios.defaults.baseURL = 'http://www.tpss.com/';
// Message.config({
//     top: 0
// });
axios.interceptors.request.use((config) => {
    // Message.destroy()
    LoadingBar.destroy()
    LoadingBar.start();
    // if (config.url !== '/data-manage/dataMapping/getSimpleTableInfoById') {
    //     Message.loading({
    //         content: '加载中，请稍后...',
    //         duration: 0
    //     });
    // }
    // let user = sessionStorage.getItem("user");
    // // console.log(user);
    // if (user) {
    //     user = JSON.parse(user);
    //     config.headers['token'] = `${user.token}`;
    // }

    if (config.method === 'post') {
        // config.data = qs.stringify(config.data);
    }
    if (config.method === 'get') {
        // config.data = { params: config.data };
    }
    // config.headers.Authorization = " ";
    // config.headers.token = ' ';
    return config;
});
// Add a response interceptor
axios.interceptors.response.use(
    (response) => {
        // Message.destroy()
        LoadingBar.finish();
        // Do something with response data
        // let data = response.data;
        // response.data = response.data
        if (response.data.code !== 200) {

            // if (response.data.code === 401) {
            //     router.push({ path: '/login' });
            // } else {
            // console.log(response.data);
            Modal.error({
                title: "系统提示",
                content: response.data.message ? response.data.message : '系统发生未知错误，请稍后再试！',
            });
            // }
        }
        return response;
    },
    (error) => {
        // Do something with response error
        // Message.destroy()
        LoadingBar.error();
        Modal.error({
            title: "系统提示",
            desc: "数据请求失败，请检查网络是否连接正常！",
        });
        return Promise.reject(error);
    }
);

// if (process.env.NODE_ENV === "production") {
//     axios.defaults.baseURL = process.env.VUE_APP_URL;
// } else {
//     axios.defaults.baseURL = process.env.VUE_APP_URL;
// }

axios.defaults.baseURL = process.env.VUE_APP_URL;

export default axios;