<template>
    <div class="metadata-map">
        <div class="left">
            <j-input-search
                style="width: 350px; margin-bottom: 24px"
                placeholder="搜索平台属性名称"
                allowClear
                @search="search"
            />
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
                                        目标属性<j-tooltip
                                            title="插件中物模型下的属性"
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
                                            filterValue ? '已映射' : '未映射'
                                        }}</span></j-tag
                                    >
                                    <j-dropdown v-else>
                                        <AIcon type="FilterOutlined" />
                                        <template #overlay>
                                            <j-menu @click="onFilter">
                                                <j-menu-item :key="true"
                                                    >置顶已映射数据</j-menu-item
                                                >
                                                <j-menu-item :key="false"
                                                    >置顶未映射数据</j-menu-item
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
                                                    ? '该属性已绑定平台属性'
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
                <div class="title">功能说明</div>
                <p>
                    该功能用于将插件中的
                    <b>物模型属性标识</b>与
                    <b>平台物模型属性标识</b
                    >进行映射,当两方属性标识不一致时，可在当前页面直接修改映射管理，系统将以映射后的物模型属性进行数据处理。
                </p>
                <p>
                    未完成映射的属性标识“目标属性”列数据为空，代表该属性值来源以在平台配置的来源为准。
                </p>
                <p>
                    数据条背景亮起代表<b>标识一致</b>或<b>已完成映射</b>的属性。
                </p>
                <div class="title">功能图示</div>
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
import { getMetadataMapById, metadataMapById } from '@/api/device/instance';
import { cloneDeep } from 'lodash-es';

const productStore = useProductStore();
const { current: productDetail } = storeToRefs(productStore);
const dataSourceCache = ref([]);
const dataSource = ref([]);
const pluginOptions = ref<any[]>([]);

const filterValue = ref<boolean | undefined>(undefined);
const originalData = ref([]);

// const tableFilter = (value: string, record: any) => {
//   return true
// }

const columns = [
    {
        title: '序号',
        dataIndex: 'index',
        width: 100,
    },
    {
        title: '平台属性',
        dataIndex: 'name',
    },
    {
        title: '目标属性',
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
                            };
                        }) || [],
                );
            }
        });
    });
};

// const search = (value: string) => {
//   if (value) {
//     dataSource.value = dataSourceCache.value.filter((item: any) => {
//       return !!item.name?.includes(value)
//     })
//   } else {
//     dataSource.value = dataSourceCache.value
//   }
// }

const customRow = (record: any) => {
    return {
        id: record.id,
        class: _value.value === record.name ? 'metadata-search-row' : '',
    };
};

const search = (value: string) => {
    if (value) {
        const _item: any = dataSourceCache.value.find((item: any) => {
            return value === item.name;
        });
        _value.value = _item.name;
        document.getElementById(_item?.id)?.scrollIntoView(); // 滚动到可视区域
    } else {
        _value.value = undefined;
    }
};

const getDefaultMetadata = async () => {
    const metadata = JSON.parse(productDetail.value?.metadata || '{}');
    const properties = metadata.properties;
    const pluginMetadata = await getPluginMetadata();
    const pluginProperties = pluginMetadata?.properties || [];
    const metadataMap: any = await getMetadataMapData();
    pluginOptions.value = pluginProperties.map((item) => ({
        ...item,
        label: item.name,
        value: item.id,
    }));

    // const concatProperties = [ ...pluginProperties.map(item => ({ id: item.id, pluginId: item.id})), ...metadataMap]
    const concatProperties = [...metadataMap];
    const arr = concatProperties.map((item) => item.id);
    const _arr = concatProperties.map((item) => item.pluginId);

    pluginProperties.map((item) => {
        // 添加默认映射，但是该选项还没被其他属性映射
        if (!arr.includes(item.id) && !_arr.includes(item.id)) {
            concatProperties.push({ id: item.id, pluginId: item.id });
        }
    });

    dataSource.value =
        properties?.map((item: any, index: number) => {
            const _m = concatProperties.find((p) => p.id === item.id);
            return {
                index: index + 1,
                id: item.id, // 产品物模型id
                name: item.name,
                type: item.valueType?.type,
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

const pluginChange = async (value: any, id: string) => {
    const res = await metadataMapById('product', productDetail.value?.id, [
        {
            metadataType: 'property',
            metadataId: value.id,
            originalId: id,
        },
    ]);
    if (res.success) {
        onlyMessage('操作成功');
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