<template>
    <div class="left-content">
        <j-tree
            :height="700"
            :show-line="{ showLeafIcon: false }"
            :show-icon="true"
            :tree-data="treeData"
            :loadData="onLoadData"
            :fieldNames="{ title: 'name', key: 'id' }"
            @select="onSelect"
            v-model:expandedKeys="expandedKeys"
        >
            <template #title="{id, name}">
                <div class="name"><AIcon
                    type="VideoCameraOutlined" style="margin-right: 5px;"
                    v-if="!treeData.find((f: any) => f.id === id)"
                /><j-ellipsis>{{ name }}</j-ellipsis></div>
            </template>
            <template #icon>
            </template>
        </j-tree>
    </div>
</template>

<script setup lang="ts">
import cascadeApi from '@/api/media/cascade';

type Emits = {
    (e: 'onSelect', data: { dId: string; cId: string }): void;
};

/**
 * 默认展开第一个
 */
 const expandedKeys = ref<any[]>([]); // 展开的key
//  const selectedKeys = ref<any[]>([]); // 选中的key

const emit = defineEmits<Emits>();

interface DataNode {
    name: string;
    id: string;
    isLeaf?: boolean;
    channelNumber?: number;
    icon?: any;
    status: {
        text: string;
        value: string;
    };
    children?: DataNode[];
}

/**
 * 点击节点
 * @param _
 * @param param1
 */
const onSelect = (_: any, { node }: any) => {
    emit('onSelect', { dId: node.deviceId, cId: node.channelId });
};

/**
 * 是否为子节点
 * @param node
 */
const isLeaf = (node: any): boolean => {
    if (node.channelNumber) {
        return false;
    }
    return true;
};

/**
 * 获取设备列表
 */
const treeData = ref<any[]>([]);
const getDeviceList = async () => {
    const res = await cascadeApi.getMediaTree({ paging: false });
    if (res.success) {
        treeData.value = res.result
            .sort((a: any, b: any) => b.createTime - a.createTime)
            .map((m: any) => {
                const extra: any = {};
                extra.isLeaf = isLeaf(m);
                return {
                    ...m,
                    ...extra,
                };
            });
            if (treeData.value.length > 0 && treeData.value[0]) {
                getChildren(treeData.value[0].id,{
                pageIndex: 0,
                pageSize: 100,
                terms: [
                    {
                        column: 'deviceId',
                        value: treeData.value[0].id,
                    },
                    {
                      "column":"catalogType",
                      "value":"device"
                    }
                ],
            },true)
                }

    }
};
getDeviceList();

/**
 * 更新数据
 * @param list
 * @param key
 * @param children
 */
const updateTreeData = (
    list: DataNode[],
    key: any,
    children: DataNode[],
): DataNode[] => {
    return list.map((node) => {
        if (node.id === key) {
            return {
                ...node,
                children: node.children
                    ? [...node.children, ...children]
                    : children,
            };
        }

        if (node.children) {
            return {
                ...node,
                children: updateTreeData(node.children, key, children),
            };
        }
        return node;
    });
};

/**
 * 获取子节点
 * @param key
 * @param params
 */
const getChildren = (key: any, params: any, first?:any): Promise<any> => {
    return new Promise(async (resolve) => {
        const res = await cascadeApi.queryChannelList(params);
        if (res.status === 200) {
            const { total, pageIndex, pageSize } = res.result;
            treeData.value = updateTreeData(
                treeData.value,
                key,
                res.result.data.map((item: DataNode) => ({
                    ...item,
                    class: item.status.value,
                    isLeaf: isLeaf(item),
                })),
            );

            if (total > (pageIndex + 1) * pageSize) {
                setTimeout(() => {
                    getChildren(key, {
                        ...params,
                        pageIndex: params.pageIndex + 1,
                    });
                }, 50);
            }
            if(first){
                expandedKeys.value.push(treeData.value[0].id)
                // selectedKeys.value.push(treeData.value[0].children[0].id)
                // emit('onSelect', { dId: treeData.value[0].children[0].deviceId, cId: treeData.value[0].children[0].channelId });
            }
            resolve(res.result);
        }
    });
};

/**
 * 异步加载子节点数据
 * @param param0
 */
const onLoadData = ({ key, children }: any): Promise<void> => {
    return new Promise(async (resolve) => {
        if (children) {
            resolve();
            return;
        }
        await getChildren(key, {
            pageIndex: 0,
            pageSize: 100,
            terms: [
                {
                    column: 'deviceId',
                    value: key,
                },
              {
                "column":"catalogType",
                "value":"device"
              }
            ],
        });
        resolve();
    });
};

</script>

<style lang="less" scoped>
@import './index.less';

.name {
    display: flex;
    align-items: center;
}
</style>
