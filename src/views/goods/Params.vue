<template>
    <div>
        <Breadcrumb :headerData="headerData"></Breadcrumb>
        <el-card>
            <el-alert :closable="false" title="注意：只允许为第三级分类设置相关参数！" type="warning"></el-alert>
            <el-row class="mt20">
                <el-col>
                    <span style="font-size: 14px">选择商品分类：</span>
                    <el-cascader
                    v-model="selectKeys"
                    :options="cateList"
                    :props="{
                    expandTrigger: 'hover',
                    value: 'cat_id',
                    label: 'cat_name',
                    children: 'children'
                    }"
                    @change="handleCateChanges"
                    clearable
                    ></el-cascader>
                </el-col>
            </el-row>
            <el-tabs v-model="activeName" @tab-click="handleTabsClick">
              <el-tab-pane label="动态参数" name="first">
                  <el-button type="primary" size="mini" :disabled="isDisabled">添加参数</el-button>
              </el-tab-pane>
               <el-tab-pane label="静态属性" name="second">
                   <el-button type="primary" size="mini" :disabled="isDisabled">添加属性</el-button>
               </el-tab-pane>
            </el-tabs>
        </el-card>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Breadcrumb from '../../component/Breadcrumb.vue';
import { getGoodsByTypeNum } from '../../api/goods'
import { msgCommon } from '../../utils/commsg'
@Component({
  name: 'Params',
  components: {
    Breadcrumb
  }
})
export default class Params extends Vue {
  headerData: object = {
    manage: '商品管理',
    sort: '参数列表'
  };

  activeName = 'second';

  cateList: Array<object> = [];

  selectKeys: Array<any> = [];

  created() {
    this.getCateList()
  }

  async getCateList() {
    const { data: res } = await getGoodsByTypeNum()
    if (res.meta.status !== 200) return msgCommon('error', '查询商品数据失败！');
    console.log(res)
    this.cateList = res.data
  }

  // 选择框change事件
  handleCateChanges() {
    console.log(this.selectKeys)
  }

  // tab页签点击事件
  handleTabsClick() {
    console.log(this.activeName)
  }

  // 根据数组长度判断按钮是否禁用
  get isDisabled() {
    if (this.selectKeys.length !== 3) {
      return true
    }
    return false
  }
}
</script>
