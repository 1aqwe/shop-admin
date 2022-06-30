import Vue from 'vue'
import VueRouter from 'vue-router'
// import HomeView from '../views/HomeView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'login',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/pages/login')
  },
  {
    path: '/home',
    name: 'home',
    redirect:'/home/users',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/pages/home'),
    // 子路由
    children: [
      {
        // user
        path: 'users',
        name: 'userList',

        meta: {
          isShow: true,
          title: '用户列表'

        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/child/user/userList')
      },
      
      // 商品
      {
        path: 'categories',
        name: 'categories',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/child/goods/categories')
      },
      {
        path: 'goods',
        name: 'goods',
        meta: {
          isShow: true,
          title: '商品列表'

        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/child/goods/goods')
      },
      {
        path: 'params',
        name: 'params',
        meta: {
          isShow: true,
          title: '参数列表'

        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/child/goods/params')
      },
      // limit
      {
        path: 'rights',
        name: 'rights',
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/child/limit/rights')
      },
      {
        path: 'roles',
        name: '/roles',
        meta: {
          isShow: true,
          title: '角色列表'

        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/child/limit/roles')
      },
      // oder
      {
        path: 'orders',
        name: 'orders',
        meta: {
          isShow: true,
          title: '订单列表'

        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/child/oder/orders')
      },
      {
        path: 'reports',
        name: 'reports',
        meta: {
          isShow: true,
          title: '数据报表'

        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/child/reports/reports')
      },
      {
        path: 'welcome',
        name: 'welcome',
        meta: {
          isShow:true,
          title: '欢迎'

        },
        // route level code-splitting
        // this generates a separate chunk (about.[hash].js) for this route
        // which is lazy-loaded when the route is visited.
        component: () => import(/* webpackChunkName: "about" */ '../views/child/welcome/welcome')
      },
      
    ]
  },

]


const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})
// 为router天界路由访问权限
router.beforeEach((to, from, next) => {
  if (to.path == '/login') return next() //访问登录界面，放行
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})
export default router
