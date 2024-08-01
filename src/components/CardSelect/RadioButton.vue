<template>
  <div class="radio-button" :style="styles">
    <div v-for="item in options" @click="onClick(item)"  class="radio-button-item" :class="{'active': myValue === item.value }">
      {{ item.label }}
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'RadioButton',
})

const props = defineProps({
  value: {
    type: [String, Number],
    default: undefined
  },
  options: {
    type: Array,
    default: () => []
  },
  columns: {
    type: Number,
    default: 3
  }
})

const emit = defineEmits(['update:value'])

const myValue = ref(props.value)

const styles = computed(() => {
  return {
    'grid-template-columns': `repeat(${props.columns}, 1fr)`
  }
})

const onClick = (record) => {
  if (myValue.value !== record.value) {
    myValue.value = record.value
    emit('update:value', record.value)
    emit('select', record.value)
  }
}

watch(() => props.value, () => {
 myValue.value = props.value
})

</script>

<style scoped lang="less">
.radio-button {
  display: grid;
  gap: 16px;

  .radio-button-item {
    padding: 6px 12px;
    text-align: center;
    height: 100%;
    border-radius: 2px;
    background-color: #f5f5f5;
    cursor: pointer;

    &.active {
      color: #fff;
      background-color: @primary-color;
    }
  }
}
</style>
