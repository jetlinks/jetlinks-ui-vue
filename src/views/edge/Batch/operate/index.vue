<template>
  <div class="operate-warp">
    <div class="operate-item" v-for="item in BatchOperateOptions" @click="showTask(item.value)">
      <div class="img"></div>
      <div class="content">
        <div class="content-title"> {{ item.label }}</div>
        <div class="content-tip">
          {{item.tip}}
        </div>
      </div>
      <div class="icon">
        <AIcon type="ArrowRightOutlined"/>
      </div>
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
  display: flex;
  flex-direction: column;
  gap: 16px;

  .operate-item {
    display: flex;
    padding: 22px 14px;
    border-radius: 6px;
    background-color: @font-gray-50;
    align-items: center;

    .content-title {
      color: @font-gray-900;
    }

    .content-tip {
      color: @font-gray-500;
    }

    .icon {
      color: @font-gray-600;
      font-size: 22px;
      margin-left: auto;
    }
  }
}
</style>
