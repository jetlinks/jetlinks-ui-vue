<!-- 设备接入 -->
<template>
    <a-card style="min-height: 100%">
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
        <div v-else>
            <a-row :gutter="24">
                <a-col :span="12">
                    <Title data="接入方式">
                        <template #extra>
                            <a-tooltip
                                :title="
                                    productStore.current?.count &&
                                    productStore.current?.count > 0
                                        ? '产品下有设备实例时不能更换接入方式'
                                        : ''
                                "
                            >
                                <a-button
                                    style="margin: 0 0 0 20px"
                                    size="small"
                                    :disabled="
                                        productStore.current?.count &&
                                        productStore.current?.count > 0
                                    "
                                    type="primary"
                                    @click="showDevice"
                                    >更换</a-button
                                >
                            </a-tooltip>
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
                        <div
                            v-if="config?.document"
                            v-html="config?.document"
                        ></div>
                    </div>
                    <div class="item-style">
                        <Title data="连接信息"></Title>
                        <div v-if="access?.channelInfo?.addresses.length > 0">
                            <div
                                v-for="item in access?.channelInfo?.addresses"
                                :key="item.address"
                            >
                                <a-badge
                                    :color="
                                        item.health === -1 ? 'red' : 'green'
                                    "
                                    :text="item.address"
                                >
                                </a-badge>
                            </div>
                        </div>
                        <div v-else>{{ '暂无连接信息' }}</div>
                    </div>
                    <Title
                        v-if="metadata?.name"
                        :data="metadata?.name"
                        class="config"
                    >
                        <template #extra>
                            <a-tooltip
                                title="此配置来自于产品接入方式所选择的协议"
                            >
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </a-tooltip>
                        </template>
                    </Title>
                    <a-form
                        ref="formRef"
                        :model="formData.data"
                        layout="vertical"
                    >
                        <div v-for="item in metadata.properties" :key="item">
                            <a-form-item
                                :label="item.name"
                                :rules="[
                                    {
                                        required:
                                            !!item?.type?.expands?.required,
                                        message: `${
                                            item.type.type === 'enum'
                                                ? '请选择'
                                                : '请输入'
                                        }${item.name}`,
                                    },
                                ]"
                            >
                                <a-input
                                    placeholder="请输入"
                                    v-if="item.type.type === 'string'"
                                    v-model:value="formData.data[item.name]"
                                ></a-input>
                                <a-input-password
                                    placeholder="请输入"
                                    v-if="item.type.type === 'password'"
                                    v-model:value="formData.data[item.name]"
                                ></a-input-password>
                                <a-select
                                    placeholder="请选择"
                                    v-if="item.type.type === 'enum'"
                                    v-model:value="formData.data[item.name]"
                                >
                                    <a-select-option
                                        v-for="el in item?.type?.type ===
                                            'enum' && item?.type?.elements
                                            ? item?.type?.elements
                                            : []"
                                        :key="el"
                                        :value="el.value"
                                    >
                                        {{ el.text }}
                                    </a-select-option>
                                </a-select>
                            </a-form-item>
                        </div>
                    </a-form>
                    <Title data="存储策略">
                        <template #extra>
                            <a-tooltip
                                title="若修改存储策略,需要手动做数据迁移,平台只能搜索最新存储策略中的数据"
                            >
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </a-tooltip>
                        </template>
                    </Title>
                    <a-form layout="vertical">
                        <a-form-item>
                            <a-select
                                ref="select"
                                v-model:value="form.storePolicy"
                            >
                                <a-select-option
                                    v-for="(item, index) in storageList"
                                    :key="index"
                                    :value="item.id"
                                    >{{ item.name }}</a-select-option
                                >
                            </a-select>
                        </a-form-item>
                    </a-form>
                    <a-button type="primary" @click="submitDevice"
                        >保存</a-button
                    >
                </a-col>
                <a-col
                    :span="12"
                    v-if="config?.routes && config?.routes?.length > 0"
                >
                    <div class="info">
                        <div>
                            <div style="font-weight: 600; margin: 0 0 10 px 0">
                                {{
                                    access?.provider ===
                                        'mqtt-server-gateway' ||
                                    access?.provider === 'mqtt-client-gateway'
                                        ? 'topic'
                                        : 'URL信息'
                                }}
                            </div>
                            <a-table
                                :columns="
                                    config.id === 'MQTT'
                                        ? columnsMQTT
                                        : columnsHTTP
                                "
                                :data-source="config?.routes"
                                :pagination="false"
                                :scroll="{ y: 500 }"
                            >
                                <template #bodyCell="{ text, column, record }">
                                    <template v-if="column.key === 'topic'">
                                        <a-tooltip
                                            placement="topLeft"
                                            :title="text"
                                        >
                                            <div class="ellipsis-style">
                                                {{ text }}
                                            </div>
                                        </a-tooltip>
                                    </template>
                                    <template v-if="column.key === 'stream'">
                                        <div>{{ getStream(record) }}</div>
                                    </template>
                                    <template
                                        v-if="column.key === 'description'"
                                    >
                                        <a-tooltip
                                            placement="topLeft"
                                            :title="text"
                                        >
                                            <div class="ellipsis-style">
                                                {{ text }}
                                            </div>
                                        </a-tooltip>
                                    </template>
                                    <template v-if="column.key === 'address'">
                                        <a-tooltip
                                            placement="topLeft"
                                            :title="text"
                                        >
                                            <div class="ellipsis-style">
                                                {{ text }}
                                            </div>
                                        </a-tooltip>
                                    </template>
                                    <template v-if="column.key === 'example'">
                                        <a-tooltip
                                            placement="topLeft"
                                            :title="text"
                                        >
                                            <div class="ellipsis-style">
                                                {{ text }}
                                            </div>
                                        </a-tooltip>
                                    </template>
                                </template>
                            </a-table>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
    </a-card>
    <!-- 选择设备 -->
    <a-modal
        title="设备接入配置"
        :visible="visible"
        width="1200px"
        okText="确定"
        cancelText="取消"
        @ok="submitData"
        @cancel="cancel"
    >
        <Search
            :columns="query.columns"
            target="deviceModal"
            @search="search"
        />
        <JTable
            :columns="columns"
            :request="queryList"
            ref="tableRef"
            modal="card"
            :rowSelection="{
                selectedRowKeys: _selectedRowKeys,
                onChange: onSelectChange,
                type: 'radio',
            }"
            :defaultParams="{
                ...temp,
                sorts: [
                    { name: 'id', value: productStore.current?.accessId },
                    { name: 'createTime', order: 'desc' },
                ],
            }"
            :params="queryParams"
            @cancelSelect="cancelSelect"
            :gridColumn="2"
            :gridColumns="[2]"
        >
            <template #headerTitle>
                <a-button type="primary" @click="add"
                    ><plus-outlined />新增</a-button
                >
            </template>
            <template #deviceType="slotProps">
                <div>{{ slotProps.deviceType.text }}</div>
            </template>
            <template #card="slotProps">
                <CardBox
                    :value="slotProps"
                    @click="handleClick"
                    v-bind="slotProps"
                    :active="_selectedRowKeys.includes(slotProps.id)"
                    :status="slotProps.state.value"
                    :statusText="slotProps.state.text"
                    :statusNames="{
                        enabled: 'success',
                        disabled: 'error',
                    }"
                >
                    <template #img>
                        <slot name="img">
                            <img :src="getImage('/device-access.png')" />
                        </slot>
                    </template>
                    <template #content>
                        <h3 style="font-weight: 600">
                            {{ slotProps.name }}
                        </h3>
                        <a-row>
                            <a-col :span="12">
                                <div class="card-item-content-text">
                                    设备类型
                                </div>
                                <div>直连设备</div>
                            </a-col>
                        </a-row>
                    </template>
                </CardBox>
            </template>
            <template #state="slotProps">
                <a-badge
                    :text="slotProps.state === 1 ? '正常' : '禁用'"
                    :status="statusMap.get(slotProps.state)"
                />
            </template>
            <template #id="slotProps">
                <a>{{ slotProps.id }}</a>
            </template>
        </JTable>
    </a-modal>
