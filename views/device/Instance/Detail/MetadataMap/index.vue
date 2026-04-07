<template>
    <div class="metadata-map">
        <div class="left">
            <a-space style="margin-bottom: 24px">
                <a-select
                    @change="onSearchChange"
                    show-search
                    allow-clear
                    :placeholder="$t('MetadataMap.index.431828-0')"
                    style="width: 250px"
                >
                    <a-select-option
                        :label="item.name"
                        v-for="item in dataSourceCache"
                        :value="item?.id"
                        :key="item?.id"
                        >{{ item?.name }}</a-select-option
                    >
                </a-select>
                <a-button type="primary" @click="onSearch"
                    ><AIcon type="SearchOutlined"
                /></a-button>
            </a-space>
            <div class="box">
                <j-scrollbar height="100%">
                    <a-table
                        :columns="columns"
                        :data-source="dataSource"
                        :pagination="false"
                        :rowSelection="{
                            selectedRowKeys: selectedKeys,
                            hideSelectAll: true,
                            columnWidth: 0,
                        }"
                        rowKey="id"
                        :customRow="customRow"
                    >
                        <template #headerCell="{ column }">
                            <template v-if="column.dataIndex === 'original'">
                                <div
                                    style="
                                        width: 100%;
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: center;
                                    "
                                >
                                    <span>
                                        {{ $t('MetadataMap.index.431828-1') }}<a-tooltip
                                            :title="$t('MetadataMap.index.431828-2')"
                                        >
                                            <AIcon
                                                style="margin-left: 10px"
                                                type="QuestionCircleOutlined"
                                            />
                                        </a-tooltip>
                                    </span>
                                    <a-tag
                                        v-if="filterValue !== undefined"
                                        color="#87d068"
                                        closable
                                        @close="onClose"
                                        ><AIcon
                                            type="ArrowUpOutlined"
                                        /><span>{{
                                            filterValue ? $t('MetadataMap.index.431828-3') : $t('MetadataMap.index.431828-4')
                                        }}</span></a-tag
                                    >
                                    <a-dropdown v-else>
                                        <AIcon type="FilterOutlined" />
                                        <template #overlay>
                                            <a-menu @click="onFilter">
                                                <a-menu-item :key="true"
                                                    >{{ $t('MetadataMap.index.431828-5') }}</a-menu-item
                                                >
                                                <a-menu-item :key="false"
                                                    >{{ $t('MetadataMap.index.431828-6') }}</a-menu-item
                                                >
                                            </a-menu>
                                        </template>
                                    </a-dropdown>
                                </div>
                            </template>
                        </template>
                        <template #bodyCell="{ column, text, record }">
                            <template v-if="column.dataIndex === 'name'">
                                <span class="metadata-title" ref="title">
                                    <j-ellipsis>
                                        {{ text }} ({{ record.id }})
                                    </j-ellipsis>
                                </span>
                            </template>
                            <template v-if="column.dataIndex === 'original'">
                                <a-select
                                    v-model:value="record.original"
                                    style="width: 100%"
                                    allowClear
                                    @change="(id) => onChange(record, id)"
                                    :placeholder="$t('MetadataMap.index.431828-7')"
                                >
                                    <a-select-option
                                        v-for="(item, index) in targetOptions"
                                        :key="index + '_' + item.id"
                                        :value="item.value"
                                    >
