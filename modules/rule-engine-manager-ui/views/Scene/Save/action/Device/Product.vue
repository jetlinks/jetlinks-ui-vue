<template>
    <pro-search
        :columns="columns"
        type="simple"
        @search="handleSearch"
        class="scene-search"
        target="scene-trigger-device-product"
    />
    <a-divider style="margin: 0" />
    <j-pro-table
        ref="actionRef"
        mode="CARD"
        :columns="columns"
        :params="params"
        :request="productQuery"
        :gridColumn="2"
        :gridColumns="[2]"
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
                :statusText="slotProps.state === 1 ? $t('Device.Product.455639-0') : $t('Device.Product.455639-1')"
                :statusNames="{ '1': 'processing', '0': 'error' }"
                @click="handleClick(slotProps)"
            >
                <template #img>
                    <slot name="img">
                      <Image
                        :src="slotProps.photoUrl ||
                                sceneImages.deviceProduct"
                        class="card-list-img-80"
                      />
                    </slot>
                </template>
                <template #content>
                    <div style="width: calc(100% - 100px)">
                        <j-ellipsis>
                            <span style="font-size: 16px; font-weight: 600">
                                {{ slotProps.name }}
                            </span>
                        </j-ellipsis>
                    </div>
                    <a-row>
                        <a-col :span="12">
                            <div class="card-item-content-text">{{ $t('Device.Product.455639-2') }}</div>
                            <j-ellipsis>{{
                                slotProps.deviceType?.text
                            }}</j-ellipsis>
                        </a-col>
                        <a-col :span="12">
                            <div class="card-item-content-text">{{ $t('Device.Product.455639-3') }}</div>
                            <j-ellipsis>{{
                                slotProps?.accessName || $t('Device.Product.455639-4')
                            }}</j-ellipsis>
                        </a-col>
                    </a-row>
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
    productDetail,
    getTreeData_api
} from '../../../../../api/others';
import { queryProductSortTree } from '../../../../../api/others';
import { accessConfigTypeFilter } from '../../../../../utils/setting';
import { sceneImages } from '../../../../../assets/index';
import { useI18n } from 'vue-i18n'
import { useTermOptions } from '@jetlinks-web/components/es/Search/hooks/useTermOptions'

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

const { termOptions: dimAssetsTermOptions } = useTermOptions({ pick: ['eq']})

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
        title: $t('Device.Product.455639-5'),
        dataIndex: 'name',
        width: 200,
        ellipsis: true,
        search: {
            type: 'string',
            first: true,
        },
    },
    {
        title: $t('Device.Product.455639-6'),
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
        title: $t('Device.Product.455639-3'),
        dataIndex: 'accessId',
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
        title: $t('Device.Product.455639-2'),
        dataIndex: 'deviceType',
        width: 150,
        search: {
            type: 'select',
            options: [
                { label: $t('Device.Product.455639-7'), value: 'device' },
                { label: $t('Device.Product.455639-8'), value: 'childrenDevice' },
                { label: $t('Device.Product.455639-9'), value: 'gateway' },
            ],
        },
    },
    {
        title: $t('Device.Product.455639-10'),
        dataIndex: 'state',
        width: '90px',
        search: {
            type: 'select',
            options: [
                { label: $t('Device.Product.455639-1'), value: 0 },
                { label: $t('Device.Product.455639-0'), value: 1 },
            ],
        },
    },
    {
        title: $t('Device.Product.455639-11'),
        dataIndex: 'describe',
        ellipsis: true,
        width: 300,
    },
    {
        dataIndex: 'classifiedId',
        title: $t('Device.Product.455639-12'),
        hideInTable: true,
        search: {
            type: 'treeSelect',
            options: () => {
                return new Promise((res) => {
                    queryProductSortTree({ paging: false }).then((resp) => {
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
        title: $t('Device.Product.455639-13'),
        hideInTable: true,
        search: {
            type: 'treeSelect',
            termOptions: dimAssetsTermOptions,
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
    productDetail(props.rowKey).then(resp => {
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
