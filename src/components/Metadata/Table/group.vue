<template>
  <a-tabs type="editable-card" v-model:activeKey="myActiveKey" @edit="onAdd" @change="change">
    <a-tab-pane v-for="item in options" :key="item.value" :closable="false">
      <template #tab>
        <a-dropdown
          v-if="myActiveKey === item.value"
          :trigger="['click']"
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
          <div >
            {{ item.label }}
          </div>
        </a-dropdown>
        <div v-else>
          {{ item.label }}
        </div>
      </template>
    </a-tab-pane>
  </a-tabs>
  <a-modal
    :visible="visible"
    :title="type === 'add' ? '新增分组' : '编辑分组'"
    @cancel="onCancel"
    @ok="onOk"
  >
    <a-form ref="formRef" :model="formData">
      <a-form-item name="label" :rules="[{ required: true, message: '请输入分组名称'}, { max: 16, message: '最大可输入16个字符'}]">
        <a-input v-model:value="formData.label" placeholder="请输入分组名称"/>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup name="MetadataBaseTableGroup">

import {Modal} from "ant-design-vue";
import {randomNumber} from "@/utils/utils";

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

const formRef = ref()
const formData = reactive({
  label: undefined
})

const onAdd = (targetKey, action) => {
  if (action === 'add') {
    visible.value = true
    type.value = 'add'
    formData.label = undefined
  }
}

const onEdit = (record) => {
  visible.value = true
  type.value = 'edit'
  formData.label = record.label
}


const onCancel = () => {
  formRef.value.resetFields()
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

        if (index !== 0 && index === props.options.length - 1) {
          myActiveKey.value = props.options[index - 1].value
        } else if (index === 0 && props.options.length === 1) {
          myActiveKey.value = undefined
        } else {
          myActiveKey.value = props.options[index + 1].value
        }

        emit('delete', record.value, index)
      },
    })
  }
}

onMounted(() => {
  myActiveKey.value = props.options[0]?.value
  emit('change', myActiveKey.value, props.options[0]?.label)
  emit('update:activeKey', myActiveKey.value)
})

</script>

<style scoped>

</style>
