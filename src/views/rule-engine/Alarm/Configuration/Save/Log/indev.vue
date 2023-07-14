<template>
    <div>
        <TabComponent :id="id" :type="type"/>
    </div>
</template>

<script lang="ts" setup>
import TabComponent from '@/views/rule-engine/Alarm/Log/TabComponent/index.vue'
import { useRoute } from 'vue-router';
const route = useRoute();
const id = route.query?.id

const props = defineProps({
  type: {
    type: String,
    default: 'detail'
  }
})
</script>
<style lang="less" scoped>
</style>