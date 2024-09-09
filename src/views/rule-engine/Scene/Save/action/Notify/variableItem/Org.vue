<template>
    <j-tree-select
        :listHeight="200"
        v-model:value="keys"
        placeholder="请选择组织"
        :tree-data="departmentTree"
        @change="onChange"
        allowClear
        :fieldNames="{
            label: 'name',
            value: 'id',
        }"
    />
</template>

<script lang="ts" setup>
import ConfigApi from '@/api/notice/config';

const props = defineProps({
    notify: {
        type: Object,
        default: () => {},
    },
    value: {
        type: Array,
        default: () => [],
    },
});

const emit = defineEmits(['update:value', 'change']);

const departmentTree = ref<any[]>([]);
const keys = ref<any[]>([]);

const getDepartment = async (id: string) => {
    if (props.notify.notifyType === 'dingTalk') {
        const resp = await ConfigApi.dingTalkDept(id);
        if (resp.status === 200) {
            departmentTree.value = resp.result;
        }
    } else {
        const resp = await ConfigApi.weChatDept(id);
        if (resp.status === 200) {
            departmentTree.value = resp.result;
        }
    }
};

watch(
    () => props.value,
    () => {
        keys.value = props?.value || [];
    },
    { deep: true, immediate: true },
);

watch(
    () => props.notify.notifierId,
    (newVal) => {
        if (newVal) {
            getDepartment(newVal);
        }
    },
    { deep: true, immediate: true },
);

const onChange = (key: string[], label: string[]) => {
    emit('update:value', {
        source: 'fixed',
        value: key,
    });
    emit('change', label)
};
</script>

<style lang="less" scoped>
</style>