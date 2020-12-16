<template>
  <div class="home">
    <el-table :data="tableData">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <el-table :data="scope.row.childData" border>
            <el-table-column label="名字" prop="namer"></el-table-column>
            <el-table-column label="年龄" prop="age"></el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column label="商品 ID" prop="id"> </el-table-column>
      <el-table-column label="商品名称" prop="name">
        <template slot-scope="scope">
          <el-select v-model="scope.row.name">
            <el-option v-for="item in names" :key="item" :label="item" :value="item"></el-option>
          </el-select>
        </template>
      </el-table-column>
      <el-table-column label="商品价格" prop="price"> </el-table-column>
      <el-table-column label="操作">
        <template  slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            circle
            v-if="!scope.row.isShow"
            @click='handleEditDict(scope.row)'
          >编辑
          </el-button>
          <el-button
            size="mini"
            type="success"
            circle
            v-else
            @click="saveInfo(scope.row)"
          >确定
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
@Component
export default class Home extends Vue {
  names: Array<string> = ['苹果8', '苹果9', '苹果11', '苹果12']

  tableData: Array<object> = [
    {
      childData: [
        { namer: '张三', age: 18 },
        { namer: '李四', age: 23 }
      ],
      id: '1',
      name: '',
      price: '6500',
      isShow: true
    },
    {
      childData: [
        { namer: '王五', age: 18 },
        { namer: '李四', age: 23 }
      ],
      id: '2',
      name: '',
      price: '7800',
      isShow: true
    },
    {
      childData: [
        { namer: '张三', age: 18 },
        { namer: '李四', age: 23 }
      ],
      id: '3',
      name: '',
      price: '7800',
      isShow: true
    }
  ]

  handleEditDict(row: any) {
    console.log(row)
    row.isShow = true
  }

  saveInfo(row: any) {
    console.log(row)
    row.isShow = false
  }
}
</script>
