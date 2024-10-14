<template>
    <j-spin :spinning="loading" v-if="metadata.properties?.length">
        <j-card :bordered="false" style="padding: 0">
            <template #extra>
                <j-space>
                    <j-button @click="visible = true">批量映射</j-button>
                    <j-button type="primary" @click="onSave">保存</j-button>
                </j-space>
            </template>
            <j-form ref="formRef" :model="modelRef">
                <j-table
                    :dataSource="modelRef.dataSource"
                    :columns="columns"
                    :pagination="false"
                >
                    <template #headerCell="{ column }">
                        <template v-if="column.key === 'collectorId'">
                            采集器
                            <j-tooltip title="边缘网关代理的真实物理设备">
                                <AIcon type="QuestionCircleOutlined" />
                            </j-tooltip>
                        </template>
                    </template>
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.dataIndex === 'metadataName'">
                            <span v-if="record.metadataName">{{
                                record.metadataName
                            }}</span>
                            <span v-else style="color: red">{{
                                record.metadataId
                            }}</span>
                        </template>
                        <template v-if="column.dataIndex === 'channelId'">
                            <j-form-item
                                :name="['dataSource', index, 'channelId']"
                            >
                                <j-select
                                    style="width: 100%"
                                    v-model:value="record[column.dataIndex]"
                                    placeholder="请选择"
                                    allowClear
                                    @change="
                                        () => onChannelChange(index, 'channel')
                                    "
                                >
                                    <j-select-option
                                        v-for="item in channelList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"
                                        >{{ item.label }}</j-select-option
                                    >
                                </j-select>
                            </j-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'collectorId'">
                            <j-form-item
                                :name="['dataSource', index, 'collectorId']"
                                :rules="[
                                    {
                                        required: !!record.channelId,
                                        message: '请选择采集器',
                                    },
                                ]"
                            >
                                <MSelect
                                    v-model="record[column.dataIndex]"
                                    :id="record.channelId"
                                    type="COLLECTOR"
                                    :edgeId="instanceStore.current.parentId"
                                    v-model:provider="record.provider"
                                    @change="
                                        onChannelChange(index, 'collector')
                                    "
                                />
                            </j-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'pointId'">
                            <j-form-item
                                :name="['dataSource', index, 'pointId']"
                                :rules="[
                                    {
                                        required: !!record.channelId,
                                        message: '请选择点位',
                                    },
                                ]"
                            >
                                <MSelect
                                    v-model="record[column.dataIndex]"
                                    :id="record.collectorId"
                                    type="POINT"
                                    :edgeId="instanceStore.current.parentId"
                                />
                            </j-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'id'">
                            <template v-if="record[column.dataIndex]">
                                <j-badge
                                    v-if="record.state.value === 'enabled'"
                                    status="success"
                                    text="启用"
                                />
                                <j-badge v-else status="warning" text="禁用" />
                            </template>
                            <j-badge v-else status="error" text="未绑定" />
                        </template>
                        <template v-if="column.key === 'action'">
                            <j-space>
                                <PermissionButton
                                    type="link"
                                    :disabled="!record.id"
                                    :tooltip="{
                                        title: '解绑',
                                    }"
                                    :popConfirm="{
                                        title: '确认解绑？',
                                        onConfirm: () => unbind(record.id),
                                    }"
                                    hasPermission="device/Instance:update"
                                >
                                    <AIcon type="icon-jiebang"
                                /></PermissionButton>
                                <template v-if="record.id">
                                    <PermissionButton
                                        type="link"
                                        hasPermission="device/Instance:update"
                                        :tooltip="{
                                            title:
                                                record.state.value === 'enabled'
                                                    ? '禁用'
                                                    : '启用',
                                        }"
                                        :popConfirm="{
                                            title:
                                                record.state.value === 'enabled'
                                                    ? '确认禁用？'
                                                    : '确认启用?',
                                            onConfirm: () => onAction(record),
                                        }"
                                    >
                                        <AIcon
                                            v-if="
                                                record.state.value === 'enabled'
                                            "
                                            type="StopOutlined"
                                        />
                                        <AIcon
                                            v-else
                                            type="PlayCircleOutlined"
                                        />
                                    </PermissionButton>
                                </template>
                            </j-space>
                        </template>
                    </template>
                </j-table>
                <div class="pagination">
                    <j-pagination
                        v-model:pageSize="pageSize"
                        v-model:current="current"
                        :total="metadata?.properties?.length || 0"
                        @change="onPageChange"
                    />
                </div>
            </j-form>
        </j-card>
        <PatchMapping
            :deviceId="instanceStore.current.id"
            v-if="visible"
            @close="visible = false"
            @save="onPatchBind"
            :metaData="metadata.properties"
            :edgeId="instanceStore.current.parentId"
        />
    </j-spin>
    <j-card v-else :bordered="false" style="padding: 0">
        <JEmpty description="暂无数据，请配置物模型" style="margin: 10% 0" />
    </j-card>
