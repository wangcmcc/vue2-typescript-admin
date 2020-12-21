<template>
    <div class="bread">
        <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>{{headerData.manage}}</el-breadcrumb-item>
        <el-breadcrumb-item>{{headerData.sort}}</el-breadcrumb-item>
      </el-breadcrumb>
    </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
@Component
export default class Breadcrumb extends Vue {
   @Prop({
     type: Object, // 父组件传递给子组件的数据类型
     required: false
   }) headerData !: object;
}
</script>
