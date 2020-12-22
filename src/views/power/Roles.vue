<template>
    <div class="roles">
      <Breadcrumb :headerData="headerData"></Breadcrumb>
      <el-card>
          <el-row>
              <el-col>
                  <el-button type="primary" size="mini" @click="addNewRoles">添加角色</el-button>
              </el-col>
          </el-row>
          <el-table :data="rolesList" border>
              <el-table-column type="expand">
                  <template slot-scope="scope">
                      <el-row :class="['bdbottom', i1 ===0 ? 'bdtop' : '', 'vcenter']" v-for="(item1, i1) in scope.row.children" :key="item1.id">
                          <!-- 渲染一级权限 -->
                          <el-col :span="5">
                              <el-tag closable @close="removeRightById(scope.row, item1.id)">{{item1.authName}}</el-tag>
                              <i class="el-icon-caret-right"></i>
                          </el-col>
                          <!-- 渲染二级 三级权限 -->
                          <el-col :span="19">
                              <!-- 通過for 嵌套渲染二級權限 -->
                              <el-row :class="[i2 === 0 ? '' : 'bdtop', 'vcenter']" v-for="(item2, i2) in item1.children" :key="item2.id">
                                  <el-col :span="6">
                                      <el-tag type="success" closable @close="removeRightById(scope.row, item2.id)">{{item2.authName}}</el-tag>
                                      <i class="el-icon-caret-right"></i>
                                  </el-col>
                                  <el-col :span="18">
                                      <el-tag v-for="(item3) in item2.children" :key="item3.id" type="warning" closable @close="removeRightById(scope.row, item3.id)">{{item3.authName}}</el-tag>
                                  </el-col>
                              </el-row>
                          </el-col>
                      </el-row>
                  </template>
              </el-table-column>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="角色名称" prop="roleName"></el-table-column>
              <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
              <el-table-column label="操作" width="300px">
                  <template slot-scope="scope">
                      <el-button type="primary" icon="el-icon-edit" size="mini" @click="editRoleInfo(scope.row)">编辑</el-button>
                      <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteRole(scope.row.id)">删除</el-button>
                      <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                  </template>
              </el-table-column>
          </el-table>
      </el-card>

      <!-- 分配权限对话框 -->
      <el-dialog
        title="分配权限"
        :visible.sync="SetRightDialogVisible"
        @close="setRightDialogClosed"
        width="50%">
        <el-tree
        ref="treeRef"
        :data="rightsLsit"
        :props="treetProps"
        show-checkbox
        default-expand-all
        node-key="id"
        :default-checked-keys="defKeys"
        >
        </el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="SetRightDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="allotRights">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加角色对话框 -->
      <el-dialog
        title="添加/修改角色"
        :visible.sync="addRoleDialogVisible"
        @close="setRoleDialogClosed"
        width="50%">
        <el-form
        :model="addRoleInfo"
        :rules="addRoleInfoRules"
        ref="addRoleInfoRef"
        label-width="100px">
          <el-form-item label="角色名称:" prop="roleName">
             <el-input v-model="addRoleInfo.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述:" prop="roleDesc">
             <el-input v-model="addRoleInfo.roleDesc"></el-input>
        </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="addRoleDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="addSaveNewRole">确 定</el-button>
        </span>
      </el-dialog>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Breadcrumb from '../../component/Breadcrumb.vue'
import { deleteRolesRightById, getRightsByType, editRolesByIdrights, saveNewRole, editRoleById, deleteRoleById } from '../../api/http'
import { getAllRolesInfo } from '../../api/user'
import { getLeafKeys } from '../../utils/index'
import { msgCommon } from '../../utils/commsg'
@Component({
  components: {
    Breadcrumb
  }
})
export default class Roles extends Vue {
  [x: string]: any;
  headerData: object = {
    manage: '权限管理',
    sort: '权限列表'
  }

  SetRightDialogVisible = false;
  // 角色列表数据
  rolesList: Array<object> = [];

  rightsLsit: Array<object> = [];

  // 默认选中的权限数组
  defKeys: Array<any> = [];

  roleId = '';
  // 添加角色对话框
  addRoleDialogVisible = false;
  // 添加角色的表单信息
  addRoleInfo: any = {
    roleName: '',
    roleDesc: ''
  }

  editRoleId = ''

  // 添加角色验证规则
  addRoleInfoRules: object = {
    roleName: [
      { required: true, message: '请输入角色名称', trigger: 'blur' }
    ],
    roleDesc: [
      { required: true, message: '请输入角色描述', trigger: 'blur' }
    ]
  }

