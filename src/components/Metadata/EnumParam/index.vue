<template>
  <div class="enum-param">
    <div class="list-item" v-for="(item, index) in _value" :key="index">
      <div class="item-left">
        <menu-outlined class="item-drag item-icon" />
      </div>
      <div class="item-middle item-editable">
        <a-popover :visible="editIndex === index" placement="top">
          <template #title>
            <div class="edit-title" style="display: flex; justify-content: space-between; align-items: center;">
              <div style="width: 150px;">枚举项配置</div>
              <close-outlined @click="handleClose" />
            </div>
          </template>
          <template #content>
            <a-form :model="_value[index]" layout="vertical">
              <a-form-item label="Value" name="value" :rules="[
                { required: true, message: '请输入Value' },
              ]">
                <a-input v-model:value="_value[index].value" size="small"></a-input>
              </a-form-item>
              <a-form-item label="Text" name="text" :rules="[
                { required: true, message: '请输入Text' },
              ]">
                <a-input v-model:value="_value[index].text" size="small"></a-input>
              </a-form-item>
            </a-form>
          </template>
          <div class="item-edit" @click="handleEdit(index)">
            {{ item.text || '枚举项配置' }}
            <edit-outlined class="item-icon" />
          </div>
        </a-popover>
      </div>
      <div class="item-right">
        <delete-outlined @click="handleDelete(index)"/>
      </div>
    </div>
    <a-button type="dashed" block @click="handleAdd">
      <template #icon><plus-outlined class="item-icon" /></template>
      新增枚举型
    </a-button>
  </div>
</template>
<script setup lang="ts" name="BooleanParam">
import { PropType } from 'vue'
import { MenuOutlined, EditOutlined, DeleteOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';

type EnumType = {
  text?: string,
  value?: string,
}

interface Emits {
  (e: 'update:value', data: EnumType[]): void;
}
const emit = defineEmits<Emits>()
const props = defineProps({
  value: {
    type: Object as PropType<EnumType[]>,
    default: () => ([])
  }
})

const _value = ref<EnumType[]>([])
watchEffect(() => {
  _value.value = props.value
})

watch(_value,
() => {
  emit('update:value', _value.value)
},
{ deep: true })

const editIndex = ref<number>(-1)
const handleEdit = (index: number) => {
  editIndex.value = index
}
const handleDelete = (index: number) => {
  editIndex.value = -1
  _value.value.splice(index, 1)
}
const handleClose = () => {
  editIndex.value = -1
}
const handleAdd = () => {
  _value.value.push({})
  emit('update:value', _value.value)
}
</script>
<style lang="less" scoped>
.enum-param {
  .list-item {
    border: 1px solid #f0f0f0;
    display: flex;
    justify-content: space-between;
    color: rgba(0, 0, 0, 0.85);
    padding: 3px 6px;
    margin-bottom: 10px;
    background-color: #fff;
    line-height: 26px;
    font-size: 14px;

    // .item-left {
    //   .item-drag {
    //     cursor: move;
    //   }
    // }
    .item-edit {
      cursor: pointer;
    }

    .item-icon {
      color: rgb(136, 136, 136);
      font-size: 12px;
    }
  }
}

:deep(.ant-form-item-label) {
  line-height: 1;

  >label {
    font-size: 12px;

    &.ant-form-item-required:not(.ant-form-item-required-mark-optional)::before {
      font-size: 12px;
    }
  }
}

:deep(.ant-form-item-explain) {
  font-size: 12px;
}

:deep(.ant-form-item-with-help) {
  .ant-form-item-explain {
    min-height: 20px;
    line-height: 20px;
  }
}

:deep(.ant-form-item) {
  margin-bottom: 20px;

  &.ant-form-item-with-help {
    margin-bottom: 0;
  }

  input {
    font-size: 12px;
  }
}

:deep(.ant-input),
:deep(.ant-select) {
  font-size: 12px;
}
</style>