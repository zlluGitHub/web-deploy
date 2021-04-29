import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router)

export default new Router({
  // mode: 'history',
  // mode: 'hash', //默认 有#号
  routes: [
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login')
    },
    {
      path: '/',
      name: 'main',
      component: () => import('@/views/Main.vue'),
      redirect: '/',//设置默认指向的路径
      children: [ //这里就是二级路由的配置
        {
          path: '/',
          name: 'index',
          component: () => import('@/views/index/Index.vue'),
        },
        {
          path: '/create',
          name: 'create',
          component: () => import('@/views/create/Index.vue'),
        },
        {
          path: '/commitList',
          name: 'commitList',
          component: () => import('@/views/commitList/Index.vue'),
        },
        {
          path: '/staticIndexDetails',
          name: 'staticIndexDetails',
          component: () => import('@/views/details/StaticIndex.vue'),
        },
        {
          path: '/gynamicDetails',
          name: 'gynamicDetails',
          component: () => import('@/views/details/Gynamic.vue'),
        },
        {
          path: '/system',
          name: 'system',
          component: () => import('@/views/system/Index.vue'),
        },
       
      ]
    },
    {
      path: '/CodeIde',
      name: 'CodeIde',
      component: () => import('@/views/CodeIde/Index.vue'),
    },
    {
      path: '/upload',
      name: 'Upload',
      component: () => import('@/views/Upload/Index.vue'),
    },
  ]
})
