<template>
  <div class="table-group-warp">
    <a-tabs type="editable-card" v-model:activeKey="myActiveKey" @edit="onAdd" @change="change">
      <a-tab-pane v-for="item in options" :key="item.value" :closable="false">
        <template #tab>
          <a-dropdown
            v-if="myActiveKey === item.value"
            :trigger="['click']"
            :getPopupContainer="(node) => tableWrapperRef || node"
          >
            <template #overlay>
              <a-menu @click="(e) => { menuClick(e, item)}">
                <a-menu-item key="edit">
                  编辑
                </a-menu-item>
                <a-menu-item key="delete">
                  删除
                </a-menu-item>
              </a-menu>
            </template>
            <div class="table-group-error-warp">
              {{ item.label }} ({{ item.effective}})
              <a-tooltip
                v-if="errorMap[item.value]"
                color="#ffffff"
                :arrowPointAtCenter="true"
                :get-popup-container="popContainer"
              >
                <template #title>
                  <span style="color: #1d2129">校验不合规</span>
                </template>
                <div class="table-group-error-target"></div>
              </a-tooltip>
            </div>
          </a-dropdown>
          <div v-else class="table-group-error-warp">
            {{ item.label }} ({{ item.effective}})
            <a-tooltip
              v-if="errorMap[item.value]"
              color="#ffffff"
              :arrowPointAtCenter="true"
              :getContainer="popContainer"
            >
              <template #title>
                <span style="color: #1d2129">校验不合规</span>
              </template>
              <div class="table-group-error-target"></div>
            </a-tooltip>
          </div>
        </template>
      </a-tab-pane>
    </a-tabs>
    <a-modal
      :visible="visible"
      title="编辑分组"
      :maskClosable="false"
      :getContainer="modalContainer"
      @cancel="onCancel"
      @ok="onOk"
    >
      <a-form ref="formRef" :model="formData" @finish="onOk">
        <a-form-item name="label" :rules="[{ required: true, message: '请输入分组名称'}, { max: 16, message: '最多可输入16个字符'}]">
          <a-input v-model:value="formData.label" placeholder="请输入分组名称"/>
        </a-form-item>
        <a-form-item v-show="false">
          <a-button html-type="submit"></a-button>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script setup name="MetadataBaseTableGroup">
import {Modal} from "ant-design-vue";
import {randomNumber} from "@/utils/utils";
import {isFullScreen} from "@/utils/comm";
import {useTableGroupError, useTableWrapper} from './context'

const props = defineProps({
  options: {
    type: Array,
    default: () => []
  },
  activeKey: {
    type: String,
    default: undefined
  }
})

const emit = defineEmits(['delete', 'edit', 'add', 'change', 'update:activeKey'])

const myActiveKey = ref(props.activeKey)
const visible = ref(false)
const type = ref('新增分组')
const errorMap = useTableGroupError()
const tableWrapperRef = useTableWrapper()
const addIndex = ref(0)

const formRef = ref()
const formData = reactive({
  label: undefined
})

const onAdd = (targetKey, action) => {
  if (action === 'add') {
    type.value = 'add'
    // 获取上一个包含 “分组_” 的信息
    const groupName = props.options.filter(item => item.label.includes('分组_'))
    let index = addIndex.value + 1
    let findStatus = false
    while (!findStatus) {
      const status = groupName.some(item => {
        const [ _, _index] = item.label.split('_')
        if (index === Number(_index)) {
          index = Number(_index) + 1
          return true
        }
        return false
      })

      findStatus = !status
    }

    addIndex.value = index
    formData.label = '分组_' + index
    onOk()
  }
}

const onEdit = (record) => {
  visible.value = true
  type.value = 'edit'
  formData.label = record.label
}


const onCancel = () => {
  formRef.value.resetFields()
  visible.value = false
}
const onOk = () => {
  const data = { ...formData }

  if (type.value === 'add') {
    data.value = randomNumber()
    myActiveKey.value = data.value
    emit(type.value, data)
    emit('change', data.value, data.label)
    emit('update:activeKey', data.value)
    visible.value = false
  } else {
    formRef.value.validate().then(() => {
      data.value = myActiveKey.value
      emit(type.value, data)
      emit('change', data.value, data.label)
      visible.value = false
    })
  }
}

const change = () => {
  const item = props.options.find(item => item.value === myActiveKey.value)
  emit('change', myActiveKey.value, item.label)
  emit('update:activeKey', myActiveKey.value)
}

const menuClick = (e, record) => {
  if (e.key === 'edit') {
    onEdit(record)
  } else {
    Modal.confirm({
      title: '将会同步删除分组内的数据，确认删除？',
      onOk: () => {
        // activeKey 根据数据长度进行左右移动
        const index = props.options.findIndex(item => item.value === record.value)
        let label = ''

        if (index !== 0 && index === props.options.length - 1) {
          myActiveKey.value = props.options[index - 1].value
          label = props.options[index - 1].label
        } else if (index === 0 && props.options.length === 1) {
          myActiveKey.value = undefined
          label = undefined
        } else {
          myActiveKey.value = props.options[index + 1].value
          label = props.options[index + 1].label
        }

        emit('delete', record.value, index)
        emit('change', myActiveKey.value, label)
      },
    })
  }
}

const popContainer = (e) => {
  return tableWrapperRef.value || e
}

const modalContainer = (e) =>{
  if (isFullScreen()) {
    return tableWrapperRef.value || document.body
  }
  return document.body
}

onMounted(() => {
  myActiveKey.value = props.options[0]?.value
  emit('change', myActiveKey.value, props.options[0]?.label)
  emit('update:activeKey', myActiveKey.value)
})

watch(() => props.activeKey, (val) => {
  myActiveKey.value = val
})

</script>

<style scoped lang="less">
.table-group-warp {
  :deep(.ant-tabs-nav) {
    margin-bottom: 0;
    .ant-tabs-tab {
      overflow: hidden;
      position: relative;
    }
    .ant-tabs-tab-active {
      background-color: #BAE0FF !important;
      border-color: #91CAFF !important;

    }

    .ant-tabs-nav-add {
      border: none;
    }
  }
}

.table-group-error-warp {
  color: #1a1a1a !important;

  .table-group-error-target {
    position: absolute;
    right: 0;
    top: 0;
    border: 16px solid transparent;
    border-top-color: @error-color;
    border-right-width: 0;
    border-bottom-width: 0;
  }
}
</style>
