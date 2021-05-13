<template>
  <div>
    <span>
      <a-badge v-if="badgeStatus" :status="badgeStatus" :text="badgeText" />
      {{ !badgeStatus? badgeText : '' }}
    </span>
    <p :style="{ fontSize: '26px' }">{{ showData }}</p>
  </div>
</template>

<script>
  export default {
    name: 'InsInfo',
    props: {
      badgeStatus: {
        type: String,
        default: ''
      },
      badgeText: {
        type: String,
        default: ''
      },
      showData: {
        type: Number,
        default: 0
      }
    }
  }
</script>

<style lang="scss" scoped>

</style>
