<template>
    <a-input-group compact>
        <a-select
            :options="[
                { label: $t('variableItem.BuildIn.910899-0'), value: 'fixed' },
                { label: $t('variableItem.BuildIn.910899-1'), value: 'upper' },
            ]"
            style="width: 120px"
            :value="value?.source"
            @change="sourceChange"
        />
        <template v-if="source === 'upper'">
            <a-tree-select
                v-model:value="upperKey"
                :treeData="builtInList"
                :placeholder="$t('variableItem.BuildIn.910899-2')"
                style="width: calc(100% - 120px)"
                :fieldNames="{ label: 'name', value: 'id' }"
                @change="(val) => itemOnChange(undefined, val)"
            >
            </a-tree-select>
        </template>
        <template v-else>
            <a-date-picker
                :value="value.value"
                allowClear
                valueFormat='YYYY-MM-DD HH:mm:ss'
                format="YYYY-MM-DD HH:mm:ss"
                style="width: calc(100% - 120px)"
                v-if="item.type === 'date'"
                @change="(_, dateString) => itemOnChange(dateString)"
            />
            <a-input-number
                :value="value.value"
                allowClear
                style="width: calc(100% - 120px)"
                v-else-if="item.type === 'number'"
                :placeholder="$t('variableItem.BuildIn.910899-3', [item.name])"
                @change="itemOnChange"
            />
            <a-input
                :value="value.value"
                allowClear
                style="width: calc(100% - 120px)"
                v-else
                :placeholder="$t('variableItem.BuildIn.910899-3', [item.name])"
                @change="(e) => itemOnChange(e.target.value)"
            />
        </template>
    </a-input-group>
</template>

<script lang="ts" setup name='NotifyBuildIn'>
import { queryConfigVariables } from '@/api/system/noticeRule';

const props = defineProps({
    value: {
        type: Object,
        default: () => {
            return {
                source: 'fixed',
                value: undefined,
                upperKey: undefined,
            };
        },
    },
    item: {
        type: Object,
        default: () => {},
    },
    name: {
        type: Number,
        default: 0,
    },
    providerId: {
        type: String,
        default: ''
    }
});

const emit = defineEmits(['update:value']);

const source = computed(() => {
    return props.value?.source || 'fixed';
});

const builtInList = ref<any[]>([]);
const upperKey = ref(props.value?.upperKey);

const sourceChange = (val: any) => {
    emit('update:value', {
        ...props.value,
        source: val,
        value: undefined,
    });
};

const itemOnChange = (val: any, _upperKey?: string) => {
    emit('update:value', {
        ...props.value,
        value: val,
        upperKey: _upperKey,
    });
};

watch(
    () => source.value,
    (newVal) => {
        const v = newVal;
        if (v === 'upper') {
            queryConfigVariables(props.providerId).then(resp => {
                if (resp.status === 200) {
                    // 避免数据id相同，去重
                    const _set = new Set((resp.result as any[]).map(item => item?.id))
                    const arr = [..._set.values()].map(item => {
                        const _arr = (resp.result as any[]).reverse()
                        return _arr.find(i => i.id === item)
                    })
                    builtInList.value = arr.map(item => {
                        return {
                            ...item,
                            id: 'detail.' + item.id // 为了方便传到后端
                        }
                    })
                }
            })
        }
    },
    { deep: true, immediate: true },
);

watch(
    () => props.value.upperKey,
    (newVal) => {
        upperKey.value = newVal;
    },
    { immediate: true },
);
</script>

<style lang="less" scoped>
</style>