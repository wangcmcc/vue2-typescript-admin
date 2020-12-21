<template>
  <div>
    <Breadcrumb :headerData="headerData"></Breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" size="mini" @click="showAddDialog"
            >添加分类</el-button
          >
        </el-col>
      </el-row>
      <TreeTable
        class="mt20"
        :data="cateList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
      >
        <template slot="isok" slot-scope="scope">
          <i
            v-if="scope.row.cat_deleted === false"
            class="el-icon-success"
            style="color: lightgreen"
          ></i>
          <i v-else class="el-icon-error" style="color: red"></i>
        </template>
        <template slot="order" slot-scope="scope">
          <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag
            type="success"
            size="mini"
            v-else-if="scope.row.cat_level === 1"
            >二级</el-tag
          >
          <el-tag type="warning" size="mini" v-else>三级</el-tag>
        </template>
        <template slot="opt" slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="editCate(scope.row)"
            >编辑</el-button
          >
          <el-button
          type="danger"
          size="mini"
          icon="el-icon-delete"
          @click="deleteRowById(scope.row.cat_id)"
            >删除</el-button
          >
        </template>
      </TreeTable>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryinfo.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加分类对话框 -->
    <el-dialog
      title="添加分类"
      @close="addCateClosed"
      :visible.sync="addCateDialogVisible"
      width="50%"
    >
      <el-form
        :model="addCateForm"
        :rules="addCateFormRules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <el-cascader
            v-model="selectKeys"
            :options="parentCateList"
            :props="{
              expandTrigger: 'hover',
              value: 'cat_id',
              label: 'cat_name',
              children: 'children',
              checkStrictly: true
            }"
            @change="parentCateChanges"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false" size="mini"
          >取 消</el-button
        >
        <el-button type="primary" size="mini" @click="addCate">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改角色对话框 -->
    <el-dialog
      title="修改分类信息"
      :visible.sync="editCateDialogVisible"
      @close="closedEdit"
      width="50%"
    >
      <el-form
        :model="editCateList"
        :rules="editCateFormRules"
        ref="editCateListRef"
        label-width="100px"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="editCateList.cat_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editCateInfo">修改</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import TreeTable from 'vue-table-with-tree-grid';
import Breadcrumb from '../../component/Breadcrumb.vue';
import { getGoodsByTypeNum, addCateInfo, editCateInfo, deleteCateById } from '../../api/goods';
import { msgCommon } from '../../utils/commsg';
@Component({
  name: 'Cate',
  components: {
    Breadcrumb,
    TreeTable
  }
})
export default class Cate extends Vue {
  total = 0;

  // 添加分类对话框
  addCateDialogVisible = false;

  // 编辑分类对话框
  editCateDialogVisible = false;

  /* eslint-disable @typescript-eslint/camelcase */
  editCateList: any = {
    cat_id: 0,
    cat_name: ''
  }

  /* eslint-disable @typescript-eslint/camelcase */
  addCateForm: any = {
    cat_name: '',
    cat_pid: 0,
    cat_level: 0
  };

  // 添加分类表单验证规则
  /* eslint-disable @typescript-eslint/camelcase */
  addCateFormRules: object = {
    cat_name: [{ required: true, mesaage: '请输入分类名称', tirgger: 'blur' }]
  };

  editCateFormRules: object = {
    cat_name: [{ required: true, mesaage: '请输入分类名称', tirgger: 'blur' }]
  }

  // 选中的父级id
  selectKeys: Array<any> = [];

  parentCateList: Array<object> = [];

  headerData: object = {
    manage: '商品管理',
    sort: '商品分类'
  };

  queryinfo: any = {
    type: 3,
    pagenum: 1,
    pagesize: 5
  };

  columns: Array<object> = [
    {
      label: '分类名称',
      prop: 'cat_name'
    },
    {
      label: '是否有效',
      type: 'template',
      template: 'isok'
    },
    {
      label: '排序',
      type: 'template',
      template: 'order'
    },
    {
      label: '操作',
      type: 'template',
      template: 'opt'
    }
  ];

