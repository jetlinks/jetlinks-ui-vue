<template>
    <div class="calendarRight">
        <div class="tips">
            <span
                >将左侧标签拖拽至右侧日历中，日历中的标签在场景联动中可以被引用作为执行动作的触发条件</span
            >
            <j-permission-button
                type="text"
                :disabled="rapidChecked"
                :popConfirm="{
                    placement: 'bottomRight',
                    title: `确认清空？`,
                    onConfirm: clearEvent,
                }"
            >
                <template #icon
                    ><AIcon
                        type="ClearOutlined"
                        style="font-size: 16px" /></template
                >清空</j-permission-button
            >
        </div>
        <FullCalendar
            ref="Calendar"
            :selectable="rapidChecked"
            @resetRapid="resetRapid"
            @selectDate="selectDate"
        />
        <div class="rapidAction">
            <div class="rapidSwitch">
                <a-tooltip>
                    <template #title
                        >开启后以周/月为最小单位制定日期模板，确认后可快速覆盖日历生效期</template
                    >
                    <AIcon type="QuestionCircleOutlined"></AIcon>
                </a-tooltip>
                快速作用：<a-switch v-model:checked="rapidChecked" />
            </div>
            <div class="rapidActionControl" v-if="rapidChecked">
                <div>
                    已选择模板
                    <a-input
                        style="width: 300px"
                        v-model:value="selectedDate"
                        :disabled="true"
                    ></a-input>
                </div>
                <div style="margin-left: 10px">
                    将模板快速作用于后续的
                    <a-input-number
                        style="width: 100px"
                        v-model:value="effectDays"
                        :min="effectMin"
                        :max="999"
                        :precision="0"
                        :controls="false"
                    ></a-input-number>
                    日内
                </div>
                <div>
                    <a-button type="text" @click="reselect">重选</a-button>
                    <a-button type="link" @click="rapid">快速作用</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="Calendar">
import FullCalendar from '../FullCalendar/index.vue';
import { inject } from 'vue';
import { clearAll } from '@/api/system/calendar';
import { onlyMessage } from '@/utils/comm';

const Calendar = ref();
const rapidChecked = ref(false);
const rapidOn = inject('rapidOn');
const selectedDate = ref();
const effectDays = ref();
const effectMin = ref();
const selectDate = (data) => {
    selectedDate.value = data?.start + '~' + data?.end;
    effectDays.value = data?.days;
    effectMin.value = data?.days;
};
const reselect = () => {
    Calendar.value.reselection();
    selectedDate.value = '';
    effectDays.value = undefined;
    effectMin.value = undefined;
};
const resetRapid = () => {
    reselect();
    rapidChecked.value = false;
};
const rapid = () => {
    Calendar.value.rapidAction(effectDays.value);
};
const clearEvent = async () => {
    const res = await clearAll();
    if (res.success) {
        onlyMessage('操作成功');
        Calendar.value?.refresh();
    }
};
watch(
    () => rapidChecked.value,
    () => {
        rapidOn.value = rapidChecked.value;
    },
    {
        immediate: true,
    },
);
</script>
<style lang="less" scoped>
.calendarRight {
  flex: 1 1 0;
  min-width: 0;
    background: #fff;


    .tips {
        display: flex;
        justify-content: space-between;
    }
    .rapidAction {
        margin-top: 10px;
        display: flex;
        align-items: center;
        .rapidSwitch {
            padding: 15px 0;
        }
        .rapidActionControl {
            display: flex;
            width: 70%;
            margin-left: 20%;
            background-color: rgb(239, 249, 254);
            padding: 10px;
            justify-content: space-around;
        }
    }
}
</style>
