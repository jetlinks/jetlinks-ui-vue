<template>
    <page-container :tabList="list" :tabActiveKey="productStore.tabActiveKey" @tabChange="onTabChange" showBack="true">
        <template #title>
            <div>
                <div style="display: flex; align-items: center">
                    <j-tooltip>
                        <template #title>{{
                            productStore.current.name
                        }}</template>
                        <div class="productDetailHead">
                            {{ productStore.current.name }}
                        </div>
                    </j-tooltip>
                    <div style="margin: -5px 0 0 20px" v-if="permissionStore.hasPermission('device/Product:action')">
                        <j-popconfirm title="确认禁用" @confirm="handleUndeploy" v-if="productStore.current.state === 1"
                            okText="确定" cancelText="取消" :disabled="!permissionStore.hasPermission('device/Product:action')">
                            <j-switch :checked="productStore.current.state === 1" checked-children="正常"
                                un-checked-children="禁用"
                                :disabled="!permissionStore.hasPermission('device/Product:action')" />
                        </j-popconfirm>
                        <j-popconfirm title="确认启用" @confirm="handleDeploy" v-if="productStore.current.state === 0"
                            okText="确定" cancelText="取消" :disabled="!permissionStore.hasPermission('device/Product:action')">
                            <j-switch :unCheckedValue="productStore.current.state === 0
                                " checked-children="正常" un-checked-children="禁用"
                                :disabled="!permissionStore.hasPermission('device/Product:action')" />
                        </j-popconfirm>
                    </div>
                    <div style="margin: -5px 0 0 20px" v-else>
                        <j-tooltip>
                            <template #title>暂无权限，请联系管理员</template>
                            <j-switch v-if="productStore.current.state === 1" :checked="productStore.current.state === 1"
                                checked-children="正常" un-checked-children="禁用"
                                :disabled="!permissionStore.hasPermission('device/Product:action')" />
                            <j-switch v-if="productStore.current.state === 0" :unCheckedValue="productStore.current.state === 0
                                " checked-children="正常" un-checked-children="禁用"
                                :disabled="!permissionStore.hasPermission('device/Product:action')" />
                        </j-tooltip>
                    </div>
                </div>
            </div>
        </template>
        <template #content>
            <div style="padding-top: 10px">
                <j-descriptions size="small" :column="4">
                    <j-descriptions-item label="设备数量" :labelStyle="{
                        fontSize: '14px',
                        opacity: 0.55,
                    }" :contentStyle="{
    fontSize: '14px',
    color: '#092EE7',
    cursor: 'pointer',
}"><span @click="jumpDevice">{{
    productStore.current?.count
    ? productStore.current?.count
    : 0
}}</span></j-descriptions-item>
                </j-descriptions>
            </div>
        </template>
        <template #extra>
            <PermissionButton type="primary" :popConfirm="{
                        title: `确定应用配置?`,
                        placement: 'bottomRight',
                        onConfirm: handleDeploy,
                    }" :disabled="productStore.current?.state === 0" :tooltip="productStore.current?.state === 0
            ? { title: '请先启用产品' }
            : undefined
            " hasPermission="device/Product:update" placement="topRight">应用配置</PermissionButton>

            <PermissionButton type="primary" :popConfirm="{
                title: `确定删除吗?`,
                placement: 'bottomRight',
                onConfirm: handleDlt,
            }" :hasPermission="true" placement="topRight">一键删除</PermissionButton>
        </template>
        <FullPage>
            <div style="height: 100%; padding: 24px;">
                <component :is="tabs[productStore.tabActiveKey]" :class="productStore.tabActiveKey === 'Metadata'
                    ? 'metedata'
                    : ''
                    " v-bind="{ type: 'product' }" :isProduct="true" />
            </div>
        </FullPage>
    </page-container>
</template>

<script lang="ts" setup>
import { useProductStore } from '@/store/product';
import Info from './BasicInfo/indev.vue';
import Device from './DeviceAccess/index.vue';
import Metadata from '../../../device/components/Metadata/index.vue';
import DataAnalysis from './DataAnalysis/index.vue';
import Property from './PropertyName/index.vue'
import MetadataMap from './MetadataMap'
// import Metadata from '../../../components/Metadata/index.vue';
import {
    _deploy,
    _undeploy,
    getDeviceNumber,
    getProtocolDetail,
    allDltDeviceInfo
} from '@/api/device/product';
import { getImage, handleParamsToString, onlyMessage } from '@/utils/comm';
import { useMenuStore } from '@/store/menu';
import { useRouterParams } from '@/utils/hooks/useParams';
import { EventEmitter } from "@/utils/utils";
import { usePermissionStore } from '@/store/permission';
import { message } from 'ant-design-vue';

