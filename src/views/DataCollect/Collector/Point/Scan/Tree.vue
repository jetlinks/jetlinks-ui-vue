<template>
    <div class="tree-content">
        <div class="tree-header">
            <div>数据源</div>
            <j-checkbox v-model:checked="isSelected">隐藏已有节点</j-checkbox>
        </div>
        <j-spin :spinning="spinning">
            <j-tree
                v-if="!!treeData"
                :load-data="onLoadData"
                :tree-data="treeData"
                v-model:checkedKeys="checkedKeys"
                :selectedKeys="selectedKeys"
                :selectable="false"
                checkable
                @check="onCheck"
                :height="600"
            >
                <template #title="{ name, key }">
                    <span
                        :class="[
                            selectKeys.includes(key)
                                ? 'tree-selected'
                                : 'tree-title',
                        ]"
                    >
                        {{ name }}
                    </span>
                </template>
            </j-tree>
            <j-empty v-else style="margin-top: 22%" />
        </j-spin>
    </div>
</template>

<script lang="ts" setup>
import type { TreeProps } from 'ant-design-vue';
import {
    scanOpcUAList,
    queryPointNoPaging,
} from '@/api/data-collect/collector';
import { cloneDeep } from 'lodash-es';

const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
    unSelectKeys: {
        type: String,
        default: '',
    },
});
const emits = defineEmits(['change']);

const channelId = props.data?.channelId;
const checkedKeys = ref<string[]>([]);
const selectKeys = ref<string[]>([]);
const spinning = ref(false);

const isSelected = ref(false);
const treeData = ref<TreeProps['treeData']>();
const treeAllData = ref<TreeProps['treeData']>();

const onLoadData = (node: any) =>
    new Promise<void>(async (resolve) => {
        if ((node?.children && node.children?.length) || !node?.folder) {
            resolve();
            return;
        }
        const resp: any = await scanOpcUAList({
            id: channelId,
            nodeId: node.key,
        });
        if (resp.status === 200) {
            const list: any = resp.result.map((item: any) => {
                return {
                    ...item,
                    key: item.id,
                    title: item.name,
                    disabled: item?.folder,
                    isLeaf: !item?.folder,
                };
            });

            treeAllData.value = updateTreeData(
                cloneDeep(treeAllData.value),
                node.key,
                [...list],
            );
        }
        resolve();
    });

const handleData = (arr: any): any[] => {
    const data = arr.filter((item: any) => {
        return (
            (isSelected && !selectKeys.value.includes(item.id)) || !isSelected
        );
    });
    return data.map((item: any) => {
        if (item.children && item.children?.length) {
            return {
                ...item,
                children: handleData(item.children),
            };
        } else {
            return item;
        }
    });
};

const onCheck = (checkedKeys: any, info: any) => {
    const one: any = { ...info.node };
    const list: any = [];
    const last: any = list.length ? list[list.length - 1] : undefined;
    if (list.map((i: any) => i?.id).includes(one.id)) {
        return;
    }
    const item = {
        features: {
            value: last
                ? last?.features?.value
                : (one?.features || []).includes('changedOnly'),
            check: true,
        },
        id: one?.id || '',
        name: one?.name || '',
        accessModes: {
            value: last ? last?.accessModes?.value : one?.accessModes || [],
            check: true,
        },
        type: one?.type,
        configuration: {
            ...one?.configuration,
            interval: {
                value: last
                    ? last?.configuration?.interval?.value
                    : one?.configuration?.interval || 3000,
                check: true,
            },
            nodeId: one?.id,
        },
    };
    emits('change', item, info.checked);
};

const updateTreeData = (list: any, key: string, children: any[]): any[] => {
    const arr = list.map((node: any) => {
        if (node.key === key) {
            return {
                ...node,
                children,
            };
        }
        if (node?.children && node?.children?.length) {
            return {
                ...node,
                children: updateTreeData(node.children, key, children),
            };
        }
        return node;
    });
    return arr;
};

const getPoint = async () => {
    spinning.value = true;
    const res: any = await queryPointNoPaging({
        paging: false,
        terms: [
            {
                terms: [
                    {
                        column: 'collectorId',
                        value: props.data?.id,
                    },
                ],
            },
        ],
    });
    if (res.status === 200) {
        selectKeys.value = res.result.map((item: any) => item.pointKey);
    }
    getScanOpcUAList();
    spinning.value = false;
};

onMounted(() => {
    getPoint();
});

const getScanOpcUAList = async () => {
    spinning.value = true;
    const res: any = await scanOpcUAList({ id: channelId });
    treeAllData.value = res.result.map((item: any) => ({
        ...item,
        key: item.id,
        title: item.name,
        disabled: item?.folder || false,
    }));
    spinning.value = false;
};
// getScanOpcUAList();

watch(
    () => isSelected.value,
    (value) => {
        treeData.value = value
            ? handleData(treeAllData.value)
            : treeAllData.value;
    },
    { deep: true },
);
watch(
    () => treeAllData.value,
    (value) => {
        treeData.value = isSelected.value ? handleData(value) : value;
    },
    { deep: true },
);

watch(
    () => props.unSelectKeys,
    (value) => {
        checkedKeys.value = checkedKeys.value.filter((i) => i !== value);
    },
    { deep: true },
);
</script>

<style lang="less" scoped>
.tree-content {
    padding: 16px;
    padding-left: 0;
    min-width: 180px;
    .tree-header {
        margin-bottom: 16px;
        display: flex;
        justify-content: space-between;
    }
    .tree-selected {
        padding: 2px 5px;
        background-color: #d6e4ff;
        border-radius: 2px;
    }
    .tree-title {
        color: black;
    }
}
</style>
