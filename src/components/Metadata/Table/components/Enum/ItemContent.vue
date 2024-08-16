<template>
  <div>
    <EditTable
      ref="tableRef"
      rowKey="value"
      :columns="columns"
      :dataSource="dataSource"
      :pagination="false"
      :height="200"
      :disableMenu="false"
      :validateRowKey="true"
    >
      <template #value="{ record, index }">
        <EditTableFormItem
          :name="[index, 'value']"
        >
          <a-input v-model:value="record.value" @change="valueChange"/>
        </EditTableFormItem>
      </template>
      <template #text="{ record, index }">
        <EditTableFormItem
          :name="[index, 'text']"
        >
          <a-input v-model:value="record.text" @change="valueChange"/>
        </EditTableFormItem>
      </template>
      <template #action="{ index }">
        <a-button danger type="link"  @click="() => deleteItem(index)">
          <template #icon>
            <AIcon type="DeleteOutlined" />
          </template>
        </a-button>
      </template>
    </EditTable>
    <a-button class="enum-table-add" @click="addItem">
      <template #icon><AIcon type="PlusOutlined" /></template>
      {{ $t('Enum.ItemContent.4348658-0') }}
    </a-button>
  </div>
</template>

<script setup name="EnumItemContent">
import EditTable from '../../Table.vue'
import EditTableFormItem from '../../TableFormItem.vue'
import { Form } from "ant-design-vue";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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
  form: {
    rules: [
      { max: 64, message: $t('Enum.ItemContent.4348658-1') },
      {
        asyncValidator: (rule, value, ...setting) => {
          const option = setting[2]

          if (!value) {
            return Promise.reject($t('Enum.ItemContent.4348658-2'))
          }

          const isSome = dataSource.value.some((item) => {
            return item.__dataIndex !== option.index && item.value === value
          })

          if (isSome) {
            return Promise.reject($t('Enum.ItemContent.4348658-3'))
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
        { required: true, message: $t('Enum.ItemContent.4348658-4') },
        { max: 64, message: $t('Enum.ItemContent.4348658-1') },
      ]
    }
  },
  {
    title: $t('Enum.ItemContent.4348658-5'),
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

const valueChange = () => {
  emit('update:value', dataSource.value)
  emit('change', dataSource.value)
  formItemContext.onFieldChange()
}

const validate = async () => {
  const res = await tableRef.value?.validate()
  return res
}

defineExpose({
  validate
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
