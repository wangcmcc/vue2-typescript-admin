<template>
  <div class='welcome'>
    <el-button @click='ab'>按钮</el-button>
    <el-dialog
     title="提示"
     ref="dialogRef"
     :visible.sync="dialogVisible"
     width="50%">
      <div v-html="html"></div>
    </el-dialog>
  </div>
</template>
<script lang='ts'>
import { Vue, Component } from 'vue-property-decorator';
@Component
export default class Welcome extends Vue {
  html = '';
  dialogVisible = false

  async ab() {
    this.html = ''
    console.log(this.$refs.dialogRef, 'ref')
    this.dialogVisible = true
    for (let i = 0; i < 10; i++) {
      await setTimeout(() => {
        console.log(i);
        this.html += `</span>${i}成功</span><br/>`
        if (i === 3) return false
      }, 1000);
    }
  }
}
</script>
