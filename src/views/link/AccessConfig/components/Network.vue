<template>
    <div>
        <a-steps :current="stepCurrent">
            <a-step v-for="item in steps" :key="item" :title="item" />
        </a-steps>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <info-circle-outlined />
                    选择与设备通信的网络组件
                </div>
                <div class="search">
                    <a-input-search
                        allowClear
                        placeholder="请输入"
                        style="width: 300px"
                        @search="networkSearch"
                    />
                    <a-button type="primary" @click="addNetwork">新增</a-button>
                </div>
                <div class="card-item">
                    <a-row :gutter="[24, 24]" v-if="networkList.length > 0">
                        <a-col
                            :span="8"
                            v-for="item in networkList"
                            :key="item.id"
                        >
                            <access-card
                                @checkedChange="checkedChange"
                                :checked="networkCurrent"
                                :data="{
                                    ...item,
                                    description: item.description
                                        ? item.description
                                        : descriptionList[provider.id],
                                }"
                            >
                                <template #other>
                                    <div class="other">
                                        <a-tooltip placement="topLeft">
                                            <div
                                                v-if="
                                                    (item.addresses || [])
                                                        .length > 1
                                                "
                                            >
                                                <div
                                                    v-for="i in item.addresses ||
                                                    []"
                                                    :key="i.address"
                                                    class="item"
                                                >
                                                    <a-badge
                                                        :color="
                                                            i.health === -1
                                                                ? 'red'
                                                                : 'green'
                                                        "
                                                    />{{ i.address }}
                                                </div>
                                            </div>
                                            <div
                                                v-for="i in (
                                                    item.addresses || []
                                                ).slice(0, 1)"
                                                :key="i.address"
                                                class="item"
                                            >
                                                <a-badge
                                                    :color="
                                                        i.health === -1
                                                            ? 'red'
                                                            : 'green'
                                                    "
                                                    :text="i.address"
                                                />
                                                <span
                                                    v-if="
                                                        (item.addresses || [])
                                                            .length > 1
                                                    "
                                                    >...</span
                                                >
                                            </div>
                                        </a-tooltip>
                                    </div>
                                </template>
                            </access-card>
                        </a-col>
                    </a-row>
                    <a-empty v-else description="暂无数据" />
                </div>
            </div>
            <div class="steps-box" v-else-if="current === 1">
                <div class="alert">
                    <info-circle-outlined />
                    使用选择的消息协议，对网络组件通信数据进行编解码、认证等操作
                </div>
                <div class="search">
                    <a-input-search
                        allowClear
                        placeholder="请输入"
                        style="width: 300px"
                        @search="procotolSearch"
                    />
                    <a-button type="primary" @click="addProcotol"
                        >新增</a-button
                    >
                </div>
                <div class="card-item">
                    <a-row :gutter="[24, 24]" v-if="procotolList.length > 0">
                        <a-col
                            :span="8"
                            v-for="item in procotolList"
                            :key="item.id"
                        >
                            <access-card
                                @checkedChange="procotolChange"
                                :checked="procotolCurrent"
                                :data="item"
                            >
                            </access-card>
                        </a-col>
                    </a-row>
                    <a-empty v-else description="暂无数据" />
                </div>
            </div>
            <div class="steps-box" v-else>
                <div
                    class="card-last"
                    :style="`max-height:${
                        clientHeight > 900 ? 750 : clientHeight * 0.7
                    }px`"
                >
                    <a-row :gutter="[24, 24]">
                        <a-col :span="12">
                            <title-component data="基本信息" />
                            <div>
                                <a-form
                                    ref="formRef"
                                    :model="formData"
                                    layout="vertical"
                                >
                                    <a-form-item
                                        label="名称"
                                        v-bind="validateInfos.name"
                                    >
                                        <a-input
                                            v-model:value="formData.name"
                                            allowClear
                                            placeholder="请输入名称"
                                        />
                                    </a-form-item>
                                    <a-form-item
                                        label="说明"
                                        v-bind="validateInfos.description"
                                    >
                                        <a-textarea
                                            placeholder="请输入说明"
                                            :rows="4"
                                            v-model:value="formData.description"
                                            show-count
                                            :maxlength="200"
                                        />
                                    </a-form-item>
                                </a-form>
                            </div>
                        </a-col>
                        <a-col :span="12">
                            <div class="config-right">
                                <div class="config-right-item">
                                    <div class="config-right-item-title">
                                        接入方式
                                    </div>
                                    <div class="config-right-item-context">
                                        {{ provider.name }}
                                    </div>
                                    <div class="config-right-item-context">
                                        {{ provider.description }}
                                    </div>
                                </div>
                                <div class="config-right-item">
                                    <div class="config-right-item-title">
                                        消息协议
                                    </div>
                                    <div class="config-right-item-context">
                                        {{
                                            procotolList.find(
                                                (i) => i.id === procotolCurrent,
                                            ).name
                                        }}
                                    </div>
                                    <div
                                        class="config-right-item-context"
                                        v-if="config.document"
                                    >
                                        <Markdown :source="config.document" />
                                    </div>
                                </div>
                                <div
                                    class="config-right-item"
                                    v-if="
                                        networkList.find(
                                            (i) => i.id === networkCurrent,
                                        ) &&
                                        (
                                            networkList.find(
                                                (i) => i.id === networkCurrent,
                                            ).addresses || []
                                        ).length > 0
                                    "
                                >
                                    <div class="config-right-item-title">
                                        网络组件
                                    </div>
                                    <div
                                        v-for="i in (networkList.find(
                                            (i) => i.id === networkCurrent,
                                        ) &&
                                            networkList.find(
                                                (i) => i.id === networkCurrent,
                                            ).addresses) ||
                                        []"
                                        :key="i.address"
                                    >
                                        <a-badge
                                            :color="
                                                i.health === -1
                                                    ? 'red'
                                                    : 'green'
                                            "
                                            :text="i.address"
                                        />
                                    </div>
                                </div>
                                <div
                                    class="config-right-item"
                                    v-if="
                                        config.routes &&
                                        config.routes.length > 0
                                    "
                                >
                                    <div class="config-right-item-title">
                                        {{
                                            data.provider ===
                                                'mqtt-server-gateway' ||
                                            data.provider ===
                                                'mqtt-client-gateway'
                                                ? 'topic'
                                                : 'URL信息'
                                        }}
                                    </div>
                                    <a-table
                                        :pagination="false"
                                        :rowKey="generateUUID()"
                                        :data-source="config.routes || []"
                                        bordered
                                        :columns="columnsMQTT"
                                        :scroll="{ y: 300 }"
                                    >
                                        <template
                                            #bodyCell="{ column, text, record }"
                                        >
                                            <template
                                                v-if="
                                                    column.dataIndex ===
                                                    'stream'
                                                "
                                            >
                                                <span
                                                    v-if="
                                                        record.upstream &&
                                                        record.downstream
                                                    "
                                                    >上行、下行</span
                                                >
                                                <span
                                                    v-else-if="record.upstream"
                                                    >上行</span
                                                >
                                                <span
                                                    v-else-if="
                                                        record.downstream
                                                    "
                                                    >下行</span
                                                >
                                            </template>
                                        </template>
                                    </a-table>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </div>
        <div class="steps-action">
            <a-button
                v-if="[0, 1].includes(current)"
                type="primary"
                style="margin-right: 8px"
                @click="next"
            >
                下一步
            </a-button>
            <a-button
                v-if="current === 2 && view === 'false'"
                type="primary"
                style="margin-right: 8px"
                @click="saveData"
            >
                保存
            </a-button>
            <a-button
                v-if="type === 'child-device' ? current > 1 : current > 0"
                @click="prev"
            >
                上一步
            </a-button>
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessNetwork">
import {
    getNetworkList,
    getProtocolList,
    getConfigView,
    save,
    update,
    getChildConfigView,
} from '@/api/link/accessConfig';
import {
    descriptionList,
    NetworkTypeMapping,
    ProtocolMapping,
} from '../Detail/data';
import AccessCard from './AccessCard/index.vue';
import { message, Form } from 'ant-design-vue';
import type { FormInstance, TableColumnType } from 'ant-design-vue';
import Markdown from 'vue3-markdown-it';
import { InfoCircleOutlined } from '@ant-design/icons-vue';
//测试数据1
const resultList1 = [
    {
        id: '1610466717670780928',
        name: '官方协议',
    },
    {
        id: '1610205217785524224',
        name: 'demo协议',
    },
    {
        id: '1610204985806958592',
        name: '水压协议',
    },
    {
        id: '1605459961693745152',
        name: '测试设备诊断日志显示',
    },
    {
        id: '1582302200020783104',
        name: 'demo',
    },
    {
        id: '1581839391887794176',
        name: '海康闸机协议',
    },
    {
        id: '1567062365030637568',
        name: '协议20220906160914',
    },
    {
        id: '1561650927208628224',
        name: 'local',
    },
];

//测试数据2
// const result2 = {
//     id: 'UDP',
//     name: 'UDP',
//     features: [],
//     routes: [],
//     metadata: '',
// };
const result2 = {
    id: 'MQTT',
    name: 'MQTT',
    features: [
        {
            id: 'supportFirmware',
            name: '支持固件升级',
        },
    ],
    routes: [
        {
            topic: '/{productId:产品ID}/{deviceId:设备ID}/properties/report',
            upstream: true,
            downstream: false,
            qos: 0,
            group: '属性上报',
            description: '上报物模型属性数据',
            example: '{"properties":{"属性ID":"属性值"}}',
            address: '/{productId:产品ID}/{deviceId:设备ID}/properties/report',
        },
        {
            topic: '/{productId:产品ID}/{deviceId:设备ID}/properties/read',
            upstream: false,
            downstream: true,
            qos: 0,
            group: '读取属性',
            description: '平台下发读取物模型属性数据指令',
            example:
                '{"messageId":"消息ID,回复时需要一致.","properties":["属性ID"]}',
            address: '/{productId:产品ID}/{deviceId:设备ID}/properties/read',
        },
        {
            topic: '/{productId:产品ID}/{deviceId:设备ID}/properties/read/reply',
            upstream: true,
            downstream: false,
            qos: 0,
            group: '读取属性',
            description: '对平台下发的读取属性指令进行响应',
            example:
                '{"messageId":"消息ID,与读取指令中的ID一致.","properties":{"属性ID":"属性值"}}',
            address:
                '/{productId:产品ID}/{deviceId:设备ID}/properties/read/reply',
        },
        {
            topic: '/{productId:产品ID}/{deviceId:设备ID}/properties/write',
            upstream: false,
            downstream: true,
            qos: 0,
            group: '修改属性',
            description: '平台下发修改物模型属性数据指令',
            example:
                '{"messageId":"消息ID,回复时需要一致.","properties":{"属性ID":"属性值"}}',
            address: '/{productId:产品ID}/{deviceId:设备ID}/properties/write',
        },
        {
            topic: '/{productId:产品ID}/{deviceId:设备ID}/properties/write/reply',
            upstream: true,
            downstream: false,
            qos: 0,
            group: '修改属性',
            description: '对平台下发的修改属性指令进行响应',
            example:
                '{"messageId":"消息ID,与修改指令中的ID一致.","properties":{"属性ID":"属性值"}}',
            address:
                '/{productId:产品ID}/{deviceId:设备ID}/properties/write/reply',
        },
        {
            topic: '/{productId:产品ID}/{deviceId:设备ID}/event/{eventId:事件ID}',
            upstream: true,
            downstream: false,
            qos: 0,
            group: '事件上报',
            description: '上报物模型事件数据',
            example: '{"data":{"key":"value"}}',
            address:
                '/{productId:产品ID}/{deviceId:设备ID}/event/{eventId:事件ID}',
        },
        {
            topic: '/{productId:产品ID}/{deviceId:设备ID}/function/invoke',
            upstream: false,
            downstream: true,
            qos: 0,
            group: '调用功能',
            description: '平台下发功能调用指令',
            example:
                '{"messageId":"消息ID,回复时需要一致.","functionId":"功能标识","inputs":[{"name":"参数名","value":"参数值"}]}',
            address: '/{productId:产品ID}/{deviceId:设备ID}/function/invoke',
        },
        {
            topic: '/{productId:产品ID}/{deviceId:设备ID}/function/invoke/reply',
            upstream: true,
            downstream: false,
            qos: 0,
            group: '调用功能',
            description: '设备响应平台下发的功能调用指令',
            example:
                '{"messageId":"消息ID,与下发指令中的messageId一致.","output":"输出结果,格式与物模型中定义的类型一致"',
            address:
                '/{productId:产品ID}/{deviceId:设备ID}/function/invoke/reply',
        },
        {
            topic: '/{productId:产品ID}/{deviceId:设备ID}/child/{childDeviceId:子设备ID}/{#:子设备相应操作的topic}',
            upstream: true,
            downstream: true,
            qos: 0,
            group: '子设备消息',
            description: '网关上报或者平台下发子设备消息',
            address:
                '/{productId:产品ID}/{deviceId:设备ID}/child/{childDeviceId:子设备ID}/{#:子设备相应操作的topic}',
        },
        {
            topic: '/{productId:产品ID}/{deviceId:设备ID}/child-reply/{childDeviceId:子设备ID}/{#:子设备相应操作的topic}',
            upstream: true,
            downstream: true,
            qos: 0,
            group: '子设备消息',
            description: '网关回复平台下发给子设备的指令结果',
            address:
                '/{productId:产品ID}/{deviceId:设备ID}/child-reply/{childDeviceId:子设备ID}/{#:子设备相应操作的topic}',
        },
        {
            topic: '/{productId:产品ID}/{deviceId:设备ID}/tags',
            upstream: true,
            downstream: false,
            qos: 0,
            group: '更新标签',
            description: '更新标签数据',
            example: '{"tags":{"key","value"}}',
            address: '/{productId:产品ID}/{deviceId:设备ID}/tags',
        },
        {
            topic: '/{productId:产品ID}/{deviceId:设备ID}/online',
            upstream: true,
            downstream: false,
            qos: 0,
            group: '状态管理',
            description: '设备上线',
            address: '/{productId:产品ID}/{deviceId:设备ID}/online',
        },
        {
            topic: '/{productId:产品ID}/{deviceId:设备ID}/offline',
            upstream: true,
            downstream: false,
            qos: 0,
            group: '状态管理',
            description: '设备离线',
            address: '/{productId:产品ID}/{deviceId:设备ID}/offline',
        },
    ],
    document:
        '### 认证说明\r\n\r\nCONNECT报文:\r\n```text\r\nclientId: 设备ID\r\nusername: secureId+"|"+timestamp\r\npassword: md5(secureId+"|"+timestamp+"|"+secureKey)\r\n ```\r\n\r\n说明: secureId以及secureKey在创建设备产品或设备实例时进行配置. \r\ntimestamp为当前时间戳(毫秒),与服务器时间不能相差5分钟.\r\nmd5为32位,不区分大小写.',
    metadata: '',
};
//测试数据
const networkData = {
    COAP_SERVER: [
        {
            id: '1620352949679960064',
            name: '前端测试1',
            description: '前端测试1',
            addresses: [
                {
                    address: 'coap://111.0.0:88',
                    health: 1,
                    ok: true,
                    bad: false,
                    disabled: false,
                },
            ],
        },
        {
            id: '1613071630619607040',
            name: '1',
            addresses: [
                {
                    address: 'coap://120.77.179.54:9000',
                    health: 1,
                    ok: true,
                    bad: false,
                    disabled: false,
                },
            ],
        },
    ],
    UDP: [
        {
            id: '1590553821093437440',
            name: '194',
            addresses: [
                {
                    address: 'udp://139.217.130.194:1883',
                    health: 1,
                    ok: true,
                    bad: false,
                    disabled: false,
                },
            ],
        },
        {
            id: '1585831257204301824',
            name: '测试隐藏集群',
            description: '111',
            addresses: [
                {
                    address: 'udp://127.0.0.1:8080',
                    health: 1,
                    ok: true,
                    bad: false,
                    disabled: false,
                },
            ],
        },
        {
            id: '1584825665263149056',
            name: '1',
            addresses: [
                {
                    address: 'udp://120.77.179.54:9000',
                    health: 1,
                    ok: true,
                    bad: false,
                    disabled: false,
                },
            ],
        },
        {
            id: '1551761481741672448',
            name: '0726UDP',
            description: '测试',
            addresses: [
                {
                    address: 'udp://120.77.179.54:8088',
                    health: 1,
                    ok: true,
                    bad: false,
                    disabled: false,
                },
            ],
        },
    ],
    TCP_SERVER: [
        {
            id: '1603206069979918336',
            name: '测试A',
            addresses: [
                {
                    address: 'tcp://120.77.179.54:8106',
                    health: -1,
                    ok: false,
                    bad: false,
                    disabled: true,
                },
            ],
        },
        {
            id: '1603206069979918330',
            name: '测试AA',
            addresses: [
                {
                    address: 'tcp://120.77.179.54:8106',
                    health: -1,
                    ok: false,
                    bad: false,
                    disabled: true,
                },
            ],
        },
    ],
    MQTT_SERVER: [
        {
            id: '1585192878304051200',
            name: 'MQTT网络组件',
            addresses: [
                {
                    address: 'mqtt://120.77.179.54:8101',
                    health: 1,
                    ok: true,
                    bad: false,
                    disabled: false,
                },
            ],
        },
        {
            id: '1583268266806009856',
            name: '我的第一个MQTT服务组件',
            description: '',
            addresses: [
                {
                    address: 'mqtt://120.77.179.54:8100',
                    health: 1,
                    ok: true,
                    bad: false,
                    disabled: false,
                },
            ],
        },
        {
            id: '1570335308902912000',
            name: '0915MQTT网络组件_勿动',
            description: '测试，勿动！',
            addresses: [
                {
                    address: 'mqtt://120.77.179.54:8083',
                    health: 1,
                    ok: true,
                    bad: false,
                    disabled: false,
                },
            ],
        },
        {
            id: '1567062350140858368',
            name: '网络组件20220906160907',
            addresses: [
                {
                    address: 'mqtt://120.77.179.54:8083',
                    health: 1,
                    ok: true,
                    bad: false,
                    disabled: false,
                },
            ],
        },
        {
            id: '1556563257890742272',
            name: 'MQTT网络组件',
            addresses: [
                {
                    address: 'mqtt://0.0.0.0:8104',
                    health: 1,
                    ok: true,
                    bad: false,
                    disabled: false,
                },
            ],
        },
        {
            id: '1534774770408108032',
            name: 'MQTT',
            addresses: [
                {
                    address: 'mqtt://120.77.179.54:8088',
                    health: 1,
                    ok: true,
                    bad: false,
                    disabled: false,
                },
            ],
        },
    ],
};
function generateUUID() {
    var d = new Date().getTime();
    if (
        typeof performance !== 'undefined' &&
        typeof performance.now === 'function'
    ) {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
        /[xy]/g,
        function (c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
        },
    );
}

const props = defineProps({
    provider: {
        type: Object,
        default: () => {},
    },
    data: {
        type: Object,
        default: () => {},
    },
});

const clientHeight = document.body.clientHeight;
const type = props.provider.channel;
const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const formRef = ref<FormInstance>();
const useForm = Form.useForm;

const current = ref(0);
const stepCurrent = ref(0);
const steps = ref(['网络组件', '消息协议', '完成']);
const networkList = ref([]);
const procotolList = ref([]);
const allProcotolList = ref([]);
const networkCurrent = ref('');
const procotolCurrent = ref('');
let config = ref({});
let columnsMQTT = ref(<TableColumnType>[]);
const formData = ref({
    name: '',
    description: '',
});

const { resetFields, validate, validateInfos } = useForm(
    formData,
    reactive({
        name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { max: 64, message: '最多可输入64个字符' },
        ],
        description: [{ max: 200, message: '最多可输入200个字符' }],
    }),
);

const queryNetworkList = async (id: string, include: string, data = {}) => {
    if (NetworkTypeMapping.get(id) === 'MQTT_SERVER') {
        //使用测试数据
        networkList.value = networkData[NetworkTypeMapping.get(id)];
        // return;
    }
    const resp = await getNetworkList(
        NetworkTypeMapping.get(id),
        include,
        data,
    );
    if (resp.status === 200) {
        //使用测试数据
        // networkList.value = resp.result;
        networkList.value =
            resp.result.length === 0
                ? networkData[NetworkTypeMapping.get(id)]
                : resp.result;
    }
};

// const  queryProcotolList=async(id:string, params:object) =>{
const queryProcotolList = async (id: string, params = {}) => {
    // const resp = await getProtocolList(ProtocolMapping.get(id), {
    //     ...params,
    //     'sorts[0].name': 'createTime',
    //     'sorts[0].order': 'desc',
    // });
    // if (resp.status === 200) {
    //     procotolList.value = resp.result;
    //     allProcotolList.value = resp.result;
    // }

    //使用测试数据1
    procotolList.value = resultList1;
    allProcotolList.value = resultList1;
};

const addNetwork = () => {
    // const url = this.$store.state.permission.routes['Link/Type/Detail']
    const url = '/iot/link/type/detail/:id';
    const tab = window.open(
        `${window.location.origin + window.location.pathname}#${url}?type=${
            NetworkTypeMapping.get(props.provider?.id) || ''
        }`,
    );
    tab.onTabSaveSuccess = (value) => {
        if (value.success) {
            networkCurrent.value = value.result.id;
            queryNetworkList(props.provider?.id, networkCurrent.value || '');
        }
    };
};
const addProcotol = () => {
    // const url = this.$store.state.permission.routes['Link/Protocol']
    const url = '/iot/link/protocol';
    const tab = window.open(
        `${window.location.origin + window.location.pathname}#${url}?save=true`,
    );
    tab.onTabSaveSuccess = (value) => {
        if (value.success) {
            procotolCurrent.value = value.result?.id;
            queryProcotolList(props.provider?.id);
        }
    };
};

