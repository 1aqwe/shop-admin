<template>
  <div>
    <Bread></Bread>
    <el-card>
      <!-- 搜索 -->
      <el-row :getter="20">
        <el-col :span="8">
          <div style="margin-top: 15px">
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getgoodsList"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <!-- 添加 -->
        <el-col :span="4">
          <el-button class="btn" type="primary" @click="addgoods"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <!-- table -->
      <el-table :data="goodsList" border style="width: 100%" stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="goods_name" label="名称" width="600">
        </el-table-column>
        <el-table-column prop="goods_price" label="价格(元)" width="120">
        </el-table-column>
        <el-table-column prop="goods_weight" label="重量(g)" width="120">
        </el-table-column>
        <!-- goods_weight -->
        <el-table-column prop="add_time" label="创建时间">
          <template slot-scope="scope">
            <!-- 使用了时间过滤器 -->
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <el-table-column prop="" label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="eidtbtn(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="deletebtn(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 编辑对话框 -->
    <el-dialog title="提示" :visible.sync="editdialogVisible" width="70%">
      <!-- step步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- form表单 -->
      <el-form
        :model="editruleForm"
        :rules="editrules"
        ref="editruleFormRef"
        label-width="100px"
        label-position="top"
      >
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeTableave"
          @tab-click="tabClicked"
        >
          <!-- tag1 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="editruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="editruleForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <!-- goods_weight -->
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="editruleForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                type="number"
                v-model="editruleForm.goods_number"
              ></el-input>
            </el-form-item>
            <!-- 分类 -->
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="editruleForm.goods_cat"
                :options="CageList"
                :props="cascaerProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- tag2 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in paramList"
              :key="item.attr_id"
            >
              <!-- 复选框 -->
              <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="item.attr_vals" @change="handleCheckAllChange">全选</el-checkbox> -->
              <div style="margin: 15px 0"></div>
              <el-checkbox-group v-model="item.attr_vals" border>
                <el-checkbox
                  v-for="(value, i) in item.attr_vals"
                  :label="value"
                  :key="i"
                  border
                  >{{ value }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- tab3 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :label="item.attr_name"
              v-for="item in stateParamList"
              :key="item.attr_id"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- tag4 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- aciton图片要上传的api地址 -->
            <div class="block" v-for="(img,index) in editruleForm.pics" :key="index">
              <!-- <span class="demonstration">{{ fit }}</span> -->
              <el-image
               
                :src="img.pics_big"
               
              ></el-image>
            </div>

            <el-upload
              :action="uploadURL"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :headers="headerObj"
              :on-success="handsuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <!-- tag5 -->
           <!-- 富文本编辑器 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="editruleForm.goods_introduce"           />
            <!-- 添加按钮 -->
            <el-button type='primary' >添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>

import Bread from "../../../components/bread/bread.vue";
// import  lodash  from  'lodash'
export default {
  components: { Bread },
  data() {
    return {
      goodsList: [],
      queryInfo: {
        query: "",
        pagenum: 1, //当前页
        pagesize: 10,
      },

      total: 0,
      // 编辑
      editdialogVisible: false,
      activeIndex: "0",
      editruleForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      // 表单验证
      editrules: {
        goods_name: {
          required: true,
          message: "请输入商品名称",
          trigger: "blur",
        },
        goods_price: {
          required: true,
          message: "请输入商品价格",
          trigger: "blur",
        },
        goods_number: {
          required: true,
          message: "请输入商品数量",
          trigger: "blur",
        },
        goods_weight: {
          required: true,
          message: "请输入商品数量",
          trigger: "blur",
        },
        goods_cat: {
          required: true,
          message: "请选择商品类别",
          trigger: "blur",
        },
      },
      // 练级选择器
      CageList: [],
      ParnetCagelist: [],
      // 选中的父级id
      selectKeys: [],
      cascaerProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      paramList: [],
      checked: false,

      paramList: [],
      stateParamList: [],
      uploadURL: "https://lianghj.top:8888/api/private/v1/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      previewVisible: false,
      goods_id:'',
    };
  },
  methods: {
    // 商品列表
    async getgoodsList() {
      const res = await this.$http.get("goods", { params: this.queryInfo });
      console.log(res);
      if (res.data.meta.status !== 200)
        return this.$message.error("获取商品列表失败！");
      this.goodsList = res.data.data.goods;
      // console.log("this.userList", this.userList);
      this.total = res.data.data.total;
        this.cateList = this.getCateList;
      

    

    },
    // 移除图片
    handleRemove(file) {
      console.log(file);
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 从pics数组中找到图片的索引
      const i = this.editruleForm.pics.findIndex((x) => x.pic === filePath);
      this.editruleForm.pics.splice(i, 1);
      console.log(this.editruleForm);
    },
    // 图片预览
    handlePreview(file) {
      console.log(file);
      this.previewPath = file.response.data.url;
      this.previewVisible = true;
      console.log(this.previewPath);
    },
    //监听 图片上传成功事件
    handsuccess(response) {
      console.log(response);
      const picInfo = {
        pic: response.data.tmp_path,
      };
      this.editruleForm.pics.push(picInfo);
      console.log(this.editruleForm);
    },
    // 分页
    handleSizeChange(val) {
      this.queryInfo.pagesize = val;
      console.log(`每页 ${val} 条`);
      this.getgoodsList();
    },
    handleCurrentChange(val) {
      this.queryInfo.pagenum = val;
      console.log(`当前页: ${val}`);
      this.getgoodsList();
    },
    addgoods() {
      console.log("add");
      this.$router.push("/home/goods/add");
    },
    // 获取分类
    async getCagelist() {
      const res = await this.$http.get("categories");
      console.log(res);
      if (res.data.meta.status !== 200) {
        return this.$message.error("获取分类列表失败");
      }
      this.CageList = res.data.data;
    },
    handleChange() {
      console.log(this.editruleForm.goods_cat);
      if (this.editruleForm.goods_cat.length !== 3) {
        this.editruleForm.goods_cat = [];
      }
    },
    beforeTableave(activename, oldactivename) {
      console.log(activename, oldactivename);
      if (oldactivename === "0" && this.editruleForm.goods_cat.length !== 3) {
        this.$message.info("请先选择分类");
        return false;
      }
    },
    // tabs是哪一个
    async tabClicked() {
      console.log(this.activeIndex);
      if (this.activeIndex === "1") {
        console.log("动态参数");
        const res = await this.$http.get(
          `categories/${this.editruleForm.goods_cat[2]}/attributes`,
          { params: { sel: "many" } }
        );
        console.log(res);
        if (res.data.meta.status !== 200)
          return this.$message.error("商品参数获取失败");
        res.data.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.paramList = res.data.data;
      } else if (this.activeIndex === "2") {
        const Stateres = await this.$http.get(
          `categories/${this.editruleForm.goods_cat[2]}/attributes`,
          { params: { sel: "only" } }
        );
        console.log(Stateres);
        if (Stateres.data.meta.status !== 200)
          return this.$message.error("商品属性取失败");
        this.stateParamList = Stateres.data.data;
      }
    },
    // 点击编辑按钮显示编辑对话框及里面的数据
    async eidtbtn(row) {
      console.log(row);
      this.getCagelist();
      // 点击查询想要的数据
      const res = await this.$http.get(`goods/${row.goods_id}`);
      console.log(res);
      if (res.data.meta.status !== 200) {
        this.$message.error("商品数据获取失败");
      }
 console.log("goods_cat", this.editruleForm.goods_cat);
      this.editruleForm = res.data.data;
      this.goods_id=res.data.data.goods_id
      // 重要！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！！
        // 设置级联选择器绑定值
    const tempArray = res.data.data.goods_cat.split(',');
    // 这里必须重新赋值为空数组，再赋值，否则v-model不能实现默认值回显
    this.editruleForm.goods_cat = [];
    tempArray.forEach(item => {
      // item - 0是把数据类型转换为数字，以与cateList 数据类型一致，否则不能正确回显默认值
      this.editruleForm.goods_cat.push(item - 0);
    });
      this.editdialogVisible = true;
    },
    // 点击提交编辑
    submit(){
      // 表单验证
      
      this.$refs.editruleFormRef.validate(async valid=>{
        if(!valid){
                return this.$message.error('请填写必要的表单项')
            }
        this.paramList.forEach(item=>{
        const newInfo={
        attr_id:item.attr_id,
        attr_vals:item.attr_vals.join(' ')
        }
        this.editruleForm.attrs.push(newInfo)
    })
    // stateParamList: []
    this.stateParamList.forEach(item=>{
        const newInfo={
            attr_id:item.attr_id,
            attr_vals:item.attr_vals
      
        }
        this.editruleForm.attrs.push(newInfo)
    })
      this.editruleForm.goods_cat=this.editruleForm.goods_cat.join(',')
        const res=await this.$http.put(`goods/${this.goods_id}`,this.editruleForm)
           console.log(res)
            if(res.data.meta.status!==200){
                this.$message.error('商品修改失败')
            }
             this.$message.success('商品修改成功')
              this. getgoodsList()
            //  this.$router.push('/home/goods')
         
             this.editdialogVisible=false
       
      // goods/:id
      })
      
    },
    //删除
    async deletebtn(row) {
      // goods/:id
      const confirmRes = await this.$confirm(
        "此操作将永久删除该商品, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      if (confirmRes !== "confirm") {
        return this.$message.info("已取消删除");
      }

      const res = await this.$http.delete(`goods/${row.goods_id}`);
      console.log(res);
      if (res.data.meta.status !== 200) {
        return this.$message.error("删除失败");
      }
      this.$message.success("删除成功");
      this.getgoodsList();
    },
  },
  // 监听搜索框为空
  watch: {
    "queryInfo.query"(newValue, oldValue) {
      console.log(newValue, oldValue);
      if (newValue === "") {
        this.getgoodsList();
      }
      this.goodsList = res.data.data;
    },
    // 搜素、分页功能完成
    // 时间过滤器
  },
  created() {
    this.getgoodsList();
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