<template>
  <j-button type="dashed" block>
    <j-popover placement="left" trigger="click">
      <template #title>
        <div class="edit-title" style="display: flex; justify-content: space-between; align-items: center;">
          <div style="width: 150px;">{{ config.name }}</div>
        </div>
      </template>
      <template #content>
        <div style="max-width: 400px;" class="ant-form-vertical">
          <j-form-item v-for="item in config.properties" :key="item.property" :name="name.concat([item.property])" :label="item.name">
            <!-- <template v-if='item.type?.type === "string"'>
              <j-input v-model:value='value[item.property]' size="small" :placeholder="`请输入${item.name}`"/>
            </template>
            <template v-else-if='item.type?.type === "int"'>
              <j-input-number style="width: 100%;" v-model:value='value[item.property]' size="small" :placeholder="`请输入${item.name}`"/>
            </template>
            <j-select v-else :mode="item.type?.multi ? 'multiple' : ''" v-model:value="value[item.property]" :options="item.type?.elements?.map((e: { 'text': string, 'value': string }) => ({
              label: e.text,
              value: e.value,
            }))" size="small" :placeholder="`请输入${item.name}`"></j-select> -->
            <ValueItem
                v-model:modelValue="value[item.property]"
                :itemType="item.type?.type"
                :mode="item?.type?.multi ? 'multiple' : ''"
                :options="
                    item.type?.elements?.map(e => ({
                      label: e.text,
                      value: e.value,
                    }))
                "
            />
          </j-form-item>
        </div>
      </template>
      {{ config.name || '存储配置' }}
      <AIcon type="EditOutlined" class="item-icon" />
    </j-popover>
  </j-button>
</template>
<script setup lang="ts" name="ConfigParam">
import { PropType } from 'vue';

type ValueType = Record<any, any>;
const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  },
  name: {
    type: Array as PropType<(string | number)[]>,
    default: () => ([]),
    required: true
  },
  config: {
    type: Array as PropType<ValueType>,
    default: () => ({ properties: [] })
  }
})

// interface Emits {
//   (e: 'update:value', data: string | undefined): void;
// }
// const emit = defineEmits<Emits>()

// const _value = computed({
//   get: () => props.value,
//   set: (val: string | undefined) => {
//     emit('update:value', val)
//   }
// })
</script>
<style lang="less" scoped>
.item-icon {
  color: rgb(136, 136, 136);
  font-size: 12px;
}

:deep(.ant-form-item-label) {
  >label {
    font-size: 12px;
  }
}

:deep(.ant-select) {
  font-size: 12px;
}

:deep(input) {
  height: 22px;
}</style>