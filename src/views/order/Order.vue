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
              @clear="getOrderList"
              >
              <el-button
              slot="append"
              icon="el-icon-search"
              @click="getOrderList"
              ></el-button>
          </el-input>
        </el-col>
            </el-row>
            <el-table :data="orderList" border stripe>
                <el-table-column type="index"></el-table-column>
                <el-table-column label="订单编号" prop="order_number"></el-table-column>
                <el-table-column label="订单价格" prop="order_price">
                </el-table-column>
                <el-table-column label="是否付款" prop="pay_status">
                    <template slot-scope="scope">
                       <el-tag v-if="scope.row.pay_status === '1'">已付款</el-tag>
                       <el-tag v-else type="danger">未付款</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="是否发货" prop="is_send"></el-table-column>
                <el-table-column label="下单时间" prop="create_time">
                    <template slot-scope="scope">
                       {{scope.row.create_time | format}}
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary" icon="el-icon-edit" @click="editRow(scope.row)"></el-button>
                        <el-button size="mini" type="success" icon="el-icon-location" @click="locationRow(scope.row)"></el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[10, 20, 30, 50]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
        <el-dialog
        title="修改地址"
        :visible.sync="addressVisible"
        @close="addressDialogClosed"
        width="50%">
          <el-form
          :model="addressForm"
          :rules="addressRules"
          ref="addressRef"
          label-width="100px">
            <el-form-item label="省市区/县:" prop="adress1">
              <el-cascader
                v-model="addressForm.adress1"
                :options="cityData"
                ></el-cascader>
            </el-form-item>
            <el-form-item label="详细地址:" prop="adress2">
              <el-input v-model="addressForm.adress2"></el-input>
            </el-form-item>
          </el-form>
          <span slot="footer" class="dialog-footer">
            <el-button @click="addressVisible = false">取 消</el-button>
            <el-button type="primary" @click="addressSave">确 定</el-button>
          </span>
        </el-dialog>

        <el-dialog
          title="物流进度"
          :visible.sync="progressdialogVisible"
          width="30%">
            <el-timeline>
               <el-timeline-item
               v-for="(activity, index) in progressInfo"
               :key="index"
               :timestamp="activity.time">
               {{activity.context}}
               </el-timeline-item>
            </el-timeline>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'
import Breadcrumb from '../../component/Breadcrumb.vue'
import { getOrderInfo, getProgress } from '../../api/order'
import { msgCommon } from '../../utils/commsg'
import { formatDate } from '../../utils/filter'
import { regionData } from 'element-china-area-data';
@Component({
  name: 'Order',
  filters: {
    format: (value: number | string) => (formatDate('yyyy-MM-dd hh:mm:ss', new Date(value)))
  },
  components: {
    Breadcrumb
  }
})
export default class Order extends Vue {
  headerData: object = {
    manage: '订单管理',
    sort: '订单详情'
  };

  addressVisible = false

  addressForm: object = {
    adress2: '',
    adress1: []
  };

  addressRules: object = {
    adress1: [
      { required: true, message: '省市区/县不能为空', trigger: 'blur' }
    ],
    adress2: [
      { required: true, message: '详细地址不能为空', trigger: 'blur' }
    ]
  }

  cityData: Array<any> = regionData;

  queryInfo: any = {
    query: '',
    pagenum: 1,
    pagesize: 10
  }

  // 订单列表数据
  orderList: Array<object> = [];

  total = 0;

  progressdialogVisible = false
  progressInfo: Array<object> = [];

  created() {
    this.getOrderList()
    console.log(this.cityData)
  }

  async getOrderList() {
    const { data: res } = await getOrderInfo(this.queryInfo)
    if (res.meta.status !== 200) return msgCommon('error', '获取订单列表失败！')
    this.orderList = res.data.goods;
    this.total = res.data.total;
    console.log(this.orderList)
  }

  handleSizeChange(value: number) {
    this.queryInfo.pagesize = value
    this.getOrderList()
  }

  handleCurrentChange(value: number) {
    this.queryInfo.pagenum = value
    this.getOrderList()
  }

  editRow(row: any) {
    console.log(row)
    this.addressVisible = true
  }

  async locationRow(row: any) {
    console.log(row)
    const { data: res } = await getProgress();
    if (res.meta.status !== 200) return msgCommon('error', '获取物流进度失败！')
    this.progressInfo = res.data
    console.log(this.progressInfo)
    this.progressdialogVisible = true
  }

  addressSave() {
    (this as any).$refs.addressRef.validate((valid: boolean) => {
      if (valid) {
        msgCommon('success', '请求成功');
        console.log(this.addressForm);
      } else {
        return msgCommon('error', '请求失败');
      }
    });
  }

  addressDialogClosed() {
    (this as any).$refs.addressRef.resetFields();
  }
}
</script>
<style lang="less" scoped>
</style>
