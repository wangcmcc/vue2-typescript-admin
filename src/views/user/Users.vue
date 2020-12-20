<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            clearable
            placeholder="请输入内容"
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态" prop="ms_state">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.ms_state"
              @change="userStateChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180">
          <template slot-scope="scope">
            <el-button
              type="primary"
              size="mini"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <el-button
              type="danger"
              size="mini"
              icon="el-icon-delete"
              @click="deleteUserInfo(scope.row.id)"
            ></el-button>
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                @click="setRole(scope.row)"
                type="warning"
                size="mini"
                icon="el-icon-setting"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <el-dialog
      title="添加用户"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="80px"
      >
        <el-form-item label="用户名:" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码:" prop="password">
          <el-input v-model="addForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱:" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机:" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 修改用户的对话框 -->
    <el-dialog
    title="修改用户"
    :visible.sync="editDiaogVisible"
    width="50%"
    @close="editDialogClosed"
   >
   <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="70px">
     <el-form-item label="用户名:">
       <el-input v-model="editForm.username" disabled></el-input>
     </el-form-item>
     <el-form-item label="邮箱:" prop="email">
       <el-input v-model="editForm.email"></el-input>
     </el-form-item>
     <el-form-item label="手机号:" prop="mobile">
       <el-input v-model="editForm.mobile"></el-input>
     </el-form-item>
   </el-form>
   <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="editUserInfo" size="mini">确 定</el-button>
    <el-button @click="editDiaogVisible = false" size="mini" type="danger">取 消</el-button>
  </span>
    </el-dialog>
    <!-- 分配角色的对话框 -->
    <el-dialog
    title="分配角色"
    :visible.sync="setRoleDialogVisible"
    width="50%"
    >
      <div>
        <p>当前的用户：{{userInfo.username}}</p>
        <p>当前的角色：{{userInfo.role_name}}</p>
        <p>分配新角色：
          <el-select v-model="seletedRoleId" placeholder="请选择">
            <el-option
            v-for="item in rolesList"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
            ></el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
         <el-button @click="setRoleDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import { msgCommon } from '../../utils/commsg'
import { getUsers, usersPut, addUser, getUserInfoByInfo, editUsersInfo, deleteUserById, getAllRolesInfo, saveUserRoleById } from '../../api/http'
@Component
export default class Users extends Vue {
  [x: string]: any;

  private checkEamil: any = (rule: any, value: any, cb: Function) => {
    const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
    if (regEmail.test(value)) {
      return cb()
    }
    cb(new Error('请输入合法的邮箱'));
  };

  private checkMobile: any = (rule: any, value: any, cb: Function) => {
    const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
    if (regMobile.test(value)) {
      return cb();
    }
    cb(new Error('请输入合法的手机号'));
  };

  queryInfo: object = {
    query: '',
    pagenum: 1,
    pagesize: 2
  };

  userlist: Array<any> = [];
  // 所有角色的数据列表
  rolesList: Array<object> = [];
  total = 0;
  dialogVisible = false;
  // 控住修改用户
  editDiaogVisible = false;
  // 分配角色
  setRoleDialogVisible = false;

  // 已选中的角色id
  seletedRoleId = '';

  // 需要被分配角色的用户信息
  userInfo: any = {}
  addForm: object = {
    username: '',
    password: '',
    email: '',
    mobile: ''
  };

