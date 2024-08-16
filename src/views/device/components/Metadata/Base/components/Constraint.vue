<template>
  <j-select
    v-model:value="myValue"
    style="width: 100%;"
    :dropdownMenuStyle="{
                zIndex: 1072
              }"
    :options="[
        { label: $t('components.Constraint.6916447-0'), value: 'false'},
        { label: $t('components.Constraint.6916447-1'), value: 'true'},
    ]"
    @change="change"
  >

  </j-select>
</template>

<script setup name="ConstraintSelect">
import {FULL_CODE} from "jetlinks-ui-components/es/DataTable";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()


const props = defineProps({
  value: {
    type: Boolean,
    default: true
  },
})

const emit = defineEmits(['update:value'])
const fullRef = inject(FULL_CODE);

const myValue = ref()

const change = (e) => {
  emit('update:value', myValue.value === 'true')
}

watch(() => props.value, () => {
  myValue.value = props.value === true ? 'true' : 'false'
}, { immediate: true })

</script>

<style scoped>

</style>
