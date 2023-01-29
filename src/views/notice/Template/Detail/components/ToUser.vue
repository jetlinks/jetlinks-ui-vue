<template>
    <a-select
        :options="options"
        @change="change"
        placeholder="请选择收信人"
        style="width: 100%"
        :allowClear="true"
    />
</template>

<script setup lang="ts">
import templateApi from '@/api/notice/template';

type Emits = {
    (e: 'update:toUser', data: string): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    type: { type: String, default: '' },
    configId: { type: String, default: '' },
});

const options = ref([]);
const queryData = async () => {
    const { result } = await templateApi.getUser(props.type, props.configId);
    options.value = result.map((item: any) => ({
        label: item.name,
        value: item.id,
    }));
};
queryData();

const change = (e: any) => {
    emit('update:toUser', e);
};

watch(
    () => props.configId,
    () => {
        queryData();
    },
);
</script>

<style lang="less" scoped></style>
