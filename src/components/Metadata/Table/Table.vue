<template>
  <div :class="{
    'metadata-edit-table-wrapper': true,
    'table-full-screen': isFullscreen
  }" ref="tableWrapper">
    <div class="metadata-edit-table-extra">
      <slot name="extra" :isFullscreen="isFullscreen" :fullScreenToggle="toggle"/>
    </div>
    <div class="metadata-edit-table">
      <div class="metadata-edit-table-header" style="height: 50px" :style="{paddingRight: scrollWidth + 'px'}">
        <Header :columns="myColumns" :style="{width: tableStyle.width}"/>
      </div>
      <div class="metadata-edit-table-body" :style="{width: tableStyle.width, height: `${height}px`}">
        <Body
            ref="tableBody"
            :dataSource="dataSource"
            :columns="myColumns"
            :cellHeight="cellHeight"
            :height="height"
            :disableMenu="disableMenu"
            :rowKey="rowKey"
            :selectedRowKeys="selectedRowKeys"
            @scrollDown="onScrollDown"
        >
        <template v-for="(_, name) in slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData || {}"/>
        </template>
        </Body>
        <slot name="bodyExtra"></slot>
      </div>
    </div>
  </div>
</template>

<script setup name="MetadataBaseTable">
import {useValidate, useResizeObserver, handleColumnsWidth, TABLE_WRAPPER, FULL_SCREEN, RIGHT_MENU} from './utils'
import {tableProps} from 'ant-design-vue/lib/table'
import {useFormContext} from './context'
import Header from './header.vue'
import Body from './body.vue'
import {useFullscreen} from '@vueuse/core';
import {provide, useAttrs, useSlots} from 'vue'

const emit = defineEmits(['scrollDown', 'rightMenuClick', 'editChange'])

const props = defineProps({
  ...tableProps(),
  serial: {
    type: Object,
    default: () => ({width: 60})
  },
  cellHeight: {
    type: Number,
    default: 50
  },
  height: {
    type: Number,
    default: 500
  },
  disableMenu: {
    type: Boolean,
    default: true
  },
  rowKey: {
    type: String,
    default: 'id'
  },
  selectedRowKeys: {
    type: [Array],
    default: () => []
  },
  validateRowKey: {
    type: Boolean,
    default: false
  }
})

const slots = useSlots()
const attrs = useAttrs()
const myColumns = ref([])
const tableWrapper = ref()
const tableBody = ref()
const tableStyle = reactive({
  width: 100,
  height: props.height
})

const fields = {}

const _dataSource = computed(() => {
  return props.dataSource
})

useResizeObserver(tableWrapper, onResize)

const {isFullscreen, toggle} = useFullscreen(tableWrapper);

const {rules, validateItem, validate, errorMap} = useValidate(
    _dataSource,
    props.columns,
    props.rowKey,
  {
      onError: (err) => {
        const _errObj = err[0]
        const field = findField(_errObj.__index, _errObj.field)
        field?.showErrorTip(_errObj.message)
        tableBody.value.scrollTo(_errObj.__index)
      },
      onEdit: () => {
          emit('editChange', true)
      },
      validateRowKey: props.validateRowKey
    }
)

provide(TABLE_WRAPPER, tableWrapper)
provide(FULL_SCREEN, isFullscreen)
provide(RIGHT_MENU, {click: rightMenu, getPopupContainer: () => tableWrapper.value })

const addField = (key, field) => {
  fields[key] = field
}

const removeField = (key) => {
  delete fields[key]
}

function findField(index, name) {
  const fieldId = Object.keys(fields).find(key => {
    const {names} = fields[key]
    return names[0] === index && names[1] === name
  })
  return fields[fieldId]
}

const scrollWidth = computed(() => {
  return (props.dataSource.length * props.cellHeight) > props.height ? 17 : 0
})

function onResize({width = 0, height}) {

  const _width = width - scrollWidth.value

  tableStyle.width = width || '100%'

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
    newColumns = [serial, ...props.columns]
  }

  myColumns.value = handleColumnsWidth(newColumns, _width)
}

const onScrollDown = (len) => {
  emit('scrollDown', len)
}

function rightMenu(menuType, record, copyValue) {
  emit('rightMenuClick', menuType, record, copyValue)
}

const scrollToById = (key) => {
  const _index = _dataSource.value.findIndex(item => item[props.rowKey] === key)
  tableBody.value.scrollTo(_index)
}

const getTableWrapperRef = () => {
  return tableWrapper.value
}

watch(() => scrollWidth.value, () => {
  onResize({width: tableStyle.width})
})

useFormContext({
  dataSource: computed(() => {
    return props.dataSource
  }),
  errorMap,
  rules,
  addField,
  removeField,
  validateItem
})

defineExpose({
  validate,
  tableWrapper,
  scrollToById,
  getTableWrapperRef
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
    }
  }
}
</style>
