<template>
    <j-modal
        :width="540"
        visible
        title="权限控制"
        @cancel="emit('close')"
        @ok="onSave"
    >
        <Role v-model="_selectedRowKeys" :gridColumn="2" />
    </j-modal>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import Role from '../Role/index.vue';

const emit = defineEmits(['close', 'save']);
const props = defineProps({
    data: {
        type: Array as PropType<string[]>,
        default: () => [],
    },
});

const _selectedRowKeys = ref<string[]>([]);

watchEffect(() => {
    _selectedRowKeys.value = props.data || [];
});

const onSave = () => {
    emit('save', _selectedRowKeys.value);
};
</script>