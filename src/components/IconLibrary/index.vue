<template>
  <div
    class="container"
    @click="onClick"
  >
    <div
      v-if="_type"
      class="icon-display"
    >
      <AIcon :type="_type" />
    </div>
    <div
      v-else
      class="no-icon"
    >
      <AIcon type="PlusOutlined" />
    </div>
  </div>
  <SelectModal
    v-if="visible"
    @close="visible = false"
    @save="onChange"
  />
</template>

<script setup lang="ts">
import SelectModal from './SelectModal.vue'
const props = defineProps({
  type: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['change', 'update:type'])

const _type = ref()
const visible = ref(false)

const onClick = () => {
  visible.value = true
}

const onChange = (val: string) => {
  _type.value = val
  emits('update:type', val)
  emits('change', val)
  visible.value = false
}

watch(
  () => props.type,
  (newVal) => {
    _type.value = newVal
  },
  { deep: true, immediate: true }
)
</script>

<style lang="less" scoped>
.container {
  width: 70px;
  height: 70px;
  border: 1px dashed #d9d9d9;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    border-color: #415ed1;
    background-color: #f5f7ff;
  }

  .icon-display {
    font-size: 32px;
    color: #415ed1;
  }

  .no-icon {
    color: #00000077;
    font-size: 22px;
  }
}
</style>
