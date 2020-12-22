<template>
  <div>
    <el-table :data="tableData" border stripe>
      <el-table-column type="expand">
          <template slot-scope="scope">
              <el-tag
              v-for="(item, i) in scope.row.attr_vals"
              :key="i"
              closable
              @close="handleClosed(scope.row, i)"
              >{{item}}</el-tag>
              <el-input
              class="input-new-tag"
              v-if="scope.row.inputVisible"
              v-model="scope.row.inputValue"
              ref="saveTagInput"
              size="small"
              @keyup.enter.native="handleInputConfirm(scope.row)"
              @blur="handleInputConfirm(scope.row)"
             >
             </el-input>
             <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
          </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="参数名称" prop="attr_name"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="mini"
            icon="el-icon-edit"
            @click="editRow(scope.row)"
            >编辑</el-button
          >
          <el-button
            type="danger"
            size="mini"
            icon="el-icon-delete"
            @click="deleteRow(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
    :title="'编辑' + titleText"
    :visible.sync="editDialogVisible"
    @close="editDialogClosed"
    width="50%">
      <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" label-width="100px">
         <el-form-item :label="titleText" prop="attr_name">
           <el-input v-model="editForm.attr_name"></el-input>
         </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
         <el-button @click="editDialogVisible = false">取 消</el-button>
         <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator';
import { editattributes, deleteattributes } from '../api/goods'
import { msgCommon } from '../utils/commsg'
@Component
export default class GoodsTable extends Vue {
  @Prop(Array) tableData!: Array<object>;

  titleText = '';
  editDialogVisible = false;

  editForm: any = {};

  /* eslint-disable @typescript-eslint/camelcase */
  editFormRules: object = {
    attr_name: [
      { required: true, message: '请输入参数名称', trigger: 'blur' }
    ]
  }

  editRow(row: any) {
    console.log(row)
    if (row.attr_sel === 'many') {
      this.titleText = '动态参数'
    } else {
      this.titleText = '静态属性'
    }
    this.editDialogVisible = true
    this.editForm = row
  }

  async deleteRow(row: any) {
    console.log(row);
    const confirmResult = await (this as any).$confirm('此操作将删除该条参数/属性信息, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch((err: any) => err);

    if (confirmResult !== 'confirm') return msgCommon('info', '已取消删除！');
    const { data: res } = await deleteattributes(row);
    if (res.meta.status !== 200) return msgCommon('error', '删除角色失败！');
    this.$emit('manySend', this.editForm.attr_sel)
    msgCommon('success', '删除角色成功！');
  }

  editDialogClosed() {
    (this as any).$refs.editFormRef.resetFields()
  }

  editParams() {
    (this as any).$refs.editFormRef.validate(async (valid: boolean) => {
      if (!valid) return false;
      const { data: res } = await editattributes(this.editForm);
      console.log(res)
      if (res.meta.status !== 200) return msgCommon('error', '修改参数失败！')
      msgCommon('success', '修改参数成功！');
      this.editDialogVisible = false;
      this.$emit('manySend', this.editForm.attr_sel)
    })
  }

  // 失去焦点或者enter键触发
  async handleInputConfirm(row: any) {
    console.log(row);
    if (row.inputValue.trim().length === 0) {
      row.inputValue = '';
      row.inputVisible = false;
      return false
    }
    row.attr_vals.push(row.inputValue.trim());
    row.inputValue = '';
    row.inputVisible = false;
    const newData = JSON.parse(JSON.stringify(row));
    newData.attr_vals = newData.attr_vals.join(',');
    const { data: res } = await editattributes(newData);
    if (res.meta.status !== 200) return msgCommon('error', '添加属性标签失败！');
    this.$emit('manySend', row.attr_sel)
    msgCommon('success', '添加属性标签成功！');
  }

  showInput(row: any) {
    row.inputVisible = true;
    (this as any).$nextTick(() => {
      (this as any).$refs.saveTagInput.$refs.input.focus();
    });
  }

  async handleClosed(row: any, key: any) {
    console.log(row, key);
    row.attr_vals.splice(key, 1);
    const deleteData = JSON.parse(JSON.stringify(row));
    deleteData.attr_vals = deleteData.attr_vals.join(',');
    const { data: res } = await editattributes(deleteData);
    if (res.meta.status !== 200) return msgCommon('error', '删除属性标签失败！');
    this.$emit('manySend', row.attr_sel)
    msgCommon('success', '删除属性标签成功！');
  }
}
</script>
<style lang="less" scoped>
.input-new-tag {
  width: 150px;
}
</style>
