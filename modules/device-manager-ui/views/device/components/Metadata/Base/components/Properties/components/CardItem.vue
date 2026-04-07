<template>
  <div class="area-box">
    <div class="top">
      <a-space>
        <div class="top-img">
          <AIcon type="FileTextOutlined"/>
        </div>
        <div>
          {{ title }}
          <a-tooltip v-if="tip" :title="tip">
            <AIcon type="QuestionCircleOutlined" style="margin-left: 2px"/>
          </a-tooltip>
        </div>
      </a-space>
      <a-switch v-model:checked="showArea" @change="handleChange"/>
    </div>
    <div v-if="!!Object.keys(slot).length && showArea" class="area">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  tip: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  value: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:value', 'change'])
const showArea = ref(false)
const slot = useSlots()

const handleChange = () => {
  emit('update:value', showArea.value)
  emit('change', showArea.value)
}

watch(() => props.value, () => {
  showArea.value = props.value
}, {
  immediate: true
})
</script>

<style lang="less" scoped>
.area-box {
  .top {
    padding: 12px;
    display: flex;
    align-items: center;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    justify-content: space-between;

    .top-img {
      border: 1px solid #d9d9d9;
      font-size: 20px;
      border-radius: 6px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: 36px;
    }
  }

  .area {
    border: 1px solid #d9d9d9;
    border-top: 0;
    width: 100%;
    padding: 12px;
  }
}
</style>
