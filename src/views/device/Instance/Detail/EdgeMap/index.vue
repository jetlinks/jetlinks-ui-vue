<template>
    <j-spin :spinning="loading" v-if="metadata.properties.length">
        <j-card>
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
                        <template v-if="column.dataIndex === 'channelId'">
                            <j-form-item
                                :name="['dataSource', index, 'channelId']"
                            >
                                <j-select
                                    style="width: 100%"
                                    v-model:value="record[column.dataIndex]"
                                    placeholder="请选择"
                                    allowClear
                                    :filter-option="filterOption"
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
                            <j-badge
                                v-if="record[column.dataIndex]"
                                status="success"
                                text="已绑定"
                            />
                            <j-badge v-else status="error" text="未绑定" />
                        </template>
                        <template v-if="column.key === 'action'">
                            <j-space>
                                <PermissionButton
                                    type="link"
                                    :disabled="!record.id"
                                    :popConfirm="{
                                        title: '确认解绑？',
                                        onConfirm: unbind(record.id),
                                    }"
                                    style="padding: 0 5px"
                                    hasPermission="device/Instance:update"
                                    :tooltip="{
                                        title: '解绑',
                                    }"
                                >
                                    <AIcon type="icon-jiebang" />
                                </PermissionButton>
                                <template v-if="record.id">
                                    <PermissionButton
                                        type="link"
                                        :disabled="!record.id"
                                        style="padding: 0 5px"
                                        :popConfirm="{
                                            title:
                                                record.state.value === 'enabled'
                                                    ? '确认禁用？'
                                                    : '确认启用?',
                                            onConfirm: onAction(record),
                                        }"
                                        hasPermission="device/Instance:update"
                                        :tooltip="{
                                            title:
                                                record.state.value === 'enabled'
                                                    ? '禁用'
                                                    : '启用',
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
                        @change="onPageChange"
                        v-model:pageSize="pageSize"
                        v-model:current="current"
                        :total="metadata?.properties?.length || 0"
                    />
                </div>
            </j-form>
        </j-card>
        <PatchMapping
            :deviceId="instanceStore.current.id"
            v-if="visible"
            @close="visible = false"
            @save="onPatchBind"
            :metaData="modelRef.dataSource"
            :edgeId="instanceStore.current.parentId"
        />
    </j-spin>
    <j-card v-else>
        <JEmpty description="暂无数据，请配置物模型" style="margin: 10% 0" />
    </j-card>
</template>

<script lang="ts" setup>
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

const current = ref<number>(1);
const pageSize = ref<number>(10);

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const instanceStore = useInstanceStore();
const metadata = JSON.parse(instanceStore.current?.metadata || '{}');
const loading = ref<boolean>(false);
const channelList = ref<any[]>([]);

const _properties = ref<any[]>([]);

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

const queryData = (cur: number) => {
    _properties.value = metadata.properties.slice(
        (cur > 0 ? cur - 1 : 0) * 10,
        cur * 10,
    );
    handleSearch(_properties.value)
};

const handleSearch = async (array: any[]) => {
    loading.value = true;
    getChannel();
    const _metadata: any[] = array.map((item: any) => ({
        metadataId: item.id,
        metadataName: `${item.name}(${item.id})`,
        metadataType: 'property',
        name: item.name,
    }));
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
            const array = resp.result?.[0].reduce((x: any, y: any) => {
                const metadataId = _metadata.find(
                    (item: any) => item.metadataId === y.metadataId,
                );
                if (metadataId) {
                    Object.assign(metadataId, y);
                } else {
                    x.push(y);
                }
                return x;
            }, _metadata);
            modelRef.dataSource = array;
        }
    }
    loading.value = false;
};

const unbind = async (id: string) => {
    if (id) {
        const resp = await removeEdgeMap(
            instanceStore.current?.parentId || '',
            {
                deviceId: instanceStore.current.id,
                idList: [id],
            },
        );
        if (resp.status === 200) {
            onlyMessage('操作成功！', 'success');
            handleSearch(_properties.value);
        }
    }
};

const onPatchBind = () => {
    visible.value = false;
    handleSearch(_properties.value);
};

const onPageChange = (page: any) => {
    queryData(page)
};

onMounted(() => {
    _properties.value = metadata.properties.slice(0, 10);
    handleSearch(_properties.value);
});

const onSave = () => {
    formRef.value
        .validate()
        .then(async () => {
            const arr = toRaw(modelRef).dataSource.filter(
                (i: any) => i.channelId,
            );
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
                    handleSearch(_properties.value);
                }
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};

const onAction = async (record: any) => {
    const value = await formRef.value.validate();
    const array = value.filter((item: any) => item.channelId);
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
    const resp = await saveEdgeMap(
        instanceStore.current.parentId || '',
        submitData,
    );
    if (resp.status === 200) {
        onlyMessage('操作成功！', 'success');
        handleSearch(_properties.value);
    }
};
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