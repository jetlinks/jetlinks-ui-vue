<template>
    <a-spin v-if="metadata.properties?.length" :spinning="loading">
        <a-card :bordered="false" borderStyle="padding: 0">
            <template #extra>
                <a-space>
                    <a-button @click="importVisible = true">导入</a-button>
                    <a-button @click="visible = true">{{ $t('EditTable.index.478060-0') }}</a-button>
                    <a-button type="primary" @click="onSave">{{ $t('EditTable.index.478060-1') }}</a-button>
                </a-space>
            </template>
            <a-form ref="formRef" :model="modelRef">
                <a-table
                    :columns="columns"
                    :dataSource="modelRef.dataSource"
                    @change="tableChange"
                    :pagination="{
                            total: modelRef.dataSource.length,
                            current: myCurrent + 1,
                            pageSize: pageSize,
                            pageSizeOptions: ['12', '24', '48', '96'],
                            showSizeChanger: true,
                            hideOnSinglePage: false,
                            showTotal: (total: number, range: number) => $t('SyncUser.index.935207-3', [range[0],range[1],total]),
                        }"
                >
                    <template #headerCell="{ column }">
                        <template v-if="column.key === 'collectorId'">
                            {{ $t('EditTable.index.478060-2') }}
                            <a-tooltip :title="$t('EditTable.index.478060-3')">
                                <AIcon type="QuestionCircleOutlined" />
                            </a-tooltip>
                        </template>
                    </template>
                    <template #bodyCell="{ column, record, index }">
                        <template v-if="column.dataIndex === 'channelId'">
                            <a-form-item
                                :name="[
                                    'dataSource',
                                    myCurrent * pageSize + index,
                                    'channelId',
                                ]"
                            >
                                <a-select
                                    style="width: 100%"
                                    v-model:value="record[column.dataIndex]"
                                    :placeholder="$t('EditTable.index.478060-4')"
                                    allowClear
                                    show-search
                                    :filter-option="filterOption"
                                    :options="channelList"
                                    @change="onChannelChange(index, 'channel')"
                                    @select="
                                        (_, option) => {
                                            record.provider = option.provider;
                                        }
                                    "
                                >
                                </a-select>
                            </a-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'collectorId'">
                            <a-form-item
                                :name="[
                                    'dataSource',
                                    myCurrent * pageSize + index,
                                    'collectorId',
                                ]"
                                :rules="[
                                    {
                                        required: !!record.channelId,
                                        message: $t('EditTable.index.478060-5'),
                                    },
                                ]"
                            >
                                <MSelect
                                    v-model="record[column.dataIndex]"
                                    :id="record.channelId"
                                    type="COLLECTOR"
                                    @change="onChannelChange(index, 'collector')"
                                />
                            </a-form-item>
                        </template>
                        <template v-if="column.dataIndex === 'pointId'">
                            <a-form-item
                                :name="[
                                    'dataSource',
                                    myCurrent * pageSize + index,
                                    'pointId',
                                ]"
                                :rules="[
                                    {
                                        required: !!record.channelId,
                                        message: $t('EditTable.index.478060-6'),
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
                                :text="$t('EditTable.index.478060-7')"
                            />
                            <a-badge v-else status="error" :text="$t('EditTable.index.478060-8')" />
                        </template>
                        <template v-if="column.key === 'action'">
                            <j-permission-button
                                type="link"
                                :tooltip="{
                                    title: $t('EditTable.index.478060-9'),
                                }"
                                :popConfirm="{
                                    title: $t('EditTable.index.478060-10'),
                                    onConfirm: () => unbind(record.id),
                                }"
                                :disabled="!record.id"
                                ><AIcon type="icon-jiebang"
                            /></j-permission-button>
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
    <a-card v-else :bordered="false" borderStyle="padding: 0">
        <JEmpty :description="$t('EditTable.index.478060-11')" style="margin: 10% 0" />
    </a-card>
    <BatchImport
        v-if="importVisible"
        :width="750"
        :downloadUrlBuilder="downloadAnalyzeMetadataTemplate"
        :request="(fileUrl) => importAnalyzeMetadata(instanceStore.current.id, fileUrl, autoCreate)"
        message="1.若平台中不存在匹配的采集器点位，则自动跳过该条数据，不会覆盖<br />2.若需根据点位自动创建物模型，请在上传文件前启用该选项。上传后再修改将无效"
        @close="importVisible = false"
        @save="handleImportSuccess"
    >
        <template #content>
            <a-space>
                <span>根据数采点位自动创建物模型</span>
                <a-tooltip title="若无对应物模型，则自动创建物模型并映射">
                    <AIcon type="QuestionCircleOutlined"/>
                </a-tooltip>
                <a-switch v-model:checked="autoCreate"></a-switch>
            </a-space>
        </template>
    </BatchImport>
