<template>
    <a-spin :spinning="loading">
        <JTable
            :columns="columns"
            :dataSource="dataSource"
            :bodyStyle="{ padding: '0 0 0 20px' }"
        >
            <template #headerTitle>
                <a-input-search
                    placeholder="请输入名称"
                    style="width: 300px; margin-bottom: 10px"
                    @search="onSearch"
                    v-model:value="value"
                    :allowClear="true"
                />
            </template>
            <template #card="slotProps">
                <PropertyCard
                    :data="{ ...slotProps, ...propertyValue[slotProps?.id] }"
                    :actions="getActions(slotProps)"
                />
            </template>
            <template #value="slotProps">
                <ValueRender
                    :data="slotProps"
                    :value="propertyValue[slotProps?.id]"
                />
            </template>
            <template #time="slotProps">
                {{ propertyValue[slotProps?.id]?.timeString || '--' }}
            </template>
            <template #action="slotProps">
                <a-space :size="16">
                    <a-tooltip
                        v-for="i in getActions(slotProps)"
                        :key="i.key"
                        v-bind="i.tooltip"
                    >
                        <a-button
                            style="padding: 0"
                            type="link"
                            :disabled="i.disabled"
                            @click="i.onClick && i.onClick(slotProps)"
                        >
                            <AIcon :type="i.icon" />
                        </a-button>
                    </a-tooltip>
                </a-space>
            </template>
            <template #paginationRender>
                <a-pagination
                    size="small"
                    :total="total"
                    :showQuickJumper="false"
                    :showSizeChanger="true"
                    :current="pageIndex + 1"
                    :pageSize="pageSize"
                    :pageSizeOptions="['8', '12', '24', '60', '100']"
                    :show-total="
                        (num) =>
                            `第 ${pageIndex * pageSize + 1} - ${
                                (pageIndex + 1) * pageSize > num
                                    ? num
                                    : (pageIndex + 1) * pageSize
                            } 条/总共 ${num} 条`
                    "
                    @change="pageChange"
                />
            </template>
        </JTable>
    </a-spin>
    <Save v-if="editVisible" @close="editVisible = false" :data="currentInfo" />
    <Indicators
        v-if="indicatorVisible"
        @close="indicatorVisible = false"
        :data="currentInfo"
    />
</template>

<script lang="ts" setup>
import _, { groupBy, throttle, toArray } from 'lodash-es';
import { PropertyData } from '../../../typings';
import PropertyCard from './PropertyCard.vue';
import ValueRender from './ValueRender.vue';
import Save from './Save.vue';
import Indicators from './Indicators.vue';
import { getProperty } from '@/api/device/instance';
import { useInstanceStore } from '@/store/instance';
import { message } from 'ant-design-vue';
import { getWebSocket } from '@/utils/websocket';
import { map } from 'rxjs/operators';
import { queryDashboard } from '@/api/comm';
const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: '值',
        dataIndex: 'value',
        key: 'value',
        scopedSlots: true,
    },
    {
        title: '更新时间',
        dataIndex: 'time',
        key: 'time',
        scopedSlots: true,
    },
    {
        title: '操作',
        dataIndex: 'action',
        key: 'action',
        scopedSlots: true,
    },
];

const _data = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
});
const value = ref<string>('');
const dataSource = ref<PropertyData[]>([]);
const _dataSource = ref<PropertyData[]>([]);
const pageIndex = ref<number>(0);
const pageSize = ref<number>(8);
const total = ref<number>(0);
const editVisible = ref<boolean>(false); // 编辑
const detailVisible = ref<boolean>(false); // 详情
const currentInfo = ref<Record<string, any>>({});
const instanceStore = useInstanceStore();
const indicatorVisible = ref<boolean>(false); // 指标
const loading = ref<boolean>(false);
const propertyValue = ref<Record<string, any>>({});

const subRef = ref();

const list = ref<any[]>([]);