  cateList: Array<object> = [];

  created() {
    this.getGoodsInfo(this.queryinfo);
  }

  // 获取商品分类数据
  async getGoodsInfo(data: object) {
    const { data: res } = await getGoodsByTypeNum(data);
    console.log(res);
    if (res.meta.status !== 200) return msgCommon('error', '查询商品数据失败！');
    this.cateList = res.data.result;
    this.total = res.data.total;
  }

  // 监听pagesize改变事件
  handleSizeChange(newPagesize: number) {
    this.queryinfo.pagesize = newPagesize;
    this.getGoodsInfo(this.queryinfo);
  }

  // 监听页码的改变
  handleCurrentChange(newCurren: number) {
    this.queryinfo.pagenum = newCurren;
    this.getGoodsInfo(this.queryinfo);
  }

  // 点击按钮 显示添加分类的按钮
  showAddDialog() {
    this.getParentCateList();
    this.addCateDialogVisible = true;
  }

  // 获取父级分类的数据列表
  async getParentCateList() {
    const { data: res } = await getGoodsByTypeNum({ type: 2 });
    if (res.meta.status !== 200) return msgCommon('error', '获取父级分类的数据列表失败！');
    this.parentCateList = res.data;
  }

  // change事件
  parentCateChanges() {
    console.log(this.selectKeys);
    if (this.selectKeys.length > 0) {
      this.addCateForm.cat_pid = this.selectKeys[this.selectKeys.length - 1];
      this.addCateForm.cat_level = this.selectKeys.length;
    } else {
      this.addCateForm.cat_pid = 0;
      this.addCateForm.cat_level = 0;
    }
  }

  // 点击按钮提交
  addCate() {
    (this as any).$refs.addCateFormRef.validate(async (valid: boolean) => {
      if (valid) {
        const { data: res } = await addCateInfo(this.addCateForm);
        console.log(res);
        if (res.meta.status !== 201) return msgCommon('error', '添加商品分类失败！');
        msgCommon('success', '添加商品分类成功！');
        this.getGoodsInfo(this.queryinfo);
        this.addCateDialogVisible = false;
      } else {
        return false;
      }
    });
  }

  // 对话框关闭事件
  addCateClosed() {
    (this as any).$refs.addCateFormRef.resetFields();
    this.selectKeys = [];
    this.addCateForm.cat_pid = 0;
    this.addCateForm.cat_level = 0;
  }

  // 点击编辑触发事件
  editCate(cate: any) {
    console.log(cate);
    this.editCateList.cat_id = Number(cate.cat_id);
    this.editCateList.cat_name = cate.cat_name;
    this.editCateDialogVisible = true
  }

  // 点击修改确认按钮修改分类信息
  editCateInfo() {
    (this as any).$refs.editCateListRef.validate(async (valid: boolean) => {
      if (!valid) return false;
      const { data: res } = await editCateInfo(this.editCateList);
      console.log(res);
      if (res.meta.status !== 200) return msgCommon('error', '更新商品分类失败！');
      msgCommon('success', '更新商品分类成功！');
      this.getGoodsInfo(this.queryinfo);
      this.editCateDialogVisible = false;
    });
  }

  // 编辑重置
  closedEdit() {
    (this as any).$refs.editCateListRef.resetFields();
    this.editCateList.cat_name = '';
    this.editCateList.cat_id = 0;
  }

  // 删除
  async deleteRowById(id: number) {
    const confirmResult = await (this as any).$confirm('此操作将删除该条商品分类信息, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch((err: any) => err);

    if (confirmResult !== 'confirm') return msgCommon('info', '已取消删除！');
    const { data: res } = await deleteCateById(id);
    if (res.meta.status !== 200) return msgCommon('error', '删除角色失败！');
    this.getGoodsInfo(this.queryinfo);
    msgCommon('success', '删除成功！');
  }
}
</script>
<style lang="less" scoped>
.el-cascader {
  width: 100%;
}
</style>
