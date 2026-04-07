<template>
    <a-space>
        <a-radio-group
            :value="radioValue"
            button-style="solid"
            @change="onRadioChange"
        >
            <a-radio-button value="today">{{$t('IotCard.index.369962-21-1')}}</a-radio-button>
            <a-radio-button value="week">{{$t('IotCard.index.369962-22')}}</a-radio-button>
            <a-radio-button value="month">{{$t('IotCard.index.369962-23')}}</a-radio-button>
        </a-radio-group>
        <a-range-picker
            show-time
            v-model:value="dateValue"
            :placeholder="[$t('Detail.TimeComponent.778589-0'), $t('Detail.TimeComponent.778589-1')]"
            @change="onRangeChange"
            :allowClear="false"
        />
    </a-space>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs';
import type { Dayjs } from 'dayjs';
import { PropType } from 'vue';

type Props = [Dayjs, Dayjs] | undefined;

const props = defineProps({
    modelValue: {
        type: Object as PropType<Props>,
        default: undefined,
    },
});

type Emits = {
    (e: 'update:modelValue', data: Props): void;
};

const emit = defineEmits<Emits>();
const radioValue = ref<string>('today');
const dateValue = ref<Props>();
const onRangeChange = (value: Props) => {
    emit('update:modelValue', value);
    radioValue.value = '';
};

const getTime = (type: string): Props => {
    let st: number = 0;
    const et = new Date().getTime();
    if (type === 'today') {
        st = dayjs().startOf('day').valueOf();
    } else if (type === 'week') {
        st = dayjs().subtract(6, 'days').valueOf();
    } else if (type === 'month') {
        st = dayjs().subtract(30, 'days').valueOf();
    }
    return [dayjs(st), dayjs(et)];
};

const onRadioChange = (e: any) => {
    const value: string = e.target.value;
    radioValue.value = value;
    emit('update:modelValue', getTime(value));
};

onMounted(() => {
    radioValue.value = 'today';
    emit('update:modelValue', getTime('today'));
});

watch(
    () => props.modelValue,
    (newVal: Props) => {
        dateValue.value = newVal;
    },
    { immediate: true, deep: true },
);
</script>
