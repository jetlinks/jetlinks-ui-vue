<template>
    <a-select
        :options="options"
        @change="change"
        placeholder="请选择收信部门"
        style="width: 100%"
        :allowClear="true"
        v-model:value="_value"
    />
</template>

<script setup lang="ts">
import templateApi from '@/api/notice/template';

type Emits = {
    (e: 'update:toParty', data: string): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    toParty: { type: String, default: '' },
    type: { type: String, default: '' },
    configId: { type: String, default: '' },
});

const _value = computed({
    get: () => props.toParty,
    set: (val: string) => emit('update:toParty', val),
});

const options = ref([]);
const queryData = async () => {
    const { result } = await templateApi.getDept(props.type, props.configId);
    options.value = result.map((item: any) => ({
        label: item.name,
        value: item.id,
    }));
};
queryData();

const change = (e: any) => {
    emit('update:toParty', e);
};

watch(
    () => props.configId,
    () => {
        queryData();
    },
);
</script>

<style lang="less" scoped></style>
