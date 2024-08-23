<template>
    <j-tree
        :height="height"
        :show-line="{ showLeafIcon: false }"
        :show-icon="true"
        :tree-data="treeData"
        :loadData="onLoadData"
        :fieldNames="{ title: 'name', key: 'id' }"
        @select="onSelect"
        v-model:expandedKeys="expandedKeys"
    >
    </j-tree>
</template>

<script setup name="ChannelTree">
import cascadeApi from '@/api/media/cascade';
const props = defineProps({
    height: {
        type: Number,
        default: 500,
    },
});

/**
 * 默认展开第一个
 */
const expandedKeys = ref([]); // 展开的key

/**
 * 获取设备列表
 */
const treeData = ref([]);
const getDeviceList = async () => {
    const res = await cascadeApi.getMediaTree({ paging: false });
    if (res.success) {
        treeData.value = res.result
            .sort((a, b) => b.createTime - a.createTime)
            .map((m) => {
                const extra = {};
                extra.isLeaf = isLeaf(m);
                return {
                    ...m,
                    ...extra,
                };
            });
        if (treeData.value.length > 0 && treeData.value[0]) {
            getChildren(
                treeData.value[0].id,
                {
                    pageIndex: 0,
                    pageSize: 100,
                    terms: [
                        {
                            column: 'deviceId',
                            value: treeData.value[0].id,
                        },
                    ],
                },
                true,
            );
        }
    }
};

/**
 * 点击节点
 * @param _
 * @param param1
 */
const onSelect = (_, { node }) => {
    emit('onSelect', { dId: node.deviceId, cId: node.channelId });
};

/**
 * 是否为子节点
 * @param node
 */
const isLeaf = (node) => {
    if (node.channelNumber) {
        return false;
    }
    return true;
};

/**
 * 获取子节点
 * @param key
 * @param params
 */
const getChildren = (key, params, first = false) => {
    return new Promise(async (resolve) => {
        const res = await cascadeApi.queryChannelList(params);
        if (res.status === 200) {
            const { total, pageIndex, pageSize } = res.result;
            treeData.value = updateTreeData(
                treeData.value,
                key,
                res.result.data.map((item) => ({
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
            if (first) {
                expandedKeys.value.push(treeData.value[0].id);
            }
            resolve(res.result);
        }
    });
};

/**
 * 更新数据
 * @param list
 * @param key
 * @param children
 */
const updateTreeData = (list, key, children) => {
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
 * 异步加载子节点数据
 * @param param0
 */
const onLoadData = ({ key, children }) => {
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

onMounted(() => {
    getDeviceList();
});
</script>
<style lang="less" scoped></style>
