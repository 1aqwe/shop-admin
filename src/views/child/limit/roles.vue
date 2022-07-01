<template>
  <div>
    <Bread></Bread>
    <el-card>
      <el-row>
        <el-col :span="5">
          <el-button type="primary" @click="addDialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="roleList" border style="width: 100%" stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              v-for="(item1, index1) in scope.row.children"
              :key="item1.id"
              :class="['vcenter', index1 === 0 ? 'rowtop' : '']"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5"><el-tag  closable
                    @close='removeRigthById(scope.row,item1.id)'
                    >{{ item1.authName }} </el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级权限 -->
              <el-col :span="19">
                <!--  -->
                <el-row
                class="vcenter"
                  v-for="item2,  in item1.children"
                  :key="item2.id"
                 
                >
                  <el-col :span="6">
                    <el-tag type="success"  
                     closable
                  @close='removeRigthById(scope.row,item2.id)'>{{ item2.authName }} </el-tag>
                    <i class="el-icon-caret-right"></i
                  ></el-col>
                  <el-col :span="18">
                  <el-tag
                    type="warning"
                    closable
                    @close='removeRigthById(scope.row,item3.id)'
                    v-for="item3  in item2.children"
                    :key="item3.id"
                    >{{ item3.authName }}
                  </el-tag>
                  </el-col>
                  
                </el-row>
              </el-col>
            </el-row>
            
          </template>
        </el-table-column>
        <el-table-column type="index"> </el-table-column>
        <el-table-column prop="roleName" label="角色名称"> </el-table-column>
        <el-table-column prop="roleDesc" label="角色描述"> </el-table-column>
        <el-table-column prop="" label="操作" width="300">
          <template slot-scope="scope">
            <!--编辑  -->
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row)"
              >编辑</el-button
            >
            <!-- 删除 -->
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="showdelectDialog(scope.row)"
              >删除</el-button
            >
            <!-- 分配角色-->
            <el-tooltip
              effect="dark"
              content="分配权限"
              placement="top"
              :enterable="false"
            >
              <el-button type="warning" size="mini" icon="el-icon-setting"
              @click='showSetDialog(scope.row)'  >分配权限</el-button
              >
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
   
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
        <el-button type="primary"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改权限对话框 -->
    <el-dialog
  title="分配权限"
  :visible.sync="setDialogVisible"
  width="50%"
  @close='setSetDialogclose'
 >
 <!-- 树形结构 -->
 <el-tree :data="rightlist" 
 :props="treeProps" 
  show-checkbox 
  :default-checked-keys="defKeys"
  ref='treeRef'
 node-key='id'

 default-expand-all
 ></el-tree>
  <span slot="footer" class="dialog-footer">
  
  
    <el-button @click="setDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="allotRights">确 定</el-button>
  </span>
</el-dialog>
  </div>
</template>

<script>
import Bread from "../../../components/bread/bread.vue";
// import Table from "../../../components/table/table.vue";
export default {
  components: { Bread },
  data() {
    return {
      roleList: [],
      delectDialogVisible:false,
      setDialogVisible:false,
      rightlist:{},
      treeProps:{
        label:'authName',
        children:'children'
      },
      defKeys:[],
      roleId:'',
    };
  },
  methods: {
    async getRolelist() {
      const res = await this.$http.get("roles");
      console.log(res);
      if (res.data.meta.status !== 200)
        return this.$message.error("获取用户列表失败！");
      this.roleList = res.data.data;
    },
    // 
  async  removeRigthById(row,rightId){
  const confireResult=await    this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch((err) => {
              err   
        });
      if(confireResult!=='confirm')return this.$message.error('取消删除')
    console.log(row,rightId)
 const res= await   this.$http.delete(`roles/${row.id}/rights/${rightId}
`)
   console.log(res)
   if(res.data.meta.status!==200) return this.$message.error('删除失败')
  
  row.children=res.data.data
   this.$message.success('删除成功')
   
    },
 async   showSetDialog(row){
      const res=await this.$http.get('rights/tree')
      if(res.data.meta.status!==200)
      return this.$message.error('获取数据失败')
      console.log(res)
      this.roleId=row.id
      console.log('row',row)
       this.getLeafKeys(row,this.defKeys)
      this.setDialogVisible=true
      this.rightlist=res.data.data
    },
    // 通过递归获取3级权限
    getLeafKeys(node, arr){
      //如果 node节点不包含children
      if(!node.children){
        return arr.push(node.id)
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      });
    },
    setSetDialogclose(){
      this.defKeys=[]
    },
    // 分配新的权限
   async allotRights(){
      const keys=[
       ...this.$refs.treeRef.getCheckedKeys(),
      ...this.$refs.treeRef. getHalfCheckedKeys()
      ]
      const idStr=keys.join(',')
      const res=await this.$http.post(`roles/${this.roleId}/rights`,{rids:idStr})
      if(res.data.meta.status!==200){
       return this.$message.error('分配权限失败')
      }
      this.$message.success('分配权限成功')
      this.getRolelist();
      this.setDialogVisible=false
    },

  },
  created() {
    this.getRolelist();
  },
};
</script>

<style lang="less" scoped>
.el-table {
  margin-top: 10px;
}
.el-tag {
  margin: 7px;
}
.rowtop {
  border-top: 1px solid #eee;
}

.el-row {
  border-bottom: 1px solid #eee;
}
.vcenter{
  display: flex;
  align-items: center;
}
</style>