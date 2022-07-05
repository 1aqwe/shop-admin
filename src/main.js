import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/css/global.css' 
import '@/assets/fonts/iconfont.css'
import axios from 'axios'
import * as echarts from 'echarts';
// 文件组件全局挂载
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)

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

// 定义时间过滤器，
Vue.filter('dateFormat', function (originDate, pattern = '') {
  // 根据给定的时间字符串，得到特定的时间
  var dt = new Date(originDate)
  //   yyyy-mm-dd
  var y = dt.getFullYear()
  var m = (dt.getMonth() + 1).toString().padStart(2, '0')
  var d = dt.getDate().toString().padStart(2, '0')
  if (pattern.toLowerCase() === 'yyyy-mm-dd') {
    return `${y}-${m}-${d}`
  } else {
    var hh = dt.getHours().toString().padStart(2, '0')
    var mm = dt.getMinutes().toString().padStart(2, '0')
    var ss = dt.getSeconds().toString().padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
  }
})



new Vue({
  router,
  store,
  axios,

  render: h => h(App)
}).$mount('#app')
