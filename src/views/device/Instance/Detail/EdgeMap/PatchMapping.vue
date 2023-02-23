<template>
    <a-modal
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
            <a-spin :spinning="loading">
                <div class="map-tree-content">
                    <a-card class="map-tree-content-card" title="源数据">
                        <a-tree
                            checkable
                            :height="300"
                            :tree-data="dataSource"
                            :checkedKeys="checkedKeys"
                            @check="onCheck"
                        />
                    </a-card>
                    <div style="width: 100px">
                        <a-button
                            :disabled="rightList.length >= leftList.length"
                            @click="onRight"
                            >加入右侧</a-button
                        >
                    </div>
                    <a-card class="map-tree-content-card" title="采集器">
                        <a-list
                            size="small"
                            :data-source="rightList"
                            class="map-tree-content-card-list"
                        >
                            <template #renderItem="{ item }">
                                <a-list-item>
                                    {{ item.title }}
                                    <template #actions>
                                        <a-popconfirm
                                            title="确定删除?"
                                            @confirm="_delete(item.key)"
                                        >
                                            <AIcon type="DeleteOutlined" />
                                        </a-popconfirm>
                                    </template>
                                </a-list-item>
                            </template>
                        </a-list>
                    </a-card>
                </div>
            </a-spin>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { treeEdgeMap, saveEdgeMap } from '@/api/device/instance';
import { message } from 'ant-design-vue/es';
const _props = defineProps({
    metaData: {
        type: Array,
        default: () => []
    },
    deviceId: {
        type: String,
        default: '',
    },
    edgeId: {
        type: String,
        default: '',
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

const onCheck = (keys: string[], e: any) => {
    checkedKeys.value = [...keys];
    leftList.value = e?.checkedNodes || [];
};

const onRight = () => {
    rightList.value = leftList.value;
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
                metadataId: (_props.metaData as any[]).find((i: any) => i.name === element.name)
                    ?.metadataId,
                provider: dataSource.value.find((it: any) => it.id === item.parentId).provider,
            }));
            params.push(...array);
        });
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
        handleSearch();
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