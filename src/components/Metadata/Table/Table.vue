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
            :dataSource="bodyDataSource"
            :columns="myColumns"
            :cellHeight="cellHeight"
            :height="height"
            :disableMenu="disableMenu"
            :rowKey="rowKey"
            :selectedRowKeys="selectedRowKeys"
            :groupKey="groupActive.key"
            :openGroup="openGroup"
            @scrollDown="onScrollDown"
        >
        <template v-for="(_, name) in slots" #[name]="slotData">
          <slot :name="name" v-bind="slotData || {}"/>
        </template>
        </Body>
        <slot name="bodyExtra"></slot>
      </div>
      <Group
        v-if="dataSource.length"
        v-model:activeKey="groupActive.key"
        :options="groupOptions"
        @add="groupAdd"
        @delete="groupDelete"
        @edit="groupEdit"
        @change="groupChange"
      />
    </div>
  </div>
</template>

<script setup name="MetadataBaseTable">
import {useValidate, useResizeObserver, handleColumnsWidth, TABLE_WRAPPER, FULL_SCREEN, RIGHT_MENU, TABLE_ERROR} from './utils'
import {tableProps} from 'ant-design-vue/lib/table'
import {useFormContext} from './context'
import Header from './header.vue'
import Body from './body.vue'
import {useFullscreen} from '@vueuse/core';
import {provide, useAttrs, useSlots} from 'vue'
import Group from './group.vue'
import {randomNumber} from "@/utils/utils";
import {bodyProps} from "./props";

const emit = defineEmits(['scrollDown', 'rightMenuClick', 'editChange'])

const props = defineProps({
  ...tableProps(),
  ...bodyProps(),
  serial: {
    type: Object,
    default: () => ({width: 66})
  },
  validateRowKey: {
    type: Boolean,
    default: false
  },
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
const defaultGroupId = randomNumber()

const fieldsErrMap = ref({})
const groupOptions = ref([])
const groupActive = reactive({
  key: undefined,
  name: undefined
})
const _dataSource = computed(() => {
  const _options = new Map()
  props.dataSource.forEach((item, index) => {
    item.__dataIndex = index
    if (!item.expands?.groupId) {
      item.expands.groupId = groupActive.key || defaultGroupId
      item.expands.groupName = groupActive.name || '分组1'
    }

    _options.set(item.expands?.groupId, {
      value: item.expands?.groupId,
      label: item.expands?.groupName
    })
  })

  groupOptions.value = [..._options.values()]

  return props.dataSource
})

const bodyDataSource = computed(() => {
  if (props.openGroup) {
    return props.dataSource.filter(item => {
      return item.expands.groupId === groupActive.key
    })
  }
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
        // 显示全部err红标
        err.forEach((item, errIndex) => {
          item.forEach((e, eIndex) =>{
            const field = findField(e.__index, e.field)

            if (field) {
              field.showErrorTip(e.message)
              fieldsErrMap.value[field.eventKey] = e.message
            }
            if (errIndex === 0 && eIndex === 0) {
              tableBody.value.scrollTo(e.__index)
            }
          })
        })
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
provide(TABLE_ERROR, fieldsErrMap)

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

function removeFieldError(key) {
  delete fieldsErrMap.value[key]
}

function addFieldError(key, message) {
  fieldsErrMap.value[key] = message
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

const groupAdd = (val) => {
  groupOptions.value.push(val)
}

const groupChange = (key, name) => {
  groupActive.key = key
  groupActive.name = name
}

const groupDelete = (id, index) => {
  groupOptions.value.splice(index, 1)
  // TODO 触发emit，外部操作dataSource
  emit('groupDelete', id)
}

const groupEdit = (record) => {
  const { name, id } = record
  // TODO 触发emit，外部操作dataSource修改分组name
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
  removeFieldError,
  addFieldError,
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
      position: relative;
      height: 100%;
      width: 100%;
      flex: 1 1 auto;
      flex-direction: row;
    }
  }
}
</style>
