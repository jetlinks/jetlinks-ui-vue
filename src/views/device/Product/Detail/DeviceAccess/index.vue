<!-- 设备接入 -->
<template>
    <j-card style="min-height: 100%">
        <div v-if="productStore.current.accessId === undefined || null">
            <j-empty :image="simpleImage">
                <template #description>
                    <span
                        v-if="
                            permissionStore.hasPermission(
                                'device/Product:update',
                            )
                        "
                    >
                        请先<j-button type="link" @click="showModal"
                            >选择</j-button
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
                            <j-tooltip
                                :title="
                                    productStore.current?.count &&
                                    productStore.current?.count > 0
                                        ? '产品下有设备实例时不能更换接入方式'
                                        : ''
                                "
                            >
                                <j-button
                                    style="margin: 0 0 0 20px"
                                    size="small"
                                    :disabled="
                                        productStore.current?.count &&
                                        productStore.current?.count > 0
                                    "
                                    type="primary"
                                    @click="showDevice"
                                    >更换</j-button
                                >
                            </j-tooltip>
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
                            v-html="markdownToHtml"
                        ></div>
                    </div>
                    <div class="item-style">
                        <Title data="连接信息"></Title>
                        <div v-if="access?.channelInfo?.addresses.length > 0">
                            <div
                                v-for="item in access?.channelInfo?.addresses"
                                :key="item.address"
                            >
                                <j-badge
                                    :color="
                                        item.health === -1 ? 'red' : 'green'
                                    "
                                    :text="item.address"
                                >
                                </j-badge>
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
                            v-for="item in metadata.properties"
                            :key="item"
                            :label="item.name"
                            :rules="[
                                {
                                    required: !!item?.type?.expands?.required,
                                    message: `${
                                        item.type.type === 'enum'
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
                                v-if="item.type.type === 'enum'"
                                v-model:value="formData.data[item.name]"
                            >
                                <j-select-option
                                    v-for="el in item?.type?.type === 'enum' &&
                                    item?.type?.elements
                                        ? item?.type?.elements
                                        : []"
                                    :key="el"
                                    :value="el.value"
                                >
                                    {{ el.text }}
                                </j-select-option>
                            </j-select>
                        </j-form-item>
                    </j-form>
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
                            <j-select
                                ref="select"
                                v-model:value="form.storePolicy"
                            >
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
                        >保存</PermissionButton
                    >
                </j-col>
                <j-col
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
                            <j-table
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
                                        <j-tooltip
                                            placement="topLeft"
                                            :title="text"
                                        >
                                            <div class="ellipsis-style">
                                                {{ text }}
                                            </div>
                                        </j-tooltip>
                                    </template>
                                    <template v-if="column.key === 'stream'">
                                        <div>{{ getStream(record) }}</div>
                                    </template>
                                    <template
                                        v-if="column.key === 'description'"
                                    >
                                        <j-tooltip
                                            placement="topLeft"
                                            :title="text"
                                        >
                                            <div class="ellipsis-style">
                                                {{ text }}
                                            </div>
                                        </j-tooltip>
                                    </template>
                                    <template v-if="column.key === 'address'">
                                        <j-tooltip
                                            placement="topLeft"
                                            :title="text"
                                        >
                                            <div class="ellipsis-style">
                                                {{ text }}
                                            </div>
                                        </j-tooltip>
                                    </template>
                                    <template v-if="column.key === 'example'">
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
    </j-card>
    <!-- 选择设备 -->
    <j-modal
        title="设备接入配置"
        v-if="visible"
        visible
        width="1200px"
        okText="确定"
        cancelText="取消"
        @ok="submitData"
        @cancel="cancel"
    >
        <pro-search
            :columns="query.columns"
            target="deviceModal"
            @search="search"
            type="simple"
        />
        <JProTable
            :columns="query.columns"
            :request="queryList"
            ref="tableRef"
            model="CARD"
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
                <j-button type="primary" @click="add"
                    ><plus-outlined />新增</j-button
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
                        enabled: 'processing',
                        disabled: 'error',
                    }"
                >
                    <template #img>
                        <slot name="img">
                            <img :src="getImage('/device-access.png')" />
                        </slot>
                    </template>
                    <template #content>
                        <Ellipsis style="width: calc(100% - 100px)">
                            <h3 style="font-weight: 600">
                                {{ slotProps.name }}
                            </h3>
                        </Ellipsis>
                        <j-row>
                            <j-col :span="12" v-if="slotProps.channelInfo">
                                <div class="card-item-content-text">
                                    {{ slotProps.channelInfo?.name }}
                                </div>
                                <Ellipsis style="width: calc(100% - 20px)">
                                    <div>
                                        {{
                                            slotProps.channelInfo?.addresses
                                                ? slotProps.channelInfo
                                                      ?.addresses[0].address
                                                : ''
                                        }}
                                    </div>
                                </Ellipsis>
                            </j-col>
                            <j-col :span="12">
                                <div class="card-item-content-text">协议</div>
                                <div>{{ slotProps.protocolDetail?.name }}</div>
                            </j-col>
                        </j-row>
                        <j-row>
                            <j-col :span="24">
                                <Ellipsis style="width: calc(100% - 50px)"
                                    ><div class="context-access">
                                        {{
                                            !!slotProps?.description
                                                ? slotProps?.description
                                                : dataSource.find(
                                                      (item) =>
                                                          item?.id ===
                                                          slotProps?.provider,
                                                  )?.description
                                        }}
                                    </div></Ellipsis
                                >
                            </j-col>
                        </j-row>
                    </template>
                </CardBox>
            </template>
            <template #state="slotProps">
                <j-badge
                    :text="slotProps.state === 1 ? '正常' : '禁用'"
                    :status="statusMap.get(slotProps.state)"
                />
            </template>
            <template #id="slotProps">
                <a>{{ slotProps.id }}</a>
            </template>
        </JProTable>
    </j-modal>
</template>

<script lang="ts" setup>
import { useProductStore } from '@/store/product';
import { ConfigMetadata } from '@/views/device/Product/typings';
import { Empty, message } from 'jetlinks-ui-components';
import { getImage } from '@/utils/comm';
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
} from '@/api/device/product';
import { isNoCommunity } from '@/utils/utils';
const productStore = useProductStore();
import Driver from 'driver.js';
import 'driver.js/dist/driver.min.css';
import { marked } from 'marked';
import type { TableColumnType } from 'ant-design-vue';
import { useMenuStore } from '@/store/menu';
import _ from 'lodash';
const tableRef = ref();
const formRef = ref();
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
const listData = ref<string[]>([]);
const access = ref({});
const config = ref<any>({});
const metadata = ref<ConfigMetadata>({ properties: [] });
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
            key: 'provider',
            dataIndex: 'provider',
            search: {
                type: 'select',
                options: async () => {
                    return new Promise((res) => {
                        getProviders().then((resp: any) => {
                            listData.value = [];
                            console.log(description.value);
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
                        value: 'enabled',
                    },
                    {
                        label: '禁用',
                        value: 'disabled',
                    },
                ],
            },
        },
        {
            title: '说明',
            key: 'description',
            dataIndex: 'description',
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

/**
 * 表格列表
 */
// const columnsMQTT: any[] = [
//     {
//         title: '分组',
//         dataIndex: 'group',
//         key: 'group',
//         ellipsis: true,
//         width: 100,
//         // customCell: (record: any, index: number) => {
//         //     const list =
//         //         (config?.routes || []).sort((a: any, b: any) => a - b) || [];
//         //     const arr = list.filter((res: any) => {
//         //         // 这里gpsNumber是我需要判断的字段名（相同就合并）
//         //         return res?.group == record?.group;
//         //     });
//         //     if (index == 0 || list[index - 1]?.group != record?.group) {
//         //         return { rowSpan: arr.length };
//         //     } else {
//         //         return { rowSpan: 0 };
//         //     }
//         // },
//     },
//     {
//         title: 'topic',
//         dataIndex: 'topic',
//         key: 'topic',
//     },
//     {
//         title: '上下行',
//         dataIndex: 'stream',
//         key: 'stream',
//         ellipsis: true,
//         align: 'center',
//         width: 100,
//     },
//     {
//         title: '说明',
//         dataIndex: 'description',
//         key: 'description',
//     },
// ];
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
// const columnsHTTP: any[] = [
//     {
//         title: '分组',
//         dataIndex: 'group',
//         key: 'group',
//         ellipsis: true,
//         width: 100,
//         // customCell: (record: any, index: number) => {
//         //     const list =
//         //         (config?.routes || []).sort((a: any, b: any) => a - b) || [];
//         //     const arr = list.filter((res: any) => {
//         //         // 这里gpsNumber是我需要判断的字段名（相同就合并）
//         //         return res?.group == record?.group;
//         //     });
//         //     if (index == 0 || list[index - 1]?.group != record?.group) {
//         //         return { rowSpan: arr.length };
//         //     } else {
//         //         return { rowSpan: 0 };
//         //     }
//         // },
//     },
//     {
//         title: '示例',
//         dataIndex: 'example',
//         key: 'example',
//     },
//     {
//         title: '说明',
//         dataIndex: 'description',
//         key: 'description',
//     },
// ];
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
        }
    });
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

                    const arr = list.filter(
                        (res: any) => res.group === record.group,
                    );

                    const isRowIndex =
                        rowIndex === 0 ||
                        list[rowIndex - 1].group !== record.group;
                    isRowIndex && (obj.rowSpan = arr.length);

                    return obj;
                },
            };
            columnsMQTT.value = [Group, ...ColumnsMQTT];
            columnsHTTP.value = [Group, ...ColumnsHTTP];
            if (config.value?.document) {
                markdownToHtml.value = marked(config.value.document);
            }
        }
    });
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
        // 保存或者更新设备接入
        const resp: any = obj.id
            ? await updateDevice(obj)
            : await saveDevice(obj);
        if (resp.status === 200) {
            detail(productStore.current?.id || '').then((res) => {
                if (res.status === 200) {
                    productStore.current = { ...res.result };
                    access.value = res.result;
                    message.success('操作成功！');
                    getData(obj.accessId);
                }
                visible.value = false;
                queryParams.value = {};
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
/**
 * 查询保存数据信息
 */
const getData = async (accessId?: string) => {
    const _accessId = accessId || productStore.current?.accessId;
    if (productStore.current?.id) {
        getConfigMetadata(productStore.current?.id).then((resp: any) => {
            metadata.value = (resp?.result[0] as ConfigMetadata) || {
                properties: [],
            };
            // 流传输模式 初始为udp模式
            if (metadata.value?.properties) {
                metadata.value?.properties.forEach((item) => {
                    if (
                        item.name === '流传输模式' &&
                        (!productStore.current?.configuration ||
                            !productStore.current?.configuration.hasOwnProperty(
                                item.name,
                            ))
                    ) {
                        formData.data[item.name] =
                            item.type.expands?.defaultValue;
                    }
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
        getConfigDetail(
            productStore.current?.messageProtocol || '',
            productStore.current?.transportProtocol || '',
        );
        getProviders().then((resp) => {
            if (resp.status === 200) {
                dataSource.value = resp.result;
            }
        });
    }
    // else {
    //   if (productStore.current?.id) {
    //     getConfigMetadata(productStore.current?.id).then((resp: any) => {
    //       metadata.value = resp?.result[0] as ConfigMetadata[];
    //     });
    //   }
    // }
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
    const res = await formRef.value.validate();
    const values = { storePolicy: form.storePolicy, ...formData.data };
    const result: any = {};
    flatObj(values, result);
    const { storePolicy, ...extra } = result;
    console.log({ ...extra });
    const id = productStore.current?.id;
    const resp = await modify(id || '', {
        id: id,
        configuration: { ...extra },
        storePolicy: storePolicy,
    });
    if (resp.status === 200) {
        message.success('操作成功！');
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
const getDetailInfo = () => {};

const add = () => {
    const url = menuStore.hasMenu('link/AccessConfig/Detail');
    if (url) {
        const tab: any = window.open(`${origin}/#${url}?view=false`);
        tab.onTabSaveSuccess = (value: any) => {
            console.log(value);
            if (value.status === 200) {
                tableRef.value.reload();
                handleClick(value.result);
            }
        };
    }
};
/**
 * 初始化
 */
watchEffect(() => {
    if (productStore.current?.storePolicy) {
        form.storePolicy = productStore.current!.storePolicy;
    }
});

nextTick(() => {
    getData();
});
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

.context-access {
    margin-right: 10px;
    color: #666;
    font-weight: 400;
    font-size: 12px;
}
</style>
