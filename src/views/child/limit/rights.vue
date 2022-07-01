<template>
  <div>
    <!-- 面包屑 -->
    <Bread></Bread>

    <el-card class="box-card">
      <!-- table -->
      <!-- <el-table :data="rightList" border style="width: 100%" stripe>
      
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">标签一</el-tag>
            <el-tag  type="success" v-else-if="scope.row.level==='1'">标签二</el-tag>
            <el-tag type="info" v-else>标签三</el-tag>
          </template>
        </el-table-column>
      </el-table> -->
   <Table :tableData='rightList'></Table>
   <Page></Page>
    </el-card>
  </div>
</template>

<script>
import Bread from "../../../components/bread/bread.vue";
import Table from "../../../components/table/table.vue";
import Page from "../../../components/table/page.vue";

export default {
  components: { Bread,Table,Page },
  data() {
    return {
      rightList: [],
    };
  },
  methods: {
    async getRightList() {
      const res = await this.$http.get("rights/" + "list");
      console.log(res);
      if (res.data.meta.status !== 200)
        return this.$message.error("获取用户列表失败！");
      this.rightList = res.data.data;
    },
  },
  created() {
    this.getRightList();
  },
};
</script>

<style>
</style>