<template>
    <pro-search
        :columns="columns"
        type="simple"
        @search="handleSearch"
        class="scene-search"
        target="scene-trigger-device-product"
    />
    <j-divider style="margin: 0" />
    <j-pro-table
        ref="actionRef"
        model="CARD"
        :columns="columns"
        :params="params"
        :request="productQuery"
        :gridColumn="2"
        :bodyStyle="{
            paddingRight: 0,
            paddingLeft: 0,
        }"
    >
        <template #card="slotProps">
            <CardBox
                :value="slotProps"
                :active="rowKey === slotProps.id"
                :status="String(slotProps.state)"
                :statusText="slotProps.state === 1 ? $t('Device.Product.5425974-0') : $t('Device.Product.5425974-1')"
                :statusNames="{ '1': 'processing', '0': 'error' }"
                @click="handleClick(slotProps)"
            >
                <template #img>
                    <slot name="img">
                        <img
                            :width="80"
                            :height="80"
                            :src="
                                slotProps.photoUrl ||
                                getImage('/device-product.png')
                            "
                        />
                    </slot>
                </template>
                <template #content>
                    <div style="width: calc(100% - 100px)">
                        <Ellipsis>
                            <span style="font-size: 16px; font-weight: 600">
                                {{ slotProps.name }}
                            </span>
                        </Ellipsis>
                    </div>
                    <j-row>
                        <j-col :span="12">
                            <div class="card-item-content-text">{{ $t('Device.Product.5425974-2') }}</div>
                            <Ellipsis>{{
                                slotProps.deviceType?.text
                            }}</Ellipsis>
                        </j-col>
                        <j-col :span="12">
                            <div class="card-item-content-text">{{ $t('Device.Product.5425974-3') }}</div>
                            <Ellipsis>{{
                                slotProps?.accessName || $t('Device.Product.5425974-4')
                            }}</Ellipsis>
                        </j-col>
                    </j-row>
                </template>
            </CardBox>
        </template>
    </j-pro-table>
</template>

<script setup lang='ts' name='Product'>
import {
    getProviders,
    queryGatewayList,
    queryProductList,
    detail
} from '@/api/device/product';
import { queryTree } from '@/api/device/category';
import { getTreeData_api } from '@/api/system/department';
import { isNoCommunity } from '@/utils/utils';
import { getImage } from '@/utils/comm';
import { accessConfigTypeFilter } from '@/utils/setting';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

type Emit = {
    (e: 'update:rowKey', data: string): void;
    (e: 'update:detail', data: any): void;
    (e: 'change', data: any, bol?: boolean): void;
}; // bol判断是否为第一次

const actionRef = ref();
const params = ref({});
const props = defineProps({
    rowKey: {
        type: String,
        default: '',
    },
    detail: {
        type: Object,
        default: () => ({}),
    },
});

const emit = defineEmits<Emit>();

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        width: 300,
        ellipsis: true,
        fixed: 'left',
        search: {
            type: 'string',
        },
    },
    {
        title: $t('Device.Product.5425974-5'),
        dataIndex: 'name',
        width: 200,
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: $t('Device.Product.5425974-6'),
        dataIndex: 'accessProvider',
        width: 150,
        ellipsis: true,
        hideInTable: true,
        search: {
            type: 'select',
            options: () =>
                getProviders().then((resp: any) => {
                    const data = resp.result || [];
                    return accessConfigTypeFilter(data);
                }),
        },
    },
    {
        title: $t('Device.Product.5425974-3'),
        dataIndex: 'accessName',
        width: 150,
        ellipsis: true,
        search: {
            type: 'select',
            options: () =>
                queryGatewayList().then((resp: any) =>
                    resp.result.map((item: any) => ({
                        label: item.name,
                        value: item.id,
                    })),
                ),
        },
    },
    {
        title: $t('Device.Product.5425974-2'),
        dataIndex: 'deviceType',
        width: 150,
        search: {
            type: 'select',
            options: [
                { label: $t('Device.Product.5425974-7'), value: 'device' },
                { label: $t('Device.Product.5425974-8'), value: 'childrenDevice' },
                { label: $t('Device.Product.5425974-9'), value: 'gateway' },
            ],
        },
    },
    {
        title: $t('Device.Product.5425974-10'),
        dataIndex: 'state',
        width: '90px',
        search: {
            type: 'select',
            options: [
                { label: $t('Device.Product.5425974-1'), value: 0 },
                { label: $t('Device.Product.5425974-0'), value: 1 },
            ],
        },
    },
    {
        title: $t('Device.Product.5425974-11'),
        dataIndex: 'describe',
        ellipsis: true,
        width: 300,
    },
    {
        dataIndex: 'classifiedId',
        title: $t('Device.Product.5425974-12'),
        hideInTable: true,
        search: {
            type: 'treeSelect',
            options: () => {
                return new Promise((res) => {
                    queryTree({ paging: false }).then((resp) => {
                        res(resp.result);
                    });
                });
            },
            componentProps: {
                fieldNames: {
                    label: 'name',
                    value: 'id',
                },
            },
        },
    },
    {
        dataIndex: 'id$dim-assets',
        key: 'id$dim-assets',
        title: $t('Device.Product.5425974-13'),
        hideInTable: true,
        search: {
            type: 'treeSelect',
            componentProps: {
              fieldNames: {
                label: 'name',
                value: 'value',
              },
            },
            options: () =>
                new Promise((resolve) => {
                    getTreeData_api({ paging: false }).then((resp: any) => {
                        const formatValue = (list: any[]) => {
                            return list.map((item: any) => {
                                if (item.children) {
                                    item.children = formatValue(item.children);
                                }
                                return {
                                    ...item,
                                    value: JSON.stringify({
                                        assetType: 'product',
                                        targets: [
                                            {
                                                type: 'org',
                                                id: item.id,
                                            },
                                        ],
                                    }),
                                };
                            });
                        };
                        resolve(formatValue(resp.result) || []);
                    });
                }),
        },
    },
];

const handleSearch = (p: any) => {
    params.value = p;
};

const productQuery = (p: any) => {
    const sorts: any = [];

    if (props.rowKey) {
        sorts.push({
            name: 'id',
            value: props.rowKey,
        });
    }
    sorts.push({ name: 'createTime', order: 'desc' });
    p.sorts = sorts;
    return queryProductList(p);
};

const handleClick = (_detail: any) => {
    if (props?.rowKey === _detail.id) {
        emit('update:rowKey', '');
        emit('update:detail', {});
        emit('change', {});
    } else {
        emit('update:rowKey', _detail.id);
        emit('update:detail', _detail);
        emit('change', _detail);
    }
};

onMounted(() => {
  if(props.rowKey){
    detail(props.rowKey).then(resp => {
      if(resp.status === 200){
        emit('update:detail', resp.result);
        emit('change', resp.result, true);
      }
    })
  }
})
</script>

<style scoped lang='less'>
.search {
    margin-bottom: 0;
    padding-right: 0px;
    padding-left: 0px;
}
</style>
