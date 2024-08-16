<template>
  <div class="enum-param">
    <div class="list-item" v-for="(item, index) in _value" :key="index">
      <div class="item-left">
        <AIcon type="MenuOutlined" class="item-drag item-icon" />
      </div>
      <div class="item-middle item-editable">
        <j-popover :visible="editIndex === index" placement="left">
          <template #title>
            <div class="edit-title" style="display: flex; justify-content: space-between; align-items: center;">
              <div style="width: 150px;">{{ $t('EnumParam.index.4348660-0') }}</div>
              <div @click="handleClose"><AIcon type="CloseOutlined" /></div>
            </div>
          </template>
          <template #content>
            <div class="ant-form-vertical">
              <j-form-item label="Value" :name="name.concat([index, 'value'])" :rules="[
                { required: true, message: $t('EnumParam.index.4348660-1') },
                { max: 64, message: $t('EnumParam.index.4348660-2') },
              ]">
                <j-input v-model:value="_value[index].value" size="small" :placeholder="$t('EnumParam.index.4348660-1')"></j-input>
              </j-form-item>
              <j-form-item label="Text" :name="name.concat([index, 'text'])" :rules="[
                { required: true, message: $t('EnumParam.index.4348660-3') },
                { max: 64, message: $t('EnumParam.index.4348660-2') },
              ]">
                <j-input v-model:value="_value[index].text" size="small" :placeholder="$t('EnumParam.index.4348660-3')"></j-input>
              </j-form-item>
            </div>
          </template>
          <div class="item-edit" @click="handleEdit(index)">
            <Ellipsis>{{ item.text || $t('EnumParam.index.4348660-0') }}</Ellipsis>
            <AIcon type="EditOutlined" class="item-icon" />
          </div>
        </j-popover>
      </div>
      <div class="item-right">
        <AIcon type="DeleteOutlined" @click="handleDelete(index)" />
      </div>
    </div>
    <j-button type="dashed" block @click="handleAdd">
      <template #icon>
        <AIcon type="PlusOutlined" class="item-icon" />
      </template>
      {{ $t('EnumParam.index.4348660-4') }}
    </j-button>
  </div>
</template>
<script setup lang="ts" name="BooleanParam">
import { PropType } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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
  },
  name: {
    type: Array as PropType<(string | number)[]>,
    default: () => ([])
  }
})

const _value = ref<EnumType[]>([])
watchEffect(() => {
  _value.value = props.value || ([{}])
})

watch(_value,
  () => {
    emit('update:value', _value.value)
  },
  { deep: true, immediate: true })

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
      display: flex;
      justify-content: center;
      align-items: center;
      max-width: 240px;
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

:deep(input) {
  height: 22px;
}
</style>