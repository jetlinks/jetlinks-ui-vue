<template>
  <PopoverModal
    v-model:visible="visible"
    :placement="placement"
    @ok="onOk"
    @cancel="onCancel"
  >
    <template #content>
      <div style="width: 450px">
        <EditTable
          ref="tableRef"
          :columns="columns"
          :dataSource="dataSource"
          :pagination="false"
          :height="200"
        >
          <template v-for="(_, key) in slots" :key="key" #[key]="slotData">
            <slot :name="key" v-bind="slotData"/>
          </template>
        </EditTable>
        <a-button style="width: 100%;margin-top: 4px" @click="addItem">
          <template #icon><AIcon type="PlusOutlined" /></template>
          新增
        </a-button>
      </div>
    </template>
    <slot><AIcon type="EditTwoTone"/></slot>
  </PopoverModal>
</template>

<script setup name="MetadataObject">
import { PopoverModal } from '../index'
import EditTable from '../../Table.vue'

const props = defineProps({
  value: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array,
    default: () => [],
  },
  placement: {
    type: String,
    default: 'top',
  },
});

const emit = defineEmits(['update:value', 'confirm', 'cancel']);

const slots = useSlots()

const tableRef = ref()
const dataSource = ref(props.value)
const visible = ref(false)

const onOk = async () => {
  const data = await tableRef.value.validate()
  if (data) {
    visible.value = false
    emit('update:value', data)
    emit('confirm', data)
  }
}

const onCancel = () => {
  emit('cancel');
};

const deleteItem = (index) => {
  dataSource.value.splice(index, 1)
}

const addItem = () => {
  dataSource.value.push({
    value: undefined,
    text: undefined
  })
}

watch(() => JSON.stringify(props.value), () => {
  dataSource.value = props.value
})

</script>

<style scoped>

</style>
