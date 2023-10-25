<template>
    <j-tree-select
        showSearch
        placeholder="1级区域不需要选择"
        :tree-data="builtInAreaList"
        :value="_value"
        :field-names="{
            children: 'children',
            label: 'name',
            value: 'code',
        }"
        tree-node-filter-prop="name"
        @select="onSelect"
    >
        <template #title="{ name, code }">
            <span v-if="code">{{ name }} | {{ code }}</span>
        </template>
    </j-tree-select>
    <j-checkbox
        @change="onCheckChange"
        v-model:checked="_checked"
        style="margin-top: 5px"
        >同步添加下一级区域</j-checkbox
    >
</template>

<script lang="ts" setup>
import { getBuiltinRegionTree } from '@/api/system/region';
import { omit } from 'lodash-es';
import { onMounted, ref } from 'vue';

const props = defineProps({
    value: {
        type: Array,
        default: () => [],
    },
});

const emits = defineEmits(['update:value']);

const features = ref<any>();
const _value = ref<string>('100000')
const builtInAreaList = ref<Record<string, any>[]>([]);
const _checked = ref<boolean>(false);

const queryBuiltinRegionTree = async () => {
    const resp = await getBuiltinRegionTree({
        paging: false,
        sorts: [{ name: 'sortIndex', order: 'asc' }],
    });
    if (resp.success) {
        builtInAreaList.value = resp?.result || [];
    }
};

const onCheckChange = (e: any) => {
    if (e.target.checked) {
        emits('update:value', features.value);
    } else {
        emits('update:value', omit(features.value, 'children'));
    }
};

const onSelect = (val: string, node: any) => {
    features.value = node;
    _value.value = val
    if (_checked.value) {
        emits('update:value', node);
    } else {
        emits('update:value', omit(node, 'children'));
    }
};

onMounted(() => {
    queryBuiltinRegionTree();
});
</script>