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
                    <span>{{ logData?.alarmName }}</span>
                    <span class="alarmType">{{
                        typeMap.get(logData?.targetType)
                    }}</span>
                </div>
                <div>
                    {{ logData.description || '暂无说明' }}
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
                        @click="dealAlarm"
                        >处理</a-button
                    >
                </div>
            </div>
        </div>
        <a-tabs v-model:activeKey="activeKey">
            <a-tab-pane key="record" tab="处理记录"
                ><Record :currentId="logData.id"
            /></a-tab-pane>
            <a-tab-pane key="logs" tab="告警日志"
                ><Log :currentId="logData.id" :configId="logData.alarmConfigId"
            /></a-tab-pane>
        </a-tabs>
    </a-drawer>
    <SolveComponent
        v-if="solveVisible"
        @closeSolve="closeSolve"
        :data="logData"
    />
</template>

<script setup name="LogDrawer">
import { useAlarmStore } from '@/store/alarm';
import { storeToRefs } from 'pinia';
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
});
const emit = defineEmits(['closeDrawer']);
const solveVisible = ref(false);
const alarmStore = useAlarmStore();
const { data } = storeToRefs(alarmStore);
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
