<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像 -->
      <div class="avatar_box">
        <img src="@/assets/logo.png" alt="" />
      </div>
      <!-- 表单 -->
      <div>
     
        <el-form
          class="login_form"
          :model="loginForm"
          :rules="loginFormRules"
          ref="loginFormRef"
        >
          <!-- 用户名 -->
          <el-form-item prop="username">
            <el-input
              prefix-icon="iconfont  icon-user"
              v-model="loginForm.username"
            >
            </el-input>
          </el-form-item>
          <!-- 密码 -->
          <el-form-item prop="password">
            <el-input
              prefix-icon="iconfont  icon-lock_fill"
              v-model="loginForm.password"
              type="password"
            ></el-input>
          </el-form-item>
          <!-- 按钮 -->
          <el-form-item class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        //登录表单
        username: "admin",
        password: "123456",
      },
      //   表单验证规则
      loginFormRules: {
        username: [
          { required: true, message: "请输入登录名", trigger: "blur" },
          {
            min: 3,
            max: 11,
            message: "长度在 3 到 11 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 3,
            max: 11,
            message: "长度在 3 到 11 个字符",
            trigger: "blur",
          },
        ],
        //  this.$refs.loginFormRef
      },
    };
  },
  methods: {
    // 重置按钮
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },

    login() {
      // 掉接口前的验证
      this.$refs.loginFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) {
          return;//valid=false时返回，不在进行axios验证
        }
        const {data:res} = await this.$http.post("login", this.loginForm);
        console.log(res);
        if(res.meta.status!=200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        window.sessionStorage.setItem('token',res.data.token);
        this.$router.replace('home')
      });
    },
  },
 
};
</script>
<!-- less可以输css里的子代在父亲里写样式 -->
<!--  npm install less less-loader --save -->
<style  <style lang="less" scoped>
.login_container {
  height: 100%;
  background-color: #2b4b6b;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>