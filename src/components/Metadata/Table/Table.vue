<template>
  <div :class="{
    'metadata-edit-table-wrapper': true,
    'table-full-screen': isFullscreen
  }" ref="tableWrapper">
      <div class="metadata-edit-table-extra">
        <slot name="extra" :isFullscreen="isFullscreen" :fullScreenToggle="toggle"/>
      </div>
      <div class="metadata-edit-table">
        <div class="metadata-edit-table-header" style="height: 50px" :style="{paddingRight: scrollWidth + 'px'}" >
          <Header :columns="myColumns" :style="{width: tableStyle.width}"/>
        </div>
        <div class="metadata-edit-table-body" :style="{width: tableStyle.width, maxHeight: `${height}px`}">
          <Body
            v-if="dataSource.length"
            v-model:dataSource="dataSource"
            :columns="myColumns"
            :cellHeight="cellHeight"
            :height="height"
            @scrollDown="onScrollDown"
          >
            <template v-for="(_, name) in slots" #[name]="slotData">
              <slot :name="name" v-bind="slotData || {}" />
            </template>
          </Body>
          <template v-else>
            <slot name="empty">
              <div class="metadata-edit-table-body-empty">
                <j-empty />
              </div>
            </slot>
          </template>
        </div>
      </div>
  </div>
</template>

<script setup name="MetadataBaseTable">
import {useValidate, useResizeObserver, handleColumnsWidth, TABLE_WRAPPER, FULL_SCREEN} from './utils'
import { tableProps } from 'ant-design-vue/lib/table'
import { useFormContext } from './context'
import Header from './header.vue'
import Body from './body.vue'
import { useFullscreen } from '@vueuse/core';
import { provide } from 'vue'

const emit = defineEmits(['scrollDown'])

const props = defineProps({
  ...tableProps(),
  serial: {
    type: Object,
    default: () => ({ width: 60})
  },
  cellHeight: {
    type: Number,
    default: 50
  },
  height: {
    type: Number,
    default: 500
  }
})

const slots = useSlots()
const myColumns = ref([])
const tableWrapper = ref()
const tableStyle = reactive({
  width: 100,
  height: props.height
})

useResizeObserver(tableWrapper, onResize)

const { isFullscreen, toggle } = useFullscreen(tableWrapper);

const { rules, validateItem, validate, errorMap } = useValidate(
  props.dataSource,
  props.columns,
)

provide(TABLE_WRAPPER, tableWrapper)
provide(FULL_SCREEN, isFullscreen)

const fields = {}
const addField = (key, field) => {
  fields[key] = field
}

const removeField = (key) => {
  delete fields[key]
}

const findField = (index, name) => {
  const fieldId = Object.keys(fields).find(key => {
    const { names } = fields[key]
    return names[0] === index && names[1] === name
  })
  return fields[fieldId]
}

const scrollWidth = computed(() => {
  return (props.dataSource.length * props.cellHeight) > props.height ? 17 : 0
})

function onResize({ width = 0, height}) {

  const _width = width - scrollWidth.value

  tableStyle.width = width

  // tableStyle.height = height - 146

  let newColumns = [...props.columns]

  if (props.serial) {
    const serial = {
      dataIndex: '__serial',
      title: '序号',
      customRender: (customData) => {
        if (props.serial?.customRender) {
          return props.serial?.customRender(customData)
        }
        return customData.index + 1
      },
      width: props.serial?.width
    }
    newColumns  = [ serial, ...props.columns]
  }

  myColumns.value = handleColumnsWidth(newColumns, _width)
}

watch(() => scrollWidth.value, () => {
  onResize({ width : tableStyle.width })
})

const onScrollDown = (len) => {
  emit('scrollDown', len)
}

useFormContext({
  dataSource: props.dataSource,
  errorMap,
  rules,
  addField,
  removeField,
  validateItem
})

defineExpose({
  validate,
  tableWrapper
})
</script>

<style scoped lang="less">
.metadata-edit-table-wrapper {
  background: #fff;
  height: 100%;

  &.table-full-screen {
    padding: 24px;
  }

 .metadata-edit-table {
   display: flex;
   flex-direction: column;
   flex-grow: 0;
   flex-shrink: 0;
   background: #fafafa;
   transition: background-color .3s ease;

   .metadata-edit-table-header {
     overflow: hidden;
   }

   .metadata-edit-table-body {
     background-color: #fff;
     overflow-y: hidden;
     display: flex;
     position: relative;
     height: 100%;
     width: 100%;
     flex: 1 1 auto;
     flex-direction: row;

     .metadata-edit-table-body-empty {
       display: flex;
       width: 100%;
       justify-content: center;
       padding-top: 24px;
     }
   }
 }
}
</style>
