<template>
    <page-container
        :tabList="list"
        @back="onBack"
        :tabActiveKey="productStore.active"
        @tabChange="onTabChange"
    >
        <template #title>
            <div>
                <div style="display: flex; align-items: center">
                    <div>{{ productStore.current.name }}</div>
                    <div style="margin: -5px 0 0 20px">
                        <a-popconfirm
                            title="确认禁用"
                            @confirm="handleUndeploy"
                            v-if="productStore.current.state === 1"
                            okText="确定"
                            cancelText="取消"
                        >
                            <a-switch
                                :checked="productStore.current.state === 1"
                                checked-children="正常"
                                un-checked-children="禁用"
                            />
                        </a-popconfirm>
                        <a-popconfirm
                            title="确认启用"
                            @confirm="handleDeploy"
                            v-if="productStore.current.state === 0"
                            okText="确定"
                            cancelText="取消"
                        >
                            <a-switch
                                :unCheckedValue="
                                    productStore.current.state === 0
                                "
                                checked-children="正常"
                                un-checked-children="禁用"
                            />
                        </a-popconfirm>
                    </div>
                </div>
            </div>
            <div style="padding-top: 10px">
                <a-descriptions size="small" :column="4">
                    <a-descriptions-item label="设备数量">{{
                        productStore.current?.count
                            ? productStore.current?.count
                            : 0
                    }}</a-descriptions-item>
                </a-descriptions>
            </div>
        </template>
        <template #extra>
            <a-popconfirm
                title="确认应用配置"
                @confirm="handleCofig"
                okText="确定"
                cancelText="取消"
            >
                <a-button
                    :disabled="productStore.current.state === 0"
                    type="primary"
                    >应用配置</a-button
                >
            </a-popconfirm>
        </template>
        <component
            :is="tabs[productStore.tabActiveKey]"
            :class="productStore.tabActiveKey === 'Metadata' ? 'metedata' : ''"
        />
    </page-container>
</template>

<script lang="ts" setup>
import { useProductStore } from '@/store/product';
import Info from './BasicInfo/indev.vue';
import Device from './DeviceAccess/index.vue';
import Metadata from '../../../device/components/Metadata/index.vue';
import DataAnalysis from './DataAnalysis/index.vue';
// import Metadata from '../../../components/Metadata/index.vue';
import {
    _deploy,
    _undeploy,
    getDeviceNumber,
    getProtocolDetail,
} from '@/api/device/product';
import { message } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import encodeQuery from '@/utils/encodeQuery';

const route = useRoute();
const checked = ref<boolean>(true);
const productStore = useProductStore();
const searchParams = ref({
    terms1: [
        {
            column: 'productId',
            termType: 'eq',
            value: productStore.current?.id,
        },
    ],
    terms2: undefined,
    type: 'and',
});

const list = ref([
    {
        key: 'Info',
        tab: '配置信息',
    },
    {
        key: 'Metadata',
        tab: '物模型',
    },
    {
        key: 'Device',
        tab: '设备接入',
    },
]);

const tabs = {
    Info,
    Metadata,
    Device,
};

watch(
    () => route.params.id,
    (newId) => {
        if (newId) {
            console.log(newId);
            productStore.tabActiveKey = 'Info';
            productStore.refresh(newId as string);
        }
    },
    { immediate: true, deep: true },
);

const onBack = () => {};

const onTabChange = (e: string) => {
    productStore.tabActiveKey = e;
};

/**
 * 启用产品
 */
const handleDeploy = async () => {
    if (productStore.current.id) {
        const resp = await _deploy(productStore.current.id);
        if (resp.status === 200) {
            message.success('操作成功！');
            productStore.refresh(productStore.current.id);
        }
    }
};

/**
 * 禁用产品
 */
const handleUndeploy = async () => {
    if (productStore.current.id) {
        const resp = await _undeploy(productStore.current.id);
        if (resp.status === 200) {
            message.success('操作成功！');
            productStore.refresh(productStore.current.id);
        }
    }
};

/**
 * 查询设备数量
 */
// const getNunmber = async () => {
// const params = new URLSearchParams();
// params.append('q', JSON.stringify(searchParams.value));
// params.append('target', 'device-instance');
// console.log(params, ' params');
// const res = await getDeviceNumber(
//     encodeQuery({ terms: { productId: params?.id } }),
// );
// };
// getNunmber();

/**
 * 是否显示数据解析模块
 */
const getProtocol = async () => {
    if (productStore.current?.messageProtocol) {
        const res = await getProtocolDetail(
            productStore.current?.messageProtocol,
        );
        if (res.status === 200) {
            const paring = res.result?.transports[0]?.features?.find(
                (item: any) => item.id === 'transparentCodec',
            );
            if (paring) {
                list.value.push({
                    key: 'DataAnalysis',
                    tab: '数据解析',
                });
            }
        }
    }
};
getProtocol();
</script>
<style scoped lang="less">
.ant-switch-loading,
.ant-switch-disabled {
    cursor: not-allowed;
}
</style>
