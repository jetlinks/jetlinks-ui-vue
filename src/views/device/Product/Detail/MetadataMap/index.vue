<template>
    <div class="metadata-map">
        <div class="left">
          <j-space style="margin-bottom: 24px">
                <j-select @change="onSearchChange" show-search allow-clear :placeholder="$t('MetadataMap.index.064551-0')" style="width: 250px;">
                    <j-select-option :label="item.name" v-for="item in dataSourceCache" :value="item?.id" :key="item?.id">{{item?.name}}</j-select-option>
                </j-select>
                <j-button type="primary" @click="onSearch"><AIcon type="SearchOutlined" /></j-button>
            </j-space>
            <div class="box">
                <j-scrollbar height="100%">
                    <j-table
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
                            <template v-if="column.dataIndex === 'plugin'">
                                <div
                                    style="
                                        width: 100%;
                                        display: flex;
                                        justify-content: space-between;
                                        align-items: center;
                                    "
                                >
                                    <span>
                                        {{ $t('MetadataMap.index.064551-1') }}<j-tooltip
                                            :title="$t('MetadataMap.index.064551-2')"
                                        >
                                            <AIcon
                                                style="margin-left: 10px"
                                                type="QuestionCircleOutlined"
                                            />
                                        </j-tooltip>
                                    </span>
                                    <j-tag
                                        v-if="filterValue !== undefined"
                                        color="#87d068"
                                        closable
                                        @close="onClose"
                                        ><AIcon
                                            type="ArrowUpOutlined"
                                        /><span>{{
                                            filterValue ? $t('MetadataMap.index.064551-3') : $t('MetadataMap.index.064551-4')
                                        }}</span></j-tag
                                    >
                                    <j-dropdown v-else>
                                        <AIcon type="FilterOutlined" />
                                        <template #overlay>
                                            <j-menu @click="onFilter">
                                                <j-menu-item :key="true"
                                                    >{{ $t('MetadataMap.index.064551-5') }}</j-menu-item
                                                >
                                                <j-menu-item :key="false"
                                                    >{{ $t('MetadataMap.index.064551-6') }}</j-menu-item
                                                >
                                            </j-menu>
                                        </template>
                                    </j-dropdown>
                                </div>
                            </template>
                        </template>
                        <template #bodyCell="{ column, text, record }">
                            <template v-if="column.dataIndex === 'name'">
                                <span class="metadata-title">
                                    <j-ellipsis>
                                        {{ text }} ({{ record.id }})
                                    </j-ellipsis>
                                </span>
                            </template>
                            <template v-if="column.dataIndex === 'plugin'">
                                <j-select
                                    v-model:value="record.plugin"
                                    style="width: 100%"
                                    allowClear
                                    @change="(id) => pluginChange(record, id)"
                                >
                                    <j-select-option
                                        v-for="(item, index) in pluginOptions"
                                        :key="index + '_' + item.id"
                                        :value="item.value"
                                        :disabled="
                                            selectedPluginKeys.includes(item.id)
                                        "
                                        ><j-tooltip
                                            :title="
                                                selectedPluginKeys.includes(
                                                    item.id,
                                                )
                                                    ? $t('MetadataMap.index.064551-7')
                                                    : ''
                                            "
                                        >
                                            {{ item.label }} ({{ item.id }})
                                        </j-tooltip></j-select-option
                                    >
                                </j-select>
                            </template>
                        </template>
                    </j-table>
                </j-scrollbar>
            </div>
        </div>
        <div class="right">
            <j-scrollbar>
                <div class="title">{{ $t('MetadataMap.index.064551-8') }}</div>
                <p>
