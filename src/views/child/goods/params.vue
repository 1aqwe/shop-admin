<template>
  <div>
    <Bread></Bread>
    <el-card>
      <!-- 警告只允许为第三级  -->
      <el-alert
        title="注意，只允许为第三级分类设置相关参数！"
        type="warning"
        show-icon
      >
      </el-alert>
      <!-- 选择器 -->
      <el-row>
        <span> 选择商品分类：</span>
        <!-- options指定数据源 -->
        <el-cascader
          v-model="selectCageKeys"
          :options="CageList"
          :props="cateProps"
          @change="handleChange"
        ></el-cascader>
      </el-row>
      <!-- tabs -->
      <!-- 难点 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="动态属性" name="many">
          <!-- 添加动态属性 -->

          <el-button
            type="primary"
            :disabled="selectCageKeys.length !== 3 ? true : false"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态表格 -->
          <el-table :data="manyTableData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- e-tag -->
                <el-tag
                  closable
                   @close='close(index,scope.row)'
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                 
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="参数名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button size="mini" type="danger" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <!-- 添加静态属性 -->
          <el-button
            type="primary"
            :disabled="selectCageKeys.length !== 3 ? true : false"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 静态表格 -->
          <el-table :data="onlyTableData" border stripe>
            <el-table-column type="expand">
             <template slot-scope="scope">
                <!-- e-tag -->
                <el-tag
                  closable
                   @close='close(index,scope.row)'
                  v-for="(item, index) in scope.row.attr_vals"
                  :key="index"
                  >{{ item }}</el-tag
                >
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                 
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
             </el-table-column>
            <el-table-column type="index"> </el-table-column>
            <el-table-column label="属性名称" prop="attr_name">
            </el-table-column>
            <el-table-column label="操作" width="1100">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  icon="el-icon-edit"
                  @click="editDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button size="mini" type="danger" icon="el-icon-delete"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      class="dialog"
      :title="activeName === 'many' ? '添加动态参数' : ' 添加静态参数'"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="handclose"
    >
      <!-- 表单 -->
      <el-form
        :model="addruleForm"
        :rules="Addrules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="addruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParam">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 -->
    <el-dialog
      class="dialog"
      :title="activeName === 'many' ? '编辑动态参数' : ' 编辑静态参数'"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="handclose"
    >
      <!-- 表单 -->
      <el-form
        :model="addruleForm"
        :rules="Addrules"
        ref="ruleForm"
        label-width="100px"
      >
        <el-form-item label="参数名称" prop="attr_name">
          <el-input v-model="addruleForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParam">确 定</el-button>
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
      CageList: [],
      value: [],
      cateProps: {
        //层级选择对象
        value: "cat_id", //选中的值
        label: "cat_name", //看到的名称
        children: "children",
      },
      // 选中的数据的值
      selectCageKeys: [],
      // tabs
      activeName: "many",
      cageId: Number,
      manyTableData: [],
      onlyTableData: [],
      titleText: "",
      addDialogVisible: false,
      addruleForm: { attr_name: "" },
      Addrules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
      editDialogVisible: false,
      // tag的输入添加
      attr_id: "",
    };
  },
  methods: {
    async getCageList() {
      const res = await this.$http.get("categories");
      console.log(res);
      this.CageList = res.data.data;
    },
    async handleChange() {
      this.getParams();
      
    },
    // 获取数据
    async getParams() {
      if (this.selectCageKeys.length !== 3) {
        this.selectCageKeys = [];
        this.selectCageKeys=[]
      this.manyTableData=[]
      this.onlyTableData=[]
        this.cageId = null;
        return;
      }
      console.log(this.selectCageKeys);
      this.cageId = this.selectCageKeys[2];
      console.log(this.cageId);
      const res = await this.$http.get(`categories/${this.cageId}/attributes`, {
        params: { sel: this.activeName },
      });
      console.log(res);
      if (res.data.meta.status !== 200) {
        return this.$message.error("数据获取失败");
      }
      // 进行分割
      res.data.data.forEach((item) => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 控制tag文本框的显示与隐藏
        item.inputVisible = false;
        // 内容
        item.inputValue = "";
      });

      if (this.activeName == "many") {
        this.manyTableData = res.data.data;
      } else {
        this.onlyTableData = res.data.data;
      }
    },
    handleClick() {
      console.log(this.activeName);
      this.getParams();
    },
    handclose() {
      this.$refs.ruleForm.resetFields();
    },
    addParam() {
      console.log(this.addruleForm.name);
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          const res = await this.$http.post(
            `categories/${this.cageId}/attributes`,
            {
              attr_name: this.addruleForm.attr_name,
              attr_sel: this.activeName,
            }
          );
          console.log(res);
          if (res.data.meta.status !== 201) {
            return this.$message.error("数据添加失败");
          }
          this.$message.success("数据添加成功");
          (this.addDialogVisible = false), this.getParams();
        }
      });
    },
    editDialog(row) {
      console.log(row);
      this.attr_id = row.attr_id;
      console.log("editDialog");
      this.editDialogVisible = true;
    },
    // 修改
    editParam() {
      console.log(this.addruleForm.name);
      this.$refs.ruleForm.validate(async (valid) => {
        if (!valid) {
          return;
        } else {
          const res = await this.$http.put(
            `categories/${this.cageId}/attributes/${this.attr_id}`,
            {
              attr_name: this.addruleForm.attr_name,
              attr_sel: this.activeName,
            }
          );
          console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error("数据修改失败");
          }
          this.$message.success("数据修改成功");
          (this.editDialogVisible = false), this.getParams();
        }
      });
    },
    // tag
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    // tag
    showInput(row) {
      row.inputVisible = true;

      this.$nextTick((_) => {
        // 自动获得焦点

        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // tag
 async   handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
     this.savaAttrVals(row)

    },
    // 将对attr_vals的操作保存到数据库
 async   savaAttrVals(row){
       // 需要发起请求  ：categories/:id/attributes/:attrId
   const res=await   this.$http.put(`categories/${this.cageId}/attributes/${row.attr_id}`,{
        attr_name:row.attr_name,
        attr_sel:row.attr_sel,
        attr_vals:row.attr_vals.join(' ')
      })
       console.log(res);
          if (res.data.meta.status !== 200) {
            return this.$message.error("修改参数失败");
          }
          this.$message.success("修改参数成功");
      
    },
    // 删除对应的参数
    close(i,row){
   
      row.attr_vals.splice(i,1)
      this.savaAttrVals(row)
    },
  },
  created() {
    console.log(this.addruleForm.attr_name);
    this.getCageList(this.activeName);
  },
};
</script>

<style  scoped>
.el-row {
  margin: 15px 0;
}
.el-table {
  margin: 15px 0;
}
.dialog {
  text-align: left;
}
.el-tag {
  margin: 0 10px;
}
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>>
</style>