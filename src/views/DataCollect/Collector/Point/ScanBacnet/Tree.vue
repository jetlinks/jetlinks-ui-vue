<template>
    <div class="tree-content">
        <div class="tree-header">
            <div>数据源</div>
            <!-- <j-checkbox v-model:checked="isSelected">隐藏已有节点</j-checkbox> -->
        </div>
        {{ unSelectKeys }}
        <a-button block @click="allControl"
            >{{ props.tableData.length ? '全部撤销' : '全部添加' }}
        </a-button>
        <j-spin :spinning="spinning">
            <j-tree
                v-if="!!treeData"
                :tree-data="treeData"
                v-model:checkedKeys="checkedKeys"
                :selectable="false"
                @check="onCheck"
                :height="600"
            >
                <template #title="{ data, name, key }">
                    <j-space>
                        <j-ellipsis>
                            <span
                                :class="[
                                    selectKeys.includes(key)
                                        ? 'tree-selected'
                                        : 'tree-title',
                                ]"
                            >
                                {{ name }}
                            </span>
                        </j-ellipsis>
                        <j-button type="link" @click="onCheck(data)">
                            <AIcon type="ArrowRightOutlined" />
                        </j-button>
                    </j-space>
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
    getBacnetObjectList,
} from '@/api/data-collect/collector';
import { cloneDeep } from 'lodash-es';

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
    unSelectKeys: {
        type: String,
        default: '',
    },
    tableData: {
        type: Array,
        default: [],
    },
});
const emits = defineEmits(['change', 'addAll', 'cancelAll']);

const channelId = props.data?.channelId;
const instanceNumber = props.data?.configuration?.instanceNumber;
const checkedKeys = ref<string[]>([]);
const selectKeys = ref<string[]>([]);
const spinning = ref(false);

const isSelected = ref(false);
const treeData = ref<TreeProps['treeData']>();
const treeAllData = ref<TreeProps['treeData']>();

const onLoadData = async () => {
    spinning.value = true;
    const resp: any = await getBacnetObjectList(
        channelId,
        instanceNumber,
    ).finally(() => (spinning.value = false));
    if (resp.status === 200) {
        treeData.value = resp.result.map((item: any) => {
            return {
                ...item,
                key: item.id,
                title: item.name,
            };
        });
    }
};

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

const onCheck = (info: any) => {
    const one: any = { ...info };
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
        nodeId: `${one?.objectId.type}:${one?.objectId.instanceNumber}` || '',
        objectId: one?.objectId || {},
        name: one?.name || '',
        propertyId: one?.propertyId || '',
        valueType: one?.valueType || '',
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
    emits('change', item);
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
};

const allControl = () => {
    if (props.tableData.length) {
        emits('cancelAll');
    } else {
        const allData = treeData.value?.map((i) => {
            return {
                features: {
                    value: (i?.features || []).includes('changedOnly'),
                    check: true,
                },
                nodeId:
                    `${i?.objectId.type}:${i?.objectId.instanceNumber}` || '',
                objectId: i?.objectId || {},
                name: i?.name || '',
                propertyId: i?.propertyId || '',
                valueType: i?.valueType || '',
                accessModes: {
                    value: i?.accessModes || [],
                    check: true,
                },
                type: i?.type,
                configuration: {
                    ...i?.configuration,
                    interval: {
                        value: i?.configuration?.interval || 3000,
                        check: true,
                    },
                    nodeId: i?.id,
                },
            };
        });
        emits('addAll', allData);
    }
};
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

onMounted(() => {
    getPoint();
    onLoadData();
});
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
