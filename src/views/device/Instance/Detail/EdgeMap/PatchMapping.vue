<template>
    <j-modal
        width="900px"
        title="批量映射"
        visible
        @ok="handleClick"
        @cancel="handleClose"
    >
        <div class="map-tree">
            <div class="map-tree-top">
                采集器的点位名称与属性名称一致时将自动映射绑定；有多个采集器点位名称与属性名称一致时以第1个采集器的点位数据进行绑定
            </div>
            <j-spin :spinning="loading">
                <div class="map-tree-content">
                    <j-card class="map-tree-content-card" title="源数据">
                        <j-tree
                            checkable
                            :height="300"
                            :tree-data="treeList"
                            :checkedKeys="checkedKeys"
                            :load-data="onLoadData"
                            @check="onCheck"
                            v-model:expandedKeys="expandedKeys"
                        />
                    </j-card>
                    <div style="width: 100px">
                        <j-button
                            :disabled="rightList.length >= leftList.length"
                            @click="onRight"
                            >加入右侧</j-button
                        >
                    </div>
                    <j-card class="map-tree-content-card" title="采集器">
                        <j-list
                            size="small"
                            :data-source="rightList"
                            class="map-tree-content-card-list"
                        >
                            <template #renderItem="{ item }">
                                <j-list-item>
                                    {{ item.title }}
                                    <template #actions>
                                        <j-popconfirm
                                            title="确定删除?"
                                            @confirm="_delete(item.key)"
                                        >
                                            <AIcon type="DeleteOutlined" />
                                        </j-popconfirm>
                                    </template>
                                </j-list-item>
                            </template>
                        </j-list>
                    </j-card>
                </div>
            </j-spin>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import {
    treeEdgeMap,
    saveEdgeMap,
    edgeChannel,
    edgeCollector,
    edgePoint,
} from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import { message } from 'ant-design-vue/es';
import type { TreeProps } from 'ant-design-vue';
const _props = defineProps({
    metaData: {
        type: Array,
        default: () => [],
    },
    deviceId: {
        type: String,
        default: '',
    },
    edgeId: {
        type: String,
        default: '',
    },
});
const _emits = defineEmits(['close', 'save']);

const checkedKeys = ref<string[]>([]);
const instanceStore = useInstanceStore();

const leftList = ref<any[]>([]);
const rightList = ref<any[]>([]);

const dataSource = ref<any[]>([]);
const loading = ref<boolean>(false);

const handleData = (data: any[], type: string) => {
    data.forEach((item) => {
        item.key = item.id;
        item.title = item.name;
        item.checkable = type === 'collectors';
        if (
            item.collectors &&
            Array.isArray(item.collectors) &&
            item.collectors.length
        ) {
            item.children = handleData(item.collectors, 'collectors');
        }
        if (item.points && Array.isArray(item.points) && item.points.length) {
            item.children = handleData(item.points, 'points');
        }
    });
    return data as any[];
};

const handleSearch = async () => {
    loading.value = true;
    const resp = await treeEdgeMap(_props.edgeId);
    loading.value = false;
    if (resp.status === 200) {
        dataSource.value = handleData((resp.result as any[])?.[0], 'channel');
    }
};


const expandedKeys = ref<string[]>([])
const onCheck = (keys: string[], e: any) => {
    // console.log(expandedKeys.push(e));
    expandedKeys.value.push(e.node.id)
    checkedKeys.value = [...keys];
    leftList.value = e?.checkedNodes || [];
};

const onRight = () => {
    rightList.value = leftList.value;
};

const treeList = ref<any[]>([]);
const getChannel = async () => {
    if (instanceStore.current?.parentId) {
        loading.value = true;
        const resp: any = await edgeChannel(instanceStore.current.parentId);
        loading.value = false;
        if (resp.status === 200) {
            treeList.value = resp.result?.[0]?.map((item: any) => ({
                ...item,
                title: item.name,
                key: item.id,
                checkable: false,
                type: 'channel',
                parentId: '',
                provider: item.provider,
            }));
        }
    }
};

const onLoadData: TreeProps['loadData'] = (treeNode) => {

    return new Promise(async (resolve) => {
        if (treeNode.dataRef?.children) {
            resolve();
            return;
        }
        const params = {
            terms: [
                {
                    terms: [
                        {
                            column:
                                treeNode.type === 'channel'
                                    ? 'channelId'
                                    : 'collectorId',
                            value: treeNode.key,
                        },
                    ],
                },
            ],
        };
        const res =
            treeNode.type === 'channel'
                ? await edgeCollector(
                      <string>instanceStore.current.parentId,
                      params,
                  )
                : await edgePoint(
                      <string>instanceStore.current.parentId,
                      params,
                  );
        (<any>treeNode.dataRef).children = res.result?.[0].map((item: any) => ({
            ...item,
            title: item.name,
            key: item.id,
            type: treeNode.type === 'channel' ? 'collector' : 'point',
            parentId: treeNode.key,
            checkable: treeNode.type === 'channel' ? true : false,
            isLeaf: treeNode.type === 'channel' ? false : true,
        }));
        treeList.value = [...treeList.value];
        resolve();
    });
};
const _delete = (_key: string) => {
    const _index = rightList.value.findIndex((i) => i.key === _key);
    rightList.value.splice(_index, 1);
    checkedKeys.value = rightList.value.map((i) => i.key);
    leftList.value = rightList.value;
};

const handleClick = async () => {
    if (!rightList.value.length) {
        message.warning('请选择采集器');
    } else {
        const params: any[] = [];
        rightList.value.map((item: any) => {
            const array = (item.children || []).map((element: any) => ({
                channelId: item.parentId,
                collectorId: element.collectorId,
                pointId: element.id,
                metadataType: 'property',
                metadataId: (_props.metaData as any[]).find(
                    (i: any) => i.name === element.name,
                )?.id,
                provider: treeList.value.find(
                    (it: any) => it.id === item.parentId,
                )?.provider,
            }));
            params.push(...array);
        });
        console.log(params);
        const filterParms = params.filter((item) => !!item.metadataId);
        if (filterParms && filterParms.length !== 0) {
            const res = await saveEdgeMap(_props.edgeId, {
                deviceId: _props.deviceId,
                provider: filterParms[0]?.provider,
                requestList: filterParms,
            });
            if (res.status === 200) {
                message.success('操作成功');
                _emits('save');
            }
        } else {
            message.error('暂无对应属性的映射');
        }
    }
};
const handleClose = () => {
    _emits('close');
};

onMounted(() => {
    if (_props.edgeId) {
        // handleSearch();
        getChannel();
    }
});
</script>

<style lang="less" scoped>
.map-tree-content {
    margin-top: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .map-tree-content-card {
        width: 350px;
        height: 400px;

        .map-tree-content-card-list {
            overflow-y: auto;
            height: 300px;
        }
    }
}
</style>
