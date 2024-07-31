<template>
    <div>
        <a-tabs
            tab-position="left"
            v-model:activeKey="activeKey"
            :tabBarStyle="{ width: '200px' }"
        >
            <a-tab-pane key="alarm" tab="告警数据">
                <Alarm :goal="type" />
            </a-tab-pane>
            <a-tab-pane key="invalid" tab="无效数据">
                <Invalid :goal="type" />
            </a-tab-pane>
        </a-tabs>
    </div>
</template>

<script setup>
import Alarm from './Alarm/index.vue';
import Invalid from './Invalid/index.vue';
const props = defineProps({
    type: {
        type: String,
        default: 'device',
    },
});
const activeKey = ref('alarm');
</script>
<style lang="less" scoped></style>
