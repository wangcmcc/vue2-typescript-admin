<template>
  <div>
    <Breadcrumb :headerData="headerData"></Breadcrumb>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input
            v-model="queryInfo.query"
            clearable
            placeholder="请输入内容"
            @clear="getGoodsList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getGoodsList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddGoods"
            >添加商品</el-button
          >
        </el-col>
      </el-row>
      <el-table :data="goodsList" border stripe>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格（元）" prop="goods_price" width="100px"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="100px"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px">
          <template slot-scope="scope">
            {{scope.row.add_time | format}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="230px">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" icon="el-icon-edit" @click="editRow(scope.row)">编辑</el-button>
            <el-button type="danger" size="mini" icon="el-icon-delete" @click="deleteRow(scope.row.goods_id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
      </el-pagination>
    </el-card>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Breadcrumb from '../../component/Breadcrumb.vue';
import { getGoodsInfo, deleteGoodsById } from '../../api/goods'
import { msgCommon } from '../../utils/commsg'
import { formatDate } from '../../utils/filter'
@Component({
  name: 'List',
  filters: {
    format: (value: number | string) => (formatDate('yyyy-MM-dd hh:mm:ss', new Date(value)))
  },
  components: {
    Breadcrumb
  }
})
export default class List extends Vue {
  dialogVisible = false;

  headerData: object = {
    manage: '商品管理',
    sort: '商品列表'
  };

  queryInfo: any = {
    query: '',
    pagenum: 1,
    pagesize: 10
  }

  goodsList: Array<object> = [];

  total = 0;

  created() {
    this.getGoodsList()
  }

  async getGoodsList() {
    const { data: res } = await getGoodsInfo(this.queryInfo);
    if (res.meta.status !== 200) return msgCommon('error', '获取商品列表失败！')
    this.goodsList = res.data.goods;
    this.total = res.data.total
    console.log(this.goodsList)
  }

  handleSizeChange(value: number) {
    console.log(value, 'A')
    this.queryInfo.pagesize = value
    this.getGoodsList()
  }

  handleCurrentChange(value: number) {
    console.log(value)
    this.queryInfo.pagenum = value
    this.getGoodsList()
  }

  // 删除
  async deleteRow(id: number | string) {
    console.log(id)
    const confirmResult = await (this as any).$confirm('此操作将删除该条商品信息, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).catch((err: any) => err);

    if (confirmResult !== 'confirm') return msgCommon('info', '已取消删除！');
    const { data: res } = await deleteGoodsById(id);
    if (res.meta.status !== 200) return msgCommon('error', '删除商品失败！');
    this.getGoodsList()
    msgCommon('success', '删除商品成功！');
  }

  goAddGoods() {
    (this as any).$router.push('/goods/add')
  }
}
</script>
