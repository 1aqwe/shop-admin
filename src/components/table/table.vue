<template>
     <el-table :data="tableData" border style="width: 100%" stripe>
        <!-- <el-table-column type="index"> </el-table-column> -->
        <el-table-column prop="authName" label="权限名称"> </el-table-column>
        <el-table-column prop="path" label="路径"> </el-table-column>
        <el-table-column prop="level" label="权限等级">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.level==='0'">标签一</el-tag>
            <el-tag  type="success" v-else-if="scope.row.level==='1'">标签二</el-tag>
            <el-tag type="info" v-else>标签三</el-tag>
          </template>
        </el-table-column>
      </el-table>
</template>

<script>

export default {
props:['tableData']
}
</script>

<style>

</style>