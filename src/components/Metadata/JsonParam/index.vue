<template>
  <div class="json-param">
    <div class="list-item" v-for="(item, index) in _value" :key="`object_${index}`">
      <div class="item-left">
        <menu-outlined class="item-drag item-icon" />
      </div>
      <div class="item-middle item-editable">
        <a-popover :visible="editIndex === index" placement="left">
          <template #title>
            <div class="edit-title" style="display: flex; justify-content: space-between; align-items: center;">
              <div style="width: 150px;">配置参数</div>
              <close-outlined @click="handleClose" />
            </div>
          </template>
          <template #content>
            <div style="max-width: 400px;">
              <a-form :model="_value[index]" layout="vertical">
                <a-form-item label="标识" name="id" :rules="[
                  { required: true, message: '请输入标识' },
                  { max: 64, message: '最多可输入64个字符' },
                  {
                    pattern: /^[a-zA-Z0-9_]+$/,
                    message: '请输入英文或者数字或者-或者_',
                  },
                ]">
                  <a-input v-model:value="_value[index].id" size="small"></a-input>
                </a-form-item>
                <a-form-item label="名称" name="name" :rules="[
                  { required: true, message: '请输入名称' },
                  { max: 64, message: '最多可输入64个字符' },
                ]">
                  <a-input v-model:value="_value[index].name" size="small"></a-input>
                </a-form-item>
                <value-type-form v-model:value="_value[index].valueType" :name="['valueType']" isSub
                  key="json_sub"></value-type-form>
              </a-form>
            </div>
          </template>
          <div class="item-edit" @click="handleEdit(index)">
            {{ item.name || '配置参数' }}
            <edit-outlined class="item-icon" />
          </div>
        </a-popover>
      </div>
      <div class="item-right">
        <delete-outlined @click="handleDelete(index)" />
      </div>
    </div>
    <a-button type="dashed" block @click="handleAdd">
      <template #icon><plus-outlined class="item-icon" /></template>
      添加参数
    </a-button>
  </div>
</template>
<script setup lang="ts" name="JsonParam">
import { PropType } from 'vue'
import { MenuOutlined, EditOutlined, DeleteOutlined, PlusOutlined, CloseOutlined } from '@ant-design/icons-vue';
import ValueTypeForm from '@/views/device/components/Metadata/Base/Edit/ValueTypeForm.vue';

type JsonType = Record<any, any>;

interface Emits {
  (e: 'update:value', data: JsonType[]): void;
}
const emit = defineEmits<Emits>()
const props = defineProps({
  value: {
    type: Object as PropType<JsonType[]>,
    default: () => ([])
  }
})

const _value = ref<JsonType[]>([])
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
  _value.value.push({
    valueType: {
      expands: {}
    },
  })
  emit('update:value', _value.value)
}
</script>
<style lang="less" scoped>
.json-param {
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