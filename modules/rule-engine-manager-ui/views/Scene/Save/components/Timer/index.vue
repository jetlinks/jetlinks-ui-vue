<template>
    <a-form ref="timerForm" :model="formModel" :colon="false" layout="vertical">
        <a-form-item name="trigger">
            <a-radio-group
                v-model:value="formModel.trigger"
                :options="triggerOptions"
                option-type="button"
                button-style="solid"
                @change="triggerChange"
            />
        </a-form-item>
        <a-form-item v-if="showCron" name="cron" :rules="cronRules">
            <a-input
                :placeholder="$t('Timer.index.9093537-0')"
                v-model:value="formModel.cron"
                @change="updateValue"
            />
        </a-form-item>
        <a-form-item v-else-if="showMulti" name="multi" :rules="multiRules">
            <Calendar v-model:value="formModel.multi" @change="updateValue" />
        </a-form-item>
        <template v-else>
            <a-form-item name="when">
                <WhenOption
                    v-model:value="formModel.when"
                    :type="formModel.trigger"
                    @change="updateValue"
                />
            </a-form-item>
            <a-form-item name="mod">
                <a-radio-group
                    v-model:value="formModel.mod"
                    :options="[
                        { label: $t('Timer.index.9093537-1'), value: 'period' },
                        { label: $t('Timer.index.9093537-2'), value: 'once' },
                    ]"
                    option-type="button"
                    button-style="solid"
                    @change="updateValue"
                />
            </a-form-item>
        </template>
        <a-space v-if="showOnce && !showMulti" style="display: flex; gap: 24px">
            <a-form-item :name="['once', 'time']">
                <a-time-picker
                    valueFormat="HH:mm:ss"
                    v-model:value="formModel.once.time"
                    style="width: 100%"
                    format="HH:mm:ss"
                    @change="updateValue"
                />
            </a-form-item>
            <a-form-item> {{ $t('Timer.index.9093537-2') }}</a-form-item>
        </a-space>
        <a-space
            v-if="showPeriod && !showMulti"
            style="display: flex; gap: 24px"
        >
            <a-form-item>
                <a-time-range-picker
                    valueFormat="HH:mm:ss"
                    :value="[formModel.period.from, formModel.period.to]"
                    @change="
                        (v) => {
                            formModel.period.from = v[0];
                            formModel.period.to = v[1];
                            updateValue();
                        }
                    "
                />
            </a-form-item>
            <a-form-item>{{ $t('Timer.index.9093537-3') }}</a-form-item>
            <a-form-item
                :name="['period', 'every']"
                :rules="[{ required: true, message: $t('Timer.index.9093537-4') }]"
            >
                <a-input-number
                    :placeholder="$t('Timer.index.9093537-4')"
                    style="max-width: 170px"
                    :precision="0"
                    :min="1"
                    :max="unitMax"
                    v-model:value="formModel.period.every"
                    @change="updateValue"
                >
                    <template #addonAfter>
                        <a-select
                            v-model:value="formModel.period.unit"
                            :options="[
                                { label: $t('Timer.index.9093537-5'), value: 'seconds' },
                                { label: $t('Timer.index.9093537-6'), value: 'minutes' },
                                { label: $t('Timer.index.9093537-7'), value: 'hours' },
                            ]"
                            @select="periodUnitChange"
                        />
                    </template>
                </a-input-number>
            </a-form-item>
            <a-form-item>{{ $t('Timer.index.9093537-2') }}</a-form-item>
        </a-space>
    </a-form>
</template>

<script setup lang="ts" name="Timer">
import type { PropType } from 'vue';
import dayjs from 'dayjs';
import WhenOption from './WhenOption.vue';
import { cloneDeep, pick } from 'lodash-es';
import type { OperationTimer } from '../../../typings';
import { defineExpose } from 'vue';
import Calendar from './Calendar.vue';
// import cronstrue from 'cronstrue';
import { isNoCommunity } from '@jetlinks-web-core/utils/utils';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
type NameType = string[] | string;

type Emit = {
    (e: 'update:value', data: Partial<OperationTimer>): void;
};

const props = defineProps({
    name: {
        type: [String, Array] as PropType<NameType>,
        default: '',
    },
    value: {
        type: Object,
        default: () => ({}),
    },
    type: {
        type: String,
        default: undefined,
    },
});

const emit = defineEmits<Emit>();
const unitMax = ref<number>(99);