const getActions = (data: Partial<Record<string, any>>) => {
    const arr = [];
    if (data.expands?.type?.includes('write')) {
        arr.push({
            key: 'edit',
            tooltip: {
                title: '设置属性至设备',
            },
            icon: 'EditOutlined',
            onClick: () => {
                editVisible.value = true;
                currentInfo.value = data;
            },
        });
    }
    if (
        (data.expands?.metrics || []).length &&
        [
            'int',
            'long',
            'float',
            'double',
            'string',
            'boolean',
            'date',
        ].includes(data.valueType?.type || '')
    ) {
        arr.push({
            key: 'metrics',
            tooltip: {
                title: '指标',
            },
            icon: 'ClockCircleOutlined',
            onClick: () => {
                indicatorVisible.value = true;
                currentInfo.value = data;
            },
        });
    }
    if (data.expands?.type?.includes('read')) {
        arr.push({
            key: 'read',
            tooltip: {
                title: '获取最新属性值',
            },
            icon: 'SyncOutlined',
            onClick: async () => {
                if (instanceStore.current.id && data.id) {
                    const resp = await getProperty(
                        instanceStore.current.id,
                        data.id,
                    );
                    if (resp.status === 200) {
                        message.success('操作成功！');
                    }
                }
            },
        });
    }
    arr.push({
        key: 'detail',
        text: '详情',
        tooltip: {
            title: '详情',
        },
        icon: 'BarsOutlined',
        onClick: () => {
            detailVisible.value = true;
            currentInfo.value = data;
        },
    });
    return arr;
};

// const valueChange = (arr: Record<string, any>[]) => {
//     (arr || [])
//         .sort((a: any, b: any) => a.timestamp - b.timestamp)
//         .forEach((item: any) => {
//             const { value } = item;
//             propertyValue.value[value?.property] = { ...item, ...value };
//         });
//     list.value = []
// };

const subscribeProperty = () => {
    const id = `instance-info-property-${instanceStore.current.id}-${
        instanceStore.current.productId
    }-${dataSource.value.map((i: Record<string, any>) => i.id).join('-')}`;
    const topic = `/dashboard/device/${instanceStore.current.productId}/properties/realTime`;
    subRef.value = getWebSocket(id, topic, {
        deviceId: instanceStore.current.id,
        properties: dataSource.value.map((i: Record<string, any>) => i.id),
        history: 1,
    })
        ?.pipe(map((res: any) => res.payload))
        .subscribe((payload) => {
            list.value = [...list.value, payload];
            unref(list).sort((a: any, b: any) => a.timestamp - b.timestamp)
            .forEach((item: any) => {
                const { value } = item;
                propertyValue.value[value?.property] = { ...item, ...value };
            });
            // list.value = [...list.value, payload];
            // throttle(valueChange(list.value), 500);
        });
};

const getDashboard = async () => {
    const param = [
        {
            dashboard: 'device',
            object: instanceStore.current.productId,
            measurement: 'properties',
            dimension: 'history',
            params: {
                deviceId: instanceStore.current.id,
                history: 1,
                properties: dataSource.value.map((i: any) => i.id),
            },
        },
    ];
    loading.value = true;
    const resp: Record<string, any> = await queryDashboard(param);
    if (resp.status === 200) {
        const t1 = (resp.result || []).map((item: any) => {
            return {
                timeString: item.data?.timeString,
                timestamp: item.data?.timestamp,
                ...item?.data?.value,
            };
        });
        const obj = {};
        toArray(groupBy(t1, 'property'))
            .map((item) => {
                return {
                    list: item.sort((a, b) => b.timestamp - a.timestamp),
                    property: item[0].property,
                };
            })
            .forEach((i) => {
                obj[i.property] = i.list[0];
            });
        propertyValue.value = { ...unref(propertyValue), ...obj };
    }
    subscribeProperty();
    loading.value = false;
};

const query = (page: number, size: number, value: string) => {
    pageIndex.value = page || 0;
    pageSize.value = size || 8;
    const _from = pageIndex.value * pageSize.value;
    const _to = (pageIndex.value + 1) * pageSize.value;
    const arr = _.cloneDeep(_dataSource.value);
    if (unref(value)) {
        const li = arr.filter((i: any) => {
            return i?.name.indexOf(unref(value)) !== -1;
        });
        dataSource.value = li.slice(_from, _to);
        total.value = li.length;
    } else {
        dataSource.value = arr.slice(_from, _to);
        total.value = arr.length;
    }
    getDashboard();
};

const pageChange = (page: number, size: number) => {
    if (size === pageSize.value) {
        query(page - 1, size, value.value);
    } else {
        query(0, size, value.value);
    }
};

watch(
    () => _data.data,
    (newVal) => {
        if (newVal.length) {
            _dataSource.value = newVal as PropertyData[];
            query(0, 8, value.value);
        }
    },
    {
        deep: true,
        immediate: true,
    },
);

const onSearch = () => {
    query(0, 8, value.value);
};
</script>

<style scoped lang="less">
</style>