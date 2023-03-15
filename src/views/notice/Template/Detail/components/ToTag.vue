<template>
    <j-select
        :options="options"
        @change="change"
        placeholder="请选择标签推送，多个标签用,号分隔"
        style="width: 100%"
        :allowClear="true"
        v-model:value="_value"
    />
</template>

<script setup lang="ts">
import templateApi from '@/api/notice/template';

type Emits = {
    (e: 'update:toTag', data: string | undefined): void;
};
type Props = {
    toTag: string | undefined;
    type: string | undefined;
    configId: string | undefined;
}

const emit = defineEmits<Emits>();

const props = defineProps<Props>();

const _value = computed({
    get: () => props.toTag,
    set: (val: string | undefined) => emit('update:toTag', val),
});

const options = ref([]);
const queryData = async () => {
    if (!props.configId) return;
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
