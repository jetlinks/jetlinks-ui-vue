<template>
    <div class="metadata-map">
        <div class="left">
            <j-input-search
                style="width: 350px; margin-bottom: 24px"
                placeholder="搜索平台属性名称"
                allowClear
                @search="search"
            />
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
            >
                <template #headerCell="{ column }">
                    <template v-if="column.dataIndex === 'original'">
                        <span>
                            目标属性<j-tooltip title="协议包中物模型下的属性">
                                <AIcon
                                    style="margin-left: 10px"
                                    type="QuestionCircleOutlined"
                                />
                            </j-tooltip>
                        </span>
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
                    <template v-if="column.dataIndex === 'original'">
                        <j-select
                            v-model:value="record.original"
                            style="width: 100%"
                            allowClear
                            @change="(id) => onChange(record, id)"
                            placeholder="请选择"
                        >
                            <j-select-option
                                v-for="(item, index) in targetOptions"
                                :key="index + '_' + item.id"
                                :value="item.value"
                                :disabled="
                                    selectedOriginalKeys.includes(item.id)
                                "
                                >{{ item.label }} ({{
                                    item.id
                                }})</j-select-option
                            >
                        </j-select>
                    </template>
                </template>
            </j-table>
        </div>
        <div class="right">
            <j-scrollbar>
                <div class="title">功能说明</div>
                <p>
                    该功能用于将协议包中的
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
                    <img :src="getImage('/device/matadataMap.jpg')" />
                </div>
            </j-scrollbar>
        </div>
    </div>
</template>

<script setup lang='ts' name='MetadataMap'>
import { storeToRefs } from 'pinia';
import { getImage, onlyMessage } from '@/utils/comm';
import {
    getMetadataMapById,
    metadataMapById,
    getProtocolMetadata,
} from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';

const deviceStore = useInstanceStore();
const { current: deviceDetail } = storeToRefs(deviceStore);
const dataSourceCache = ref([]);
const dataSource = ref([]);
const targetOptions = ref<any[]>([]);

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
        dataIndex: 'original',
        width: 250,
        sorter: {
            compare: (a, b) =>
                (a.original?.length || 0) - (b.original?.length || 0),
        },
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
                            };
                        }) || [],
                );
            }
        });
    });
};

const search = (value: string) => {
    if (value) {
        dataSource.value = dataSourceCache.value.filter((item: any) => {
            return !!item.name?.includes(value);
        });
    } else {
        dataSource.value = dataSourceCache.value;
    }
};

const getDefaultMetadata = async () => {
    const properties = metadata.value?.properties;
    const _metadata = await getMetadata();
    const _properties = _metadata?.properties || [];
    const metadataMap: any = await getMetadataMapData();

    targetOptions.value = _properties.map((item) => ({
        ...item,
        label: item.name,
        value: item.id,
    }));

    const concatProperties = [...metadataMap];
    const arr = concatProperties.map((item) => item.id);
    const _arr = concatProperties.map((item) => item.originalId);

    _properties.map((item) => {
        // 添加默认映射，但是该选项还没被其他属性映射
        if (!arr.includes(item.id) && !_arr.includes(item.id)) {
            concatProperties.push({ id: item.id, originalId: item.id });
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

const onChange = async (value: any, id: string) => {
    const res = await metadataMapById('device', _id, [
        {
            metadataType: 'property',
            metadataId: value.id,
            originalId: id || null,
        },
    ]);
    if (res.success) {
        onlyMessage('操作成功');
    }
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