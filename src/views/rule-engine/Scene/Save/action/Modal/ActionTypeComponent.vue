<template>
    <div>
        <template v-if="actionType === 'device'">
            <Device v-bind="props" :value="data?.device" @cancel="onCancel" @save="onPropsOk" :thenName="branchesName" />
        </template>
        <template v-else-if="actionType === 'notify'">
            <Notify :options="data?.options" :value="data?.notify" @cancel="onCancel" @save="onPropsOk" />
        </template>
        <template v-else-if="actionType === 'delay'">
            <Delay :value="data?.delay" @cancel="onCancel" @save="onPropsOk" />
        </template>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { ActionsType } from '../../../typings';
import Delay from '../Delay/index.vue';
import Notify from '../Notify/index.vue';
import Device from '../Device/index.vue';

const props = defineProps({
    branchesName: {
        type: Number,
        default: 0,
    },
    branchGroup: {
        type: Number,
        default: 0,
    },
    name: {
        type: Number,
        default: 0,
    },
    data: {
        type: Object as PropType<ActionsType>,
    },
    parallel: {
        type: Boolean,
    },
    actionType: {
        type: String,
        default: '',
    },
});

const emit = defineEmits(['cancel', 'save']);

const onCancel = () => {
    emit('cancel');
};

const onPropsOk = (data: any, options: any) => {
    const _data = {
        type: props.actionType,
        executor: props.actionType,
        key: props?.data?.key || `${props.actionType}_${new Date().getTime()}`,
        [props.actionType]: {
            ...data,
        },
    };
    emit('save', { ..._data }, options);
};
</script>