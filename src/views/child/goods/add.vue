<template>
  <div>
    <Bread></Bread>
    <el-card>
      <!--  -->
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <!-- 步骤条 -->
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
      <!-- from -->
      <el-form
        :model="addruleForm"
        :rules="addrules"
        ref="addruleForm"
        label-width="100px"
        class="demo-ruleForm"
        label-position="top"
      >
        <!-- tab -->

        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTableave"
          @tab-click="tabClicked"
        >
          <!-- tab1 -->
          <el-tab-pane label="基本信息" name="0">
            <!-- form-item -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addruleForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addruleForm.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <!-- goods_weight -->
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addruleForm.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                type="number"
                v-model="addruleForm.goods_number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addruleForm.goods_cat"
                :options="CageList"
                :props="cascaerProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- tab2 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item
              :label="item.attr_name"
              v-for="item in paramList"
              :key="item.attr_id"
            >
              <!-- 复选框 -->
              <!-- <el-checkbox :indeterminate="isIndeterminate" v-model="item.attr_vals" @change="handleCheckAllChange">全选</el-checkbox> -->
              <div style="margin: 15px 0"></div>
              <el-checkbox-group
                v-model="item.attr_vals"
              
                border
              >
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
          <!-- tab4 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- aciton图片要上传的api地址 -->
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
          <!-- tab5 -->
          <!-- 富文本编辑器 -->
          <el-tab-pane label="商品内容" name="4">
            <quill-editor
              ref="myQuillEditor"
              v-model="addruleForm.goods_introduce"
            
           
            />
            <!-- 添加按钮 -->
            <el-button type='primary' class="adbtn" @click="add">添加</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览 -->
    <el-dialog
      title="提示"
      :visible.sync="previewVisible"
      width="50%"
      height="50%"
      class="img"
    >
      <span>图片预览</span>
      <img :src="previewPath" alt="" />
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import Bread from "../../../components/bread/bread.vue";
export default {
  components: { Bread },
  data() {
    return {
      activeIndex: "0",
      addruleForm: {
        goods_name: "",
        goods_price: 0,
        ggoods_number: 0,
        goods_weight: 0,
        goods_cat: [],
        pics: [],
        goods_introduce:'',
        attrs:[]
      },
      addrules: {
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
      CageList: [],
      //   联级选择器
      // 指定级联悬着器的分配对象
      ParnetCagelist: [],
      cascaerProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      // 选中的父级id
      selectKeys: [],
      paramList: [],
      stateParamList: [],
      uploadURL: "https://lianghj.top:8888/api/private/v1/upload",
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      previewPath: "",
      previewVisible: false,
    };
  },
  methods: {
    async getCageList() {
      const res = await this.$http.get("categories", {});
      console.log(res);
      if (res.data.meta.status !== 200)
        return this.$message.error("获取数据失败");
      this.CageList = res.data.data;
    },

    handleChange() {
      console.log(this.addruleForm.goods_cat);
      if (this.addruleForm.goods_cat.length !== 3) {
        this.addruleForm.goods_cat = [];
      }
    },
    beforeTableave(activename, oldactivename) {
      console.log(activename, oldactivename);
      if (oldactivename === "0" && this.addruleForm.goods_cat.length !== 3) {
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
          `categories/${this.addruleForm.goods_cat[2]}/attributes`,
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
          `categories/${this.addruleForm.goods_cat[2]}/attributes`,
          { params: { sel: "only" } }
        );
        console.log(Stateres);
        if (Stateres.data.meta.status !== 200)
          return this.$message.error("商品属性取失败");
        this.stateParamList = Stateres.data.data;
      }
    },
    // 移除图片
    handleRemove(file) {
      console.log(file);
      // 获取将要删除的图片的临时路径
      const filePath = file.response.data.tmp_path;
      // 从pics数组中找到图片的索引
      const i = this.addruleForm.pics.findIndex((x) => x.pic === filePath);
      this.addruleForm.pics.splice(i, 1);
      console.log(this.addruleForm);
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
      this.addruleForm.pics.push(picInfo);
      console.log(this.addruleForm);
    },
   add(){
        this.$refs.addruleForm.validate( async valid=>{
            if(!valid){
                return this.$message.error('请填写必要的表单项')
            }
            //执行 添加
            // 处理静态、动态
    //         paramList: [],
    //   stateParamList: [],
    this.paramList.forEach(item=>{
        const newInfo={
        attr_id:item.attr_id,
        attr_vals:item.attr_vals.join(' ')
        }
        this.addruleForm.attrs.push(newInfo)
    })
    // stateParamList: []
    this.stateParamList.forEach(item=>{
        const newInfo={
            attr_id:item.attr_id,
            attr_vals:item.attr_vals
      
        }
        this.addruleForm.attrs.push(newInfo)
    })
    // form.attrs=this.addruleForm.attrs
    // console.log(form)
            this.addruleForm.goods_cat=this.addruleForm.goods_cat.join(',')
            const res=await this.$http.post('goods',this.addruleForm)
            console.log(res)
            if(res.data.meta.status!==200){
                this.$message.error('商品创建失败')
            }
             this.$message.success('商品创建成功')
             this.getCageList();
             this.$router.push('/home/goods')
             this.getCageList();
        })
    }
  },
  created() {
    this.getCageList();
  },
};
</script>

<style>
.el-checkbox {
  margin: 0;
}

.img {
  width: 100%;
}
.adbtn{
    margin: 15px 0;
}

</style>