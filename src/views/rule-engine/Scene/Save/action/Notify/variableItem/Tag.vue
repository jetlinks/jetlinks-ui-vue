<template>
    <j-select
        style="width: 100%"
        v-model:value="keys"
        placeholder="请选择标签"
        :options="tagsList"
        @change="onChange"
    />
</template>

<script lang="ts" setup>
import TemplateApi from '@/api/notice/template';

const props = defineProps({
    notify: {
        type: Object,
        default: () => {},
    },
    value: {
        type: String,
        default: ''
    },
});

const emit = defineEmits(['update:value']);

const tagsList = ref<any[]>([]);
const keys = ref<string>('');

const getDepartment = async (id: string) => {
    const resp = await TemplateApi.getTags(id);
    if (resp.status === 200) {
        tagsList.value = resp.result.map((item: any) => ({value: item.id, label: item.name}))
    }
};

watch(
    () => props.value,
    (newVal) => {
        keys.value = newVal || ''
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

const onChange = (key: string, label: string[]) => {
    // TODO 回显label的问题
    emit('update:value', {
        source: 'fixed',
        value: key,
    });
};
</script>

<style lang="less" scoped>
</style>