const checkedChange = (id: string) => {
    networkCurrent.value = id;
};

const networkSearch = (value: string) => {
    queryNetworkList(props.provider.id, networkCurrent.value || '', {
        terms: [
            {
                column: 'name$LIKE',
                value: `%${value}%`,
            },
        ],
    });
};
const procotolChange = (id: string) => {
    if (!props.data.id) {
        procotolCurrent.value = id;
    }
};

const procotolSearch = (value: string) => {
    if (value) {
        const list = allProcotolList.value.filter((i) => {
            return (
                i.name &&
                i.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
            );
        });
        procotolList.value = list;
    } else {
        procotolList.value = allProcotolList.value;
    }
};

const saveData = () => {
    validate()
        .then(async (values) => {
            const params = {
                ...props.data,
                ...values,
                protocol: procotolCurrent.value,
                channel: 'network', // 网络组件
                channelId: networkCurrent.value,
            };
            const resp =
                id === ':id'
                    ? await save(params)
                    : await update({
                          ...params,
                          id,
                          provider: props.provider.id,
                          transport:
                              props.provider?.id === 'child-device'
                                  ? 'Gateway'
                                  : ProtocolMapping.get(props.provider.id),
                      });
            if (resp.status === 200) {
                message.success('操作成功！');
                // 回到列表页面
                // if (window.onTabSaveSuccess) {
                //     window.onTabSaveSuccess(resp);
                //     setTimeout(() => window.close(), 300);
                // } else {
                //     // this.$store.dispatch('jumpPathByKey', { key: MenuKeys['Link/AccessConfig'] })
                // }
                history.back();
            }
        })
        .catch((err) => {});
};

