<template>
    <a-spin :spinning="loading" v-if="metadata.properties?.length">
        <a-card :bordered="false" style="padding: 0">
            <template #extra>
                <a-space>
                    <a-button @click="visible = true">{{ $t('EdgeMap.index.378452-0') }}</a-button>
                    <a-button type="primary" @click="onSave">{{ $t('EdgeMap.index.378452-1') }}</a-button>
                </a-space>
            </template>
            <a-form ref="formRef" :model="modelRef">
                <a-table
                    :dataSource="modelRef.dataSource"
                    :columns="columns"
                    :pagination="false"
                >
                    <template #headerCell="{ column }">
                        <template v-if="column.key === 'collectorId'">
                            {{ $t('EdgeMap.index.378452-2') }}
                            <a-tooltip :title="$t('EdgeMap.index.378452-3')">
                                <AIcon type="QuestionCircleOutlined" />
                            </a-tooltip>
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
                            <a-form-item
                                :name="['dataSource', index, 'channelId']"
                            >
                                <a-select
                                    style="width: 100%"
                                    v-model:value="record[column.dataIndex]"
                                    :placeholder="$t('EdgeMap.index.378452-4')"
                                    allowClear
                                    @change="
                                        () => onChannelChange(index, 'channel')
                                    "
                                >
                                    <a-select-option
                                        v-for="item in channelList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"
                                        >{{ item.label }}</a-select-option
                                    >
                                </a-select>
                            </a-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'collectorId'">
                            <a-form-item
                                :name="['dataSource', index, 'collectorId']"
                                :rules="[
                                    {
                                        required: !!record.channelId,
                                        message: $t('EdgeMap.index.378452-5'),
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
                            </a-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'pointId'">
                            <a-form-item
                                :name="['dataSource', index, 'pointId']"
                                :rules="[
                                    {
                                        required: !!record.channelId,
                                        message: $t('EdgeMap.index.378452-6'),
                                    },
                                ]"
                            >
                                <MSelect
                                    v-model="record[column.dataIndex]"
                                    :id="record.collectorId"
                                    type="POINT"
                                    :edgeId="instanceStore.current.parentId"
                                />
                            </a-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'id'">
                            <template v-if="record[column.dataIndex]">
                                <a-badge
                                    v-if="record.state.value === 'enabled'"
                                    status="success"
                                    :text="$t('EdgeMap.index.378452-7')"
                                />
                                <a-badge v-else status="warning" :text="$t('EdgeMap.index.378452-8')" />
                            </template>
                            <a-badge v-else status="error" :text="$t('EdgeMap.index.378452-9')" />
                        </template>
                        <template v-if="column.key === 'action'">
                            <a-space>
                                <j-permission-button
                                    type="link"
                                    :disabled="!record.id"
                                    :tooltip="{
                                        title: $t('EdgeMap.index.378452-10'),
                                    }"
                                    :popConfirm="{
                                        title: $t('EdgeMap.index.378452-11'),
                                        onConfirm: () => unbind(record.id),
                                    }"
                                    hasPermission="device/Instance:update"
                                >
                                    <AIcon type="icon-jiebang"
                                /></j-permission-button>
                                <template v-if="record.id">
                                    <j-permission-button
                                        type="link"
                                        hasPermission="device/Instance:update"
                                        :tooltip="{
                                            title:
                                                record.state.value === 'enabled'
                                                    ? $t('EdgeMap.index.378452-8')
                                                    : $t('EdgeMap.index.378452-7'),
                                        }"
                                        :popConfirm="{
                                            title:
                                                record.state.value === 'enabled'
                                                    ? $t('EdgeMap.index.378452-12')
                                                    : $t('EdgeMap.index.378452-13'),
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
                                    </j-permission-button>
                                </template>
                            </a-space>
                        </template>
                    </template>
                </a-table>
                <div class="pagination">
                    <a-pagination
                        v-model:pageSize="pageSize"
                        v-model:current="current"
                        :total="metadata?.properties?.length || 0"
                        @change="onPageChange"
                    />
                </div>
            </a-form>
        </a-card>
        <PatchMapping
            :deviceId="instanceStore.current.id"
            v-if="visible"
            @close="visible = false"
            @save="onPatchBind"
            :metaData="metadata.properties"
            :edgeId="instanceStore.current.parentId"
        />
    </a-spin>
    <a-card v-else :bordered="false" style="padding: 0">
        <JEmpty :description="$t('EdgeMap.index.378452-14')" style="margin: 10% 0" />
    </a-card>
</template>

<script lang="ts" setup name="EdgeMap">
import { useInstanceStore } from '../../../../../store/instance';
import {
    getEdgeMap,
    saveEdgeMap,
    removeEdgeMap,
    edgeChannel,
} from '../../../../../api/instance';
import MSelect from './MSelect.vue';
import PatchMapping from './PatchMapping.vue';
import { onlyMessage } from '@jetlinks-web-core/utils/comm';
import { cloneDeep } from 'lodash-es';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const columns = [
    {
        title: $t('EdgeMap.index.378452-15'),
        dataIndex: 'metadataName',
        key: 'metadataName',
        width: '20%',
    },
    {
        title: $t('EdgeMap.index.378452-16'),
        dataIndex: 'channelId',
        key: 'channelId',
        width: '20%',
    },
    {
        title: $t('EdgeMap.index.378452-2'),
        dataIndex: 'collectorId',
        key: 'collectorId',
        width: '20%',
    },
    {
        title: $t('EdgeMap.index.378452-17'),
        key: 'pointId',
        dataIndex: 'pointId',
        width: '20%',
    },
    {
        title: $t('EdgeMap.index.378452-18'),
        key: 'id',
        dataIndex: 'id',
        width: '10%',
    },
    {
        title: $t('EdgeMap.index.378452-19'),
        key: 'action',
        width: '10%',
    },
];


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
                onlyMessage($t('EdgeMap.index.378452-20'), 'success');
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
            const arr = toRaw(data.value).filter((i: any) => i.channelId).map((item: any) => {
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
                    onlyMessage($t('EdgeMap.index.378452-20'), 'success');
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
            onlyMessage($t('EdgeMap.index.378452-20'), 'success');
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
