<template>
  <!-- <el-button type='info' @click="loginout">退出</el-button> -->

  <el-container>
    <el-header>
      <div class="logo">
        <img src="@/assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="loginout">退出</el-button>
    </el-header>
    <el-container>
      <!-- 侧边栏 -->
      <!-- 动态绑定是否折叠 3元表达式-->
      <el-aside :width="isCollapse ? '64px':'200px'">
      <div class="toggle-button" @click="show">|||</div>
        <!-- 一级菜单 -->
        <el-menu 
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409EFF" 
          unique-opened
          :collapse='isCollapse'
          :collapse-transition='false'
          router
          :default-active='$route.path'
           
         
        >
          <el-submenu :index="item.id+''"  v-for="item in menueList" :key="item.id" >
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{item.authName}}</span>
            </template>
            <!-- 二级菜单 -->

            <el-menu-item :index="'/home/'+subitem.path" v-for="subitem in item.children " :key="subitem.id">
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subitem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 子路由 -->
      <el-main>
   
     <keep-alive>
      <router-view></router-view>
     
     </keep-alive>
      </el-main>
    </el-container>
  </el-container>

  <!--  justify-content: space-between; 两边对齐-->
</template>

<script>
// import '@/assets/fonts/iconfont.css'
export default {
    data() {
        return {
            menueList:[],
            iconObj:{
                '125':'iconfont icon-user',
                '103':'iconfont icon-tijikongjian',
                '101':'iconfont icon-shangpin',
                '102':'iconfont icon-danju',
                '145':'iconfont icon-baobiao',

            // 'iconfont icon-tijikongjian','iconfont icon-shangpin','iconfont icon-danju','iconfont icon-baobiao'
            },
            isCollapse:false
        }
    },
  methods: {
    loginout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    show(){
        this.isCollapse=!this.isCollapse
    },
//   获取左侧菜单
  async  getMenuList(){
   const {data:res} =await this.$http.get('menus')
   console.log(res)
   this.menueList=res.data
  }
  
},
   created() {
    this.getMenuList()
    //  const router= this.$router.matched
     
    //  console.log(router)
const list=this.$router.getRoutes().filter(v=>v.meta.isShow)
// console.log('list',list)
this. menueList=list


    },
};
</script>

 <style lang="less" scopde>
.el-header {
  background-color: #373d41;
  color: #eaedf1;
  display: flex;
  justify-content: space-between;
  line-height: 60px;
  padding-left: 0;
  align-items: center;
  font-size: 20px;
  align-items: center;
  .logo {
    display: flex;
    justify-items: center;
  }
  span {
    margin-left: 15px;
  }
}

.el-aside {
  background-color: #333744;
  color: #333744;
  text-align: center;
  line-height: 200px;
  .el-menu{
    border-right:none ;
  }
}

.el-main {
  background-color: #eaedf1;
 
  text-align: center;

}
.el-container {
  height: 100vh;
}



.iconfont{
    margin-right: 10px;
}
.toggle-button{
   
   text-align: center;
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    letter-spacing: 0.2em;
    cursor: pointer;
}
</style>