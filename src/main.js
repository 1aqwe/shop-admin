import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/global.css' 
import '@/assets/fonts/iconfont.css'
import axios from 'axios'
// 树形结构
import ZkTable from 'vue-table-with-tree-grid'
Vue.config.productionTip = false
Vue.prototype.$http=axios
axios.defaults.baseURL ='https://lianghj.top:8888/api/private/v1/'
// axios请求拦截
axios.interceptors.request.use((config)=>{
  console.log(config)
  // 为请求对象添加token验证Authorization字段
const token= config.headers.Authorization=window.sessionStorage.getItem('token');
  // if(token){ config.headers.token=token}
  return config
})
Vue.use(ElementUI);
Vue.use(ZkTable)



new Vue({
  router,
  store,
  axios,

  render: h => h(App)
}).$mount('#app')
