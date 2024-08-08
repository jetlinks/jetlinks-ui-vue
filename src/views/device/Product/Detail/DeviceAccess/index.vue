<!-- 设备接入 -->
<template>
    <div
        v-if="access.id === undefined || null"
        style="margin-top: 20%; transform: translateY(-50%)"
    >
        <j-empty :image="simpleImage">
            <template #description>
                <span
                    v-if="
                        permissionStore.hasPermission('device/Product:update')
                    "
                >
                    请先<j-button type="link" @click="showModal">选择</j-button
                    >设备接入网关，用以提供设备接入能力
                </span>
                <span v-else>请联系管理员配置产品接入方式</span>
            </template>
        </j-empty>
    </div>
    <div v-else>
        <j-row :gutter="24">
            <j-col :span="12">
                <Title data="接入方式">
                    <template #extra>
                        <PermissionButton
                            style="margin: 0 0 0 20px"
                            type="primary"
                            size="small"
                            :tooltip="{
                                title: tooltip,
                            }"
                            :disabled="checkDisabled"
                            ghost
                            @click="showDevice"
                            hasPermission="device/Product:update"
                        >
                            更换
                        </PermissionButton>
                    </template>
                </Title>
                <div>
                    <div>
                        {{ access?.name }}
                    </div>
                    <div>
                        {{
                            access?.description ||
                            dataSource.find(
                                (item) => item?.id === access?.provider,
                            )?.description
                        }}
                    </div>
                </div>
                <div class="item-style">
                    <Title data="消息协议"></Title>
                    <div>
                        {{ access?.protocolDetail?.name }}
                    </div>
                    <!-- 显示md文件内容 -->
                    <div v-if="config?.document" v-html="markdownToHtml"></div>
                </div>
                <div class="item-style">
                    <Title data="连接信息"></Title>
                    <div v-if="access?.channelInfo?.addresses.length > 0">
                        <div
                            v-for="item in access?.channelInfo?.addresses"
                            :key="item.address"
                        >
                            <j-badge
                                :color="item.health === -1 ? 'red' : 'green'"
                                :text="item.address"
                            >
                            </j-badge>
                        </div>
                    </div>
                    <div v-else>{{ '暂无连接信息' }}</div>
                </div>
                <!--        产品类型        -->
                <j-form
                    ref="pluginFormRef"
                    :model="productData"
                    layout="vertical"
                    v-if="productTypes.length"
                >
                    <j-form-item
                        name="id"
                        label="产品类型"
                        :rules="[{ required: true, message: '请选择产品类型' }]"
                    >
                        <j-select
                            v-model:value="productData.id"
                            :options="productTypes"
                            @change="productTypeChange"
                            placeholder="请选择产品类型"
                        />
                    </j-form-item>
                </j-form>
                <!--        其它接入配置        -->
                <div v-for="(i,index) in metadata">
                    <Title v-if="i?.name" :data="i?.name" class="config">
                        <template #extra>
                            <j-tooltip
                                title="此配置来自于产品接入方式所选择的协议"
                            >
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </j-tooltip>
                        </template>
                    </Title>
                    <j-form
                        ref="formRef"
                        :model="formData.data"
                        layout="vertical"
                    >
                        <j-form-item
                            :name="item.property"
                            v-for="item in i?.properties || []"
                            :key="item"
                            :label="item.name"
                            :rules="[
                                {
                                    required: !!item?.type?.expands?.required,
                                    message: `${
                                        item.type.type === 'enum' || 'boolean'
                                            ? '请选择'
                                            : '请输入'
                                    }${item.name}`,
                                },
                            ]"
                        >
                            <j-input
                                placeholder="请输入"
                                v-if="item.type.type === 'string'"
                                v-model:value="formData.data[item.property]"
                            ></j-input>
                            <j-input-password
                                placeholder="请输入"
                                v-if="item.type.type === 'password'"
                                v-model:value="formData.data[item.property]"
                            ></j-input-password>
                            <j-select
                                placeholder="请选择"
                                v-if="
                                    item.type.type === 'enum' ||
                                    item.type.type === 'boolean'
                                "
                                v-model:value="formData.data[item.property]"
                                :options="getOptions(item)"
                            >
                                <!-- <j-select-option
                                v-for="el in item?.type?.type === 'enum' &&
                                item?.type?.elements
                                    ? item?.type?.elements
                                    : []"
                                :key="el"
                                :value="el.value"
                            >
                                {{ el.text }}
                            </j-select-option> -->
                            </j-select>
                            <j-input-number
                                v-if="
                                    ['int', 'float', 'double', 'long'].includes(
                                        item.type.type,
                                    )
                                "
                                v-model:value="formData.data[item.property]"
                                placeholder="请输入"
                            ></j-input-number>
                        </j-form-item>
                    </j-form>
                </div>
                <Title data="存储策略">
                    <template #extra>
                        <j-tooltip
                            title="若修改存储策略,需要手动做数据迁移,平台只能搜索最新存储策略中的数据"
                        >
                            <AIcon
                                type="QuestionCircleOutlined"
                                style="margin-left: 2px"
                            />
                        </j-tooltip>
                    </template>
                </Title>
                <j-form layout="vertical">
                    <j-form-item>
                        <j-select ref="select" v-model:value="form.storePolicy">
                            <j-select-option
                                v-for="(item, index) in storageList"
                                :key="index"
                                :value="item.id"
                                >{{ item.name }}</j-select-option
                            >
                        </j-select>
                    </j-form-item>
                </j-form>
                <PermissionButton
                    type="primary"
                    @click="submitDevice"
                    hasPermission="device/Instance:update"
                    :loading="submitLoading"
                    >保存</PermissionButton
                >
            </j-col>
            <j-col
                :span="12"
                v-if="config?.routes && config?.routes?.length > 0"
            >
                <div class="info">
                    <div>
                        <div style="font-weight: 600; margin: 0 0 10px 0">
                            {{
                                access?.provider === 'mqtt-server-gateway' ||
                                access?.provider === 'mqtt-client-gateway'
                                    ? 'topic'
                                    : 'URL信息'
                            }}
                        </div>
                        <j-table
                            :columns="
                                config.id === 'MQTT' ? columnsMQTT : columnsHTTP
                            "
                            :data-source="config?.routes"
                            :pagination="false"
                            :scroll="{ y: 500 }"
                        >
                            <template #bodyCell="{ text, column, record }">
                                <template v-if="column?.key === 'topic'">
                                    <j-tooltip
                                        placement="topLeft"
                                        :title="text"
                                    >
                                        <div class="ellipsis-style">
                                            {{ text }}
                                        </div>
                                    </j-tooltip>
                                </template>
                                <template v-if="column?.key === 'stream'">
                                    <div>{{ getStream(record) }}</div>
                                </template>
                                <template v-if="column.key === 'description'">
                                    <j-tooltip
                                        placement="topLeft"
                                        :title="text"
                                    >
                                        <div class="ellipsis-style">
                                            {{ text }}
                                        </div>
                                    </j-tooltip>
                                </template>
                                <template v-if="column?.key === 'address'">
                                    <j-tooltip
                                        placement="topLeft"
                                        :title="text"
                                    >
                                        <div class="ellipsis-style">
                                            {{ text }}
                                        </div>
                                    </j-tooltip>
                                </template>
                                <template v-if="column?.key === 'example'">
                                    <j-tooltip
                                        placement="topLeft"
                                        :title="text"
                                    >
                                        <div class="ellipsis-style">
                                            {{ text }}
                                        </div>
                                    </j-tooltip>
                                </template>
                            </template>
                        </j-table>
                    </div>
                </div>
            </j-col>
        </j-row>
    </div>
    <!-- 选择设备 -->
    <AccessModal
        v-if="visible"
        :product-id="productStore.current.id"
        :deviceType="productStore.current.deviceType"
        :accessId="accessId"
        :providersList="dataSource"
        @cancel="visible = false"
        @submit="checkAccess"
    />
    <!-- 物模型处理方式 -->
    <MetaDataModal
        v-if="metadataVisible"
        :metadata="productData.metadata"
        :access="access"
        :data="metadataModalCacheData"
        @cancel="
            () => {
                (metadataVisible = false), (metadataModalCacheData = {});
            }
        "
        @submit="MetaDataModalSubmit"
    />
