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
    addDevice,
    edgeChannel,
    edgeCollector,
    edgePoint,
    saveDeviceMapping,
} from '@/api/device/instance';
import { onlyMessage } from '@/utils/comm';
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
    deviceData: {
        type: Object,
    },
    text: {
        type: String,
    }
});
const _emits = defineEmits(['close', 'save']);

const checkedKeys = ref<string[]>([]);

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

const expandedKeys = ref<string[]>([]);
const onCheck = (keys: string[], e: any) => {
    checkedKeys.value = [...keys];
    expandedKeys.value.push(e.node.id);
    leftList.value = e?.checkedNodes || [];
};

const onRight = () => {
    console.log(rightList.value, leftList.value);
    rightList.value = leftList.value;
};

const treeList = ref<any[]>([]);
const getChannel = async () => {
    if (_props.edgeId) {
        loading.value = true;
        const resp: any = await edgeChannel(_props.edgeId);
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
    console.log(treeNode);
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
                      <string>_props.edgeId,
                      params,
                  )
                : await edgePoint(
                      <string>_props.edgeId,
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
        onlyMessage('请选择采集器', 'warning');
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
                )?.metadataId,
                provider: treeList.value.find(
                    (it: any) => it.id === item.parentId,
                ).provider,
            }));
            params.push(...array);
        });
        const filterParms = params.filter((item) => !!item.metadataId);
        if (_props.deviceId) {
            if (filterParms && filterParms.length !== 0) {
                const res = await saveEdgeMap(_props.edgeId, {
                    deviceId: _props.deviceId,
                    provider: filterParms[0]?.provider,
                    requestList: filterParms,
                });
                if (res.status === 200) {
                    onlyMessage('操作成功');
                    _emits('save');
                }
            } else {
                onlyMessage('暂无对应属性的映射', 'error');
            }
        } else {
            if (filterParms && filterParms.length !== 0) {
                const res: any = await addDevice(_props.deviceData);
                if (res.status === 200) {
                    const resq: any = await saveEdgeMap(_props.edgeId, {
                        deviceId: res.result?.id,
                        provider: filterParms[0]?.provider,
                        requestList: filterParms,
                    });
                    const resp = await saveDeviceMapping(_props.edgeId, {
                        info: [{
                            deviceId: res.result?.id,
                            deviceName: res.result?.name,
                        }],
                    })
                    if (res.status === 200) {
                        onlyMessage('操作成功');
                        _emits('save');
                    }
                }
            } else {
                onlyMessage('暂无对应属性的映射', 'error');
            }
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