  // 树形控件的绑定对象
  treetProps: object = {
    label: 'authName',
    children: 'children'
  }

  created() {
    this.getRoelsList()
  }

  async getRoelsList() {
    const { data: res } = await getAllRolesInfo()
    if (res.meta.status !== 200) return msgCommon('error', '获取角色列表信息失败！');
    this.rolesList = res.data
  }

  // 添加角色对话框
  addNewRoles() {
    this.addRoleInfo = {
      roleName: '',
      roleDesc: ''
    }
    this.addRoleDialogVisible = true
  }

  // 添加角色通讯
  addSaveNewRole() {
    (this as any).$refs.addRoleInfoRef.validate(async (valid: boolean) => {
      if (valid) {
        if (this.editRoleId) {
          console.log('修改')
          const { data: res } = await editRoleById(this.editRoleId, this.addRoleInfo);
          if (res.meta.status !== 200) return msgCommon('error', '修改角色失败！');
          this.getRoelsList()
          // this.$message.success('修改角色成功！');
          msgCommon('success', '修改角色成功！')
          this.addRoleDialogVisible = false
        } else {
          const { data: res } = await saveNewRole(this.addRoleInfo)
          if (res.meta.status !== 201) return msgCommon('error', '添加角色失败！');
          this.getRoelsList()
          msgCommon('error', '添加角色成功！');
          this.addRoleDialogVisible = false
        }
      } else {
        return false;
      }
    });
  }

  setRoleDialogClosed() {
    this.editRoleId = '';
    (this as any).$refs.addRoleInfoRef.resetFields();
  }

  // 修改/编辑 角色打开对话框
  editRoleInfo(row: any) {
    // 此处为了省事 修改和新增用一个对话框
    this.addRoleDialogVisible = true;
    this.addRoleInfo.roleName = row.roleName
    this.addRoleInfo.roleDesc = row.roleDesc
    this.editRoleId = row.id
  }

  // 根据id删除对应的角色
  async deleteRole(id: string) {
    const confirmResult = await this.$confirm('此操作将删除该条调角色信息, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch((err: any) => err);

    if (confirmResult !== 'confirm') return msgCommon('info', '已取消删除！');
    const { data: res } = await deleteRoleById(id);
    if (res.meta.status !== 200) return msgCommon('error', '删除角色失败！');
    this.getRoelsList()
    msgCommon('success', '删除角色成功！');
  }

  // 根据权限id删除对应权限
  async removeRightById(role: any, rightId: string) {
    const confirmResult = await this.$confirm('此操作将删除该条权限, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch((err: any) => err);
    if (confirmResult !== 'confirm') return msgCommon('info', '已取消删除！');
    const { data: res } = await deleteRolesRightById(role.id, rightId)
    if (res.meta.status !== 200) return msgCommon('error', '删除权限失败！');
    role.children = res.data
    msgCommon('success', '删除成功！');
  }

  // 展示分配权限的对话框
  async showSetRightDialog(role: any) {
    this.roleId = role.id;
    console.log(role, 'role')
    // 获取所有权限的数据
    const { data: res } = await getRightsByType('tree')
    if (res.meta.status !== 200) return msgCommon('error', '获取权限tree数据失败！');
    // 获取到的权限tree形数据
    this.rightsLsit = res.data;
    // 递归获取三级节点id
    getLeafKeys(role, this.defKeys)
    this.SetRightDialogVisible = true
  }

  // 监听关闭分配权限对话框关闭事件
  setRightDialogClosed() {
    this.defKeys = []
  }

  // 分配权限
  async allotRights() {
    const keys: any[] = [
      ...(this as any).$refs.treeRef.getCheckedKeys(),
      ...(this as any).$refs.treeRef.getHalfCheckedKeys()
    ];
    const idStr = keys.join(',')
    console.log(typeof idStr)
    const { data: res } = await editRolesByIdrights(this.roleId, idStr)
    console.log(res)
    if (res.meta.status !== 200) return msgCommon('error', '分配角色权限失败！');
    this.getRoelsList()
    msgCommon('success', '角色权限分配成功！');
    this.SetRightDialogVisible = false
  }
}
</script>
<style lang="less" scoped>
.el-tag {
    margin: 7px;
}

.bdtop {
    border-top: 1px solid #eee;
}

.bdbottom {
    border-bottom: 1px solid #eee;
}

.vcenter {
    display: flex;
    align-items: center;
}
</style>
