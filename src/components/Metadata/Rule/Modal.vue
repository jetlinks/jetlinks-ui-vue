<template>
  <j-modal
      :mask-closable="false"
      visible width="70vw"
      :title="$t('Rule.Modal.4348541-0')"
      @cancel="handleCancel"
      @ok="handleOk"
  >

  </j-modal>
</template>

<script setup lang="ts" name="RuleModal">
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const handleCancel = () => {

}

const handleOk = () => {

}

</script>

<style scoped>

</style>