<template>
  <div>
    <Bread></Bread>
    <el-card>
      <!-- 搜索 -->
      <el-row :getter="20">
        <el-col :span="8">
          <div style="margin-top: 15px">
            <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable>
              <el-button
                slot="append"
                icon="el-icon-search"
                   
                @click="getOrderList"
              ></el-button>
            </el-input>
          </div>
        </el-col>
      </el-row>
      <!-- table -->
      <el-table :data="orderList" border style="width: 100%">
        <el-table-column prop="order_number" label="订单编号" width="180">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="180">
        </el-table-column>
        <el-table-column prop="order_pay" label="是否付款"> 
         <template slot-scope="scope">
           <el-tag type="danger" v-if="scope.row.order_pay==='0'">未付款</el-tag>
           <el-tag type="danger" v-else>已付款</el-tag>
           </template>
        </el-table-column>
         <el-table-column prop="is_send" label="是否发货"> 
          <template slot-scope="scope">
          <el-tag type="danger" v-if="scope.row.is_send==='0'">否</el-tag>
           <el-tag type="danger" v-else>是</el-tag>
           </template>
         </el-table-column>
         <!-- create_time -->
          <el-table-column prop="create_time" label="下单时间">
          <template slot-scope="scope">
            <!-- 使用了时间过滤器 -->
            {{ scope.row.create_time | dateFormat }}
          </template>
           </el-table-column>
           <!-- 操作 -->
           <el-table-column prop="is_send" label="操作"> 
           <template slot-scope="scope">
           <el-button  type="primary" icon="el-icon-edit" @click="etit(scope.row)"></el-button>
            <el-button type="success" icon="el-icon-location-outline" @click="show"></el-button>
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
      :total="total">
    </el-pagination>
     
    
    </el-card>
    <!-- 物流对话框 -->
    <el-dialog
  title="提示"
  :visible.sync="dialogVisible"
  width="50%"
  >
  <span>物流信息</span>
  <el-timeline >
    <el-timeline-item
      v-for="(activity, index) in activities"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
  <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
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
        query:'',
        pagenum: 1,
        pagesize: 10,
      },
      total:0,
      orderList: [],
      dialogVisible:false,
        activities:{
          

         }
    };
  },
  methods: {
    // 获取订单
    async getOrderList() {
        // const res = await this.$http.get("goods", { params: this.queryInfo });
      const res = await this.$http.get("orders" ,{params:this.queryInfo });
      console.log(res);
      if (res.data.meta.status !== 200) {
        this.$message.error("订单列表获取失败");
      }
      this.total=res.data.data.total
      this.orderList=res.data.data.goods
    },
    // 分页
    handleCurrentChange(val){
      this.queryInfo.pagenum=val
       this.getOrderList();
    },
    handleSizeChange(val){
        this.queryInfo.pagesize=val
         this.getOrderList();
    },
    // 物流
   async show(){
      const res=await this.$http.get('/kuaidi/1106975712662')
      console.log(res)
       if (res.data.meta.status !== 200) {
        this.$message.error("物流信息获取失败");
      }
      this.activities=res.data.data
      this.dialogVisible=true
    },

  },
  created() {
    this.getOrderList();
  },
};
</script>

<style>
</style>