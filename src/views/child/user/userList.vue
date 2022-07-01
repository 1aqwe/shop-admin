<template>
  <div>
    <!--面包屑导航区域  -->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片内容 -->
    <el-card class="box-card">
      <!-- 搜索框 -->
      <el-row :getter="20">
        <el-col :span="8">
          <div style="margin-top: 15px">
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              class="input-with-select"
              clearable
              @clear="getUserlist"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserlist"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <!-- 添加 -->
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- 用户表 -->
      <el-table :data="userList" border style="width: 100%">
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <!-- 状态 -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.mg_state"
              @change="changeState(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column prop="" label="操作" width="180">
          <template slot-scope="scope">
            <!--编辑  -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="showdelectDialog(scope.row)"
            ></el-button>
            <!-- 分配角色-->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
             
            >
              <el-button
                type="warning"
                size="mini"
                icon="el-icon-setting"
                 @click="showsetRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->

      <el-pagination
        background
        layout="prev, pager, next"
        :total="total"
        :page-size="queryInfo.pagesize"
        :current-page="queryInfo.pagenum"
        @current-change="handelCurrentPage"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogCLosed"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="addruleForm"
        :rules="addruleFormrules"
        ref="addFormRef"
        label-width="70px"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addruleForm.username"></el-input>
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item label="密码" prop="password">
          <el-input v-model="addruleForm.password"></el-input>
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addruleForm.email"></el-input>
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="addruleForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="添加用户" :visible.sync="editDialogVisible" width="50%">
      <!-- 内容主题区域 -->
      <el-form
        :model="editForm"
        :rules="editFormrules"
        ref="editFormRef"
        label-width="70px"
      >
        <!-- 用户名 -->
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>

        <!-- 用户名 -->
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <!-- 用户名 -->
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 删除用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="delectDialogVisible"
      width="50%"
      center
    >
      <span>是否删除当前用户</span>
      <span slot="footer">
        <el-button @click="delectDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="delectUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setroleDialogVisible"
      width="50%"
      center
    >
    <p>当前的用户：{{setRow.username}}</p>
    <p>当前的角色：{{setRow.role_name}}</p>
    <p>
    <!-- 选择器 -->
     <el-select v-model="SelectRoleId" placeholder="请选择">
    <el-option
      v-for="item in SetroleList"
      :key="item.id"
      :label="item.roleName"
      :value="item.id">
    </el-option>
  </el-select>
    </p>
    <p>
    
    {{setRow}}</p>

      <span slot="footer">
        <el-button @click="setroleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setUser()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 正则验证邮箱
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;

      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    // 正则手机号邮箱
    var checkMoble = (rule, value, cb) => {
      const regMobile = /^1[3-9]\d{9}$/;

      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的手机号"));
    };
    return {
      userList: [],
      queryInfo: {
        query: "",
        pagenum: 1, //当前页
        pagesize: 2,
      },
      total: 0,
      searchval: "",
      // 添加用户数据
      addDialogVisible: false,
      addruleForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addruleFormrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          {
            validator: checkEmail,
            trigger: "blur", // 正则验证
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },

          {
            validator: checkMoble,
            trigger: "blur",
          },
        ],
      },
      // 修改用户数据
      editForm: {},
      editDialogVisible: false,
      editFormrules: {
        email: [
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
          {
            validator: checkEmail,
            trigger: "blur", // 正则验证
          },
        ],
        mobile: [
          {
            required: true,
            message: "请输入手机号",
            trigger: "blur",
          },

          {
            validator: checkMoble,
            trigger: "blur",
          },
        ],
      },
      // 删除用户数据
      delectDialogVisible: false,
      deleteForm: {},
      // 设置权限
      setroleDialogVisible: false,
      setRow:[],
      SetroleList:[],
      SelectRoleId:'',

    };
  },
  methods: {
    async getUserlist() {
      const res = await this.$http.get("users", { params: this.queryInfo });
      console.log("users", res.data);
      if (res.data.meta.status !== 200)
        return this.$message.error("获取用户列表失败！");
      this.userList = res.data.data.users;
      console.log("this.userList", this.userList);
      this.total = res.data.data.total;
    },
    // handSizeChange(NewSize){
    //   console.log(NewSize)
    // },
    handelCurrentPage(Newpage) {
      console.log(Newpage);
      this.queryInfo.pagenum = Newpage;
      this.getUserlist();
    },
    async changeState(state) {
      console.log(state);
      const { data: res } = await this.$http.put(
        `users/${state.id}/state/${state.mg_state}`
      );
      console.log("state", res);

      if (res.meta.status !== 200) {
        state.mg_state = !state.mg_state;
        return this.$message.error("修改状态失败");
      } else {
        this.$message.success("修改状态成功");
      }
    },

    // 监听添加用户对话框关闭时间
    addDialogCLosed() {
      // 关闭对话框，清空输入内容resetFields()
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户
    addUser() {
      // 先进行表单验证validate
      this.$refs.addFormRef.validate(async (valid) => {
        console.log(valid);
        if (!valid) return; //为false

        const { data: res } = await this.$http.post("users", this.addruleForm);
        if (res.meta.status !== 201) {
          this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.addDialogVisible = false;
        // 刷新列表，重新调用列表就行
        this.getUserlist();
      });
    },
    async showEditDialog(row) {
      // console.log(row)
      const res = await this.$http.get("users/" + row.id);
      // console.log(res)
      if (res.data.meta.status !== 201) {
        this.$message.error("用户信息显示失败");
      }
      this.$message.success("用户信息查询成功");
      this.editForm = res.data.data;
      this.editDialogVisible = true;
    },

    async editUser() {
      console.log("edituser");
      const res = await this.$http.put("users/" + this.editForm.id, {
        email: this.editForm.email,
        mobile: this.editForm.mobile,
      });
      console.log(res);
      if (res.data.status !== 200) {
        this.$message.error("用户修改失败");
      }
      this.$message.success("用户修改失成功");
      this.editDialogVisible = false;
      this.getUserlist();
    },
    // 删除用户
    showdelectDialog(row) {
      this.delectDialogVisible = true;
      console.log(row);
      this.deleteForm = row;
    },
    async delectUser() {
      console.log("delect");
      const res = await this.$http.delete("users/" + this.deleteForm.id);
      if (res.data.meta.status !== 200) {
        this.$message.error("用户删除失败");
      }

      this.$message.success("删除成功");
      this.delectDialogVisible = false;
      this.getUserlist();
    },
    // 设置权限
  async showsetRoleDialog(row) {
     this.setRow=row
     const res = await this.$http.get("roles");
      console.log(res);
      if (res.data.meta.status !== 200)
      return this.$message.error("获取用户列表失败！");
      this.SetroleList = res.data.data;
      console.log(this.SetroleList)
      this.setroleDialogVisible=true

    },
    setUser(){
   
    },
  },
  created() {
    this.getUserlist();
  },
};
</script>

<style lang="less" scoped>
.el-row {
  text-align: center;
}
.el-button--primary {
  margin-top: 15px;
}
.el-table {
  margin-top: 20px;
  font-size: 12px;
}
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
.el-pagination {
  margin-top: 20px;
}
</style>