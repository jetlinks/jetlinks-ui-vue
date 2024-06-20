<template>
  <div :class='["trigger-options-content", isAdd ? "is-add" : ""]'>
    <span v-if='!isAdd'> 点击设定时间 </span>
    <template v-else>
      <div v-if='options.when'>
        <span className='trigger-options-when'>{{ options.when }}</span>
      </div>
      <div v-if='options.time'>
        <span className='trigger-options-time'>{{ options.time }}</span>
      </div>
      <div v-if='options.extraTime'>
        <span className='trigger-options-extraTime'>{{ options.extraTime }}</span>
      </div>
    </template>
  </div>
</template>

<script setup lang='ts' name='TimerTitle'>

const props = defineProps({
  options: {
    type: Object,
    default: () => ({})
  }
})

const isAdd = computed(() => {
  return !!Object.keys(props.options).length
})

</script>

<style scoped lang='less'>
.trigger-options-content {
  display: inline-flex;
  gap: 16px;

  .center-item {
    display: flex;
    align-items: center;
  }

  .icon-padding-right {
    padding-right: 4px;
  }

}
</style>