</template>

<script lang="ts" setup>
import { useProductStore } from '@/store/product';
import { ConfigMetadata } from '@/views/device/Product/typings';
import { Empty, message } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import Title from '../Title/index.vue';
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
} from '@/api/device/product';
import { isNoCommunity } from '@/utils/utils';
const productStore = useProductStore();
import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';
import { marked } from 'marked';
const render = new marked.Renderer();
marked.setOptions({
    renderer: render,
    gfm: true,
    pedantic: false,
    snaitize: false,
});
const simpleImage = ref(Empty.PRESENTED_IMAGE_SIMPLE);
const visible = ref<boolean>(false);
const listData = ref<string[]>([]);
const access = ref({});
const config = ref({});
const metadata = ref<ConfigMetadata[]>([]);
const dataSource = ref<string[]>([]);
const storageList = ref<any[]>([]);
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
 * 打开设备弹窗
 */
const showDevice = () => {
    _selectedRowKeys.value = [productStore.current?.accessId];
    visible.value = true;
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
const param = ref<Record<string, any>>({
    pageSize: 4,
    terms: [],
});
const queryParams = ref<Record<string, any>>({});
/**
 * 查询条件
 */
const temp = {
    ...param.value,
    terms:
        productStore.current?.deviceType?.value === 'childrenDevice'
            ? [
                  ...param.value.terms,
                  {
                      terms: [
                          {
                              column: 'provider',
                              termType: 'in',
                              value: 'child-device,edge-child-device',
                          },
                      ],
                  },
              ]
            : [...param.value?.terms],
};
const _selectedRowKeys = ref<string[]>([]);
const currentForm = ref({});

const onSelectChange = (keys: string[]) => {
    _selectedRowKeys.value = [...keys];
};

const cancelSelect = () => {
    _selectedRowKeys.value = [];
};

const handleClick = (dt: any) => {
    _selectedRowKeys.value.splice(0, 1);
    _selectedRowKeys.value = [dt.id];
    current.value = {
        ...dt,
    };
};
const search = (e: any) => {
    queryParams.value = {
        ...e,
    };
};

//引导页数据
const steps = [
    {
        element: '.device-detail-metadata',
        popover: {
            className: 'driver',
            title: `<div id='title'>配置物模型</div><div id='guide'>1/3</div>`,
            description: `配置产品物模型，实现设备在云端的功能描述。`,
            position: 'bottom',
        },
    },
    {
        element: '.ant-switch',
        popover: {
            className: 'driver',
            title: `<div id='title'>启用产品</div><div id='guide'>2/3</div>`,
            description: '启用产品后，可在产品下新增设备。',
            position: 'bottom',
        },
    },
    {
        element: '.ant-descriptions-item-label',
        popover: {
            className: 'driver',
            title: `<div id='title'>添加设备</div><div id='guide'>3/3</div>`,
            description: '添加设备，并连接到平台。',
            position: 'bottom',
        },
    },
];
const steps1 = [
    {
        element: '.config',
        popover: {
            className: 'driver',
            title: `<div id='title'>填写配置</div><div id='guide'>1/4</div>`,
            description: `填写设备接入所需的配置参数。`,
            position: 'right',
        },
    },
    {
        element: '#rc-tabs-0-tab-Metadata',
        popover: {
            className: 'driver',
            title: `<div id='title'>配置物模型</div><div id='guide'>2/4</div>`,
            description: `配置产品物模型，实现设备在云端的功能描述。`,
            position: 'bottom',
        },
    },
    {
        element: '.ant-switch',
        popover: {
            className: 'driver',
            title: `<div id='title'>启用产品</div><div id='guide'>3/4</div>`,
            description: '启用产品后，可在产品下新增设备。',
            position: 'bottom',
        },
    },
    {
        element: '.ant-descriptions-item-label',
        popover: {
            className: 'driver',
            title: `<div id='title'>添加设备</div><div id='guide'>4/4</div>`,
            description: '添加设备，并连接到平台。',
            position: 'bottom',
        },
    },
];
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
        // ref.current = ref.current + 1;
    },
    onPrevious: () => {
        // ref.current = ref.current - 1;
    },
    onReset: () => {
        // if (ref.current !== 3) {
        //   guide({
        //     name: 'guide',
        //     content: 'skip',
        //   });
        // }
        // ref.current = 0;
    },
});

