<template>
    <page-container :showBack="true">
        <template #title>
            
        </template>
        <pro-search :columns="columns" type="object" @search="onSearch" />
        <j-pro-table
            :defaultParams="defaultParams"
            :pagination="{
                pageSizeOptions: ['10', '20', '50', '80', '100'],
                showSizeChanger: true,
                showQuickJumper: false,
                size: 'size',
            }"
            :columns="columns"
            :params="factoryDetails"
            model="CARD"
            ref="cardRef"
            :request="query"
        >
            <template #card="slotProps">
                <CardBox
                    :value="slotProps"
                    :status="slotProps.state?.value"
                    :statusText="slotProps.state?.text"
                    :statusNames="{
                        online: 'processing',
                        office: 'error',
                    }"
                >
                    <template #img>
                        <img
                            :width="80"
                            :height="80"
                            :src="
                                slotProps?.photoUrl ||
                                getImage('/device/instance/device-card.png')
                            "
                        />
                    </template>
                    <template #content>
                        <Ellipsis style="width: calc(100% - 10px)">
                            <span style="font-size: 16px; font-weight: 600">
                                {{ slotProps.name }}
                            </span>
                        </Ellipsis>
                        <j-row>
                            <j-col :span="8">
                                <div class="card-item-content-text">
                                    设备类型
                                </div>
                                <j-ellipsis style="width: calc(100% - 10px)">
                                    <span>{{
                                        slotProps.deviceType?.text
                                    }}</span>
                                </j-ellipsis>
                            </j-col>
                            <j-col :span="8">
                                <div class="card-item-content-text">
                                    所属产品
                                </div>
                                <j-ellipsis style="width: calc(100% - 10px)">
                                    <div>{{ slotProps.productName }}</div>
                                </j-ellipsis>
                            </j-col>
                        </j-row>
                    </template>
                </CardBox>
            </template>
        </j-pro-table>
    </page-container>
</template>
<script lang="ts" setup>
import { _queryFactory } from '@/api/factory/factory';
import { getImage, onlyMessage } from '@/utils/comm';
import { omit, cloneDeep } from 'lodash-es';

const route = useRoute();
const factoryDetails = ref<Record<string, any>>({});
const cardRef = ref<Record<string, any>>({});
const defaultParams = {
    pageSize: 20,
    pageIndex: 0,
    terms: [
        {
            type: 'or',
            value: `${route.params?.id}`,
            termType: 'eq',
            column: 'factoryId',
        },
    ],
};

const columns = [
    {
        title: '名称',
        dataIndex: 'name',
        key: 'name',
        width: 200,
        ellipsis: true,
        search: {
            first: true,
            type: 'string',
        },
    },
    {
        title: '设备类型',
        key: 'deviceType',
        dataIndex: 'deviceType',
        width: 200,
        ellipsis: true,
        scopedSlots: true,
        search: {
            type: 'select',
            options: [
                {
                    label: '直连设备',
                    value: 'device',
                },
                {
                    label: '网关子设备',
                    value: 'childrenDevice',
                },
                {
                    label: '网关设备',
                    value: 'gateway',
                },
            ],
        },
    },
    {
        title: '所属产品',
        dataIndex: 'productName',
        key: 'productName',
        ellipsis: true,
        search: {
            first: true,
            type: 'string',
        },
    },
];

// 搜索
const onSearch = (e: any) => {
    const newTerms = cloneDeep(e);
    if (newTerms.terms?.length) {
        newTerms.terms.forEach((a: any) => {
            a.terms = a.terms.map((b: any) => {
                if (b.column === 'id$dim-assets') {
                    const value = b.value;
                    b = {
                        column: 'id',
                        termType: 'dim-assets',
                        value: {
                            assetType: 'factory',
                            targets: [
                                {
                                    type: 'org',
                                    id: value,
                                },
                            ],
                        },
                    };
                }
                return b;
            });
        });
    }
    factoryDetails.value = newTerms;
};

const query = (params: Record<string, any>) =>
    new Promise((resolve) => {
        _queryFactory(params).then((response: any) => {
            console.log(response);
            resolve({
                result: {
                    data: response.result?.data,
                    pageIndex: params.pageIndex || 0,
                    pageSize: params.pageSize || 20,
                    total: response.result?.total,
                },
                status: response.status,
            });
        });
    });
</script>

<style lang="less" scoped></style>
