<template>
    <j-modal
        title="延迟执行"
        visible
        :width="400"
        @cancel="onCancel"
        @ok="onOk"
        :maskClosable="false"
    >
        <a-input-number
            style="max-width: 220px"
            placeholder="请输入时间"
            v-model:value="value"
            :precision="3"
            :min="0"
            :max="6535"
        >
            <template #addonAfter>
                <a-select
                    :options="[
                        { label: '秒', value: 'seconds' },
                        { label: '分', value: 'minutes' },
                        { label: '小时', value: 'hours' },
                    ]"
                    v-model:value="unit"
                />
            </template>
        </a-input-number>
    </j-modal>
</template>

<script lang="ts" setup>
import { onlyMessage } from '@/utils/comm';

const timeUnitEnum = {
    seconds: '秒',
    minutes: '分',
    hours: '小时',
};

const emit = defineEmits(['cancel', 'save']);

const value = ref<number>(0);
const unit = ref<'seconds' | 'minutes' | 'hours'>('seconds');

const onCancel = () => {
    emit('cancel');
};
const onOk = () => {
    if (unref(value) || unref(value) === 0) {
    } else {
        onlyMessage('请输入时间', 'error');
    }
    emit(
        'save',
        {
            time: value.value,
            unit: unit.value,
        },
        { name: `${value.value} ${timeUnitEnum[unit.value]}后，执行后续动作` },
    );
};
</script>