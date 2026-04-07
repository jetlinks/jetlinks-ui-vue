<script setup name="Collector">
import {useI18n} from "vue-i18n";

const props = defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
})
const {t: $t} = useI18n();
</script>

<template>
  <a-space>
    <span>{{data?.options?.type}}</span>
    <span>
                  <AIcon type="icon-mubiao" style="padding: 0 4px" />
                  <span>{{data?.options?.triggerName}}</span>
                </span>
    <span>{{data?.options?.pointName}}</span>
    <template v-if="data.collector?.handlerType === 'write'">
      <span>为</span>
      <span>{{data?.options?.propertiesName}}</span>
    </template>
  </a-space>
</template>

<style scoped lang="less">

</style>
