<template>
  <div>
    <a-checkbox
        :checked="data._granted"
        :indeterminate="data.indeterminate"
        :disabled='data.code === USER_CENTER_MENU_CODE'
        @change="menuChange"
    >{{ data.i18nName || data.name }}</a-checkbox>
  </div>
</template>

<script setup>
import {USER_CENTER_MENU_CODE} from "@jetlinks-web-core/utils/consts";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['change'])

const menuChange = (e) => {
  emit('change', e.target.checked)
}
</script>

<style lang="less" scoped>

</style>