const driver1 = new Driver({
    allowClose: false,
    doneBtnText: '我知道了',
    closeBtnText: '不再提示',
    nextBtnText: '下一步',
    prevBtnText: '上一步',
    onNext: () => {},
    onPrevious: () => {},
    onReset: () => {
        // if (ref.current !== 4) {
        //   // guide({
        //   //   name: 'guide',
        //   //   content: 'skip',
        //   // });
        // }
        // ref.current = 0;
    },
});

/**
 * 表格列表
 */
const columnsMQTT: any[] = [
    {
        title: '分组',
        dataIndex: 'group',
        key: 'group',
        ellipsis: true,
        width: 100,
        // customCell: (record: any, index: number) => {
        //     const list =
        //         (config?.routes || []).sort((a: any, b: any) => a - b) || [];
        //     const arr = list.filter((res: any) => {
        //         // 这里gpsNumber是我需要判断的字段名（相同就合并）
        //         return res?.group == record?.group;
        //     });
        //     if (index == 0 || list[index - 1]?.group != record?.group) {
        //         return { rowSpan: arr.length };
        //     } else {
        //         return { rowSpan: 0 };
        //     }
        // },
    },
    {
        title: 'topic',
        dataIndex: 'topic',
        key: 'topic',
    },
    {
        title: '上下行',
        dataIndex: 'stream',
        key: 'stream',
        ellipsis: true,
        align: 'center',
        width: 100,
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
    },
];

