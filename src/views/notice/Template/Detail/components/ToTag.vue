<template>
    <a-select
        :options="options"
        @change="change"
        placeholder="请选择标签推送，多个标签用,号分隔"
        style="width: 100%"
        :allowClear="true"
    />
</template>

<script setup lang="ts">
import templateApi from '@/api/notice/template';

type Emits = {
    (e: 'update:toTag', data: string): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    type: { type: String, default: '' },
    configId: { type: String, default: '' },
});

const options = ref([]);
const queryData = async () => {
    const { result } = await templateApi.getTags(props.configId);
    options.value = result.map((item: any) => ({
        label: item.name,
        value: item.id,
    }));
};
queryData();

const change = (e: any) => {
    emit('update:toTag', e);
};

watch(
    () => props.configId,
    () => {
        queryData();
    },
);
</script>

<style lang="less" scoped></style>
