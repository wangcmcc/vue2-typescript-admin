<template>
    <div class="rights">
      <Breadcrumb :headerData="headerData"></Breadcrumb>
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
import Breadcrumb from '../../component/Breadcrumb.vue'
import { getRightsByType } from '../../api/http'
import { msgCommon } from '../../utils/commsg'
@Component({
  components: {
    Breadcrumb
  }
})
export default class Rights extends Vue {
  headerData: object = {
    manage: '权限管理',
    sort: '权限列表'
  }

  rightsList: Array<object> = []

  created() {
    this.getRightsList()
  }

  async getRightsList() {
    const { data: res } = await getRightsByType('list')
    if (res.meta.status !== 200) return msgCommon('error', '获取权限列表失败！')
    this.rightsList = res.data;
  }
}
</script>
