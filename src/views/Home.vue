<template>
 <el-container class="home-container">
   <!-- 头部区域 -->
  <el-header>
    <div>
      <img src="../assets/img1.png" alt="">
      <span>电商后台管理系统</span>
    </div>
    <el-button type="info" @click="logout">退出</el-button>
  </el-header>

  <!-- 主体区域 -->
  <el-container>

    <!-- 侧边栏 -->
    <el-aside :width="isColles ? '64px' : '200px'">
      <div class="toggle_button" @click="toggleCollles">|||</div>
      <!-- 侧边栏测单 -->
      <el-menu
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#409BFF"
      unique-opened
      :collapse="isColles"
      :collapse-transition="false"
      router
      :default-active="activePath"
      >
      <!-- 一级菜单 -->
      <el-submenu
      :index="item.id + ''"
      v-for="item in menulist"
      :key="item.id">
        <!-- 一级菜单的模板 -->
        <template slot="title">
          <!-- 图标 -->
          <i :class="iconsObj[item.id]"></i>
          <!-- 文本 -->
          <span>{{item.authName}}</span>
        </template>

           <!-- 二级菜单 -->
          <el-menu-item
          :index="'/'+subItem.path"
          v-for="subItem in item.children"
          :key="subItem.id"
          @click="saveNavStatus('/' + subItem.path)"
          >
            <template slot="title">
              <!-- 二级菜单的图标 -->
              <i class="el-icon-menu"></i>
              <!-- 二级菜单的文本 -->
              <span>{{subItem.authName}}</span>
            </template>
          </el-menu-item>
      </el-submenu>
    </el-menu>
    </el-aside>
    <!-- 右侧主体内容 -->
    <el-main>
      <router-view></router-view>
    </el-main>
  </el-container>
</el-container>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getMenus } from '../api/http'
@Component
export default class Home extends Vue {
  [x: string]: any
  menulist: Array<any> = []
  iconsObj: object = {
    125: 'el-icon-user',
    103: 'el-icon-eleme',
    101: 'el-icon-goods',
    102: 'el-icon-s-shop',
    145: 'el-icon-s-data'
  }

  isColles = false
  // 被激活的连接状态
  activePath = ''

  created() {
    this.getMenuList();
    console.log(window.sessionStorage.getItem('activePath'))
    const active = window.sessionStorage.getItem('activePath')
    this.activePath = active === null ? '' : active
  }

  logout() {
    window.sessionStorage.clear()
    this.$router.push('/login')
  }

  // 请求侧边栏数据
  async getMenuList() {
    const { data: res } = await getMenus();
    if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
    this.menulist = res.data
    console.log(res)
  }

  // 点击菜单按钮折叠 展开
  toggleCollles() {
    this.isColles = !this.isColles
  }

  // 保存连接的激活状态
  saveNavStatus(activePath: any) {
    window.sessionStorage.setItem('activePath', activePath)
    this.activePath = activePath
  }
}
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333774;
  .el-menu {
    border-right: none;
  }
}

.el-main {
  background-color: #eaedf1;
}

.toggle_button {
  background-color: #4A5064;
  font-size: 10px;
  line-height: 24px;
  color: white;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>
