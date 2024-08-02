<template>
    <j-select
        :options="options"
        @change="change"
        :placeholder="$t('components.ToOrg.2146918-0')"
        style="width: 100%"
        :allowClear="true"
        v-model:value="_value"
    />
</template>

<script setup lang="ts">
import templateApi from '@/api/notice/template';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
type Emits = {
    (e: 'update:toParty', data: string | undefined): void;
};

type Props = {
    toParty: string | undefined;
    type: string | undefined;
    configId: string | undefined;
}

const emit = defineEmits<Emits>();

const props = defineProps<Props>();

const _value = computed({
    get: () => props.toParty,
    set: (val: string | undefined) => emit('update:toParty', val),
});
const typeObj = {
    weixin: 'wechat',
    dingTalk: 'dingtalk',
};
const options = ref([]);
const queryData = async () => {
    if (!props.configId) return;
    const { result } = await templateApi.getDept(
        typeObj[props.type],
        props.configId,
    );
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