</template>

<script lang="ts" setup name="EdgeMap">
import { useInstanceStore } from '@/store/instance';
import {
    getEdgeMap,
    saveEdgeMap,
    removeEdgeMap,
    edgeChannel,
} from '@/api/device/instance';
import MSelect from './MSelect.vue';
import PatchMapping from './PatchMapping.vue';
import { onlyMessage } from '@/utils/comm';
import { cloneDeep } from 'lodash-es';
import { usePermissionStore } from '@/store/permission';
import { dataTool } from 'echarts';
const columns = [
    {
        title: '名称',
        dataIndex: 'metadataName',
        key: 'metadataName',
        width: '20%',
    },
    {
        title: '通道',
        dataIndex: 'channelId',
        key: 'channelId',
        width: '20%',
    },
    {
        title: '采集器',
        dataIndex: 'collectorId',
        key: 'collectorId',
        width: '20%',
    },
    {
        title: '点位',
        key: 'pointId',
        dataIndex: 'pointId',
        width: '20%',
    },
    {
        title: '状态',
        key: 'id',
        dataIndex: 'id',
        width: '10%',
    },
    {
        title: '操作',
        key: 'action',
        width: '10%',
    },
];

const permissionStore = usePermissionStore();

const data: any = ref([]);
// const isPermission = permissionStore.hasPermission('device/Instance:update');

const current = ref<number>(1);
const pageSize = ref<number>(10);

const instanceStore = useInstanceStore();
const metadata = JSON.parse(instanceStore.current?.metadata || '{}');
const loading = ref<boolean>(false);
const channelList = ref<any[]>([]);

// const _properties = computed(() => {
//     const _cur = current.value >= 1 ? current.value : 1;
//     const _pageSize = pageSize.value
//     return metadata.properties?.slice((_cur - 1) * _pageSize, _cur * _pageSize) || [];
// });

const modelRef = reactive<{
    dataSource: any[];
}>({
    dataSource: [],
});

const formRef = ref();
const visible = ref<boolean>(false);

const getChannel = async () => {
    if (instanceStore.current?.parentId) {
        const resp: any = await edgeChannel(instanceStore.current.parentId);
        if (resp.status === 200) {
            channelList.value = resp.result?.[0]?.map((item: any) => ({
                label: item.name,
                value: item.id,
                provider: item.provider,
            }));
        }
    }
};

const handleSearch = async () => {
    loading.value = true;
    const _metadataMap = new Map();
    const _metadata: any[] = metadata.properties.map((item: any) => {
        const value = {
            metadataId: item.id,
            metadataName: `${item.name}(${item.id})`,
            metadataType: 'property',
            name: item.name,
        };
        _metadataMap.set(item.id, value);
        return value;
    });

    if (_metadata && _metadata.length) {
        const resp: any = await getEdgeMap(
            instanceStore.current?.parentId || '',
            {
                deviceId: instanceStore.current.id,
                query: {},
            },
        ).catch(() => {
            modelRef.dataSource = _metadata;
            loading.value = false;
        });
        if (resp.status === 200) {
            // const array = _metadata.map((item: any) => {
            //   const metadataId = resp.result?.[0].find((x: any) => x.metadataId === item.metadataId);
            //   Object.assign(item, metadataId);
            //   return item
            // })
            // resp.result?.[0].forEach((item:any)=>{
            //    const differ = array.every((i:any)=>{
            //        return item.metadataId !== i.metadataId
            //     })
            //     if(differ){
            //         array.push(item)
            //     }
            // })

            resp.result?.[0]?.forEach((item: any) => {
                _metadataMap.has(item.metadataId)
                    ? _metadataMap.set(
                          item.metadataId,
                          Object.assign(
                              _metadataMap.get(item.metadataId),
                              item,
                          ),
                      )
                    : _metadataMap.set(item.metadataId, item);
            });
            data.value = [..._metadataMap.values()];
            onPageChange();
        }
    }
    loading.value = false;
};