</template>

<script lang="ts" setup name="AccessConfig">
import { useProductStore } from '@/store/product';
import { ConfigMetadata } from '@/views/device/Product/typings';
import { Empty } from 'jetlinks-ui-components';
import Title from '../Title/index.vue';
import { usePermissionStore } from '@/store/permission';
import { steps, steps1 } from './util';
import './index.less';
import {
    getProviders,
    _deploy,
    _undeploy,
    queryList,
    getConfigView,
    getConfigMetadata,
    productGuide,
    productGuideSave,
    getStoragList,
    saveDevice,
    updateDevice,
    detail,
    modify,
    getAccessConfig,
} from '@/api/device/product';

import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';
import { marked } from 'marked';
import type { TableColumnType } from 'ant-design-vue';
import { useMenuStore } from '@/store/menu';
import _ from 'lodash-es';
import { accessConfigTypeFilter } from '@/utils/setting';
import AccessModal from './accessModal.vue';
import MetaDataModal from './metadataModal.vue';
import {
    getPluginData,
    getProductByPluginId,
    savePluginData,
} from '@/api/link/plugin';
import { detail as queryPluginAccessDetail } from '@/api/link/accessConfig';
import { onlyMessage } from '@/utils/comm';
import { pick } from 'lodash-es';

const productStore = useProductStore();
const tableRef = ref();
const formRef = ref([]);
const menuStore = useMenuStore();
const permissionStore = usePermissionStore();
const render = new marked.Renderer();
marked.setOptions({
    renderer: render,
    gfm: true,
    pedantic: false,
    snaitize: false,
});
const simpleImage = ref(Empty.PRESENTED_IMAGE_SIMPLE);
const visible = ref<boolean>(false);
const access = ref<Record<string, any>>({});
const accessId = ref<string>(productStore.current.accessId);
const config = ref<any>({});
const metadata = ref<ConfigMetadata[]>([{ properties: [] }]);
const dataSource = ref<string[]>([]);
const storageList = ref<any[]>([]);
const markdownToHtml = shallowRef('');
const current = ref({
    id: productStore.current?.accessId,
    name: productStore.current?.accessName,
    protocol: productStore.current?.messageProtocol,
    transport: productStore.current?.transportProtocol,
    protocolDetail: {
        name: productStore.current?.protocolName,
    },
});
//存储数据
const form = reactive<Record<string, any>>({
    storePolicy: 'default-row' || productStore.current?.storePolicy || '',
});
// 表单数据
const formData = reactive<Record<string, any>>({
    data: productStore.current?.configuration || {},
});
//获取物模型下拉选项
const getOptions = (i: any) => {
    if (i.type.type === 'enum') {
        return (i.type?.elements || []).map((item) => {
            return {
                label: item?.text,
                value: item?.value,
            };
        });
    } else if (i.type.type === 'boolean') {
        return [
            {
                label: i.type?.falseText,
                value: i.type?.falseValue,
            },
            {
                label: i.type?.trueText,
                value: i.type?.trueValue,
            },
        ];
    }
    return undefined;
};
const fun = () => {
    console.log(formData.data, productStore.current?.configuration);
};
fun();
// 产品类型
const productTypes = ref([]);
const productData = reactive({
    id: undefined,
    metadata: {}, // 物模型
});
const pluginFormRef = ref();
const metadataVisible = ref(false);
const metadataModalCacheData = ref();

