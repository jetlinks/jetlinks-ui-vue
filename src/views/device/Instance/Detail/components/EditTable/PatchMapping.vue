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
                    <j-card class="map-tree-content-card">
                        <template #title>
                            <div class="map-tree-header">
                                <span>数据源</span>
                                <div>
                                    <a-input
                                        placeholder="请输入通道或采集器名称"
                                        allow-clear
                                        v-model:value="searchValue"
                                        @change="onSearch"
                                    >
                                        <template #suffix>
                                            <AIcon type="SearchOutlined" />
                                        </template>
                                    </a-input>
                                </div>
                            </div>
                        </template>
                        <j-tree
                            v-if="dataSource.length"
                            checkable
                            v-model:expandedKeys="expandedKeys"
                            :height="300"
                            :tree-data="dataSource"
                            :checkedKeys="checkedKeys"
                            @check="onCheck"
                        >
                            <template #title="{ title }">
                                <span v-if="title.indexOf(searchValue) > -1">
                                    {{
                                        title.substring(
                                            0,
                                            title.indexOf(searchValue),
                                        )
                                    }}
                                    <span style="color: #f50">{{
                                        searchValue
                                    }}</span>
                                    {{
                                        title.substring(
                                            title.indexOf(searchValue) +
                                                searchValue.length,
                                        )
                                    }}
                                </span>
                                <span v-else>{{ title }}</span>
                            </template>
                        </j-tree>
                        <j-empty v-else style="margin-top: 16px"></j-empty>
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
import { useInstanceStore } from 'store/instance';
import { debounce } from 'lodash-es';

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
const searchValue = ref()
const leftList = ref<any[]>([]);

const rightList = ref<any[]>([]);
const expandedKeys = ref<any[]>([]);
const dataSource = ref<any[]>([]);
const loading = ref<boolean>(false);

let dataSourceCache;
const handleData = (data: any[], type: string, provider?: string) => {
    data.forEach((item) => {
        item.key = item.id;
        item.title = item.name;
        item.checkable = type === 'collectors';
        if (provider) {
            item.provider = provider;
        }
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
        } else {
            item.disableCheckbox = true;
        }
    });
    return data as any[];
};

const handleSearch = async () => {
    loading.value = true;

    const params = {};

    const resp = await treeMapping(params);
    loading.value = false;
    if (resp.status === 200) {
        const _data = handleData(resp.result as any[], 'channel');
        dataSourceCache = JSON.stringify(_data);
        dataSource.value = _data;
    }
};

const onCheck = (keys: string[], e: any) => {
    checkedKeys.value = [...keys];
    leftList.value = e?.checkedNodes || [];
};

const onRight = () => {
    leftList.value.forEach((i: any) => {
        i.disableCheckbox = true;
    });
    rightList.value = leftList.value;
};

const _delete = (_key: string) => {
    const _index = rightList.value.findIndex((i) => i.key === _key);
    leftList.value[_index].disableCheckbox = false;
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
                state:
                    instanceStore.current.state.value == 'notActive'
                        ? 'disabled'
                        : null,
            }));
            params.push(...array);
        });
        const filterParams = params.filter((item) => !!item.metadataId);
        if (filterParams?.length !== 0) {
            const res = await saveMapping(
                _props.deviceId,
                _props.type,
                filterParams,
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

const treeFilter = (data: any[], value: any, key: string = 'name'): any[] => {
    if (!data) return [];
    return data.filter((item) => {
        if (item[key].includes(value)) {
            if (item.parentId) {
                !expandedKeys.value.includes(item.parentId) &&
                    expandedKeys.value.push(item.parentId);
            }
            return true;
        }

        // 排除点位的搜索
        if (
            item.children &&
            item.children.length &&
            !item.hasOwnProperty('points')
        ) {
            item.children = treeFilter(item.children || [], value, key);
            return !!item.children.length;
        }

        return false;
    });
};

const onSearch = debounce((e) => {
    // handleSearch()
    const _data = JSON.parse(dataSourceCache || '[]');
    const text = e.target.value;
    dataSource.value = text
        ? treeFilter(_data, e.target.value, 'title')
        : _data;
}, 300);

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
.map-tree-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>
