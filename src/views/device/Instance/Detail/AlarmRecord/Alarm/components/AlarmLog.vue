<template>
    <a-drawer
        visible
        :closable="false"
        width="1000"
        @close="closeDrawer"
        :destroyInactiveTabPane="true"
    >
        <div class="alarmInfo">
            <div class="title">{{ $t('components.AlarmLog.584343-0') }}</div>
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
                        >{{ $t('components.AlarmLog.584343-1') }}</a-button
                    >
                </div>
            </div>
        </div>
        <Log :currentId="AlarmData.id" :configId="AlarmData.alarmConfigId" />
    </a-drawer>
    <SolveComponent
        v-if="solveVisible"
        @closeSolve="closeSolve"
        @refresh="refresh"
        :data="AlarmData"
    />
</template>

<script setup>
import { queryLevel } from '@/api/rule-engine/config';
import Log from '@/views/rule-engine/Alarm/Log/TabComponent/components/Log.vue';
import SolveComponent from '@/views/rule-engine/Alarm/Log/SolveComponent/index.vue';
import { useAlarmLevel } from '@/hook';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
    data: {
        type: Object,
        default: {},
    },
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