const unbind = (id: string) => {
    const _deviceId = instanceStore.current.id;
    if (id && _deviceId) {
        const response = removeEdgeMap(instanceStore.current?.parentId || '', {
            deviceId: _deviceId,
            idList: [id],
        });
        response.then((resp) => {
            if (resp.status === 200) {
                onlyMessage('操作成功！', 'success');
                handleSearch();
            }
        });
        return response;
    }
};

const onPatchBind = () => {
    visible.value = false;
    onRefresh();
};

const onChannelChange = (_index: number, type: 'collector' | 'channel') => {
    if (type === 'channel') {
        modelRef.dataSource[_index].collectorId = undefined;
        modelRef.dataSource[_index].pointId = undefined;
    } else {
        modelRef.dataSource[_index].pointId = undefined;
    }
};

const onPageChange = () => {
    formRef.value?.validate().then(() => {
        const _cur = current.value >= 1 ? current.value : 1;
        const _pageSize = pageSize.value;
        const array =
            data.value.slice((_cur - 1) * _pageSize, _cur * _pageSize) || [];
        modelRef.dataSource = array;
    });
};

const onSave = () => {
    formRef.value
        .validate()
        .then(async (_data: any) => {
            const arr = toRaw(data.value).filter((i: any) => i.channelId).map(item => {
                if (instanceStore.current.state?.value === 'notActive') {
                    item.state = 'disabled'
                }
                return item
            });
            if (arr && arr.length !== 0) {
                const submitData = {
                    deviceId: instanceStore.current.id,
                    provider: (arr[0] as any)?.provider,
                    requestList: arr,
                };
                const resp = await saveEdgeMap(
                    instanceStore.current.parentId || '',
                    submitData,
                );
                if (resp.status === 200) {
                    onlyMessage('操作成功！', 'success');
                    onRefresh();
                }
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};

const onAction = (record: any) => {
    const array = (modelRef.dataSource || [])?.filter(
        (item: any) => item.channelId,
    );
    const findArray = array.find((item: any) => item.id === record?.id);
    const arr = {
        ...findArray,
        state: record?.state.value === 'enabled' ? 'disabled' : 'enabled',
    };
    const filterArray = array.filter((item: any) => item.id !== record?.id);
    const submitData = {
        deviceId: instanceStore.current.id,
        provider: array[0]?.provider,
        requestList: [...filterArray, arr],
    };
    const response = saveEdgeMap(
        instanceStore.current.parentId || '',
        submitData,
    );
    response.then((resp) => {
        if (resp.status === 200) {
            onlyMessage('操作成功！', 'success');
            onRefresh();
        }
    });
    return response
};

const onRefresh = async () => {
    loading.value = true;
    if (modelRef.dataSource && modelRef.dataSource.length) {
        const resp: any = await getEdgeMap(
            instanceStore.current?.parentId || '',
            {
                deviceId: instanceStore.current.id,
                query: {},
            },
        ).catch(() => {
            loading.value = false;
        });
        if (resp.status === 200) {
            const arr = cloneDeep(modelRef.dataSource);
            const array = arr.map((x: any) => {
                const _item = resp.result?.[0].find(
                    (item: any) => item.metadataId === x.metadataId,
                );
                if (_item) {
                    return {
                        ...x,
                        ..._item,
                    };
                } else {
                    return x;
                }
            });
            modelRef.dataSource = array;
        }
    }
    loading.value = false;
};

watch(
    () => modelRef.dataSource,
    (val) => {
        const dataMap = new Map();
        val.forEach((item: any) => {
            dataMap.set(item.metadataId, item);
        });
        data.value.forEach((item: any, index: number) => {
            dataMap.has(item.metadataId) ? (data.value[index] = item) : '';
        });
    },
    {
        deep: true,
    },
);
onMounted(() => {
    getChannel();
    handleSearch();
});
</script>

<style lang="less" scoped>
:deep(.ant-form-item) {
    margin: 0 !important;
}

.pagination {
    display: flex;
    margin-top: 20px;
    width: 100%;
    justify-content: flex-end;
}
</style>