</template>

<script lang="ts" setup>
import { useInstanceStore } from '@device-manager-ui/store/instance';
import {
    queryMapping,
    saveMapping,
    removeMapping,
    queryChannelNoPaging,
    downloadAnalyzeMetadataTemplate,
    importAnalyzeMetadata
} from '@device-manager-ui/api/instance';
import MSelect from '../MSelect.vue';
import PatchMapping from './PatchMapping.vue';
import { onlyMessage } from '@jetlinks-web-core/utils/comm';
import { useI18n } from 'vue-i18n';
import BatchImport from '@jetlinks-web-core/components/BatchImport/index.vue';

const { t: $t } = useI18n();

const columns = [
    {
        title: $t('EditTable.index.478060-12'),
        dataIndex: 'metadataName',
        key: 'metadataName',
        width: '20%',
        ellipsis: true
    },
    {
        title: $t('EditTable.index.478060-13'),
        dataIndex: 'channelId',
        key: 'channelId',
        width: '20%',
    },
    {
        title: $t('EditTable.index.478060-2'),
        dataIndex: 'collectorId',
        key: 'collectorId',
        width: '20%',
    },
    {
        title: $t('EditTable.index.478060-14'),
        key: 'pointId',
        dataIndex: 'pointId',
        width: '20%',
    },
    {
        title: $t('EditTable.index.478060-15'),
        key: 'id',
        dataIndex: 'id',
        width: '10%',
        ellipsis: true
    },
    {
        title: $t('EditTable.index.478060-16'),
        key: 'action',
        fixed: 'right',
        width: '10%',
    },
];

const autoCreate = ref(false)
const importVisible = ref(false)
const myCurrent = ref(0);
const pageSize = ref(12);

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
const metadata = computed(() => JSON.parse(instanceStore.current?.metadata || '{}'));
const loading = ref<boolean>(false);
const channelList = ref([]);

const modelRef = reactive({
    dataSource: [],
});

const formRef = ref();
const visible = ref<boolean>(false);

const onChannelChange = (_index: number, type: 'collector' | 'channel') => {
    if (type === 'channel') {
        modelRef.dataSource[_index].collectorId = undefined;
        modelRef.dataSource[_index].pointId = undefined;
    } else {
        modelRef.dataSource[_index].pointId = undefined;
    }
};

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
        metadata.value.properties?.map?.((item: any) => ({
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
    myCurrent.value = pageSize.value !== pagination.pageSize ? 0 : pagination.current - 1;
    pageSize.value = pagination.pageSize || 12
};

const unbind = (id: string) => {
    if (id) {
        const response = removeMapping('device', instanceStore.current.id, [
            id,
        ]);
        response.then((resp) => {
            if (resp.status === 200) {
                onlyMessage($t('EditTable.index.478060-17'));
                handleSearch();
            }
        });
        return response
    }
};

const onPatchBind = () => {
    visible.value = false;
    handleSearch();
};

// 导入数采映射成功
const handleImportSuccess = () => {
    handleSearch();
}

onMounted(() => {
    handleSearch();
});

const onSave = () => {
    formRef.value
        .validate()
        .then(async () => {
            const arr = toRaw(modelRef).dataSource.filter(
                (i: any) => i.channelId,
            ).map(item => {
                if (instanceStore.current.state?.value === 'notActive') {
                    item.state = 'disabled'
                }
                return item;
            });
            if (arr && arr.length !== 0) {
                const resp = await saveMapping(
                    instanceStore.current.id,
                    props.provider,
                    arr,
                );
                if (resp.status === 200) {
                    onlyMessage($t('EditTable.index.478060-17'));
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
:deep(.ant-pagination-item) {
  display: none !important;
}
</style>