  addFormRules: object = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 3, max: 10, message: '请输入3~10位的用户名', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 3, max: 10, message: '请输入3~10位的密码', trigger: 'blur' }
    ],
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { validator: this.checkEamil, trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      { validator: this.checkMobile, trigger: 'blur' }
    ]
  };

  // 修改表单的验证对象
  editFormRules: object = {
    email: [
      { required: true, message: '请输入邮箱', trigger: 'blur' },
      { validator: this.checkEamil, trigger: 'blur' }
    ],
    mobile: [
      { required: true, message: '请输入手机号码', trigger: 'blur' },
      { validator: this.checkMobile, trigger: 'blur' }
    ]
  }

  // 查询到的用户信息对象
  editForm: object = {}

  created() {
    this.getUserList();
  }

  async getUserList() {
    console.log('this.queryInfo:', this.queryInfo)
    const { data: res } = await getUsers(this.queryInfo);
    if (res.meta.status !== 200) return msgCommon('error', '获取用户列表失败!');
    this.userlist = res.data.users;
    this.total = res.data.total;
  }

  // 监听条数
  handleSizeChange(newSize: any) {
    (this as any).queryInfo.pagesize = newSize;
    this.getUserList();
  }

  // 监听页码变化
  handleCurrentChange(newPage: any) {
    (this as any).queryInfo.pagenum = newPage;
    this.getUserList();
  }

  // 监听开关状态
  /* eslint-disable @typescript-eslint/camelcase */
  async userStateChange(row: any) {
    const { data: res } = await usersPut(row);
    if (res.meta.status !== 200) {
      row.ms_state = !row.ms_state;
      msgCommon('error', '更新用户状态失败!');
    }
    msgCommon('success', '修改成功!');
  }

  // 点击按钮添加用户
  addUser() {
    (this as any).$refs.addFormRef.validate(async (valid: boolean) => {
      if (!valid) return
      const { data: res } = await addUser(this.addForm)
      console.log(res)
      if (res.meta.status !== 201) return msgCommon('error', '添加用戶失敗!');
      msgCommon('success', '添加用戶成功!');
      this.dialogVisible = false
      // 重新获取所有用户
      this.getUserList()
    })
  }

  // 监听dialog关闭
  addDialogClose() {
    (this as any).$refs.addFormRef.resetFields();
  }

  // 展示修改用户的对话框
  async showEditDialog(id: string | number) {
    const { data: res } = await getUserInfoByInfo(id)
    console.log(res)
    if (res.meta.status !== 200) return msgCommon('error', '获取用户信息失败!');
    this.editForm = res.data
    this.editDiaogVisible = true
  }

  // 监听修改胡勇对话框的重置
  editDialogClosed() {
    (this as any).$refs.editFormRef.resetFields();
  }

  // 修改表单提交
  editUserInfo() {
    (this as any).$refs.editFormRef.validate(async (valid: boolean) => {
      if (!valid) return
      const { data: res } = await editUsersInfo(this.editForm)
      console.log(res)
      if (res.meta.status !== 200) return msgCommon('error', '更新用戶信息失敗！');
      this.editDiaogVisible = false
      // 重新获取所有用户
      this.getUserList()
      this.$message.success('修改用户信息成功！')
    })
  }

  // 删除用户信息
  async deleteUserInfo(id: string | number) {
    const confirmResult = await this.$confirm('此操作将删除该条用户信息, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch((err: any) => err);
    if (confirmResult !== 'confirm') return msgCommon('info', '已取消删除!');
    const { data: res } = await deleteUserById(id);
    if (res.meta.status !== 200) return msgCommon('error', '删除失败！');
    this.getUserList()
    this.$message.success(res.meta.msg)
  }

  // 展示分配角色对话框事件
  async setRole(row: any) {
    this.userInfo = row

    // 在展示对话框钱获取所有的角色列表
    const { data: res } = await getAllRolesInfo()
    if (res.meta.status !== 200) return msgCommon('error', '获取角色列表失败！');
    this.rolesList = res.data;
    console.log(this.rolesList, 'aaa')
    this.setRoleDialogVisible = true
  }

  // 点击按钮 分配角色
  async saveRoleInfo() {
    if (!this.seletedRoleId) {
      msgCommon('warning', '请选择要分配的角色!');
    }
    const { data: res } = await saveUserRoleById(this.userInfo.id, this.seletedRoleId)
    console.log(res)
    if (res.meta.status !== 200) return msgCommon('error', '更新角色失败！');
    msgCommon('success', '更新角色成功！');
    this.getUserList();
    this.setRoleDialogVisible = false
  }
}
</script>
<style lang="less" scoped></style>
