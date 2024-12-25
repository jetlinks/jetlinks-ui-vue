<template>
    <div class="calendarRight">
        <div class="tips">
            <span
                >{{ $t('CalendarRight.index.810845-0') }}</span
            >
            <j-permission-button
                type="text"
                :disabled="rapidChecked"
                :popConfirm="{
                    placement: 'bottomRight',
                    title: $t('CalendarRight.index.810845-1'),
                    onConfirm: clearEvent,
                }"
            >
                <template #icon
                    ><AIcon
                        type="ClearOutlined"
                        style="font-size: 16px" /></template
                >{{ $t('CalendarRight.index.810845-2') }}</j-permission-button
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
                        >{{ $t('CalendarRight.index.810845-3') }}</template
                    >
                    <AIcon type="QuestionCircleOutlined"></AIcon>
                </a-tooltip>
                {{ $t('CalendarRight.index.810845-4') }}<a-switch v-model:checked="rapidChecked" />
            </div>
            <div class="rapidActionControl" v-if="rapidChecked">
                <a-space>
                    <j-ellipsis>
                        {{ $t('CalendarRight.index.810845-5') }}
                    </j-ellipsis>
                    <a-input
                        style="width: 300px"
                        v-model:value="selectedDate"
                        :disabled="true"
                    ></a-input>
                </a-space>
                <a-space>
                    <j-ellipsis>
                        {{ $t('CalendarRight.index.810845-6') }}
                    </j-ellipsis>
                    <a-input-number
                        style="width: 100px"
                        v-model:value="effectDays"
                        :min="effectMin"
                        :max="999"
                        :precision="0"
                        :controls="false"
                    ></a-input-number>
                    <j-ellipsis>
                        {{ $t('CalendarRight.index.810845-7') }}
                    </j-ellipsis>
                </a-space>
                <div>
                    <a-button type="text" @click="reselect">{{ $t('CalendarRight.index.810845-8') }}</a-button>
                    <a-button type="link" @click="rapid">{{ $t('CalendarRight.index.810845-9') }}</a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup name="Calendar">
import FullCalendar from '../FullCalendar/index.vue';
import { inject } from 'vue';
import { clearAll } from '@/api/system/calendar';
import { onlyMessage } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
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
        onlyMessage($t('CalendarRight.index.810845-10'));
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
        width: 100%;
        margin-top: 10px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 16px;
        overflow: auto;
        .rapidSwitch {
            padding: 15px 0;
        }
        .rapidActionControl {
            display: flex;
            flex: 1;
            background-color: rgb(239, 249, 254);
            padding: 10px;
            justify-content: space-around;
            gap: 20px;
            overflow: auto;
            white-space: nowrap;
        }
    }
}
</style>
