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
                            :tree-data="dataSource"
                            :checkedKeys="checkedKeys"
                            @check="onCheck"
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
                                        <ConfirmModal
                                            title="确认删除？"
                                            :onConfirm="() => _delete(item.key)"
                                            ><AIcon type="DeleteOutlined"
                                        /></ConfirmModal>
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
import { treeMapping, saveMapping } from '@/api/device/instance';
import { onlyMessage } from '@/utils/comm';
import { useInstanceStore } from "store/instance";

const _props = defineProps({
    type: {
        type: String,
        default: 'MODBUS_TCP',
    },
    metaData: {
        type: Array,
        default: () => [],
    },
    deviceId: {
        type: String,
        default: '',
    },
});
const _emits = defineEmits(['close', 'save']);

const instanceStore = useInstanceStore();
const checkedKeys = ref<string[]>([]);

const leftList = ref<any[]>([]);
const rightList = ref<any[]>([]);

const dataSource = ref<any[]>([]);
const loading = ref<boolean>(false);

const handleData = (data: any[], type: string, provider?: string) => {
    data.forEach((item) => {
        item.key = item.id;
        item.title = item.name;
        item.checkable = type === 'collectors';
        provider ? (item.provider = provider) : '';
        if (
            item.collectors &&
            Array.isArray(item.collectors) &&
            item.collectors.length
        ) {
            item.children = handleData(
                item.collectors,
                'collectors',
                item.provider,
            );
        }
        if (item.points && Array.isArray(item.points) && item.points.length) {
            item.children = handleData(item.points, 'points');
        }
    });
    return data as any[];
};

const handleSearch = async () => {
    loading.value = true;
    const resp = await treeMapping({
        // terms: [
        //     {
        //         column: 'provider',
        //         value: _props.type,
        //     },
        // ],
    });
    loading.value = false;
    if (resp.status === 200) {
        dataSource.value = handleData(resp.result as any[], 'channel');
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
        onlyMessage('请选择采集器', 'warning');
    } else {
        const params: any[] = [];
        rightList.value.forEach((item: any) => {
            const array = (item.children || []).map((element: any) => ({
                channelId: item.parentId,
                collectorId: element.collectorId,
                pointId: element.id,
                metadataType: 'property',
                metadataId: (_props.metaData as any[]).find(
                    (i: any) => i.name === element.name,
                )?.metadataId,
                provider: item.provider,
                state: instanceStore.current.state.value == 'notActive' ? 'disabled': null,
            }));
            params.push(...array);
        });
        const filterParms = params.filter((item) => !!item.metadataId);
        if (filterParms && filterParms.length !== 0) {
            const res = await saveMapping(
                _props.deviceId,
                _props.type,
                filterParms,
            );
            if (res.status === 200) {
                onlyMessage('操作成功');
                _emits('save');
            }
        } else {
            onlyMessage('暂无对应属性的映射', 'error');
        }
    }
};
const handleClose = () => {
    _emits('close');
};

watchEffect(() => {
    if (_props.type) {
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