const submitLoading = ref(false);
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
    queryParams.value = {};
    visible.value = false;
};
/**
 * 打开设备弹窗
 */
const showDevice = () => {
    visible.value = true;
};

const param = ref<Record<string, any>>({
    pageSize: 4,
    terms: [],
});
const queryParams = ref<Record<string, any>>({});

const currentForm = ref({});

const search = (e: any) => {
    queryParams.value = {
        ...e,
    };
};

const stepsRef = reactive({ current: 0 });

/**
 * 保存引导页数据
 */
const guide = (data: any) => {
    productGuideSave(data);
};
/**
 * 显示引导页
 */
const driver = new Driver({
    allowClose: false,
    doneBtnText: '我知道了',
    closeBtnText: '不再提示',
    nextBtnText: '下一步',
    prevBtnText: '上一步',
    onNext: () => {
        stepsRef.current = stepsRef.current + 1;
    },
    onPrevious: () => {
        stepsRef.current = stepsRef.current - 1;
    },
    onReset: () => {
        if (stepsRef.current !== 3) {
            guide({
                name: 'guide',
                content: 'skip',
            });
        }
        stepsRef.current = 0;
    },
});

const driver1 = new Driver({
    allowClose: false,
    doneBtnText: '我知道了',
    closeBtnText: '不再提示',
    nextBtnText: '下一步',
    prevBtnText: '上一步',
    onNext: () => {
        stepsRef.current = stepsRef.current + 1;
    },
    onPrevious: () => {
        stepsRef.current = stepsRef.current - 1;
    },
    onReset: () => {
        if (stepsRef.current !== 4) {
            guide({
                name: 'guide',
                content: 'skip',
            });
        }
        stepsRef.current = 0;
    },
});

