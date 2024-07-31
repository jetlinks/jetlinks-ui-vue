<template>
    <a-drawer
        :visible="true"
        width="1000"
        :destroyInactiveTabPane="true"
        @close="closeDrawer"
    >
        <template #title>
            <div class="alarmInfo">
                <div>
                    <div class="alarmTitle">
                        <span class="alarmType">{{
                            typeMap.get(AlarmData?.targetType)
                        }}</span>
                        <div>
                            <Ellipsis style="max-width: 100px">{{
                                AlarmData?.alarmName
                            }}</Ellipsis>
                        </div>
                        <LevelIcon :level="AlarmData.level"></LevelIcon>
                    </div>
                </div>
                <div class="alarmInfoRight">
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
        </template>
        <div>
            {{ AlarmData?.description || '暂无说明' }}
        </div>
        <a-radio-group
            v-model:value="activeKey"
            button-style="solid"
            style="margin: 20px 0"
        >
            <a-radio-button value="record">处理记录</a-radio-button>
            <a-radio-button value="logs">告警日志</a-radio-button>
        </a-radio-group>
        <Record
            :currentId="AlarmData.id"
            ref="RecordRef"
            v-if="activeKey === 'record'"
        ></Record>
        <Log
            :currentId="AlarmData.id"
            :configId="AlarmData.alarmConfigId"
            v-else
        />
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
        background-color: #e6f4ff;
        padding: 2px 8px;
        margin-right: 10px;
        color: #1677ff;
    }
    .alarmTitle {
        display: flex;
    }
    .alarmInfoRight {
        text-align: right;
    }
}
</style>
