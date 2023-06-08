<template>
    <j-modal
        :width="900"
        visible
        title="权限控制"
        @cancel="emit('close')"
        @ok="onSave"
    >
        <Role v-model="_selectedRowKeys" />
    </j-modal>
</template>

<script lang="ts" setup>
import { onlyMessage } from '@/utils/comm';
import Role from '../Role/index.vue'

const emit = defineEmits(['close', 'save']);

const _selectedRowKeys = ref<string[]>([]);
const checked = ref<boolean>(false);

const onSave = () => {
    if(_selectedRowKeys.value.length) {
        emit('save', _selectedRowKeys.value);
    } else {
        onlyMessage('请配置角色权限', 'error')
    }
};

</script>