let columnsMQTT = ref(<TableColumnType>[]);
const ColumnsMQTT = [
    {
        title: 'topic',
        dataIndex: 'topic',
        key: 'topic',
        ellipsis: true,
    },
    {
        title: '上下行',
        dataIndex: 'stream',
        key: 'stream',
        ellipsis: true,
        align: 'center',
        width: 100,
        scopedSlots: { customRender: 'stream' },
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
    },
];
const columnsHTTP = ref(<TableColumnType>[]);
const ColumnsHTTP = [
    {
        title: '地址',
        dataIndex: 'address',
        key: 'address',
        ellipsis: true,
        // scopedSlots: { customRender: 'address' },
    },
    {
        title: '示例',
        dataIndex: 'example',
        key: 'example',
        ellipsis: true,
        // scopedSlots: { customRender: 'example' },
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
        ellipsis: true,
        // scopedSlots: { customRender: 'description' },
    },
];
/**
 * 获取上下行数据
 */
const getStream = (record: any) => {
    const list = [];
    if (record?.upstream) {
        list.push('上行');
    }
    if (record?.downstream) {
        list.push('下行');
    }
    return `${list.join(',')}`;
};
/**
 * 查询接入方式
 */
const queryAccessDetail = async (id: string) => {
    const res = await queryList({
        terms: [
            {
                column: 'id',
                value: id,
            },
        ],
    }).then((res: any) => {
        if (res.status === 200) {
            access.value = res.result.data[0];
            if (access.value?.transportDetail?.metadata) {
                const metadata = JSON.parse(
                    access.value?.transportDetail?.metadata,
                );
                productData.metadata = pick(metadata, [
                    'functions',
                    'properties',
                    'events',
                    'tags',
                ]);
            }
        }
    });
};

const handleColumns = () => {
    const Group = {
        title: '分组',
        dataIndex: 'group',
        key: 'group',
        ellipsis: true,
        align: 'center',
        width: 100,
        customCell: (record: any, rowIndex: number) => {
            const obj = {
                children: record,
                rowSpan: 0,
            };
            const list = config.value?.routes || [];

            const arr = list.filter((res: any) => res.group === record.group);

            const isRowIndex =
                rowIndex === 0 || list[rowIndex - 1].group !== record.group;
            isRowIndex && (obj.rowSpan = arr.length);

            return obj;
        },
    };
    columnsMQTT.value = [Group, ...ColumnsMQTT];
    columnsHTTP.value = [Group, ...ColumnsHTTP];
};

/**
 * 查询协议信息
 */
const getConfigDetail = (
    messageProtocol: string,
    transportProtocol: string,
) => {
    getConfigView(messageProtocol, transportProtocol).then((resp) => {
        if (resp.status === 200) {
            config.value = resp.result;
            handleColumns();
            if (config.value?.document) {
                markdownToHtml.value = marked(config.value.document);
            }
        }
    });
};

const modifyArray = (oldData: any[], newData: any[]) => {
    newData.map((item) => {
        if (!_.map(oldData, 'id').includes(item.id)) {
            oldData.push(item);
        }
    });
    return oldData.map((item, index) => {
        return { ...item, sortsIndex: index };
    });
};
/**
 *
 */
const getGuide = async (isDriver1: boolean = false) => {
    const res: any = await productGuide();
    if (res.result && res.result?.content === 'skip') {
        return;
    } else {
        if (isDriver1) {
            driver1.defineSteps(steps1);
            driver1.start();
        } else {
            driver.defineSteps(steps);
            driver.start();
        }
    }
};