const columnsHTTP: any[] = [
    {
        title: '分组',
        dataIndex: 'group',
        key: 'group',
        ellipsis: true,
        width: 100,
        // customCell: (record: any, index: number) => {
        //     const list =
        //         (config?.routes || []).sort((a: any, b: any) => a - b) || [];
        //     const arr = list.filter((res: any) => {
        //         // 这里gpsNumber是我需要判断的字段名（相同就合并）
        //         return res?.group == record?.group;
        //     });
        //     if (index == 0 || list[index - 1]?.group != record?.group) {
        //         return { rowSpan: arr.length };
        //     } else {
        //         return { rowSpan: 0 };
        //     }
        // },
    },
    {
        title: '示例',
        dataIndex: 'example',
        key: 'example',
    },
    {
        title: '说明',
        dataIndex: 'description',
        key: 'description',
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
    console.log(id, 'id');
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
        }
    });
};

/**
 * 查询协议信息
 */
const getConfigDetail = async (
    messageProtocol: string,
    transportProtocol: string,
) => {
    const res = await getConfigView(messageProtocol, transportProtocol).then(
        (resp) => {
            if (resp.status === 200) {
                config.value = resp.result;
            }
        },
    );
};

/**
 * 获取网关类型
 */
const getProviderList = async () => {
    const res = await getProviders().then((resp) => {
        if (resp.status === 200) {
            dataSource.value = resp.result;
        }
    });
};
/**
 * 提交设备数据
 */
