<template>
    <div class="rights">
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>权限管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
      <el-card>
          <el-table :data="rightsList" border stripe>
              <el-table-column type="index"></el-table-column>
              <el-table-column label="权限名称" prop="authName"></el-table-column>
              <el-table-column label="路径" prop="path"></el-table-column>
              <el-table-column label="权限等级" prop="level">
                  <template slot-scope="scope">
                      <el-tag v-if="scope.row.level === '0' ">一级</el-tag>
                      <el-tag v-else-if="scope.row.level === '1' " type="success">二级</el-tag>
                      <el-tag v-else type="warning">三级</el-tag>
                  </template>
              </el-table-column>
          </el-table>
      </el-card>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getRightsByType } from '../../api/http'
@Component
export default class Rights extends Vue {
  [x: string]: any
  rightsList: Array<object> = []

  created() {
    this.getRightsList()
  }

  async getRightsList() {
    const { data: res } = await getRightsByType('list')
    if (res.meta.status !== 200) return this.$message.error('获取权限列表失败！')
    this.rightsList = res.data;
  }
}
</script>
