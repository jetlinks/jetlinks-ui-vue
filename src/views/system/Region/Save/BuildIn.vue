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
import { onMounted, ref, watch } from 'vue';

const props = defineProps({
    value: {
        type: String,
        default: '',
    },
    name: {
        type: String,
        default: '',
    },
    children: {
        type: Array,
        default: () => [],
    },
});

const emits = defineEmits(['update:value', 'update:name', 'update:children']);

const features = ref<any>({});
const _value = ref<string>();
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
        emits('update:children', features.value?.children || []);
    } else {
        emits('update:children', []);
    }
};

const getObj = (node: any): any => {
    const _children = (node?.children || []).map((item: any) => {
        return {
            code: item.code,
            name: item.name,
            parentId: item.parentId,
        };
    });
    return {
        code: node.code,
        name: node.name,
        parentId: node.parentId,
        children: _children,
    };
};

const onSelect = (val: string, node: any) => {
    features.value = getObj(node);
    _value.value = val;
    emits('update:name', features.value?.name);
    emits('update:value', features.value?.code);
};

onMounted(() => {
    queryBuiltinRegionTree();
});

watch(
    () => props.value,
    () => {
        if (props.value) {
            _value.value = props.value
        } else {
            emits('update:name', '中国');
            emits('update:value', 100000);
        }
    },
    {
        deep: true,
        immediate: true,
    },
);

watch(
    () => props.children,
    () => {
        _checked.value = !!props.children?.length
    },
    {
        deep: true,
        immediate: true,
    },
);
</script>