<!--                  This function is used to map-->
<!--                  <b>object model attribute identifiers</b>-->
<!--                  in the plugin/protocol package to-->
<!--                  <b>platform object model attribute identifiers</b>.-->
<!--                  When the attribute identifiers of the two parties are inconsistent, the mapping management can be directly modified on the current page, and the system will process the data based on the-->
<!--                  <b>mapped object model attributes</b>.-->
                    {{ $t('MetadataMap.index.064551-9') }}
                    <b>{{ $t('MetadataMap.index.064551-10') }}</b>
                  {{ $t('MetadataMap.index.064551-11') }}
                    <b>{{ $t('MetadataMap.index.064551-12') }}</b
                    >{{ $t('MetadataMap.index.064551-13') }}
                    <b>{{ $t('MetadataMap.index.064551-14') }}</b>{{ $t('MetadataMap.index.064551-15') }}<b>{{ $t('MetadataMap.index.064551-16') }}</b>{{ $t('MetadataMap.index.064551-17') }}
                </p>
                <p>
                    {{ $t('MetadataMap.index.064551-18') }}
                </p>
                <p>
<!--                  The background lighting of a data entry indicates an attribute whose-->
<!--                  identifier is consistent-->
<!--                  or-->
<!--                  has already been mapped.-->
                    {{ $t('MetadataMap.index.064551-19') }}<b>{{ $t('MetadataMap.index.064551-20') }}</b>{{ $t('MetadataMap.index.064551-21') }}<b>{{ $t('MetadataMap.index.064551-22') }}</b>{{ $t('MetadataMap.index.064551-23') }}
                </p>
                <div class="title">{{ $t('MetadataMap.index.064551-24') }}</div>
                <div>
                    <img :src="getImage('/device/matadataMap.png')" />
                </div>
            </j-scrollbar>
        </div>
    </div>
</template>

<script setup lang='ts' name='MetadataMap'>
import { storeToRefs } from 'pinia';
import { useProductStore } from '@/store/product';
import { detail as queryPluginAccessDetail } from '@/api/link/accessConfig';
import { getPluginData, getProductByPluginId } from '@/api/link/plugin';
import { getImage, onlyMessage } from '@/utils/comm';
import { getMetadataMapById, metadataMapById, getProtocolMetadata } from '@/api/device/instance';
import { cloneDeep } from 'lodash-es';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const productStore = useProductStore();
const { current: productDetail } = storeToRefs(productStore);
const dataSourceCache = ref([]);
const dataSource = ref([]);
const pluginOptions = ref<any[]>([]);

const filterValue = ref<boolean | undefined>(undefined);
const originalData = ref([]);
const searchValue = ref<any>(undefined);
const _delTag = ref<boolean>(false);

// const tableFilter = (value: string, record: any) => {
//   return true
// }

const columns = [
    {
        title: $t('MetadataMap.index.064551-25'),
        dataIndex: 'index',
        width: 100,
    },
    {
        title: $t('MetadataMap.index.064551-26'),
        dataIndex: 'name',
    },
    {
        title: $t('MetadataMap.index.064551-1'),
        dataIndex: 'plugin',
        width: 250,
        // sorter: tableFilter
    },
];

const _value = ref<any>(undefined);

const selectedKeys = computed(() => {
    return (
        dataSource.value
            ?.filter((item) => !!item?.plugin)
            .map((item) => item.id) || []
    );
});

const selectedPluginKeys = computed(() => {
    return (
        dataSource.value
            ?.filter((item) => !!item?.plugin)
            .map((item) => item.plugin) || []
    );
});

