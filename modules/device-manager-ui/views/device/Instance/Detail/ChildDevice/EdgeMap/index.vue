<template>
    <a-spin :spinning="loading" v-if="_metadata?.length">
        <a-card :bordered="false">
            <template #title>
                <TitleComponent :data="$t('EdgeMap.index.626301-0')"></TitleComponent>
            </template>
            <template #extra>
                <a-space>
                    <a-button @click="showModal">{{ $t('EdgeMap.index.626301-1') }}</a-button>
                    <a-button type="primary" @click="onSave"
                        >{{ $t('EdgeMap.index.626301-2') }}</a-button
                    >
                </a-space>
            </template>
            <a-form ref="formRef" :model="modelRef">
                <a-table :dataSource="modelRef.dataSource" :columns="columns">
                    <template #headerCell="{ column }">
                        <template v-if="column.key === 'collectorId'">
                            {{ $t('EdgeMap.index.626301-3') }}
                            <a-tooltip :title="$t('EdgeMap.index.626301-4')">
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
                                    :placeholder="$t('EdgeMap.index.626301-5')"
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
                                        message: $t('EdgeMap.index.626301-6'),
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
                                        message: $t('EdgeMap.index.626301-7'),
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
                                :text="$t('EdgeMap.index.626301-8')"
                            />
                            <a-badge v-else status="error" :text="$t('EdgeMap.index.626301-9')" />
                        </template>
                        <template v-if="column.key === 'action'">
                            <j-permission-button
                                type="link"
                                :tooltip="{
                                    title: $t('EdgeMap.index.626301-10'),
                                }"
                                :disabled="!record.id"
                                :popConfirm="{
                                    title: $t('EdgeMap.index.626301-11'),
                                    onConfirm: () => unbind(record.id),
                                }"
                                ><AIcon type="icon-jiebang"
                            /></j-permission-button>
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
        <JEmpty :description="$t('EdgeMap.index.626301-12')" style="margin: 10% 0" />
    </a-card>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '../../../../../../store/instance';
import {
    saveEdgeMap,
    removeEdgeMap,
    edgeChannel,
    addDevice,
    editDevice,
    saveDeviceMapping,
} from '../../../../../../api/instance';
import MSelect from './MSelect.vue';
import PatchMapping from './PatchMapping.vue';
import { inject } from 'vue';
import { onlyMessage } from '@jetlinks-web/utils';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const columns = [
    {
        title: $t('EdgeMap.index.626301-13'),
        dataIndex: 'metadataName',
        key: 'metadataName',
        width: '20%',
    },
    {
        title: $t('EdgeMap.index.626301-14'),
        dataIndex: 'channelId',
        key: 'channelId',
        width: '20%',
    },
    {
        title: $t('EdgeMap.index.626301-3'),
        dataIndex: 'collectorId',
        key: 'collectorId',
        width: '20%',
    },
    {
        title: $t('EdgeMap.index.626301-15'),
        key: 'pointId',
        dataIndex: 'pointId',
        width: '20%',
    },
    {
        title: $t('EdgeMap.index.626301-16'),
        key: 'id',
        dataIndex: 'id',
        width: '10%',
    },
    {
        title: $t('EdgeMap.index.626301-17'),
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
const _emit = defineEmits(['close', 'getEdgeMap']);
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
const unbind = (id: string) => {
    if (id) {
        const response = removeEdgeMap(instanceStore.current?.id || '', {
            deviceId: instanceStore.current.parentId,
            idList: [id],
        });
        response.then((resp) => {
            if (resp.status === 200) {
                onlyMessage($t('EdgeMap.index.626301-18'));
                _emit('getEdgeMap');
            }
        });
        return response
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
                onlyMessage($t('EdgeMap.index.626301-19'), 'error');
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
                            {
                                deviceId: resq.result?.id,
                                deviceName: formData.name,
                            },
                        ],
                    };
                    if (!instanceStore.current.parentId) {
                        const res = await saveDeviceMapping(
                            instanceStore.current.id,
                            params,
                        );
                    }
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
        onlyMessage($t('EdgeMap.index.626301-20'));
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

<style lang="less" scoped></style>
