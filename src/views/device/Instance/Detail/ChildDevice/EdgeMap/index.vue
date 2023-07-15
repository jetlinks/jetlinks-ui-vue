<template>
    <j-spin :spinning="loading" v-if="_metadata?.length">
        <j-card :bordered="false">
            <template #title>
                <TitleComponent data="点位映射"></TitleComponent>
            </template>
            <template #extra>
                <j-space>
                    <j-button @click="showModal">批量映射</j-button>
                    <j-button type="primary" @click="onSave"
                        >保存并应用</j-button
                    >
                </j-space>
            </template>
            <j-form ref="formRef" :model="modelRef">
                <j-table :dataSource="modelRef.dataSource" :columns="columns">
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
                                    :edgeId="instanceStore.current.id"
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
                                    :edgeId="instanceStore.current.id"
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
                            <j-tooltip title="解绑">
                                <j-popconfirm
                                    title="确认解绑"
                                    :disabled="!record.id"
                                    @confirm="unbind(record.id)"
                                >
                                    <j-button type="link" :disabled="!record.id"
                                        ><AIcon type="icon-jiebang"
                                    /></j-button>
                                </j-popconfirm>
                            </j-tooltip>
                        </template>
                    </template>
                </j-table>
            </j-form>
        </j-card>
        <PatchMapping
            :deviceId="instanceStore.current.parentId"
            v-if="visible"
            @close="visible = false"
            @save="onPatchBind"
            :metaData="modelRef.dataSource"
            :edgeId="instanceStore.current.id"
            :deviceData="deviceData"
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
    addDevice,
    editDevice,
    saveDeviceMapping
} from '@/api/device/instance';
import MSelect from './MSelect.vue';
import PatchMapping from './PatchMapping.vue';
import { inject } from 'vue';
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
const validate = inject('validate');
const form = ref();
const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};
const props = defineProps(['productList']);
const _emit = defineEmits(['close','getEdgeMap']);
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
/**获取通道列表 */
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
/**
 * 初始化
 */
const handleSearch = async () => {
    loading.value = true;
    getChannel();
    modelRef.dataSource = _metadata.value;
    loading.value = false;
};
/**
 * 解绑映射
 * @param id 选择解绑id
 */
const unbind = async (id: string) => {
    if (id) {
        const resp = await removeEdgeMap(
            instanceStore.current?.id || '',
            {
                deviceId: instanceStore.current.parentId,
                idList: [id],
            },
        );
        if (resp.status === 200) {
            onlyMessage('操作成功！');
            _emit('getEdgeMap');
        }
    }
};

const onPatchBind = () => {
    visible.value = false;
    _emit('close');
};
watchEffect(() => {
    if (instanceStore.current?.metadata) {
        _metadata.value = instanceStore.current?.metadata;
    } else {
        _metadata.value = {};
    }
    handleSearch();
});
const onSave = async () => {
    form.value = await validate();
    if (form.value) {
        formRef.value.validateFields().then(async () => {
            if (modelRef.dataSource.length === 0) {
                onlyMessage('请配置物模型', 'error');
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
                    parentId: instanceStore.current.id, // 网关设备id
                    id: instanceStore.current.parentId // 设备id
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
                    const params = {
                      info: [
                        { deviceId: resq.result?.id, deviceName: formData.name }
                      ]
                    }
                    const res = await saveDeviceMapping(instanceStore.current.id, params)
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
        onlyMessage('保存成功');
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
</style>