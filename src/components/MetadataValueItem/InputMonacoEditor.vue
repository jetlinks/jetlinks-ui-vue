<template>
  <a-input v-model:value="_value" readOnly :placeholder="$t('MetadataValueItem.index.6754398-1')">
    <template #addonAfter>
      <a-button type="text" size="small" @click="visible = true">
        <AIcon type="EditOutlined"/>
      </a-button>
    </template>
  </a-input>
  <a-modal v-model:open="visible" :title="$t('CrudTable.index.150716-2')" @ok="onSave" @cancel="visible = false">
    <monaco-editor
        v-model:modelValue="_value"
        theme="vs"
        style="height: 300px"
    />
  </a-modal>
</template>

<script setup>
import {onlyMessage} from "@jetlinks-web/utils";
import {isObject} from "lodash-es";
import {useI18n} from "vue-i18n";

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  type: {
    type: String,
    default: 'array'
  }
})
const emits = defineEmits(['update:modelValue'])
const { t: $t } = useI18n();
const _value = ref()
const visible = ref(false)
const onSave = () => {
  try {
    const _json = JSON.parse(_value.value)
    if(props.type === 'array' && !Array.isArray(_json)) {
      onlyMessage($t('MetadataValueItem.index.6754398-3'), 'error')
      return
    } else if(props.type === 'object' && !isObject(_json)) {
      onlyMessage($t('MetadataValueItem.index.6754398-4'), 'error')
      return
    } else {
      emits('update:modelValue', _json)
      emits('change', _json)
      visible.value = false
    }
  } catch (e) {
    onlyMessage(props.type === 'array' ? $t('MetadataValueItem.index.6754398-3') : $t('MetadataValueItem.index.6754398-4'), 'error')
  }
}

watch(() => props.modelValue, (val) => {
  _value.value =  val ? JSON.stringify(val) : undefined
}, {
  immediate: true,
  deep: true
})
</script>

<style lang="less" scoped>

</style>
