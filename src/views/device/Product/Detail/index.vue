<template>
    <page-container
        :tabList="list"
        :tabActiveKey="productStore.tabActiveKey"
        @tabChange="onTabChange"
        showBack="true"
    >
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
                    <div
                        style="margin: -5px 0 0 20px"
                        v-if="
                            permissionStore.hasPermission(
                                'device/Product:action',
                            )
                        "
                    >
                        <PermissionButton
                            style="padding: 0"
                            type="text"
                            hasPermission="device/Product:action"
                            :popConfirm="{
                                title:
                                    productStore.current.state === 1
                                        ? $t('Detail.index.064554-0')
                                        : $t('Detail.index.064554-1'),
                                onConfirm:
                                    productStore.current.state === 1
                                        ? handleUndeploy
                                        : handleDeploy,
                            }"
                        >
                            <j-switch
                                :checked="productStore.current.state === 1"
                                :checked-children="$t('Detail.index.064554-2')"
                                :un-checked-children="$t('Detail.index.064554-3')"
                                :disabled="
                                    !permissionStore.hasPermission(
                                        'device/Product:action',
                                    )
                                "
                            />
                        </PermissionButton>
                    </div>
                    <div style="margin: -5px 0 0 20px" v-else>
                        <j-tooltip>
                            <template #title>{{ $t('Detail.index.064554-4') }}</template>
                            <j-switch
                                v-if="productStore.current.state === 1"
                                :checked="productStore.current.state === 1"
                                :checked-children="$t('Detail.index.064554-2')"
                                :un-checked-children="$t('Detail.index.064554-3')"
                                :disabled="
                                    !permissionStore.hasPermission(
                                        'device/Product:action',
                                    )
                                "
                            />
                            <j-switch
                                v-if="productStore.current.state === 0"
                                :unCheckedValue="
                                    productStore.current.state === 0
                                "
                                :checked-children="$t('Detail.index.064554-2')"
                                :un-checked-children="$t('Detail.index.064554-3')"
                                :disabled="
                                    !permissionStore.hasPermission(
                                        'device/Product:action',
                                    )
                                "
                            />
                        </j-tooltip>
                    </div>
                </div>
            </div>
        </template>
        <template #content>
            <div style="padding-top: 10px">
                <j-descriptions size="small" :column="4">
                    <j-descriptions-item
                        :label="$t('Detail.index.064554-5')"
                        :labelStyle="{
                            fontSize: '14px',
                            opacity: 0.55,
                        }"
                        :contentStyle="{
                            fontSize: '14px',
                            color: '#092EE7',
                            cursor: 'pointer',
                        }"
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
            <PermissionButton
                type="primary"
                :popConfirm="{
                    title: $t('Detail.index.064554-6'),
                    onConfirm: handleDeploy,
                }"
                :disabled="productStore.current?.state === 0"
                :tooltip="
                    productStore.current?.state === 0
                        ? { title: $t('Detail.index.064554-7') }
                        : undefined
                "
                hasPermission="device/Product:update"
                placement="topRight"
                >{{ $t('Detail.index.064554-8') }}</PermissionButton
            >
        </template>
        <FullPage>
            <div style="height: 100%; padding: 24px">
                <component
                    :is="tabs[productStore.tabActiveKey]"
                    :class="
                        productStore.tabActiveKey === 'Metadata'
                            ? 'metedata'
                            : ''
                    "
                    v-bind="{ type: 'product' }"
                />
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
import MetadataMap from './MetadataMap';
import AlarmRecord from '@/views/device/Instance/Detail/AlarmRecord/index.vue';
import Firmware from '@/views/device/Instance/Detail/Firmware/index.vue';
import {
    _deploy,
    _undeploy,
    getDeviceNumber,
    getProtocolDetail,
} from '@/api/device/product';
import { handleParamsToString, onlyMessage } from '@/utils/comm';
import { useMenuStore } from '@/store/menu';
import { useRouterParams } from '@/utils/hooks/useParams';
import { EventEmitter } from '@/utils/utils';
import { usePermissionStore } from '@/store/permission';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const permissionStore = usePermissionStore();
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
        tab: $t('Detail.index.064554-9'),
    },
    {
        key: 'Metadata',
        tab: $t('Detail.index.064554-10'),
        class: 'objectModel',
    },
    {
        key: 'Device',
        tab: $t('Detail.index.064554-11'),
    },
    {
        key: 'Firmware',
        tab: $t('Detail.index.064554-12'),
    },
]);