<!--                                      :disabled="
                                            selectedOriginalKeys.includes(
                                                item.id,
                                            )
                                        "-->
                                        {{ item.label }} ({{
                                            item.id
                                        }})</a-select-option
                                    >
                                </a-select>
                            </template>
                        </template>
                    </a-table>
                </j-scrollbar>
            </div>
        </div>
        <div class="right">
            <j-scrollbar>
                <div class="title">{{ $t('MetadataMap.index.431828-8') }}</div>
                <p>
                    {{ $t('MetadataMap.index.431828-9') }}
                    <b>{{ $t('MetadataMap.index.431828-10') }}</b>{{ $t('MetadataMap.index.431828-11') }}
                    <b>{{ $t('MetadataMap.index.431828-12') }}</b
                    >{{ $t('MetadataMap.index.431828-13') }}
                </p>
              <p>
                {{ $t('MetadataMap.index.130045-18') }}
              </p>
                <p>
                    {{ $t('MetadataMap.index.431828-15') }}<b>{{ $t('MetadataMap.index.431828-16') }}</b>{{ $t('MetadataMap.index.431828-17') }}<b>{{ $t('MetadataMap.index.431828-18') }}</b>{{ $t('MetadataMap.index.431828-19') }}
                </p>
                <div class="title">{{ $t('MetadataMap.index.431828-20') }}</div>
                <div>
                    <img :src="device.metadataMap" />
                </div>
            </j-scrollbar>
        </div>
    </div>
</template>

<script setup lang='ts' name='MetadataMap'>
import { storeToRefs } from 'pinia';
import { onlyMessage } from '@jetlinks-web/utils';
import {
    getMetadataMapById,
    metadataMapById,
    getProtocolMetadata,
} from '../../../../../api/instance';
import { useInstanceStore } from '../../../../../store/instance';
import { cloneDeep } from 'lodash-es';
import {device} from "../../../../../assets";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const deviceStore = useInstanceStore();
const { current: deviceDetail } = storeToRefs(deviceStore);
const dataSourceCache = ref([]);
const dataSource = ref([]);
const targetOptions = ref<any[]>([]);

const filterValue = ref<boolean | undefined>(undefined);
const originalData = ref([]);

const _value = ref<any>(undefined);
const searchValue = ref<any>(undefined);
const _delTag = ref<boolean>(false);

const columns = [
    {
        title: $t('MetadataMap.index.431828-21'),
        dataIndex: 'index',
        width: 100,
    },
    {
        title: $t('MetadataMap.index.431828-22'),
        dataIndex: 'name',
    },
    {
        title: $t('MetadataMap.index.431828-1'),
        dataIndex: 'original',
        width: 250,
    },
];

const selectedKeys = computed(() => {
    return (
        dataSource.value
            ?.filter((item: any) => !!item?.original)
            .map((i: any) => i.id) || []
    );
});

const selectedOriginalKeys = computed(() => {
    return (
        dataSource.value
            ?.filter((item: any) => !!item?.original)
            .map((i: any) => i.original) || []
    );
});

const metadata = computed(() => {
    return JSON.parse(deviceDetail.value?.metadata || '{}');
});

const _id = deviceDetail.value?.id;

const getMetadataMapData = () => {
    return new Promise((resolve) => {
        getMetadataMapById('device', _id).then((res: any) => {
            if (res.success) {
                resolve(
                    res.result
                        ?.filter((i: any) => i.customMapping)
                        ?.map((item: any) => {
                            return {
                                id: item.metadataId,
                                originalId: item.originalId,
                                customMapping: item.customMapping,
                            };
                        }) || [],
                );
            }
        });
    });
};

const customRow = (record: any) => {
    return {
        id: record.id,
        class: _value.value === record?.name ? 'metadata-search-row' : '',
    };
};

const onSearchChange = (_: any, options: any) => {
    searchValue.value = options?.label;
};

const onSearch = () => {
    if (searchValue.value) {
        const _item: any = dataSourceCache.value.find((item: any) => {
            return searchValue.value === item?.name;
        });
        if (_item) {
            _value.value = _item?.name;
            document.getElementById(_item?.id)?.scrollIntoView(); // 滚动到可视区域
        }
    } else {
        _value.value = undefined;
    }
};

