<template>
    <j-spin v-if="metadata.properties?.length" :spinning="loading">
        <j-card :bordered="false" borderStyle="padding: 0">
            <template #extra>
                <j-space>
                    <j-button @click="visible = true">{{ $t('EditTable.index.920632-0') }}</j-button>
                    <j-button type="primary" @click="onSave">{{ $t('EditTable.index.920632-1') }}</j-button>
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
                            {{ $t('EditTable.index.920632-2') }}
                            <j-tooltip :title="$t('EditTable.index.920632-3')">
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
                                    :placeholder="$t('EditTable.index.920632-4')"
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
                                        message: $t('EditTable.index.920632-5'),
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
                                        message: $t('EditTable.index.920632-6'),
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
                                :text="$t('EditTable.index.920632-7')"
                            />
                            <j-badge v-else status="error" :text="$t('EditTable.index.920632-8')" />
                        </template>
                        <template v-if="column.key === 'action'">
                            <PermissionButton
                                type="link"
                                :tooltip="{
                                    title: $t('EditTable.index.920632-9'),
                                }"
                                :popConfirm="{
                                    title: $t('EditTable.index.920632-10'),
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
        <JEmpty :description="$t('EditTable.index.920632-11')" style="margin: 10% 0" />
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
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const columns = [
    {
        title: $t('EditTable.index.920632-12'),
        dataIndex: 'metadataName',
        key: 'metadataName',
        width: '20%',
    },
    {
        title: $t('EditTable.index.920632-13'),
        dataIndex: 'channelId',
        key: 'channelId',
        width: '20%',
    },
    {
        title: $t('EditTable.index.920632-2'),
        dataIndex: 'collectorId',
        key: 'collectorId',
        width: '20%',
    },
    {
        title: $t('EditTable.index.920632-14'),
        key: 'pointId',
        dataIndex: 'pointId',
        width: '20%',
    },
    {
        title: $t('EditTable.index.920632-15'),
        key: 'id',
        dataIndex: 'id',
        width: '10%',
    },
    {
        title: $t('EditTable.index.920632-16'),
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
                onlyMessage($t('EditTable.index.920632-17'));
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
                console.log(arr);
                const resp = await saveMapping(
                    instanceStore.current.id,
                    props.provider,
                    arr,
                );
                if (resp.status === 200) {
                    onlyMessage($t('EditTable.index.920632-17'));
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
