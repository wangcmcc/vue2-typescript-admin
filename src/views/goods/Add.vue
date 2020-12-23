<template>
    <div>
        <Breadcrumb :headerData="headerData"></Breadcrumb>
        <el-card>
          <el-alert
          title="添加商品信息"
          type="info"
          :closable="false"
          center
          show-icon>
          </el-alert>
          <el-steps
          :space="200"
          :active="activeIndex - 0"
          finish-status="success"
          align-center>
            <el-step title="基本信息"></el-step>
            <el-step title="商品参数"></el-step>
            <el-step title="商品属性"></el-step>
            <el-step title="商品图片"></el-step>
            <el-step title="商品内容"></el-step>
            <el-step title="完成"></el-step>
          </el-steps>
          <el-form
          :model="AddForm"
          :rules="AddFormRules"
          ref="AddFormRef"
          label-width="100px"
          label-position="top">
            <el-tabs
            :tab-position="'left'"
            v-model="activeIndex"
            :before-leave="beforeTabLeave"
            @tab-click="tabClick"
            >
              <el-tab-pane label="基本信息" name="0">
                  <el-form-item label="商品名称" prop="goods_name">
                      <el-input v-model="AddForm.goods_name"></el-input>
                  </el-form-item>
                  <el-form-item label="商品价格" prop="goods_price">
                      <el-input type="number" v-model="AddForm.goods_price"></el-input>
                  </el-form-item>
                  <el-form-item label="商品重量" prop="goods_weight">
                      <el-input type="number" v-model="AddForm.goods_weight"></el-input>
                  </el-form-item>
                  <el-form-item label="商品数量" prop="goods_number">
                      <el-input type="number" v-model="AddForm.goods_number"></el-input>
                  </el-form-item>
                  <el-form-item label="商品分类" prop="goods_cat">
                      <el-cascader
                      v-model="AddForm.goods_cat"
                      :options="cateList"
                      :props="{
                       expandTrigger: 'hover',
                       value: 'cat_id',
                       label: 'cat_name',
                       children: 'children',
                       checkStrictly: true
                      }"
                     @change="handleChanges"
                     clearable
                    ></el-cascader>
                  </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品参数" name="1">
                <el-form-item :label="item.attr_name" v-for="item in manyTableData" :key="item.attr_id">
                   <el-checkbox-group v-model="item.attr_vals">
                      <el-checkbox border :label="cb" v-for="(cb, i) in item.attr_vals" :key="i"></el-checkbox>
                   </el-checkbox-group>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品属性" name="2">
                <el-form-item :label="item.attr_name" v-for="item in onlyTableData" :key="item.attr_id">
                  <el-input v-model="item.attr_vals"></el-input>
                </el-form-item>
              </el-tab-pane>
              <el-tab-pane label="商品图片" name="3">
                <el-upload
                :action="upLoadUrl"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :headers="headerObj"
                :on-success="handleSuccess"
                list-type="picture">
                  <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
              </el-tab-pane>
              <el-tab-pane label="商品内容" name="4">
                <quillEditor v-model="AddForm.goods_introduce"></quillEditor>
                <el-button type="primary" size="mini" class="mt20" @click="add">添加商品</el-button>
              </el-tab-pane>
            </el-tabs>
          </el-form>
        </el-card>

        <!-- 图片预览 -->
        <el-dialog
          title="提示"
          :visible.sync="previewVisibel"
          width="50%">
          <img :src="previewPath" alt="" class="previewimg">
        </el-dialog>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Breadcrumb from '../../component/Breadcrumb.vue'
import { getGoodsByTypeNum, getCateAttributeById } from '../../api/goods'
import { msgCommon } from '../../utils/commsg'
// 调用编辑器
import { quillEditor } from 'vue-quill-editor';
import 'quill/dist/quill.core.css';
import 'quill/dist/quill.snow.css';
import 'quill/dist/quill.bubble.css';
@Component({
  name: 'Add',
  components: {
    Breadcrumb,
    quillEditor
  }
})
export default class Add extends Vue {
  headerData: object = {
    manage: '商品管理',
    sort: '添加商品'
  };

