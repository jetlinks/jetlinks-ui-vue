<template>
  <j-button type="link" style="padding-left: 0;" :disabled="disabled">
    <AIcon type="SettingOutlined" />
    {{ $t('components.ModelButton.6916340-0') }}
  </j-button>
</template>

<script setup name="ModelButton">
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()


const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>

</style>
