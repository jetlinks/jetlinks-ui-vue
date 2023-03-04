<template>
    <div>
        <TabComponent type="detail" :id="id"/>
    </div>
</template>

<script lang="ts" setup>
import TabComponent from '@/views/rule-engine/Alarm/Log/TabComponent/indev.vue'
import { useRoute } from 'vue-router';
const route = useRoute();
const id = route.query?.id
</script>
<style lang="less" scoped>
</style>