const submitData = async () => {
    console.log(current.value, 'vvv');
    if (current.value) {
        const obj: any = {
            ...productStore.current,
            transportProtocol: current.value?.transport,
            protocolName: current.value?.protocolDetail?.name,
            accessId: current.value?.id,
            accessName: current.value?.name,
            accessProvider: current.value?.provider,
            messageProtocol: current.value?.protocol,
        };
        const metatdata = JSON.parse(productStore.current?.metadata || '{}');
        if (!productStore.current?.metadata) {
            const response = await getConfigView(
                obj?.messageProtocol || '',
                obj?.transportProtocol || '',
            );
            if (response.status === 200) {
                const ndata = JSON.parse(response.result?.metadata || '{}');
                const mdata = {
                    events: modifyArray(
                        metatdata?.events || [],
                        ndata?.events || [],
                    ),
                    properties: modifyArray(
                        metatdata?.properties || [],
                        ndata?.properties || [],
                    ),
                    functions: modifyArray(
                        metatdata?.functions || [],
                        ndata?.functions || [],
                    ),
                    tags: modifyArray(metatdata?.tags || [], ndata?.tags || []),
                };
                //  MetadataAction.insert(mdata);
                obj.metadata = JSON.stringify(mdata);
            }
        }
        const resp: any = obj.id
            ? await updateDevice(obj)
            : await saveDevice(obj);
        if (resp.status === 200) {
            console.log(productStore.current?.id, 'productStore.current?.id');
            detail(productStore.current?.id || '').then((res) => {
                if (res.status === 200) {
                    productStore.current = { ...res.result };
                    access.value = res.result;
                    message.success('操作成功！');
                }
                visible.value = false;
            });
        }
    } else {
        message.error('请选择接入方式');
    }
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
 * 查询保存数据信息
 */
const getData = async () => {
    if (productStore.current?.accessId) {
        if (productStore.current?.id) {
            getConfigMetadata(productStore.current?.id).then(
                async (resp: any) => {
                    metadata.value =
                        (resp?.result[0] as ConfigMetadata[]) || [];
                    const res: any = await productGuide();
                    if (res.result && res.result?.content === 'skip') {
                        return;
                    } else {
                        if (resp.result && resp.result.length > 0) {
                            driver1.defineSteps(steps1);
                            driver1.start();
                        } else {
                            driver.defineSteps(steps);
                            driver.start();
                        }
                    }
                },
            );
        }
        queryAccessDetail(productStore.current?.accessId);
        getConfigDetail(
            productStore.current?.messageProtocol || '',
            productStore.current?.transportProtocol || '',
        );
        getProviders().then((resp) => {
            if (resp.status === 200) {
                dataSource.value = resp.result;
            }
        });
    } else {
        if (productStore.current?.id) {
            getConfigMetadata(productStore.current?.id).then((resp: any) => {
                metadata.value = resp?.result[0] as ConfigMetadata[];
            });
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
    const values = { storePolicy: form.storePolicy, ...formData.data };
    const result: any = {};
    flatObj(values, result);
    const { storePolicy, ...extra } = result;
    const id = productStore.current?.id;
    const resp = await modify(id || '', {
        id: id,
        configuration: { ...extra },
        storePolicy: storePolicy,
    });
    if (resp.status === 200) {
        message.success('操作成功！');
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
const getDetailInfo = () => {};
/**
 * 初始化
 */
watchEffect(() => {
    if (productStore.current?.accessId) {
        getData();
    }
});
</script>
<style lang="less" scoped>
:deep(._jtable-body_1eyxz_1
        ._jtable-body-header_1eyxz_6
        ._jtable-body-header-right_1eyxz_12
        ._jtable-body-header-right-button_1eyxz_17) {
    display: none;
    margin-left: 10px;
    gap: 8px;
}

.item-style {
    margin-bottom: 10px;
}

.info {
    height: 630px;
    padding: 20px;
    background-color: #e6e6e6;
}

.ellipsis-style {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
