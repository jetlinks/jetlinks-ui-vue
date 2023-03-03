<template>
    <div class="left-content">
        <a-tree
            :height="700"
            :show-line="{ showLeafIcon: false }"
            :show-icon="true"
            :tree-data="treeData"
            :loadData="onLoadData"
            :fieldNames="{ title: 'name', key: 'id' }"
            @select="onSelect"
        >
            <template #icon="{ key, selected }">
                <AIcon type="VideoCameraOutlined" class="online" />
            </template>
        </a-tree>
    </div>
</template>

<script setup lang="ts">
import cascadeApi from '@/api/media/cascade';

type Emits = {
    (e: 'onSelect', data: { dId: string; cId: string }): void;
};

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

const onSelect = (_: any, { node }: any) => {
    console.log('node: ', node);
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
        treeData.value = res.result.map((m: any) => {
            const extra: any = {};
            extra.isLeaf = isLeaf(m);
            return {
                ...m,
                ...extra,
            };
        });
    }
};
getDeviceList();

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
const getChildren = (key: any, params: any): Promise<any> => {
    return new Promise(async (resolve) => {
        const res = await cascadeApi.queryChannelList(params);
        if (res.status === 200) {
            const { total, pageIndex, pageSize } = res.result;
            treeData.value = updateTreeData(
                treeData.value,
                key,
                res.result.data.map((item: DataNode) => ({
                    ...item,
                    // icon: (<AIcon type="VideoCameraOutlined" className={item.status.value}/>),
                    // icon: `<AIcon type="VideoCameraOutlined" class="${item.status.value}"/>`,
                    // icon: (h:any) => h('h1', 22),
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
            console.log('treeData.value: ', treeData.value);
            console.log('res.result: ', res.result);
            resolve(res.result);
        }
    });
};

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
            ],
        });
        resolve();
    });
};
</script>

<style lang="less" scoped>
@import './index.less';
</style>
