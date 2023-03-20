<template>
    <page-container
        :tabList="list"
        @back="onBack"
        :tabActiveKey="productStore.tabActiveKey"
        @tabChange="onTabChange"
    >
        <template #title>
            <div>
                <div style="display: flex; align-items: center">
                    <a-tooltip>
                        <template #title>{{
                            productStore.current.name
                        }}</template>
                        <div class="productDetailHead">
                            {{ productStore.current.name }}
                        </div>
                    </a-tooltip>
                    <div style="margin: -5px 0 0 20px">
                        <j-popconfirm
                            title="确认禁用"
                            @confirm="handleUndeploy"
                            v-if="productStore.current.state === 1"
                            okText="确定"
                            cancelText="取消"
                        >
                            <j-switch
                                :checked="productStore.current.state === 1"
                                checked-children="正常"
                                un-checked-children="禁用"
                            />
                        </j-popconfirm>
                        <j-popconfirm
                            title="确认启用"
                            @confirm="handleDeploy"
                            v-if="productStore.current.state === 0"
                            okText="确定"
                            cancelText="取消"
                        >
                            <j-switch
                                :unCheckedValue="
                                    productStore.current.state === 0
                                "
                                checked-children="正常"
                                un-checked-children="禁用"
                            />
                        </j-popconfirm>
                    </div>
                </div>
            </div>
            <div style="padding-top: 10px">
                <j-descriptions size="small" :column="4">
                    <j-descriptions-item
                        label="设备数量"
                        style="cursor: pointer"
                        ><span @click="jumpDevice">{{
                            productStore.current?.count
                                ? productStore.current?.count
                                : 0
                        }}</span></j-descriptions-item
                    >
                </j-descriptions>
            </div>
        </template>
        <template #extra>
            <!-- <j-popconfirm
                    title="确认应用配置"
                    @confirm="handleCofig"
                    okText="确定"
                    cancelText="取消"
                >
                    <j-button
                        :disabled="productStore.current.state === 0"
                        type="primary"
                        >应用配置</j-button
                    >
                </j-popconfirm> -->
            <PermissionButton
                type="primary"
                :popConfirm="{
                    title: `确定应用配置?`,
                    onConfirm: handleConfig,
                }"
                :disabled="productStore.current?.state === 0"
                :tooltip="
                    productStore.current?.state === 0
                        ? { title: '请先启用产品' }
                        : undefined
                "
                hasPermission="device/Product:update"
                >应用配置</PermissionButton
            >
        </template>
        <component
            :is="tabs[productStore.tabActiveKey]"
            :class="productStore.tabActiveKey === 'Metadata' ? 'metedata' : ''"
            v-bind="{ type: 'product' }"
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
import { message } from 'jetlinks-ui-components';
import { getImage } from '@/utils/comm';
import encodeQuery from '@/utils/encodeQuery';
import { useMenuStore } from '@/store/menu';
const menuStory = useMenuStore();

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
        class:'objectModel'
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
    DataAnalysis,
};

watch(
    () => route.params.id,
    (newId) => {
        if (newId) {
            productStore.reSet();
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
        const res: any = await getProtocolDetail(
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
/**
 * 详情页跳转到设备页
 */
const jumpDevice = () => {
    // console.log(productStore.current?.id);
    const searchParams = {
        column: 'productId',
        termType: 'eq',
        value: productStore.current?.id,
    };
    menuStory.jumpPage(
        'device/Instance',
        {},
        {
            target: 'device-instance',
            q: JSON.stringify({ terms: [{ terms: [{ searchParams }] }] }),
        },
    );
};
onMounted(() => {
    getProtocol();
    if (history.state?.params?.tab) {
        productStore.tabActiveKey = history.state?.params?.tab;
    }
});
</script>
<style scoped lang="less">
.ant-switch-loading,
.ant-switch-disabled {
    cursor: not-allowed;
}
.productDetailHead {
    max-width: 50%;
    overflow: hidden;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