const checkAccess = async (data: any) => {
    visible.value = false;
    accessId.value = data.access.id;
    access.value = data.access;
    config.value = data.access?.transportDetail || {};
    productTypes.value = [];
    productData.id = undefined;
    productData.metadata = {};
    metadata.value = data.metadata || [
        {
            properties: [],
        },
    ];
    if (metadata.value.length) {
        metadata.value.forEach((i: any) => {
            i?.properties.forEach((item: any) => {
                if (
                    item.name === '流传输模式' &&
                    (!productStore.current?.configuration ||
                        !productStore.current?.configuration.hasOwnProperty(
                            item.property,
                        ))
                ) {
                    formData.data[item.property] =
                        item.type.expands?.defaultValue;
                }
            });
        });
    }
    if (data.access.channel === 'plugin') {
        // 插件设备
        markdownToHtml.value = '';
        productTypes.value = data.productTypes.map((item) => ({
            ...item,
            label: item.name,
            value: item.id,
        }));
    } else {
        handleColumns();
        markdownToHtml.value = config.value?.document
            ? marked(config.value.document)
            : '';
        getGuide(!!data.metadata.length); //

        if (data.access?.transportDetail?.metadata) {
            const metadata = JSON.parse(data.access?.transportDetail?.metadata);
            productData.metadata = pick(metadata, [
                'functions',
                'properties',
                'events',
                'tags',
            ]);
        }
    }
};

const productTypeChange = (id: string, items: any) => {
    productData.metadata = items?.metadata
        ? pick(items.metadata, ['functions', 'properties', 'events', 'tags'])
        : {};
};

/**
 * 获取协议类型名称
 */
const getProvidersList = async () => {
    const res: any = await getProviders();
    dataSource.value = res.result;
};

/**
 * 查询保存数据信息
 */
const getData = async (accessId?: string) => {
    const _accessId = accessId || productStore.current?.accessId;
    if (productStore.current?.id) {
        getConfigMetadata(productStore.current?.id).then((resp: any) => {
            metadata.value = resp?.result || [
                {
                    properties: [],
                },
            ];
            // 流传输模式 初始为udp模式
            if (metadata.value.length) {
                metadata.value.forEach((i: any) => {
                    i?.properties.forEach((item: any) => {
                        if (
                            item.name === '流传输模式' &&
                            (!productStore.current?.configuration ||
                                !productStore.current?.configuration.hasOwnProperty(
                                    item.property,
                                ))
                        ) {
                            formData.data[item.property] =
                                item.type.expands?.defaultValue;
                        }
                    });
                });
            }
            if (accessId) {
                // 切换接入方式之后获取是否显示引导
                getGuide(resp?.result.length); //
            }
        });
    }
    if (_accessId) {
        // 有设备接入
        // const metadataResp = await getConfigMetadata(productStore.current!.id)
        // if (metadataResp.success) {
        //   metadata.value = (metadataResp.result?.[0] as ConfigMetadata[]) || [];
        // }
        queryAccessDetail(_accessId);
        if (productStore.current?.accessProvider === 'plugin_gateway') {
            queryPluginAccessDetail(_accessId).then(async (res) => {
                //
                if (res.success) {
                    const pluginRes = await getPluginData(
                        'product',
                        _accessId,
                        productStore.current?.id,
                    );
                    const resp = await getProductByPluginId(
                        res.result.channelId,
                    ).catch(() => ({ success: false, result: [] }));
                    if (resp.success) {
                        productTypes.value = resp.result.map((item) => {
                            if (pluginRes?.result?.externalId === item.id) {
                                productData.id = pluginRes?.result?.externalId;
                                productData.metadata = pick(item.metadata, [
                                    'functions',
                                    'properties',
                                    'events',
                                    'tags',
                                ]);
                            }
                            return {
                                ...item,
                                label: item.name,
                                value: item.id,
                            };
                        });
                    }
                }
            });
        } else {
            getConfigDetail(
                productStore.current?.messageProtocol || '',
                productStore.current?.transportProtocol || '',
            );
        }
    }
    getStoragList().then((resp: any) => {
        if (resp.status === 200) {
            storageList.value = resp.result;
        }
    });
};

/**
 * 保存设备接入
 */
const submitDevice = async () => {
    if (pluginFormRef.value) {
        // 插件
        const pluginRef = await pluginFormRef.value.validate();
        if (!pluginRef) return;
    }
    const allValidate = formRef.value.map((item:any)=>{
        return item?.validate()
    })
    const res = await Promise.all(allValidate)
    // const res = await formRef.value.validate();
    if (!res) return;
    const values = { storePolicy: form.storePolicy, ...formData.data };
    const id = productStore.current?.id;
    // 该产品是否有物模型，有则弹窗进行处理
    const _metadata = JSON.parse(productStore.current?.metadata || '{}');
    if (
        (_metadata.properties?.length ||
            _metadata.events?.length ||
            _metadata.functions?.length ||
            _metadata.tags?.length) &&
        (productData.metadata?.properties?.length ||
            productData.metadata?.events?.length ||
            productData.metadata?.functions?.length ||
            productData.metadata?.tags?.length)
    ) {
        metadataModalCacheData.value = {
            id,
            values,
            productTypeId: productData.id,
        };
        metadataVisible.value = true;
    } else {
        updateAccessData(id, values);
    }
};

