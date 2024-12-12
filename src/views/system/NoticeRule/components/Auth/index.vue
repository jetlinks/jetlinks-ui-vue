<template>
    <a-modal
        :width="540"
        visible
        :title="$t('Auth.index.210912-0')"
        @cancel="emit('close')"
        @ok="onSave"
    >
        <div class="alert">
            <AIcon type="InfoCircleOutlined" />
            {{ $t('Auth.index.210912-1', [name]) }}
        </div>
        <Role v-model="_selectedRowKeys" :gridColumn="2" />
    </a-modal>
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
    name: {
        type: String,
        default: ''
    }
});

const _selectedRowKeys = ref<string[]>([]);

watchEffect(() => {
    _selectedRowKeys.value = props.data || [];
});

const onSave = () => {
    emit('save', _selectedRowKeys.value);
};
</script>

<style lang="less" scoped>
.alert {
    height: 40px;
    padding: 0 20px 0 10px;
    margin-bottom: 10px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 40px;
    background-color: #f6f6f6;
}
</style>