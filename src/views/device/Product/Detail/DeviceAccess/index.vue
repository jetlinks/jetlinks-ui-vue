<!-- 设备接入 -->
<template>
    <a-card>
        <div v-if="productStore.current.accessId === undefined || null">
            <a-empty :image="simpleImage">
                <template #description>
                    <span>
                        请先<a-button type="link" @click="showModal"
                            >选择</a-button
                        >设备接入网关，用以提供设备接入能力
                    </span>
                </template>
            </a-empty>
        </div>
        <div v-else></div>
    </a-card>
    <!-- 选择设备 -->
    <a-modal
        title="设备接入配置"
        :visible="visible"
        width="1200px"
        okText="确定"
        cancelText="取消"
        @cancel="cancel"
    >
        <Search :columns="query.columns" target="deviceModal" />
    </a-modal>
</template>

<script lang="ts" setup>
import { useProductStore } from '@/store/product';
import { Empty } from 'ant-design-vue';
import {
    getProviders,
    category,
    queryOrgThree,
    queryGatewayList,
    queryProductList,
    _deploy,
    _undeploy,
    deleteProduct,
    addProduct,
    editProduct,
    queryProductId,
} from '@/api/device/product';
import { isNoCommunity } from '@/utils/utils';
const productStore = useProductStore();
const simpleImage = ref(Empty.PRESENTED_IMAGE_SIMPLE);
const visible = ref(false);
const listData = ref([]);
/**
 * 显示弹窗
 */
const showModal = () => {
    visible.value = true;
};

/**
 * 关闭弹窗
 */
const cancel = () => {
    visible.value = false;
};
/**
 * 筛选
 */
const query = reactive({
    columns: [
        {
            title: '名称',
            dataIndex: 'name',
            key: 'name',
            search: {
                first: true,
                type: 'string',
            },
        },
        {
            title: '网关类型',
            key: 'accessProvider',
            dataIndex: 'accessProvider',
            search: {
                type: 'select',
                options: async () => {
                    return new Promise((res) => {
                        getProviders().then((resp: any) => {
                            listData.value = [];
                            // const list = () => {
                            if (isNoCommunity) {
                                listData.value = (resp?.result || []).map(
                                    (item: any) => ({
                                        label: item.name,
                                        value: item.id,
                                    }),
                                );
                            } else {
                                listData.value = (resp?.result || [])
                                    .filter((i: any) =>
                                        [
                                            'mqtt-server-gateway',
                                            'http-server-gateway',
                                            'mqtt-client-gateway',
                                            'tcp-server-gateway',
                                        ].includes(i.id),
                                    )
                                    .map((item: any) => ({
                                        label: item.name,
                                        value: item.id,
                                    }));
                                // }
                            }
                            res(listData.value);
                        });
                    });
                },
            },
        },
        {
            title: '状态',
            key: 'state',
            dataIndex: 'state',
            search: {
                type: 'select',
                options: [
                    {
                        label: '正常',
                        value: 1,
                    },
                    {
                        label: '禁用',
                        value: 0,
                    },
                ],
            },
        },
        {
            title: '说明',
            key: 'describe',
            dataIndex: 'describe',
            search: {
                type: 'string',
            },
        },
        {
            title: '操作',
            key: 'action',
            fixed: 'right',
            width: 250,
            scopedSlots: true,
        },
    ],
});
</script>
