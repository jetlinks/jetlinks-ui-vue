<template>
  <div class="metadata-edit-table-wrapper" ref="tableWrapper">
      <div class="metadata-edit-table">
        <div class="metadata-edit-table-header" style="height: 56px" >
          <Header :columns="columns" :style="{width: tableStyle.width}"/>
        </div>
        <div class="metadata-edit-table-body" :style="{width: tableStyle.width, maxHeight: `${height}px`}">
          <Body
            v-if="dataSource.length"
            :columns="columns"
            :dataSource="dataSource"
            :cellHeight="cellHeight"
            :height="height"
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
import {useValidate, useResizeObserver, handleColumnsWidth} from './utils'
import { tableProps } from 'ant-design-vue/lib/table'
import { useFormContext } from './context'
import Header from './header.vue'
import Body from './body.vue'

const slots = useSlots()

const props = defineProps({
  ...tableProps(),
  serial: {
    type: Object,
    default: () => ({ width: 60})
  },
  cellHeight: {
    type: Number,
    default: 66
  },
  height: {
    type: Number,
    default: 500
  }
})

const columns = ref([])
const tableWrapper = ref()
const tableStyle = reactive({
  width: 100
})

const onResize = ({ width = 0}) => {


  const scrollWidth = (props.dataSource.length * props.cellHeight) > props.height ? 17 : 0

  const _width = width - scrollWidth
  console.log(width, _width, scrollWidth)
  tableStyle.width = width

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

  columns.value = handleColumnsWidth(newColumns, _width)
}

useResizeObserver(tableWrapper, onResize)

const { rules, validateItem, validate, errorMap } = useValidate(
  props.dataSource,
  props.columns,
  {
    onError: (err) => {
      const _errObj = err[0]
      const field = findField(_errObj.__index, _errObj.field)
      field?.showErrorTip(_errObj.message)
      // TODO table滚动到指定位置
    }
  }
)

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

useFormContext({
  dataSource: props.dataSource,
  errorMap,
  rules,
  addField,
  removeField,
  validateItem
})

defineExpose({
  validate
})
</script>

<style scoped lang="less">
.metadata-edit-table-wrapper {
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
       padding-top: 24px;
     }
   }
 }
}
</style>
