<template>
    <div>
        <j-radio-group
            v-if="quickBtn"
            default-value="today"
            button-style="solid"
            v-model:value="radioValue"
            @change="(e) => handleBtnChange(e.target.value)"
        >
            <j-radio-button
                v-for="item in quickBtnList"
                :key="item.value"
                :value="item.value"
            >
                {{ item.label }}
            </j-radio-button>
        </j-radio-group>
        <a-range-picker
            format="YYYY-MM-DD"
            valueFormat="YYYY-MM-DD"
            style="margin-left: 12px"
            @change="rangeChange"
            v-model:value="rangeVal"
            :allowClear="false"
        >
        </a-range-picker>
    </div>
</template>

<script setup lang="ts">
import moment from 'moment';
import { PropType } from 'vue';

interface BtnOptions {
    label: string;
    value: string;
}

interface EmitProps {
    (e: 'change', data: Record<string, any>): void;
}

const emit = defineEmits<EmitProps>();

const props = defineProps({
    // 显示快捷按钮
    quickBtn: {
        type: Boolean,
        default: true,
    },
    // 快捷按钮列表
    quickBtnList: {
        type: Array as PropType<BtnOptions[]>,
        default: [
            { label: '今日', value: 'today' },
            { label: '近一周', value: 'week' },
            { label: '近一月', value: 'month' },
            { label: '近一年', value: 'year' },
        ],
    },
    type: {
        type: String,
        default: 'today',
    },
});

const radioValue = ref(props.type || 'week' || undefined);
const rangeVal = ref<[string, string]>();

const rangeChange = (val: any) => {
    radioValue.value = undefined;
    emit('change', {
        start: moment(val[0]).valueOf(),
        end: moment(val[1]).valueOf(),
        type: undefined,
    });
};

const getTimeByType = (type: string) => {
    switch (type) {
        case 'hour':
            return moment().subtract(1, 'hours').valueOf();
        case 'week':
            return moment().subtract(6, 'days').valueOf();
        case 'month':
            return moment().subtract(29, 'days').valueOf();
        case 'year':
            return moment().subtract(365, 'days').valueOf();
        default:
            return moment().startOf('day').valueOf();
    }
};

const handleBtnChange = (val: string) => {
    radioValue.value = val;
    let endTime = moment(new Date()).valueOf();
    let startTime = getTimeByType(val);
    if (val === 'yesterday') {
        startTime = moment().subtract(1, 'days').startOf('day').valueOf();
        endTime = moment().subtract(1, 'days').endOf('day').valueOf();
    }
    rangeVal.value = [
        moment(startTime).format('YYYY-MM-DD'),
        moment(endTime).format('YYYY-MM-DD'),
    ];
    emit('change', {
        start: startTime,
        end: endTime,
        type: val,
    });
};

watch(
    () => radioValue.value,
    (val) => {
        handleBtnChange(val);
    },
    { deep: true, immediate: true },
);
</script>
