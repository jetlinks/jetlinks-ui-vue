<template>
  <div class="operate-warp">
    <div class="operate-item" v-for="item in BatchOperateOptions" @click="showTask(item.value)">
      <div class="icon"></div>
      <div class="content">
        <div class="content-title"> {{ item.label }}</div>
        <div class="content-tip">
          {{item.tip}}
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script setup name="BatchOperate">
import { BatchOperateOptions } from '../util'

const emit = defineEmits(['selected'])

const showTask = (type) => {
  emit('selected', {type})
}

</script>

<style scoped lang="less">
.operate-warp {
  width: 340px;
  display: grid;
  grid-template-rows: 1fr 1fr 1fr;
  gap: 12px;
  border: 1px solid #f1f1f1;
  padding: 16px;
  border-radius: 4px;

  .operate-item {
    display: flex;
    border: 1px solid #f1f1f1;
    padding: 12px;
  }
}
</style>
