<template>
    <a-select
        :options="options"
        @change="change"
        :placeholder="$t('components.ToTag.6401013-0')"
        style="width: 100%"
        :allowClear="true"
        v-model:value="_value"
    />
</template>

<script setup lang="ts">
import templateApi from '../../../../api/template';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
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
