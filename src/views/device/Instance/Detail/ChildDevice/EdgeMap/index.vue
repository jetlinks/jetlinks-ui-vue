<template>
    <a-spin :spinning="loading" v-if="_metadata">
        <a-card :bordered="false">
            <template #title>
                <TitleComponent data="点位映射"></TitleComponent>
            </template>
            <template #extra>
                <a-space>
                    <a-button @click="showModal">批量映射</a-button>
                    <a-button type="primary" @click="onSave">保存</a-button>
                </a-space>
            </template>
            <a-form ref="formRef" :model="modelRef">
                <a-table :dataSource="modelRef.dataSource" :columns="columns">
                    <template #headerCell="{ column }">
                        <template v-if="column.key === 'collectorId'">
                            采集器
                            <a-tooltip title="边缘网关代理的真实物理设备">
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
                                    :edgeId="instanceStore.current.id"
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
                                    :edgeId="instanceStore.current.id"
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
                                    :disabled="!record.id"
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
            :deviceId="instanceStore.current.parentId"
            v-if="visible"
            @close="visible = false"
            @save="onPatchBind"
            :metaData="modelRef.dataSource"
            :edgeId="instanceStore.current.id"
            :deviceData="deviceData"
        />
    </a-spin>
    <a-card v-else>
        <JEmpty description="暂无数据，请配置物模型" style="margin: 10% 0" />
    </a-card>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@/store/instance';
import {
    getEdgeMap,
    saveEdgeMap,
    removeEdgeMap,
    edgeChannel,
    addDevice,
    editDevice,
} from '@/api/device/instance';
import MSelect from './MSelect.vue';
import PatchMapping from './PatchMapping.vue';
import { message } from 'ant-design-vue/es';
import { inject } from 'vue';
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
const validate = inject('validate');
const form = ref();
const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const  props = defineProps(['productList']);
const _emit = defineEmits(['close']);
const instanceStore = useInstanceStore();
let _metadata = ref();
const loading = ref<boolean>(false);
const channelList = ref([]);

const modelRef = reactive({
    dataSource: [],
});
const deviceData = ref();
const formRef = ref();
const visible = ref<boolean>(false);

const getChannel = async () => {
    if (instanceStore.current?.id) {
        const resp: any = await edgeChannel(instanceStore.current.id);
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
    modelRef.dataSource = _metadata;
    getChannel();
    if (_metadata && _metadata.length) {
        const resp: any = await getEdgeMap(instanceStore.current?.orgId || '', {
            deviceId: instanceStore.current.id,
            query: {},
        }).catch(() => {
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
            message.success('操作成功！');
            handleSearch();
        }
    }
};

const onPatchBind = () => {
    visible.value = false;
    _emit('close');
};

onMounted(() => {
    handleSearch();
});

watchEffect(() => {
    if (instanceStore.current?.metadata) {
        _metadata.value = instanceStore.current?.metadata;
    } else {
        _metadata.value = {};
    }
});
const onSave = async () => {
    form.value = await validate();
    if (form.value) {
        formRef.value.validateFields().then(async () => {
            if (modelRef.dataSource.length === 0) {
                message.error('请配置物模型');
            } else {
                channelList.value.forEach((item: any) => {
                    modelRef.dataSource.forEach((i: any) => {
                        if (item.value === i.channelId) {
                            i.provider = item.provider;
                        }
                    });
                });
                const formData = {
                    ...form.value,
                    productName: props.productList.find(
                        (item: any) => item.id === form.value?.productId,
                    ).name,
                    parentId: instanceStore.current.id,
                    id: instanceStore.current.parentId
                        ? instanceStore.current.parentId
                        : undefined,
                };
                const resq = instanceStore.current.parentId
                    ? await editDevice(formData)
                    : await addDevice(formData);
                if (resq.status === 200) {
                    const array = modelRef.dataSource.filter(
                        (item: any) => item.channelId,
                    );
                    const submitData = {
                        deviceId: instanceStore.current.parentId
                            ? instanceStore.current.parentId
                            : resq.result?.id,
                        provider: array?.[0]?.provider,
                        requestList: array,
                    };
                    save(submitData);
                }
            }
        });
    }
};
const save = async (item: any) => {
    const res = await saveEdgeMap(instanceStore.current.id, item);
    if (res.status === 200) {
        message.success('保存成功');
        _emit('close');
    }
};
const showModal = async () => {
    form.value = await validate();
    if (form.value) {
        const formData = {
            ...form.value,
            productName: props.productList.find(
                (item: any) => item.id === form.value?.productId,
            ).name,
            parentId: instanceStore.current.id,
        };
        deviceData.value = formData;
    }
    visible.value = true;
};
</script>

<style lang="less" scoped>
:deep(.ant-form-item) {
    margin: 0 !important;
}
</style>