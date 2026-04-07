<template>
    <a-modal
        :title="$t('Delay.index.9667826-0')"
        open
        :width="400"
        @cancel="onCancel"
        @ok="onOk"
        :maskClosable="false"
    >
        <a-input-number
            style="max-width: 220px"
            :placeholder="$t('Delay.index.9667826-1')"
            v-model:value="_value"
            :precision="3"
            :min="0.001"
            :max="65535"
        >
            <template #addonAfter>
                <a-select
                    style="min-width: 60px"
                    :options="[
                        { label: $t('Delay.index.9667826-2'), value: 'seconds' },
                        { label: $t('Delay.index.9667826-3'), value: 'minutes' },
                        { label: $t('Delay.index.9667826-4'), value: 'hours' },
                    ]"
                    v-model:value="unit"
                />
            </template>
        </a-input-number>
    </a-modal>
</template>

<script lang="ts" setup>
import { onlyMessage } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
    value: {
        type: Object,
        default: () => {
            return {
                time: 0,
                unit: 'seconds',
            };
        },
    },
});

const timeUnitEnum = {
    seconds: $t('Delay.index.9667826-2'),
    minutes: $t('Delay.index.9667826-3'),
    hours: $t('Delay.index.9667826-4'),
};

const emit = defineEmits(['cancel', 'save']);

const _value = ref<number>(props.value.time);
const unit = ref<'seconds' | 'minutes' | 'hours'>(
    props.value?.unit || 'seconds',
);

watch(
    () => props.value,
    (newVal) => {
        _value.value = newVal?.time || 0;
        unit.value = newVal?.unit || 'seconds';
    },
    {
        immediate: true,
        deep: true,
    },
);

const onCancel = () => {
    emit('cancel');
};
const onOk = () => {
    if (unref(_value)) {
        emit(
            'save',
            {
                time: _value.value,
                unit: unit.value,
            },
            {
                name: $t('Delay.index.9667826-5', [_value.value, timeUnitEnum[unit.value]]),
            },
        );
    } else {
        onlyMessage($t('Delay.index.9667826-1'), 'error');
    }
};
</script>