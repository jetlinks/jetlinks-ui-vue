<template>
  <div>
    <EditTable
      ref="tableRef"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :scroll="{ y: 300 }"
    >
      <template #value="{ record, index }">
        <EditableItem
          :name="[index, 'value']"
        >
          <a-input v-model:value="record.value" />
        </EditableItem>
      </template>
      <template #text="{ record, index }">
        <EditableItem
          :name="[index, 'text']"
        >
          <a-input v-model:value="record.text" />
        </EditableItem>
      </template>
      <template #action="{ index }">
        <a-button type="link"  @click="() => deleteItem(index)">
          <AIcon type="DeleteOutlined" />
        </a-button>
      </template>
    </EditTable>
    <a-button class="enum-table-add" @click="addItem">
      <template #icon><AIcon type="PlusOutlined" /></template>
      新增枚举项
    </a-button>
  </div>
</template>

<script setup name="EnumItemContent">
import EditTable from '../../Table.vue'
import EditableItem from '../../TableFormItem.vue'
import { Form } from "ant-design-vue";

const emit = defineEmits(['update:value', 'change'])
const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
});

const formItemContext = Form.useInjectFormItemContext();

const dataSource = ref(props.value || [])
const tableRef = ref()

const columns = [{
  title: 'Value',
  dataIndex: 'value',
  width: 150,
  form: {
    rules: [
      { max: 64, message: '最多可输入64个字符' },
      {
        asyncValidator: (rule, value, ...setting) => {
          const option = setting[2]
          if (!value) {
            return Promise.reject('请输入Value')
          }
          console.log(dataSource.value, value, option)
          if (dataSource.value.filter((_, index) => index !== option.index).some(item => item.value === value)) {
            return Promise.reject('该Value值已存在')
          }
          return Promise.resolve();
        }
      }
    ]
  },
},
  {
    title: 'Text',
    dataIndex: 'text',
    width: 150,
    form: {
      rules: [
        { required: true, message: '请输入Text' },
        { max: 64, message: '最多可输入64个字符' },
      ]
    }
  },
  {
    title: '操作',
    dataIndex: 'action',
    width: 60,
  },
]

const deleteItem = (index) => {
  dataSource.value.splice(index, 1)
  emit('update:value', dataSource.value)
  emit('change', dataSource.value)
  formItemContext.onFieldChange()
}

const addItem = () => {
  dataSource.value.push({
    value: undefined,
    text: undefined
  })
  emit('update:value', dataSource.value)
  emit('change', dataSource.value)
  formItemContext.onFieldChange()
}

defineExpose({
  validate: () => tableRef.value?.validate()
})

watch(
  () => JSON.stringify(props.value),
  () => {
    dataSource.value = props.value || [];
  },
);
</script>

<style scoped>
.enum-table-add {
  width: 100%;
  margin-top: 4px;
}
</style>
