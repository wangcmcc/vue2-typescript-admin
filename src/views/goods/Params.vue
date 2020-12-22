<template>
    <div>
        <Breadcrumb :headerData="headerData" :titleText="titleText"></Breadcrumb>
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
              <el-tab-pane label="动态参数" name="many">
                  <el-button type="primary" size="mini" :disabled="isDisabled" @click="addDialogVisible=true">添加参数</el-button>
                  <GoodsTable :tableData="manyTableData" @manySend="updateParamsData"></GoodsTable>
              </el-tab-pane>
               <el-tab-pane label="静态属性" name="only">
                   <el-button type="primary" size="mini" :disabled="isDisabled" @click="addDialogVisible=true">添加属性</el-button>
                   <GoodsTable :tableData="onlyTableData" @manySend="updateParamsData"></GoodsTable>
               </el-tab-pane>
            </el-tabs>
        </el-card>

        <el-dialog
        :title="'添加' + titleText"
        :visible.sync="addDialogVisible"
        @close="addDialogClosed"
        width="50%">
           <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100px">
           <el-form-item :label="titleText" prop="attr_name">
             <el-input v-model="addForm.attr_name"></el-input>
           </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="addParams">确 定</el-button>
          </span>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Breadcrumb from '../../component/Breadcrumb.vue';
import GoodsTable from '../../component/GoodsTable.vue'
import { getGoodsByTypeNum, getCateAttributeById, addattributes } from '../../api/goods'
import { msgCommon } from '../../utils/commsg'
@Component({
  name: 'Params',
  components: {
    Breadcrumb,
    GoodsTable
  }
})
export default class Params extends Vue {
  headerData: object = {
    manage: '商品管理',
    sort: '参数列表'
  };

  addForm: any = {}

  /* eslint-disable @typescript-eslint/camelcase */
  addFormRules: object = {
    attr_name: [
      { required: true, message: '请输入参数名称', trigger: 'blur' }
    ]
  }

  addDialogVisible = false

  activeName = 'many';

  cateList: Array<object> = [];

  selectKeys: Array<any> = [];

  manyTableData: Array<object> = [];

  onlyTableData: Array<object> = [];

  created() {
    this.getCateList()
  }

  async getCateList() {
    const { data: res } = await getGoodsByTypeNum()
    if (res.meta.status !== 200) return msgCommon('error', '查询商品数据失败！');
    this.cateList = res.data
  }

  // 选择框change事件
  handleCateChanges() {
    if (this.selectKeys.length !== 3) {
      this.selectKeys = [];
      this.manyTableData = [];
      this.onlyTableData = [];
      return
    }
    this.getParamsData()
  }

  // tab页签点击事件
  handleTabsClick() {
    console.log(this.activeName);
    this.getParamsData()
  }

  // 获取参数列表数据的请求封装
  async getParamsData() {
    const { data: res } = await getCateAttributeById(this.cateId, this.activeName);
    if (res.meta.status !== 200) return msgCommon('error', '获取参数列表失败！')
    res.data.forEach((item: any) => {
      item.attr_vals = item.attr_vals ? item.attr_vals.split(',') : [];
      item.inputVisible = false;
      item.inputValue = '';
    });
    if (this.activeName === 'many') {
      this.manyTableData = res.data
    } else {
      this.onlyTableData = res.data
    }
  }

  addDialogClosed() {
    (this as any).$refs.addFormRef.resetFields()
  }

  // 点击按钮添加参数
  addParams() {
    (this as any).$refs.addFormRef.validate(async (valid: boolean) => {
      if (!valid) return false;
      const queryData = {
        attr_name: this.addForm.attr_name,
        attr_sel: this.activeName
      }
      const { data: res } = await addattributes(this.cateId, queryData);
      console.log(res)
      if (res.meta.status !== 201) return msgCommon('error', '添加参数失败！')
      msgCommon('success', '添加参数成功！');
      this.addDialogVisible = false
      this.getParamsData()
    })
  }

  // 根据数组长度判断按钮是否禁用
  get isDisabled() {
    if (this.selectKeys.length !== 3) {
      return true
    }
    return false
  }

  // 当前选中的三级分类的id
  get cateId() {
    if (this.selectKeys.length === 3) {
      return this.selectKeys[2]
    }
    return null
  }

  get titleText() {
    if (this.activeName === 'many') {
      return '动态参数'
    }
    return '静态属性'
  }

  updateParamsData(msg: string) {
    console.log(msg)
    this.getParamsData()
  }
}
</script>
