<template>
  <div class="operate-warp">
    <div class="operate-item" v-for="item in options" @click="showTask(item.value)">
      <div class="icon"></div>
      <div class="content">
        <div class="content-title"> {{ item.title}}</div>
        <div class="content-tip">
          {{item.tip}}
        </div>
      </div>
      <div></div>
    </div>
  </div>
</template>

<script setup name="BatchOperate">

const emit = defineEmits(['selected'])

const options = [
  {
    icon: '',
    title: '安装插件',
    tip: '批量安装插件至边缘端',
    value: 'plugin'
  },
  {
    icon: '',
    title: '远程升级',
    tip: '批量升级边缘网关固件',
    value: 'remote'
  },
  {
    icon: '',
    title: '绑定子设备',
    tip: '批量绑定云端子设备',
    value: 'device'
  },
]

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