const next = async () => {
    if (current.value === 0) {
        if (!networkCurrent.value) {
            message.error('请选择网络组件！');
        } else {
            queryProcotolList(props.provider.id);
            current.value = current.value + 1;
        }
    } else if (current.value === 1) {
        if (!procotolCurrent.value) {
            message.error('请选择消息协议！');
        } else {
            //使用测试数据2
            config.value = result2;
            current.value = current.value + 1;
            columnsMQTT.value = [
                {
                    title: '分组',
                    dataIndex: 'group',
                    key: 'group',
                    ellipsis: true,
                    align: 'center',
                    width: 100,
                    customCell: (record: object, rowIndex: number) => {
                        const obj = {
                            children: record,
                            rowSpan: 0,
                        };
                        const list =
                            (config.value && config.value.routes) || [];

                        const arr = list.filter(
                            (res: object) => res.group == record.group,
                        );

                        if (
                            rowIndex == 0 ||
                            list[rowIndex - 1].group !== record.group
                        )
                            obj.rowSpan = arr.length;

                        return obj;
                    },
                },
                {
                    title: 'topic',
                    dataIndex: 'topic',
                    key: 'topic',
                    align: 'center',
                    ellipsis: true,
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
                    ellipsis: true,
                },
            ];

            // const resp =
            //     type !== 'child-device'
            //         ? await getConfigView(
            //               procotolCurrent.value,
            //               ProtocolMapping.get(props.provider.id),
            //           )
            //         : await getChildConfigView(procotolCurrent.value);
            // if (resp.status === 200) {
            //     config.value = resp.result;
            //     current.value = current.value + 1;
            //     columnsMQTT = [
            //         {
            //             title: '分组',
            //             dataIndex: 'group',
            //             key: 'group',
            //             ellipsis: true,
            //             align: 'center',
            //             width: 100,
            //             customRender: (value, row, index) => {
            //                 const obj = {
            //                     children: value,
            //                     attrs: {},
            //                 };
            //                 const list = (config && config.routes) || [];
            //                 const arr = list.filter((res) => {
            //                     return res.group == row.group;
            //                 });
            //                 if (
            //                     index == 0 ||
            //                     list[index - 1].group !== row.group
            //                 ) {
            //                     obj.attrs.rowSpan = arr.length;
            //                 } else {
            //                     obj.attrs.rowSpan = 0;
            //                 }
            //                 return obj;
            //             },
            //         },
            //         {
            //             title: 'topic',
            //             dataIndex: 'topic',
            //             key: 'topic',
            //             ellipsis: true,
            //         },
            //         {
            //             title: '上下行',
            //             dataIndex: 'stream',
            //             key: 'stream',
            //             ellipsis: true,
            //             align: 'center',
            //             width: 100,
            //             scopedSlots: { customRender: 'stream' },
            //         },
            //         {
            //             title: '说明',
            //             dataIndex: 'description',
            //             key: 'description',
            //             ellipsis: true,
            //         },
            //     ];
            // }
        }
    }
};
const prev = () => {
    current.value = current.value - 1;
};

