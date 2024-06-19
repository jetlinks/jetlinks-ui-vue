<template>
    <a-drawer
        :visible="true"
        width="1000"
        :closable="false"
        :destroyInactiveTabPane="true"
        @close="closeDrawer"
    >
        <div class="alarmInfo">
            <div>
                <div>
                    <span>{{ AlarmData?.alarmName }}</span>
                    <span class="alarmType">{{
                        typeMap.get(AlarmData?.targetType)
                    }}</span>
                </div>
                <div>
                    {{ AlarmData?.description || '暂无说明' }}
                </div>
            </div>
            <div class="alarmInfoRight">
                <div>
                    {{
                        levelMap?.[AlarmData?.level] || AlarmData?.level
                    }}
                </div>
                <div>
                    <BadgeStatus
                        :status="AlarmData?.state.value"
                        :statusNames="{
                            warning: 'error',
                            normal: 'default',
                        }"
                    >
                    </BadgeStatus
                    ><span>
                        {{ AlarmData?.state.text }}
                    </span>
                    <a-button
                        v-if="AlarmData?.state.value === 'warning'"
                        type="link"
                        @click="dealAlarm"
                        >处理</a-button
                    >
                </div>
            </div>
        </div>
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="record" tab="处理记录"
                ><Record :currentId="AlarmData.id" ref="RecordRef"
            /></a-tab-pane>
            <a-tab-pane key="logs" tab="告警日志"
                ><Log
                    :currentId="AlarmData.id"
                    :configId="AlarmData.alarmConfigId"
            /></a-tab-pane>
        </a-tabs>
    </a-drawer>
    <SolveComponent
        v-if="solveVisible"
        @closeSolve="closeSolve"
        @refresh="refresh"
        :data="AlarmData"
    />
</template>

<script setup name="LogDrawer">
import { query } from '@/api/rule-engine/log';
import Record from './Record.vue';
import Log from './Log.vue';
import SolveComponent from '../../SolveComponent/index.vue';
const props = defineProps({
    logData: {
        type: Object,
        default: {},
    },
    typeMap: {
        type: Object,
        default: {},
    },
    levelMap: {
        type: Object,
        default: {},
    },
});
const emit = defineEmits(['closeDrawer', 'refreshTable']);
const solveVisible = ref(false);
const RecordRef = ref();
const AlarmData = ref(props.logData);
const activeKey = ref('record');
const closeDrawer = () => {
    emit('closeDrawer');
};
const dealAlarm = () => {
    solveVisible.value = true;
};
const closeSolve = () => {
    solveVisible.value = false;
};

const refresh = async () => {
    solveVisible.value = false;
    const res = await query({
        terms: [
            {
                column: 'id',
                value: props.logData.id,
                type: 'and',
            },
        ],
    });
    if (res.success) {
        AlarmData.value = res.result.data[0];
        if (activeKey.value === 'record') {
            RecordRef?.value.refreshRecord();
        }
    }
    emit('refreshTable');
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