const getDefaultMetadata = async () => {
    const properties = metadata.value?.properties;
    if (!deviceDetail.value?.protocol) {
        return;
    }
    const _metadata = await getMetadata();
    const _properties = _metadata?.properties || [];
    const metadataMap: any = await getMetadataMapData();

    targetOptions.value = _properties.map((item) => ({
        ...item,
        label: item?.name,
        value: item.id,
    }));

    const concatProperties = [...metadataMap];

    if (!concatProperties.length) {
        _delTag.value = true;
        const arr = concatProperties.map((item) => item.id);
        const _arr = concatProperties.map((item) => item.originalId);

        _properties.map((item) => {
            // 添加默认映射，但是该选项还没被其他属性映射
            if (!arr.includes(item.id) && !_arr.includes(item.id)) {
                concatProperties.push({
                    id: item.id,
                    originalId: item.id,
                    customMapping: item?.customMapping,
                });
            }
        });
    }
    dataSource.value =
        properties?.map((item: any, index: number) => {
            const _m = concatProperties.find((p) => p.id === item.id);
            return {
                index: index + 1,
                id: item.id, // 产品物模型id
                name: item?.name,
                type: item.valueType?.type,
                customMapping: _m?.customMapping,
                original: _m?.originalId, // 协议包物模型id
            };
        }) || [];
    dataSourceCache.value = dataSource.value;
};

const getMetadata = (): Promise<{ properties: any[] }> => {
    return new Promise((resolve) => {
        const transport = deviceDetail.value?.transport;
        getProtocolMetadata(deviceDetail.value?.protocol || '', transport).then(
            (res: any) => {
                if (res.success) {
                    resolve(JSON.parse(res?.result || '{}'));
                }
                resolve({ properties: [] });
            },
        );
    });
};

const onMapData = async (arr: any[], flag?: boolean) => {
    const res = await metadataMapById('device', _id, arr);
    if (res.success && flag) {
        onlyMessage($t('MetadataMap.index.431828-23'));
    }
};

const onChange = async (value: any, id: string) => {
    if ((!id && value?.customMapping) || id) {
        // 映射 / 取消映射
        const arr = [
            {
                metadataType: 'property',
                metadataId: value.id,
                originalId: id,
            },
        ];
        onMapData(arr, true);
    }
};

const onFilter = ({ key }: any) => {
    originalData.value = dataSource.value;
    const _dataSource = cloneDeep(dataSource.value).sort((a: any, b: any) => {
        if (!key) {
            return (a.original ? 1 : -1) - (b.original ? 1 : -1);
        } else {
            return (b.original ? 1 : -1) - (a.original ? 1 : -1);
        }
    });

    dataSource.value = _dataSource;
    filterValue.value = key;
};

const onClose = () => {
    filterValue.value = undefined;
    dataSource.value = originalData.value;
};

onMounted(() => {
    getDefaultMetadata();
});

onUnmounted(() => {
    if (_delTag.value && dataSourceCache.value) {
        // 保存数据
        const arr = dataSourceCache.value.filter((i: any) => i?.original).map((item: any) => {
            return {
                metadataType: 'property',
                metadataId: item.id,
                originalId: item.original,
            }
        })
        onMapData(arr)
    }
});
</script>

<style scoped lang='less'>
.metadata-map {
    min-height: 100%;
    display: flex;
    gap: 24px;

    .left {
        flex: 1;
        height: 100%;

        .box {
            height: calc(100vh - 388px);
            overflow: hidden;

            :deep(.metadata-search-row) {
                td {
                    background: #ffff80 !important;
                }
            }
        }
    }

    .right {
        // position: absolute;
        border: 1px solid rgba(0, 0, 0, 0.08);
        min-height: 100%;
        min-width: 410px;
        width: 33.33333%;
        // top: 0;
        // right: 0;
        padding: 16px;

        .title {
            margin-bottom: 16px;
            color: rgba(#000, 0.85);
            font-weight: bold;

            p {
                initial-letter: 28px;
                color: #666666;
            }
        }
    }

    .metadata-title {
        color: #666666;
    }

    :deep(.ant-table-selection-column) {
        padding: 0;
        label {
            display: none;
        }
    }
}
</style>
