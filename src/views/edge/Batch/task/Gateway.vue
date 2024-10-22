<template>
  <div class="gateway-select-warp">
    <template v-if="options.length">
      <j-scrollbar :maxHeight="180">
        <div
          v-for="item in options"
          :class="{
            'gateway-select-item': true,
            'selected': myValue === item.value
          }"
        >
          <div class="icon">
            <AIcon type="InboxOutlined" />
          </div>
          <div class="content">
            {{ item.label }}
          </div>
          <div class="tool" @click="() => onDelete(item.value)">
            <AIcon type="DeleteOutlined" />
          </div>
        </div>
      </j-scrollbar>
    </template>
    <j-empty v-else />
  </div>
</template>

<script setup name="GatewaySelect">

const emit = defineEmits(['update:value', 'change', 'delete'])
const props = defineProps({
  value: {
    type: String,
    default: undefined
  },
  options: {
    type: Array,
    default: () => []
  }
})

const myValue = ref()

// const onSelected = (record) => {
//   myValue.value = record
//   emit('update:value', record)
//   emit('change', record)
// }

const onDelete = (id) => {
  if (myValue.value === id) {
    myValue.value = undefined
    emit('update:value', undefined)
    emit('change', undefined)
  }
  emit('delete', id)
}

watch(() => props.value, () => {
  myValue.value = props.value || []
}, { immediate: true })
</script>

<style scoped lang="less">
.gateway-select-warp {
  padding: 8px;
  border: 1px solid @border-base-color;
  border-radius: 6px;
  min-height: 100px;

  .gateway-select-item {
    display: flex;
    gap: 4px;
    cursor: pointer;
    padding: 8px 6px;
    border-radius: 4px;

    .content {
      flex: 1 1 0;
    }

    & .icon,& .tool{
      width: 24px;
    }

    .tool {
      visibility: hidden;
      color: @error-color-hover;
    }

    &:hover {
      background-color: #f5f5f5;

      .tool {
        visibility: visible;
      }
    }

    &.selected {
      background-color: @primary-color-hover;
      color: #fff;
    }
  }
}
</style>
