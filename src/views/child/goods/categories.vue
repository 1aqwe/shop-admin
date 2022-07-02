<template>
  <div>
    <Bread></Bread>
    <el-card>
      <!-- 添加 -->
      <el-row>
        <el-col :span="5">
          <el-button type="primary" @click="showaddDialogVisible"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <!-- table -->
      <zk-table
        :data="cageList"
        :columns="columns"
        show-index
        index-text="#"
        :selection-type="false"
        :expand-type="false"
        border
      >
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i
            class="el-icon-error"
            v-if="scope.row.cat_deleted === false"
            style="color: lightgreen"
          ></i>
          <i class="el-icon-success" v-else style="color: lightgreen"></i>
        </template>
        <template slot="likes" scope="scope">
          {{ scope.row.likes.join(",") }}
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0"> 一级 </el-tag>
          <el-tag
            size="mini"
            type="success"
            v-else-if="scope.row.cat_level === 1"
          >
            二级
          </el-tag>
          <el-tag size="mini" type="warning" v-else> 三级 </el-tag>
        </template>
        <!-- 操作 -->
        <template slot="opt" slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit"
            >编辑
          </el-button>
          <el-button size="mini" type="danger" icon="el-icon-delete"
            >删除
          </el-button>
        </template>
      </zk-table>

      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类提示框 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addclose"
    >
      <!-- 添加分列的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateFormrules"
        ref="ruleFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父类分类">
          <!-- props用来指定配置对象 -->
          <el-cascader
            v-model="selectKeys"
            :options="ParnetCagelist"
            :props="cascaerProps"
            @change="ParentCageChange"
            clearable
            checkStrictly="true"
          ></el-cascader>
        </el-form-item>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcage">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Bread from "../../../components/bread/bread.vue";
export default {
  components: { Bread },
  data() {
    return {
      queryInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      cageList: [],
      total: 0,
      columns: [
        {
          label: "分类名称",
          prop: "cat_name",
        },
        {
          label: "是否有效",
          type: "template",
          template: "isok", //表示当前这一列使用的模板名称
        },
        {
          label: "排序",
          type: "template",
          template: "order", //表示当前这一列使用的模板名称
        },
        {
          label: "操作",
          type: "template",
          template: "opt", //表示当前这一列使用的模板名称
        },
      ],
      addDialogVisible: false,
      addCateForm: {
        cat_name: "",
        cat_pid: 0,
        cat_level: 0,
      },

      addCateFormrules: {
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
        ],
      },
      // 指定级联悬着器的分配对象
      ParnetCagelist: [],
      cascaerProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的父级id
      selectKeys: [],
    };
  },
  methods: {
    async getCageList() {
      const res = await this.$http.get("categories", {
        params: this.queryInfo,
      });
      console.log(res);
      if (res.data.meta.status !== 200)
        return this.$message.error("获取数据失败");
      (this.cageList = res.data.data.result),
        (this.total = res.data.data.total);
    },
    handleSizeChange(NewSize) {
      this.queryInfo.pagesize = NewSize;
      this.getCageList();
    },
    handleCurrentChange(NewPage) {
      this.queryInfo.pagenum = NewPage;
      this.getCageList();
    },
    showaddDialogVisible() {
      this.getParnetCage();
      this.addDialogVisible = true;
    },
    // 获取父级商品分类数据列表
    async getParnetCage() {
      const res = await this.$http.get("categories", { params: { type: 2 } });
      console.log(res.data);
      if (res.data.meta.status !== 200)
        return this.$message.error("获取数据失败");
      this.ParnetCagelist = res.data.data;
    },
    // 选择项发生变化
    ParentCageChange() {
      console.log(this.selectKeys);
      // 如果selectKeys素组中的length>0,则选中
      if (this.selectKeys.length > 0) {
        this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
        this.addCateForm.cat_level = this.selectKeys.length;
        return;
      } else {
        this.addCateForm.cat_pid = 0;
        this.addCateForm.cat_level = 0;
      }
    },
    addclose() {
      this.$refs.ruleFormRef.resetFields();
      this.selectKeys = [];
      this.addCateForm.cat_level = 0;
      this.addCateForm.cat_pid = 0;
    },
    addcage() {
      console.log(this.addCateForm);
      // 验证表单
      this.$refs.ruleFormRef.validate(async (valid) => {
        if (!valid) return;
        const res = await this.$http.post("categories", this.addCateForm);
        console.log('add',res);
        if (res.data.meta.status !== 201)
        { return this.$message.error("添加分类失败");}
       this.$message.success("添加分类成功");
       this.getCageList();

        this.addDialogVisible = false;
      });
    },
  },
  // { params: this.queryInfo }
  created() {
    this.getCageList();
  },
};
</script>

<style scoped>
.zk-table {
  margin-top: 15px;
}
.el-cascader {
  width: 100%;
}
</style>