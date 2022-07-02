<!--table子组件封装-->
<template>
    <el-table :data="value.tableData" border>
        <el-table-column v-for="(item,key) in value.tableKey" 
        :key="key"
        :prop="item.value"
        :label="item.name">
        <slot name="searchBox"></slot>

          
         
        </el-table-column>
    </el-table>
</template>
<script>
export default{
    name: 'table',
   props:{
    value: {
      type: Object,
      default: true
    }
   },//子传父
    data(){
        return{

        }
    },
    created() {
     
    },
}
</script>
<style>

</style>

