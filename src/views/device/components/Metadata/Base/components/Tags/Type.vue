<template>
  <j-select
      v-model:value="myValue"
      mode="multiple"
      :options="[
        { label: $t('Tags.Type.6916229-0'), value: 'read'},
        { label: $t('Tags.Type.6916229-1'), value: 'write'},
        { label: $t('Tags.Type.6916229-2'), value: 'report'},
      ]"
      :dropdownStyle="{
        zIndex: 1071
      }"
      :get-popup-container="(node) => fullRef || node"
      :placeholder="$t('Tags.Type.6916229-3')"
      @change="onChange"
  />
</template>

<script setup lang="ts">
import { FULL_CODE } from 'jetlinks-ui-components/es/DataTable'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()


type Emit = {
(e: 'update:value', data: any): void
}

const props = defineProps({
  value: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits<Emit>()
const fullRef = inject(FULL_CODE);
const myValue = ref<Array<string>>([])

const onChange = () =>{
  const _data = {
    ...props.value
  }

  _data.expands['type'] = myValue.value

  emit('update:value', {
    ..._data
  })
}

watch(() => props.value.expands, () => {
  myValue.value = props.value?.expands?.type
}, { immediate: true})

</script>

<style scoped>

</style>
