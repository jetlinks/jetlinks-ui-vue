<template>
    <j-spin v-if="metadata.properties?.length" :spinning="loading">
        <j-card :bordered="false" borderStyle="padding: 0">
            <template #extra>
                <j-space>
                    <j-button @click="visible = true">批量映射</j-button>
                    <j-button type="primary" @click="onSave">保存</j-button>
                </j-space>
            </template>
            <j-form ref="formRef" :model="modelRef">
                <j-table
                    :columns="columns"
                    :dataSource="modelRef.dataSource"
                    @change="tableChange"
                >
                    <template #headerCell="{ column }">
                        <template v-if="column.key === 'collectorId'">
                            采集器
                            <j-tooltip title="数据采集中配置的真实物理设备">
                                <AIcon type="QuestionCircleOutlined" />
                            </j-tooltip>
                        </template>
                    </template>
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.dataIndex === 'channelId'">
                            <j-form-item
                                :name="[
                                    'dataSource',
                                    myCurrent * 10 + index,
                                    'channelId',
                                ]"
                            >
                                <j-select
                                    style="width: 100%"
                                    v-model:value="record[column.dataIndex]"
                                    placeholder="请选择"
                                    allowClear
                                    show-search
                                    :filter-option="filterOption"
                                    :options="channelList"
                                    @select="
                                        (_, option) => {
                                            record.provider = option.provider;
                                        }
                                    "
                                >
                                </j-select>
                            </j-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'collectorId'">
                            <j-form-item
                                :name="[
                                    'dataSource',
                                    myCurrent * 10 + index,
                                    'collectorId',
                                ]"
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
                                />
                            </j-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'pointId'">
                            <j-form-item
                                :name="[
                                    'dataSource',
                                    myCurrent * 10 + index,
                                    'pointId',
                                ]"
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
                            <PermissionButton
                                type="link"
                                :tooltip="{
                                    title: '解绑',
                                }"
                                :popConfirm="{
                                    title: '确认解绑',
                                    onConfirm: () => unbind(record.id),
                                }"
                                :disabled="!record.id"
                                ><AIcon type="icon-jiebang"
                            /></PermissionButton>
                        </template>
                    </template>
                </j-table>
            </j-form>
        </j-card>
        <PatchMapping
            :deviceId="instanceStore.current.id"
            v-if="visible"
            @close="visible = false"
            @save="onPatchBind"
            :type="provider"
            :metaData="modelRef.dataSource"
        />
    </j-spin>
    <j-card v-else :bordered="false" borderStyle="padding: 0">
        <JEmpty description="暂无数据，请配置物模型" style="margin: 10% 0" />
    </j-card>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import {
    queryMapping,
    saveMapping,
    removeMapping,
    queryChannelNoPaging,
} from '@/api/device/instance';
import MSelect from '../MSelect.vue';
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

const myCurrent = ref(0);

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const props = defineProps({
    provider: {
        type: String,
        default: 'MODBUS_TCP',
    },
});

const instanceStore = useInstanceStore();
const metadata = JSON.parse(instanceStore.current?.metadata || '{}');
const loading = ref<boolean>(false);
const channelList = ref([]);

const modelRef = reactive({
    dataSource: [],
});

const formRef = ref();
const visible = ref<boolean>(false);

const getChannel = async () => {
    const resp: any = await queryChannelNoPaging({
        paging: false,
        // terms: [
        //     {
        //         terms: [
        //             {
        //                 column: 'provider',
        //                 value: props.provider,
        //             },
        //         ],
        //     },
        // ],
    });
    if (resp.status === 200) {
        channelList.value = resp.result?.map((item: any) => ({
            label: item.name,
            value: item.id,
            provider: item.provider,
        }));
    }
};

const handleSearch = async () => {
    loading.value = true;
    getChannel();
    const _metadata =
        metadata.properties?.map?.((item: any) => ({
            metadataId: item.id,
            metadataName: `${item.name}(${item.id})`,
            metadataType: 'property',
            name: item.name,
        })) || [];
    if (_metadata && _metadata.length) {
        const resp: any = await queryMapping(
            'device',
            instanceStore.current.id,
        );
        if (resp.status === 200) {
            const array = resp.result.reduce((x: any, y: any) => {
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

const tableChange = (pagination: { current: number }) => {
    myCurrent.value = pagination.current - 1;
};

const unbind = (id: string) => {
    if (id) {
        const response = removeMapping('device', instanceStore.current.id, [
            id,
        ]);
        response.then((resp) => {
            if (resp.status === 200) {
                onlyMessage('操作成功！');
                handleSearch();
            }
        });
        return response;
    }
};

const onPatchBind = () => {
    visible.value = false;
    handleSearch();
};

onMounted(() => {
    handleSearch();
});

const onSave = () => {
    formRef.value
        .validate()
        .then(async () => {
            const arr = toRaw(modelRef)
                .dataSource.filter((i: any) => i.channelId)
                .map((item) => {
                    if (instanceStore.current.state?.value === 'notActive') {
                        item.state = 'disabled';
                    }
                    return item;
                });
            if (arr && arr.length !== 0) {
                console.log(arr);
                const resp = await saveMapping(
                    instanceStore.current.id,
                    props.provider,
                    arr,
                );
                if (resp.status === 200) {
                    onlyMessage('操作成功！');
                    handleSearch();
                }
            }
        })
        .catch((err: any) => {
            console.log('error', err);
        });
};
</script>

<style lang="less" scoped>
:deep(.ant-form-item) {
    margin: 0 !important;
}
</style>
