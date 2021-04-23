import Vue from 'vue'
import App from './App.vue'

//引入 iview
import iView from 'view-design';
import 'view-design/dist/styles/iview.css';
Vue.use(iView);

import './style/gloable.scss'
import 'font-awesome/css/font-awesome.css'

import events from './utils'
Vue.prototype.$mitt = events

import VueClipboard from 'vue-clipboard2'
Vue.use(VueClipboard)

import request from './request/index.js'
Vue.prototype.$request = request

import qs from 'qs';
Vue.prototype.$qs = qs
// import uploader from "vue-simple-uploader";
// Vue.use(uploader)
// Vue.prototype.$socket = new WebSocket("ws://152.136.101.31:8001");
// axios.defaults.withCredentials = true; //让ajax携带cookie
// axios.interceptors.request.use(
//   config => {
//     // 这里的config包含每次请求的内容
//     let token = store.state.variable.token;
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   err => {
//     return Promise.reject(err);
//   }
// );
// 获取当前时间
Vue.prototype.$dateTime = () => {
  let date = new Date();
  let seperator1 = "-";
  let seperator2 = ":";
  let month = date.getMonth() + 1;
  let strDate = date.getDate();
  if (month >= 1 && month <= 9) {
    month = "0" + month;
  };
  if (strDate >= 0 && strDate <= 9) {
    strDate = "0" + strDate;
  };

  let hours = date.getHours();
  if (hours >= 0 && hours <= 9) {
    hours = "0" + hours;
  };

  let minutes = date.getMinutes();
  if (minutes >= 0 && minutes <= 9) {
    minutes = "0" + minutes;
  };

  let seconds = date.getSeconds();
  if (seconds >= 0 && seconds <= 9) {
    seconds = "0" + seconds;
  };

  let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
    + " " + hours + seperator2 + minutes
    + seperator2 + seconds;
  return currentdate;
};
Vue.prototype.$url = process.env.VUE_APP_URL;

//全局引入模拟数据
// import mock from './mock'
// Vue.prototype.$mock = mock

// import './utils/flexible' //rem 转换

Vue.config.productionTip = false

//实例化 store
import store from './store' // this.$store.commit("setUser", user); 

//引入路由文件
import router from './router'
//// 路由拦截
// const whiteList = ['/task'];//不需要登录能访问的path
// router.beforeEach((to, from, next) => {
//   console.log('beforeEach');
//   // let userInfo = JSON.parse(sessionStorage.getItem('state'));//获取缓存看是否登录过
//   let state = sessionStorage.getItem('state');//获取缓存看是否登录过
//   if (whiteList.indexOf(to.path) < 0) {//访问了需要登录才能访问的页面
//     if (state === 'true') {//登录过来直接进去
//       next();
//     } else {
//       if (to.path == '/login') {
//         next();
//       } else {
//         next('/login');
//       }
//     }
//   } else {
//     next();
//   }
// });

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app')
