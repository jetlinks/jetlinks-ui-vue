<template>
    <a-drawer
        visible
        :closable="false"
        width="1000"
        @close="closeDrawer"
        :destroyInactiveTabPane="true"
    >
        <div class="alarmInfo">
            <div class="title">告警日志</div>
            <div class="alarmInfoRight">
                <div>
                    {{ levelMap?.[AlarmData?.level] || AlarmData?.level }}
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
        <Log :currentId="AlarmData.id" :configId="AlarmData.alarmConfigId" :goal="goal"/>
    </a-drawer>
    <SolveComponent
        v-if="solveVisible"
        @closeSolve="closeSolve"
        @refresh="refresh"
        :goal="goal"
        :data="AlarmData"
    />
</template>

<script setup>
import { queryLevel } from '@/api/rule-engine/config';
import Log from '@/views/rule-engine/Alarm/Log/TabComponent/components/Log.vue';
import SolveComponent from '@/views/rule-engine/Alarm/Log/SolveComponent/index.vue';
import { useAlarmLevel } from '@/hook';
const props = defineProps({
    data: {
        type: Object,
        default: {},
    },
    goal:{
        type:String,
        default:''
    }
});
const emit = defineEmits(['closeDrawer', 'refreshTable']);
const { levelMap } = useAlarmLevel();
const solveVisible = ref(false);
const AlarmData = computed(()=>{
    return props.data
})
const closeDrawer = () => {
    emit('closeDrawer');
};
const closeSolve = () => {
    solveVisible.value = false;
};
const refresh = () => {
    solveVisible.value = false;
    emit('refreshTable');
};
const dealAlarm = () => {
    solveVisible.value = true;
};

</script>
<style lang="less" scoped>
.alarmInfo {
    display: flex;
    justify-content: space-between;
}
</style>
