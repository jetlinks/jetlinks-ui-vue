<script setup name='ClassifyOptions'>
import { brandClassifyId } from '@device-manager-ui/components/ResourceTable/Search/data'
import { omit } from 'lodash-es'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: ''
  },
  value: {
    type: Array,
    default: []
  }
})

const emit = defineEmits(['change'])

const selectKeys = ref(new Set())

const _options = computed(() => {
  if (props.type === brandClassifyId) {
    return props.options.map(i => omit(i, 'children'))
  }
  return props.options
})
const onChange = (record) => {
  const has = selectKeys.value.has(record.id)

  if (!has) {
    selectKeys.value.add(record.id)
  } else {
    selectKeys.value.delete(record.id)
  }
  emit('change', [...selectKeys.value.values()], !has, record)
}

watch(() => props.type, () => {
  selectKeys.value.clear()
}, {
  immediate: true,
  deep: true
})

watch(() => props.value, (val) => {
  if(val.length){
    selectKeys.value = new Set([...val])
  }
}, {
  deep: true,
  immediate: true
})
</script>

<template>
  <div class='children-items' :class='{"grandson-items": type === brandClassifyId}'>
    <div class='children-item' v-for='item in _options'>
      <div class='item' :class='{"active": selectKeys.has(item.id)}' @click='onChange(item)'>
        <j-ellipsis>{{ item.name }}</j-ellipsis>
      </div>
      <div class='grandson-items' v-if='item.children?.length'>
        <div
            :class="{
               'item': true,
              'grandson-item': true,
              'active': selectKeys.has(gItem.id)
            }"
            v-for='gItem in item.children' @click.stop='onChange(gItem)'
        >
          <j-ellipsis>{{ gItem.name }}</j-ellipsis>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang='less'>
.children-items {
  padding: 16px;
  max-height: 250px;
  overflow-y: auto;

  .item {
    cursor: pointer;
    max-width: 150px;
    margin-bottom: 8px;
    color: #1F2429;

    &:hover {
      color: @primary-color;
    }

    &.active {
      color: @primary-color;
    }
  }
}

.grandson-items {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.grandson-item {

  &.item {
    color: @font-gray-600;
  }
}
</style>