  activeIndex = '0'

  // 添加商品表单数据对象
  /* eslint-disable @typescript-eslint/camelcase */
  AddForm: any = {
    goods_name: '',
    goods_price: 0,
    goods_weight: 0,
    goods_number: 0,
    goods_cat: [],
    pics: [],
    goods_introduce: ''
  }

  AddFormRules: object = {
    goods_name: [
      { required: true, message: '请输入商品名称', trigger: 'blur' }
    ],
    goods_price: [
      { required: true, message: '请输入商品价格', trigger: 'blur' }
    ],
    goods_weight: [
      { required: true, message: '请输入商品重量', trigger: 'blur' }
    ],
    goods_number: [
      { required: true, message: '请输入商品数量', trigger: 'blur' }
    ],
    goods_cat: [
      { required: true, message: '请输入商品分类', trigger: 'blur' }
    ]
  }

  cateList: Array<object> = [];

  // 动态参数列表数据
  manyTableData: Array<object> = [];

  // 静态属性数据列表
  onlyTableData: Array<object> = [];

  // 上传图片地址
  upLoadUrl = 'http://127.0.0.1:8888/api/private/v1/upload';

  // 图片上传组件的请求头对象
  headerObj: object = {
    Authorization: window.sessionStorage.getItem('token')
  }

  previewPath = '';

  previewVisibel = false

  created() {
    this.getCateList()
  }

  async getCateList() {
    const { data: res } = await getGoodsByTypeNum();
    if (res.meta.status !== 200) return msgCommon('error', '获取商品分类失败！')
    this.cateList = res.data;
    console.log(res)
  }

  // 级联选择器change事件
  handleChanges() {
    console.log(this.AddForm.goods_cat);
    if (this.AddForm.goods_cat.length !== 3) {
      this.AddForm.goods_cat = [];
    }
  }

  beforeTabLeave(activeName: string, oldactiveName: string) {
    if (oldactiveName === '0' && this.AddForm.goods_cat.length !== 3) {
      msgCommon('error', '请先选择商品分类')
      return false
    }
  }

  async tabClick() {
    console.log(this.activeIndex)
    if (this.activeIndex === '1') {
      // 访问动态参数面板
      const { data: res } = await getCateAttributeById(this.cateId, 'many');
      if (res.meta.status !== 200) return msgCommon('error', '获取动态参数列表失败！')
      console.log(res.data)
      res.data.forEach((item: any) => {
        item.attr_vals = item.attr_vals.length === 0 ? [] : item.attr_vals.split(',')
      });
      this.manyTableData = res.data
    } else if (this.activeIndex === '2') {
      const { data: res } = await getCateAttributeById(this.cateId, 'only');
      if (res.meta.status !== 200) return msgCommon('error', '获取静态属性列表失败！')
      console.log(res.data)
      this.onlyTableData = res.data
    }
  }

  // 计算属性获取id
  get cateId() {
    if (this.AddForm.goods_cat.length === 3) {
      return this.AddForm.goods_cat[2]
    }
    return null
  }

  // 处理图片预览效果
  handlePreview(file: any) {
    console.log(file)
    this.previewPath = file.response.data.url;
    this.previewVisibel = true;
  }

  // 处理移除图片的操作
  handleRemove(file: any) {
    console.log(file)
    const filePath = file.response.data.tmp_path;
    const i = this.AddForm.pics.findIndex((x: any) => x.pic === filePath);
    this.AddForm.pics.splice(i, 1);
    console.log(this.AddForm.pics)
  }

  // 图片上传成功的钩子事件
  handleSuccess(response: any) {
    console.log(response)
    const picInfo = { pic: response.data.tmp_path }
    this.AddForm.pics.push(picInfo);
    console.log(this.AddForm.pics)
  }

  add() {
    (this as any).$refs.AddFormRef.validate((valid: boolean) => {
      if (!valid) {
        msgCommon('error', '请添加商品必要项！')
        return false
      }
      console.log(this.AddForm)
    });
  }
}
</script>
<style lang="less" scoped>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewimg {
  width: 100%;
}
</style>
