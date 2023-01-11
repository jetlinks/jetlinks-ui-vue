<template>
  <div class='JSearch-content'>
    <div class='left'>
      <SearchItem :index='1' />
      <SearchItem :index='2' />
      <SearchItem :index='3' />
    </div>
    <div class='center'>
      <a-select
        :options='typeOptions'
      />
    </div>
    <div class='right'>
      <SearchItem :index='4' />
      <SearchItem :index='5' />
      <SearchItem :index='6' />
    </div>
  </div>
</template>

<script setup lang='ts' name='Search'>
import SearchItem from './Item.vue'
import { typeOptions } from './util'

const props = defineProps({
  defaultParams: {
    type: Object,
    default: () => ({})
  },
  columns: {
    type: Array,
    default: () => []
  },
  type: {
    type: String,
    default: 'advanced'
  },
  key: {
    type: String,
    default: '',
    required: true
  }
})

const searchParams = reactive({
  data: {}
})

</script>

<style scoped lang='less'>
.JSearch-content {
  display: flex;
  gap: 16px;
  .left, & .right {
    display: flex;
    gap: 16px;
    flex-direction: column;
    width: 0;
    flex-grow: 1;
    min-width: 0;
  }

  .center {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-basis: 120px;
  }
}
</style>