<template>
    <a-select
        style="width: 100%"
        v-model:value="keys"
        :placeholder="$t('variableItem.Tag.692842-0')"
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

const emit = defineEmits(['update:value', 'change']);

const tagsList = ref<any[]>([]);
const keys = ref<string | undefined>(undefined);

const getDepartment = async (id: string) => {
    const resp = await TemplateApi.getTags(id);
    if (resp.status === 200) {
        tagsList.value = resp.result.map((item: any) => ({value: item.id, label: item.name}))
    }
};

watch(
    () => props.value,
    (newVal) => {
        keys.value = newVal || undefined
    },
    { immediate: true },
);

watch(
    () => props.notify.channelConfiguration?.notifierId,
    (newVal) => {
        if (newVal) {
            getDepartment(newVal);
        }
    },
    { deep: true, immediate: true },
);

const onChange = (key: string, option: any) => {
    emit('update:value', {
        source: 'fixed',
        value: key,
    });
    emit('change', option ? option?.label : '')
};
</script>

<style lang="less" scoped>
</style>