const updateAccessData = async (id: string, values: any) => {
    const result: any = {};
    //   flatObj(values, result);
    //   const { storePolicy, ...extra } = result;
    const { storePolicy, ...extra } = values;
    // 产品有物模型，设备接入没有，取产品物模型；设备接入有物模型，产品没有，取设备接入的物模型；否则取空字符串；不能为undefined或者null
    let _metadata = '';
    if (productStore.current?.metadata) {
        _metadata = productStore.current?.metadata;
    } else if (
        productData.metadata &&
        Object.keys(productData.metadata).length
    ) {
        _metadata = JSON.stringify(productData.metadata);
    }
    // 更新选择设备(设备接入)
    const accessObj = {
        ...productStore.current,
        metadata: _metadata,
        transportProtocol: access.value?.transport,
        protocolName: access.value?.protocolDetail?.name,
        accessId: access.value?.id,
        accessName: access.value?.name,
        accessProvider: access.value?.provider,
        messageProtocol: access.value?.protocol,
    };
    submitLoading.value = true;
    const updateDeviceResp = await updateDevice(accessObj).catch(() => {
        success: false;
    });

    if (!updateDeviceResp.success) {
        submitLoading.value = false;
    }

    if (access.value?.provider === 'plugin_gateway' && productData.id) {
        await savePluginData(
            'product',
            access.value?.id,
            productStore.current.id,
            productData.id,
        ).catch(() => ({}));
    }
    // 更新产品配置信息
    const resp = await modify(id || '', {
        id: id,
        configuration: { ...extra },
        storePolicy: storePolicy,
    }).finally(() => {
        submitLoading.value = false;
    });
    if (resp.status === 200) {
        onlyMessage('操作成功！');
        productStore.current!.storePolicy = storePolicy;
        if ((window as any).onTabSaveSuccess) {
            if (resp.result) {
                (window as any).onTabSaveSuccess(resp);
                setTimeout(() => window.close(), 300);
            }
        } else {
            getDetailInfo();
        }
    }
};

const flatObj = (obj: any, result: any) => {
    Object.keys(obj).forEach((key: string) => {
        if (typeof obj[key] === 'string') {
            result[key] = obj[key];
        } else {
            flatObj(obj[key], result);
        }
    });
};

const getDetailInfo = async () => {
    await productStore.getDetail(productStore.detail.id);
    MetaDataModalSubmit();
};

const MetaDataModalSubmit = () => {
    // 跳转物模型标签
    productStore.tabActiveKey = 'Metadata';
};

getProvidersList();
/**
 * 初始化
 */
watchEffect(() => {
    if (productStore.current?.storePolicy) {
        form.storePolicy = productStore.current!.storePolicy;
    }
});

const tooltip = computed(() => {
    if (productStore.current?.count > 0) {
        return '产品下有设备实例时不能更换接入方式';
    }
    if (productStore.current.state === 1) {
        return '停用产品后才可更换接入方式';
    }
    return '';
});

const checkDisabled = computed(() => {
    if (productStore.current?.count > 0 || productStore.current.state === 1) {
        return true;
    }
    return false;
});

nextTick(() => {
    getData();
});
watch(
    () => productStore.current,
    () => {
        getData();
        formData.data = productStore.current?.configuration || {};
    },
);
</script>
<style lang="less" scoped>
:deep(
        ._jtable-body_1eyxz_1
            ._jtable-body-header_1eyxz_6
            ._jtable-body-header-right_1eyxz_12
            ._jtable-body-header-right-button_1eyxz_17
    ) {
    display: none;
    margin-left: 10px;
    gap: 8px;
}

.item-style {
    margin-bottom: 10px;
}
.ellipsis-style {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}

.context-access {
    margin-right: 10px;
    color: #666;
    font-weight: 400;
    font-size: 12px;
}
.changeBtn {
    margin: 0 0 0 20px;
}
</style>
