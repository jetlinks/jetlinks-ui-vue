<template>
    <a-drawer
        open
        :closable="false"
        width="1000"
        @close="closeDrawer"
        :destroyInactiveTabPane="true"
    >
        <div class="alarmInfo">
            <div class="title">{{ $t('components.AlarmLog.345792-0') }}</div>
            <div class="alarmInfoRight">
                <div>
                    <j-badge-status
                        :status="AlarmData?.state.value"
                        :statusNames="{
                            warning: 'error',
                            normal: 'default',
                        }"
                    >
                    </j-badge-status
                    ><span>
                        {{ AlarmData?.state.text }}
                    </span>
                    <j-permission-button
                        v-if="AlarmData?.state.value === 'warning'"
                        type="link"
                        hasPermission="rule-engine/Alarm/Log:action"
                        @click="dealAlarm"
                        >{{ $t('components.AlarmLog.345792-1') }}</j-permission-button
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
import SolveComponent from './SolveComponent.vue';
import Log from './Log.vue';

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
