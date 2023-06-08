<template>
    <div style="margin-top: 24px;">
        <j-tabs tab-position="left">
            <j-tab-pane v-for="item in tabs" :key="item.key" :tab="item.tab"><NotificationRecord /></j-tab-pane>
        </j-tabs>
    </div>
</template>

<script lang="ts" setup>
import NotificationRecord from './components/NotificationRecord/index.vue'

const tabs = [
    {
        key: '1',
        tab: '告警'
    },
    {
        key: '2',
        tab: '系统运维'
    },
    {
        key: '3',
        tab: '业务监控'
    }
]
</script>