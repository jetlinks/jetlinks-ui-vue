<template>
  <a-button type="link" style="padding-left: 0;" :disabled="disabled">
    <AIcon type="SettingOutlined" />
    {{$t('Base.Base.640395-11')}}
  </a-button>
</template>

<script setup name="ModelButton">

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>

</style>