const getMetadataMapData = () => {
    return new Promise((resolve) => {
        getMetadataMapById('product', productDetail.value?.id).then((res) => {
            if (res.success) {
                resolve(
                    res.result
                        ?.filter((item) => item.customMapping)
                        ?.map((item) => {
                            return {
                                id: item.metadataId,
                                pluginId: item.originalId,
                                customMapping: item?.customMapping,
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
    searchValue.value = options?.label
}

const onSearch = () => {
    if (searchValue.value) {
        const _item: any = dataSourceCache.value.find((item: any) => {
            return searchValue.value === item?.name;
        });
        if(_item) {
          _value.value = _item?.name;
          document.getElementById(_item?.id)?.scrollIntoView(); // 滚动到可视区域
        }
        
    } else {
        _value.value = undefined;
    }
};

const getDefaultMetadata = async () => {
    const metadata = JSON.parse(productDetail.value?.metadata || '{}');
    const properties = metadata.properties;
    const pluginMetadata = await getMetadata();
    const pluginProperties = pluginMetadata?.properties || [];
    const metadataMap: any = await getMetadataMapData();
    pluginOptions.value = pluginProperties.map((item) => ({
        ...item,
        label: item?.name,
        value: item.id,
    }));

    // const concatProperties = [ ...pluginProperties.map(item => ({ id: item.id, pluginId: item.id})), ...metadataMap]
    const concatProperties = [...metadataMap];
    if(!concatProperties.length) {
        _delTag.value = true
        const arr = concatProperties.map((item) => item.id);
        const _arr = concatProperties.map((item) => item.pluginId);

        pluginProperties.map((item) => {
            // 添加默认映射，但是该选项还没被其他属性映射
            if (!arr.includes(item.id) && !_arr.includes(item.id)) {
                concatProperties.push({ id: item.id, pluginId: item.id, customMapping: item?.customMapping, });
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
                plugin: _m?.pluginId, // 插件物模型id
            };
        }) || [];
    dataSourceCache.value = dataSource.value;
};

const getPluginMetadata = (): Promise<{ properties: any[] }> => {
    return new Promise((resolve) => {
        queryPluginAccessDetail(productDetail.value?.accessId!).then(
            async (res) => {
                if (res.success) {
                    const _channelId = (res.result as any)!.channelId;
                    const pluginRes = await getPluginData(
                        'product',
                        productDetail.value?.accessId || '',
                        productDetail.value?.id,
                    ).catch(() => ({ success: false, result: {} }));
                    const resp = await getProductByPluginId(_channelId).catch(
                        () => ({ success: false, result: [] }),
                    );
                    if (resp.success) {
                        const _item = (resp.result as any[])?.find(
                            (item: any) =>
                                item.id ===
                                (pluginRes?.result as any)?.externalId,
                        );

                        resolve(_item ? _item.metadata : { properties: [] });
                    }
                }
                resolve({ properties: [] });
            },
        );
    });
};
const getMetadata = (): Promise<{ properties: any[] }> => {
    return new Promise((resolve) => {
        const transport = productDetail.value?.transportProtocol;
        getProtocolMetadata(productDetail.value?.messageProtocol || '', transport).then(
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
    const res = await metadataMapById('product', productDetail.value?.id, arr);
    if (res.success && flag) {
        onlyMessage($t('MetadataMap.index.064551-27'));
    }
};

const pluginChange = async (value: any, id: string) => {
    if ((!id && value?.customMapping) || id) {
        // 映射 / 取消映射
        const arr = [
            {
                metadataType: 'property',
                metadataId: value.id,
                originalId: id,
            },
        ];
        onMapData(arr, true)
    }
};

const onFilter = ({ key }: any) => {
    originalData.value = dataSource.value;
    const _dataSource = cloneDeep(dataSource.value).sort((a: any, b: any) => {
        if (!key) {
            return (a.plugin ? 1 : -1) - (b.plugin ? 1 : -1);
        } else {
            return (b.plugin ? 1 : -1) - (a.plugin ? 1 : -1);
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
    if (_delTag.value && dataSourceCache.value.length) {
        // 保存数据.filter((i: any) => i?.plugin)
        const arr = dataSourceCache.value.map((item: any) => {
            return {
                metadataType: 'property',
                metadataId: item.id,
                originalId: item.plugin || null,
            }
        })
        onMapData(arr)
    }
});
</script>

<style scoped lang='less'>
.metadata-map {
    // position: relative;
    min-height: 100%;
    display: flex;
    gap: 24px;

    .left {
        // margin-right: 44px;
        flex: 1;

        .box {
            height: calc(100vh - 392px);
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