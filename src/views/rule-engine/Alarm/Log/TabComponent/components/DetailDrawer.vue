<template>
    <a-drawer
        :visible="true"
        width="700"
        :closable="false"
        @close="closeDrawer"
    >
        <div class="alarmInfo">
            <div>
                <div>
                    <span>{{ logData?.alarmName }}</span>
                    <span class="alarmType">{{
                        typeMap.get(logData?.targetType)
                    }}</span>
                </div>
                <div v-if="logData?.description">
                    {{ logData.description }}
                </div>
            </div>
            <div class="alarmInfoRight">
                <div>
                    {{
                        data.defaultLevel.find((i) => i.level === logData.level)
                            ?.title || logData.level
                    }}
                </div>
                <div>
                    <BadgeStatus
                        :status="logData.state.value"
                        :statusNames="{
                            warning: 'error',
                            normal: 'default',
                        }"
                    >
                    </BadgeStatus
                    ><span>
                        {{ logData.state.text }}
                    </span>
                    <a-button
                        v-if="logData.state.value === 'warning'"
                        type="link"
                        >处理</a-button
                    >
                </div>
            </div>
        </div>
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="record" tab="处理记录"><Record /></a-tab-pane>
            <a-tab-pane key="logs" tab="告警日志" force-render
                >Content of Tab Pane 2</a-tab-pane
            >
        </a-tabs>
    </a-drawer>
</template>

<script lang="ts" setup name="LogDrawer">
import { useAlarmStore } from '@/store/alarm';
import { storeToRefs } from 'pinia';
import Record from './Record.vue';
const props = defineProps({
    logData: {
        type: Object,
        default: {},
    },
    typeMap: {
        type: Object,
        default: {},
    },
});
const emit = defineEmits(['closeDrawer']);
const alarmStore = useAlarmStore();
const { data } = storeToRefs(alarmStore);
const activeKey = ref('record');
const closeDrawer = () => {
    emit('closeDrawer');
};
</script>
<style lang="less" scoped>
.alarmInfo {
    display: flex;
    justify-content: space-between;
    .alarmType {
        background-color: rgb(242, 242, 242);
        padding: 0 10px;
        margin-left: 10px;
    }
    .alarmInfoRight {
        text-align: right;
    }
}
</style>
