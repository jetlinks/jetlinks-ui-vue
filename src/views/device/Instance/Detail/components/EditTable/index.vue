<template>
    <a-spin :spinning="loading">
        <a-card>
            <template #extra>
                <a-space>
                    <a-button @click="visible = true">批量映射</a-button>
                    <a-button type="primary" @click="onSave">保存</a-button>
                </a-space>
            </template>
            <a-form ref="formRef" :model="modelRef">
                <a-table :dataSource="modelRef.dataSource" :columns="columns">
                    <template #headerCell="{ column }">
                        <template v-if="column.key === 'collectorId'">
                            采集器
                            <a-tooltip title="数据采集中配置的真实物理设备">
                                <AIcon type="QuestionCircleOutlined" />
                            </a-tooltip>
                        </template>
                    </template>
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.dataIndex === 'channelId'">
                            <a-form-item
                                :name="['dataSource', index, 'channelId']"
                            >
                                <a-select
                                    style="width: 100%"
                                    v-model:value="record[column.dataIndex]"
                                    placeholder="请选择"
                                    allowClear
                                    :filter-option="filterOption"
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
                                        message: '请选择采集器',
                                    },
                                ]"
                            >
                                <MSelect
                                    v-model="record[column.dataIndex]"
                                    :id="record.channelId"
                                    type="COLLECTOR"
                                />
                            </a-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'pointId'">
                            <a-form-item
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
                                />
                            </a-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'id'">
                            <a-badge
                                v-if="record[column.dataIndex]"
                                status="success"
                                text="已绑定"
                            />
                            <a-badge v-else status="error" text="未绑定" />
                        </template>
                        <template v-if="column.key === 'action'">
                            <a-tooltip title="解绑">
                                <a-popconfirm
                                    title="确认解绑"
                                    @confirm="unbind(record.id)"
                                >
                                    <a-button type="link" :disabled="!record.id"
                                        ><AIcon type="icon-jiebang"
                                    /></a-button>
                                </a-popconfirm>
                            </a-tooltip>
                        </template>
                    </template>
                </a-table>
            </a-form>
        </a-card>
        <PatchMapping
            :deviceId="instanceStore.current.id"
            v-if="visible"
            @close="visible = false"
            @save="onPatchBind"
            :type="provider"
            :metaData="modelRef.dataSource"
        />
    </a-spin>
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
import { message } from 'ant-design-vue/es';

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
        terms: [
            {
                terms: [
                    {
                        column: 'provider',
                        value: props.provider,
                    },
                ],
            },
        ],
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
    const _metadata = metadata.properties.map((item: any) => ({
        metadataId: item.id,
        metadataName: `${item.name}(${item.id})`,
        metadataType: 'property',
        name: item.name,
    }));
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

const unbind = async (id: string) => {
    if (id) {
        const resp = await removeMapping('device', instanceStore.current.id, [
            id,
        ]);
        if (resp.status === 200) {
            message.success('操作成功！');
            handleSearch();
        }
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
            const arr = toRaw(modelRef).dataSource.filter(
                (i: any) => i.channelId,
            );
            if (arr && arr.length !== 0) {
                const resp = await saveMapping(
                    instanceStore.current.id,
                    props.provider,
                    arr,
                );
                if (resp.status === 200) {
                    message.success('操作成功！');
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