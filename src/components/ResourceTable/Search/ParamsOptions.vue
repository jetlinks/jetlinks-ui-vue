<script setup name="ParamsOptions">
  const props = defineProps({
    title: {
      type: String
    },
    options: {
      type: Array,
      default: () => []
    },
    showAll: {
      type: Boolean,
      default: true
    },
    value: {
      type: [String, Number],
      default: undefined
    },
    fieldNames: {
      type: Object,
      default: () => ({
        label: 'label',
        value: 'value'
      })
    }
  })

  const emit = defineEmits(['change', 'update:value'])

  const activeKey = ref(props.showAll ? 'all' : undefined)

  const handleFieldNames = (array) => {
    return array.map(item => {
      return {
        ...item,
        label: item[props.fieldNames.label || 'label'],
        value: item[props.fieldNames.value || 'value']
      }
    })
  }

  const _options = computed(() => {
    const array = handleFieldNames(props.options)
    if (props.showAll) {
      return [
        { label: '全部', value: 'all' },
        ...array
      ]
    }
    return array
  })

  const onChange = (record, e) => {
    e.stopPropagation()
    if (activeKey.value !== record.value) {
      activeKey.value = record.value
      emit('update:value', record.value)
      emit('change', record.value, record)
    }
  }
</script>

<template>
  <div class="params-warp">
    <div class="params-title">
      {{ title }}:
    </div>
    <div class="params-list">
      <div
        :class="{
          'params-item': true,
          'active': item.value === activeKey
        }"
        v-for="item in _options"
        @click="(e) => onChange(item, e)"
      >
        {{ item.label }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.params-warp {
  display: flex;
  gap: 12px;
  align-items: center;

  .params-list {
    display: flex;
    min-width: 0;
    flex-grow: 1;
    flex-shrink: 1;
    gap: 4px;

    .params-item {
      padding: 4px 18px;
      border-radius: 20px;
      transition: all .3s;
      cursor: pointer;
      min-width: 90px;
      text-align: center;

      &.active {
        background-color: @primary-color;
        color: #fff;
      }
    }
  }
}
</style>