onMounted(() => {
    if (props.data && props.data.id) {
        if (props.data.provider !== 'child-device') {
            procotolCurrent.value = props.data.protocol;
            current.value = 0;
            networkCurrent.value = props.data.channelId;
            queryNetworkList(props.provider.id, networkCurrent.value);
            procotolCurrent.value = props.data.protocol;
            steps.value = ['网络组件', '消息协议', '完成'];
        } else {
            steps.value = ['消息协议', '完成'];
            current.value = 1;
            queryProcotolList(props.provider.id);
        }
    } else {
        if (props.provider?.id) {
            if (type !== 'child-device') {
                queryNetworkList(props.provider.id, '');
                steps.value = ['网络组件', '消息协议', '完成'];
                current.value = 0;
            } else {
                steps.value = ['消息协议', '完成'];
                current.value = 1;
                queryProcotolList(props.provider.id);
            }
        }
    }
});

onMounted(() => {
    if (id !== ':id') {
        procotolCurrent.value = props.data.protocol;
        formData.value = {
            name: props.data.name,
            description: props.data.description,
        };
    }
});

watch(
    current,
    (v) => {
        stepCurrent.value = type === 'child-device' ? v - 1 : v;
    },
    {
        deep: true,
        immediate: true,
    },
);
</script>

<style lang="less" scoped>
.steps-content {
    margin: 20px;
}
.steps-box {
    min-height: 400px;
    .card-item {
        padding-right: 5px;
        max-height: 480px;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .card-last {
        padding-right: 5px;
        overflow-y: auto;
        overflow-x: hidden;
    }
}
.steps-action {
    width: 100%;
    margin-top: 24px;
    margin-left: 20px;
}
.alert {
    height: 40px;
    padding-left: 10px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 40px;
    background-color: #f6f6f6;
}
.search {
    display: flex;
    margin: 15px 0;
    justify-content: space-between;
}

.other {
    width: 100%;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    .item {
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
}

.config-right {
    padding: 20px;
    color: rgba(0, 0, 0, 0.8);
    background: rgba(0, 0, 0, 0.04);

    .config-right-item {
        margin-bottom: 10px;

        .config-right-item-title {
            width: 100%;
            margin-bottom: 10px;
            font-weight: 600;
        }

        .config-right-item-context {
            margin: 5px 0;
            color: rgba(0, 0, 0, 0.8);
        }
    }
}
</style>