const permissionStore = usePermissionStore()
const menuStory = useMenuStore();
const route = useRoute();
const checked = ref<boolean>(true);
const productStore = useProductStore();
const routerParams = useRouterParams();
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
        class: 'objectModel',
    },
    {
        key: 'Device',
        tab: '设备接入',
    },
    {
        key: 'Property',
        tab: '属性别名',
    },
]);

const tabs = {
    Info,
    Metadata,
    Device,
    DataAnalysis,
    MetadataMap,
    Property
};

watch(
    () => route.params.id,
    (newId) => {
        if (newId && route.name === 'device/Product/Detail') {
            productStore.reSet();
            productStore.tabActiveKey = 'Info';
            productStore.refresh(newId as string);
        }
    },
    { immediate: true, deep: true },
);
watch(
    () => productStore.current,
    () => {
        getProtocol();
    },
);
const onBack = () => {
    history.back();
};

const onTabChange = (e: string) => {
    if (productStore.tabActiveKey === 'Metadata') {
        EventEmitter.emit('MetadataTabs', () => {
            productStore.tabActiveKey = e;
        })
    } else {
        productStore.tabActiveKey = e;
    }
};

/**
 * 启用产品
 */
const handleDeploy = async () => {
    if (productStore.current.id) {
        const resp = await _deploy(productStore.current.id);
        if (resp.status === 200) {
            onlyMessage('操作成功！');
            productStore.refresh(productStore.current.id);
        }
    }
};
/**
 * handleDlt 一键删除
 */
const handleDlt = () => {
    console.log('productStore.current?.id', productStore.current?.id);
    allDltDeviceInfo(productStore.current?.id).then((res: any) => {
        if (res.status === 200) {
            message.success('删除成功')
            productStore.refresh(productStore.current?.id);
        }
    })
}
/**
 * 禁用产品
 */
const handleUndeploy = async () => {
    if (productStore.current.id) {
        const resp = await _undeploy(productStore.current.id);
        if (resp.status === 200) {
            onlyMessage('操作成功！');
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
                list.value = [
                    {
                        key: 'Info',
                        tab: '配置信息',
                    },
                    {
                        key: 'Metadata',
                        tab: '物模型',
                        class: 'objectModel',
                    },
                    {
                        key: 'Device',
                        tab: '设备接入',
                    },
                    {
                        key: 'DataAnalysis',
                        tab: '数据解析',
                    },
                    {
                        key: 'Property',
                        tab: '属性别名',
                    }
                ];
            } else {
                list.value = [
                    {
                        key: 'Info',
                        tab: '配置信息',
                    },
                    {
                        key: 'Metadata',
                        tab: '物模型',
                        class: 'objectModel',
                    },
                    {
                        key: 'Device',
                        tab: '设备接入',
                    },
                    {
                        key: 'Property',
                        tab: '属性别名',
                    },
                ];
            }
        }
        if (productStore.current?.accessProvider === 'plugin_gateway') {
            list.value.push({ key: 'MetadataMap', tab: '物模型映射' })
        }
    }
};
/**
 * 详情页跳转到设备页
 */
const jumpDevice = () => {
    // console.log(productStore.current?.id);
    const searchParams = {
        column: 'productName',
        termType: 'eq',
        value: productStore.current?.id,
    };
    menuStory.jumpPage(
        'device/Instance',
        {},
        {
            target: 'device-instance',
            q: handleParamsToString([searchParams]),
        },
    );
};
onMounted(() => {
    if (routerParams.params?.value.tab) {
        productStore.tabActiveKey = routerParams.params?.value.tab;
    }
});
</script>
<style scoped lang="less">
.ant-switch-loading,
.ant-switch-disabled {
    cursor: not-allowed;
}

.productDetailHead {
    max-width: 300px;
    overflow: hidden;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