const tabs = {
    Info,
    Metadata,
    Device,
    DataAnalysis,
    MetadataMap,
    AlarmRecord,
    Firmware,
};

const onBack = () => {
    history.back();
};

const onTabChange = (e: string) => {
    if (productStore.tabActiveKey === 'Metadata') {
        EventEmitter.emit('MetadataTabs', () => {
            productStore.tabActiveKey = e;
        });
    } else {
        productStore.tabActiveKey = e;
    }
};

/**
 * 启用产品
 */
const handleDeploy = () => {
    if (productStore.current.id) {
        const resp = _deploy(productStore.current.id);
        resp.then((res) => {
            if (res.status === 200) {
                onlyMessage($t('Detail.index.064554-13'));
                productStore.refresh(productStore.current.id);
            }
        });
        return resp;
    }
};

/**
 * 禁用产品
 */
const handleUndeploy = () => {
    if (productStore.current.id) {
        const resp = _undeploy(productStore.current.id);
        resp.then((res) => {
            if (res.status === 200) {
                onlyMessage($t('Detail.index.064554-13'));
                productStore.refresh(productStore.current.id);
            }
        });
        return resp;
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
                        tab: $t('Detail.index.064554-9'),
                    },
                    {
                        key: 'Metadata',
                        tab: $t('Detail.index.064554-10'),
                        class: 'objectModel',
                    },
                    {
                        key: 'Device',
                        tab: $t('Detail.index.064554-11'),
                    },
                    {
                        key: 'DataAnalysis',
                        tab: $t('Detail.index.064554-14'),
                    },
                    {
                        key: 'Firmware',
                        tab: $t('Detail.index.064554-12'),
                    },
                ];
            } else {
                list.value = [
                    {
                        key: 'Info',
                        tab: $t('Detail.index.064554-9'),
                    },
                    {
                        key: 'Metadata',
                        tab: $t('Detail.index.064554-10'),
                        class: 'objectModel',
                    },
                    {
                        key: 'Device',
                        tab: $t('Detail.index.064554-11'),
                    },
                    {
                        key: 'Firmware',
                        tab: $t('Detail.index.064554-12'),
                    },
                ];
            }
        }
        //当前设备接入选择的协议
        const protocol = res.result?.transports.find(
            (item) => item.id === productStore.current.transportProtocol,
        );
        if (
            protocol?.features.find(
                (item) => item.id === 'diffMetadataSameProduct',
            )
        ) {
            list.value.push({ key: 'MetadataMap', tab: $t('Detail.index.064554-15') });
        }
        if (
            permissionStore.hasPermission(
                'rule-engine/Alarm/Configuration:view',
            )
        ) {
            list.value.push({
                key: 'AlarmRecord',
                tab: $t('Detail.index.064554-16'),
            });
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

watch(
    () => productStore.current,
    () => {
        getProtocol();
    },
);

// watch(
//   () => route.params.id,
//   (newId) => {
//     if (newId && route.name === 'device/Product/Detail') {
//       productStore.reSet();
//       productStore.tabActiveKey = 'Info';
//       productStore.refresh(newId as string);
//     }
//   },
//   { immediate: true, deep: true },
// );

onMounted(() => {
    productStore.reSet();
    productStore.refresh(route.params.id as string);
    productStore.tabActiveKey = routerParams.params?.value.tab || 'Info';
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
    text-overflow: ellipsis;
}
</style>
