<script setup name="Alarm">
import {useI18n} from "vue-i18n";

defineProps({
  data: {
    type: Object,
    default: () => ({}),
  },
  options: {
    type: Object,
  }
})
const emit = defineEmits(['visibleChange'])
const {t: $t} = useI18n();
const onVisibleChange = () => {
  emit('visibleChange', true)
}
</script>

<template>
  <span>
    {{ data?.alarm?.mode === 'trigger' ? $t('ListItem.Item.637563-0') :$t('ListItem.Item.637563-2') }}
  </span>
  <a-button
    style="padding: 0"
    type="link"
    @click.stop="onVisibleChange"
  >
    {{ $t('ListItem.Item.637563-1') }}
  </a-button>
</template>

<style scoped lang="less">

</style>
