<template>
    <div>
        <a-tabs
            tab-position="left"
            style="height: 500px"
            v-model:activeKey="activeKey"
            :tabBarStyle="{ width: '200px' }"
        >
            <a-tab-pane key="alarm" tab="告警数据">
                <Alarm />
            </a-tab-pane>
            <a-tab-pane key="invalid" tab="无效数据">
                <Invalid />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import Alarm from './Alarm/index.vue';
const activeKey = ref('alarm');
</script>
<style lang="less" scoped></style>
