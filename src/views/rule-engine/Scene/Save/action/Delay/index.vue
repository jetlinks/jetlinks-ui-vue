<template>
    <j-modal
        :title="$t('Delay.index.5425976-0')"
        visible
        :width="400"
        @cancel="onCancel"
        @ok="onOk"
        :maskClosable="false"
    >
        <j-input-number
            style="max-width: 220px"
            :placeholder="$t('Delay.index.5425976-1')"
            v-model:value="_value"
            :precision="3"
            :min="0.001"
            :max="65535"
        >
            <template #addonAfter>
                <j-select
                    :options="[
                        { label: $t('Delay.index.5425976-2'), value: 'seconds' },
                        { label: $t('Delay.index.5425976-3'), value: 'minutes' },
                        { label: $t('Delay.index.5425976-4'), value: 'hours' },
                    ]"
                    v-model:value="unit"
                />
            </template>
        </j-input-number>
    </j-modal>
</template>

<script lang="ts" setup>
import { onlyMessage } from '@/utils/comm';
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
    seconds: $t('Delay.index.5425976-2'),
    minutes: $t('Delay.index.5425976-3'),
    hours: $t('Delay.index.5425976-4'),
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
                name: $t('Delay.index.5425976-5', [_value.value,timeUnitEnum[unit.value]]),
            },
        );
    } else {
        onlyMessage($t('Delay.index.5425976-1'), 'error');
    }
};
</script>