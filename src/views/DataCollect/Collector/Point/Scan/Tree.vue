<template>
    <div class="tree-content">
        <div class="tree-header">
            <div>{{ $t('Scan.Tree.3217110-0') }}</div>
            <!-- <j-checkbox v-model:checked="isSelected">隐藏已有节点</j-checkbox> -->
        </div>
        <j-spin :spinning="spinning">
            <a-breadcrumb>
                <a-breadcrumb-item
                    v-for="(i, index) in breadcrumb"
                    @click="() => jumpFile(index, i.nodeId)"
                    ><a href="javascript:void(0);">{{
                        i.breadcrumbName
                    }}</a></a-breadcrumb-item
                >
            </a-breadcrumb>
            <a-button @click="allControl" block style="margin-bottom: 10px">{{
                controlAllType ? $t('Scan.Tree.3217110-1') : $t('Scan.Tree.3217110-2')
            }}</a-button>
            <div v-if="!!treeData" class="treeContainer">
                <div
                    v-for="i in treeData"
                    class="treeItem"
                    @click="() => clickItem(i)"
                >
                    <AIcon
                        :type="i?.folder ? 'icon-wenjianjia' : 'icon-dianwei'"
                        style="margin-right: 10px"
                    ></AIcon>
                    <span
                        :class="[
                            selectKeys.includes(i.key)
                                ? 'tree-selected'
                                : 'tree-title',
                        ]"
                    >
                        {{ i.name }}
                    </span>
                </div>
            </div>
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
    unSelectKeys: {
        type: String || Array,
        default: '',
    },
});
const emits = defineEmits(['change', 'cancelAll', 'addAll']);
const channelId = props.data?.channelId;
const checkedKeys = ref<string[]>([]);
const selectKeys = ref<string[]>([]);
const spinning = ref(false);

const isSelected = ref(false);
const treeData = ref<TreeProps['treeData']>();
const breadcrumb = ref([
    {
        breadcrumbName: $t('Scan.Tree.3217110-3'),
        nodeId: undefined,
    },
]);
const controlAllType = computed(() => {
    return treeData.value?.some((i: any) => {
        return checkedKeys.value.some((item: any) => {
            return item === i.id;
        });
    });
});

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
    const controlType = checkedKeys.value?.includes(one.id);
    if (!controlType) {
        checkedKeys.value.push(one.id);
        emits('change', item, true);
    }
};

const clickItem = async (node: any) => {
    if (node?.folder) {
        getScanOpcUAList(node.key);
        breadcrumb.value.push({
            breadcrumbName: node.name,
            nodeId: node.key,
        });
    } else {
        onCheck(node);
    }
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
    getScanOpcUAList(undefined);
    spinning.value = false;
};

const allControl = () => {
    const currentPoints: any = [];
    treeData.value?.forEach((i) => {
        if (!i.folder) {
            const one: any = { ...i };
            const item = {
                features: {
                    value: (one?.features || []).includes('changedOnly'),
                    check: true,
                },
                id: one?.id || '',
                name: one?.name || '',
                accessModes: {
                    value: one?.accessModes || [],
                    check: true,
                },
                type: one?.type,
                configuration: {
                    ...one?.configuration,
                    interval: {
                        value: one?.configuration?.interval || 3000,
                        check: true,
                    },
                    nodeId: one?.id,
                },
            };
            currentPoints.push(item);
        }
    });
    if (controlAllType.value) {
        emits('cancelAll', currentPoints);
    } else {
        currentPoints.forEach((i: any) => {
            checkedKeys.value.push(i.id);
        });
        emits('addAll', currentPoints);
    }
};

const getScanOpcUAList = async (nodeId: string | undefined) => {
    const params = nodeId
        ? {
              id: channelId,
              nodeId: nodeId,
          }
        : {
              id: channelId,
          };
    spinning.value = true;
    const res: any = await scanOpcUAList(params);
    treeData.value = res.result.map((item: any) => ({
        ...item,
        key: item.id,
        title: item.name,
    }));
    spinning.value = false;
};

const jumpFile = (breadcrumbNumber: number, nodeId: string) => {
    breadcrumb.value.splice(breadcrumbNumber + 1, breadcrumb.value.length - 1);
    getScanOpcUAList(nodeId);
};
watch(
    () => props.unSelectKeys,
    (value) => {
        if (typeof value === 'string') {
            checkedKeys.value = checkedKeys.value.filter((i) => i !== value);
        } else {
            checkedKeys.value = checkedKeys.value.filter((i) => {
                return !value?.some((item) => {
                    return item === i;
                });
            });
        }
    },
    { deep: true },
);
onMounted(() => {
    getPoint();
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
.treeContainer {
    max-height: 600px;
    overflow-y: auto;
    .treeItem {
        cursor: pointer;
    }
}
</style>