const cronRules = [
    { max: 64, message: $t('Timer.index.9093537-8') },
    {
        validator: async (_: any, value: string) => {
            if (!value) {
                return Promise.reject(new Error($t('Timer.index.9093537-10')));
            }

            // 分割cron表达式
            const parts = value.trim().split(' ');
            if (parts.length < 6 || parts.length > 7) {
                return Promise.reject(new Error($t('Timer.index.9093537-9')));
            }

            // 验证每个字段
            const rules = {
                seconds: /^(\*|([0-5]?[0-9])(,[0-5]?[0-9])*)$|^([0-5]?[0-9])\/([0-5]?[0-9])$/,
                minutes: /^(\*|([0-5]?[0-9])(,[0-5]?[0-9])*)$|^([0-5]?[0-9])\/([0-5]?[0-9])$/,
                hours: /^(\*|([0-1]?[0-9]|2[0-3])(,([0-1]?[0-9]|2[0-3]))*)$|^([0-1]?[0-9]|2[0-3])\/([0-1]?[0-9]|2[0-3])$/,
                day: /^(\*|\?|([1-2]?[0-9]|3[0-1])(,([1-2]?[0-9]|3[0-1]))*)$|^([1-2]?[0-9]|3[0-1])\/([1-2]?[0-9]|3[0-1])$/,
                month: /^(\*|([1-9]|1[0-2])(,([1-9]|1[0-2]))*)$|^([1-9]|1[0-2])\/([1-9]|1[0-2])$/,
                week: /^(\*|\?|[0-6](,[0-6])*|MON|TUE|WED|THU|FRI|SAT|SUN)$/,
                year: /^(\*|\d{4}|\d{4}-\d{4}|\d{4}\/\d{1,2}|\?)$/
            };

            const [second, minute, hour, dayOfMonth, month, dayOfWeek, year = '*'] = parts;

            // 检查每个部分是否符合规则
            if (!rules.seconds.test(second)) {
                return Promise.reject(new Error($t('Timer.index.9093537-9')));
            }
            if (!rules.minutes.test(minute)) {
                return Promise.reject(new Error($t('Timer.index.9093537-9')));
            }
            if (!rules.hours.test(hour)) {
                return Promise.reject(new Error($t('Timer.index.9093537-9')));
            }
            if (!rules.day.test(dayOfMonth)) {
                return Promise.reject(new Error($t('Timer.index.9093537-9')));
            }
            if (!rules.month.test(month)) {
                return Promise.reject(new Error($t('Timer.index.9093537-9')));
            }
            if (!rules.week.test(dayOfWeek)) {
                return Promise.reject(new Error($t('Timer.index.9093537-9')));
            }
            if (!rules.year.test(year)) {
                return Promise.reject(new Error($t('Timer.index.9093537-9')));
            }

            // 检查日期和星期的互斥关系
            if (dayOfMonth !== '?' && dayOfWeek !== '?' && dayOfMonth !== '*' && dayOfWeek !== '*') {
                return Promise.reject(new Error($t('Timer.index.9093537-9')));
            }

            return Promise.resolve();
        },
    },
];

const multiRules = [
    {
        validator: async (_: any, v: string) => {
            if (!v.spec?.length) {
                return Promise.reject($t('Timer.index.9093537-11'));
            } else {
                const index = v.spec.findIndex(
                    (item) => !item.scheduleTags.length,
                );
                if (index > -1) {
                    return Promise.reject($t('Timer.index.9093537-12', [index + 1]));
                }
            }

            return Promise.resolve();
        },
    },
];

const triggerOptions = computed(() => {
    let _options = isNoCommunity ? [
        { label: $t('Timer.index.9093537-13'), value: 'week' },
        { label: $t('Timer.index.9093537-14'), value: 'month' },
        { label: $t('Timer.index.9093537-15'), value: 'cron' },
        { label: $t('Timer.index.9093537-16'), value: 'multi' },
    ] : [
        { label: $t('Timer.index.9093537-13'), value: 'week' },
        { label: $t('Timer.index.9093537-14'), value: 'month' },
        { label: $t('Timer.index.9093537-15'), value: 'cron' },
    ]

    // if (props.type === 'timer') {
    //   _options = [..._options, {
    //     label: $t('Timer.index.9093537-16'), value: "multi"
    //   }]
    // }
    return _options;
});

const formModel = reactive<OperationTimer>({
    trigger: 'week',
    when: props.value.when || [],
    mod: 'period',
    cron: undefined,
    once: {
        time: dayjs(new Date()).format('HH:mm:ss'),
    },
    period: {
        from: dayjs(new Date()).startOf('day').format('HH:mm:ss'),
        to: dayjs(new Date()).endOf('day').format('HH:mm:ss'),
        every: 1,
        unit: 'seconds',
    },
    multi: {
        type: 'and',
        spec: [],
    },
});
const timerForm = ref();

const showCron = computed(() => {
    return formModel.trigger === 'cron';
});
const showMulti = computed(() => {
    return formModel.trigger === 'multi';
});

const showOnce = computed(() => {
    return formModel.trigger !== 'cron' && formModel.mod === 'once';
});

const showPeriod = computed(() => {
    return formModel.trigger !== 'cron' && formModel.mod === 'period';
});

const updateValue = () => {
    const cloneValue = cloneDeep(formModel);
    let keys: string[] = ['trigger'];
    if (cloneValue.trigger === 'cron') {
        keys.push('cron');
    } else if (cloneValue.trigger === 'multi') {
        keys.push('multi');
    } else {
        keys = keys.concat(['mod', 'when']);

        if (cloneValue.mod === 'period') {
            keys.push('period');
        } else {
            keys.push('once');
        }
    }
    emit('update:value', pick(cloneValue, keys));
};

const triggerChange = () => {
    formModel.when = [];
    formModel.cron = undefined;
    updateValue();
};

/**
 * 频率单位切换
 * @param v
 */
const periodUnitChange = (v: any) => {
    if (v === 'hours') {
        unitMax.value = 99999;
    } else {
        unitMax.value = 99;
    }
    formModel.period!.every = 1;
    updateValue();
};

defineExpose({
    validateFields: () =>
        new Promise(async (resolve) => {
            const data = await timerForm.value?.validateFields();
            resolve(data);
        }),
});

Object.assign(formModel, props.value);
formModel.when = props.value.when || [];

watchEffect(() => {
    if (props.value?.period?.unit === 'hours') {
        unitMax.value = 99999;
    } else {
        unitMax.value = 99;
    }
});
</script>

<style scoped lang="less"></style>
