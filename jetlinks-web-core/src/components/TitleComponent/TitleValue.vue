<template>
  <div class="title-value">
    <div class="title">
      <slot name="title">
        <template v-if="title">
          {{ title }}
        </template>
        <template v-else>
          <AIcon class="icon" type="icon-ID"/>
        </template>
      </slot>
    </div>
    <div class="value">
      <j-ellipsis v-if="ellipsis !== false">
        <slot/>
      </j-ellipsis>
      <template v-else>
        <slot/>
      </template>
    </div>
  </div>
</template>

<script setup>
defineOptions({
  name: 'TitleValue'
})

defineProps({
  title: {
    type: String
  },
  ellipsis: {
    type: Boolean,
    default: true
  }
})
</script>

<style scoped lang="less">
.title-value {
  display: flex;
  gap: .5rem;

  .title {
    color: @font-gray-500;
    white-space: nowrap;

    .icon {
      color: @primary-color;
    }
  }

  .value {
    flex: 1 1 0;
    color: @font-gray-600;
  }
}
</style>
