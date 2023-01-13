<template>
    <div style="margin-top: 10px">
        <a-steps :current="stepCurrent">
            <a-step v-for="item in steps" :key="item" :title="item" />
        </a-steps>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <a-icon type="info-circle" style="margin-right: 10px" />
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
                    <a-icon type="info-circle" style="margin-right: 10px" />
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
                <div class="card-last">
                    <a-row :gutter="[24, 24]">
                        <a-col :span="12">
                            <title-component data="基本信息" />
                            <div>
                                <a-form
                                    ref="formRef"
                                    :model="form"
                                    layout="vertical"
                                >
                                    <a-form-item
                                        label="名称"
                                        v-bind="validateInfos.name"
                                    >
                                        <a-input
                                            v-model:value="form.name"
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
                                            v-model:value="form.description"
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
                                            #stream
                                            slot-scope="text, record"
                                        >
                                            <span
                                                v-if="
                                                    record.upstream &&
                                                    record.downstream
                                                "
                                                >上行、下行</span
                                            >
                                            <span v-else-if="record.upstream"
                                                >上行</span
                                            >
                                            <span v-else-if="record.downstream"
                                                >下行</span
                                            >
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
                @click="next"
            >
                下一步
            </a-button>
            <a-button v-if="current === 2" type="primary" @click="saveData">
                保存
            </a-button>
            <a-button v-if="current > 0" style="margin-left: 8px" @click="prev">
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
import type { FormInstance } from 'ant-design-vue';
import Markdown from 'vue3-markdown-it';


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
"id": "MQTT",
"name": "MQTT",
"features": [],
"routes": [],
"document": "# MQTT认证说明\r\nCONNECT报文:\r\n```text\r\nclientId: 设备ID\r\nusername: secureId+\"|\"+timestamp\r\npassword: md5(secureId+\"|\"+timestamp+\"|\"+secureKey)\r\n ```\r\n\r\n说明: secureId以及secureKey在创建设备产品或设备实例时进行配置. \r\ntimestamp为当前系统时间戳(毫秒),与系统时间不能相差5分钟.\r\nmd5为32位,不区分大小写.",
"metadata": "{\"functions\":[],\"name\":\"test\",\"description\":\"测试用\",\"id\":\"test\",\"properties\":[{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"double\"},\"name\":\"温度\",\"id\":\"t\"},{\"valueType\":{\"round\":\"HALF_UP\",\"type\":\"int\"},\"name\":\"状态\",\"id\":\"state\"}],\"events\":[],\"tags\":[]}"
}

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
let columnsMQTT = ref([]);
const form = reactive({
    name: '',
    description: '',
});

const { resetFields, validate, validateInfos } = useForm(
    form,
    reactive({
        name: [
            { required: true, message: '请输入证书名称', trigger: 'blur' },
            { max: 64, message: '最多可输入64个字符' },
        ],
    }),
);

const queryNetworkList = async (id: string, params: object, data = {}) => {
    const resp = await getNetworkList(NetworkTypeMapping.get(id), data, params);
    if (resp.status === 200) {
        networkList.value = resp.result;
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
    const url = '/demo';
    const tab = window.open(
        `${window.location.origin + window.location.pathname}#${url}?type=${
            NetworkTypeMapping.get(props.provider?.id) || ''
        }`,
    );
    tab.onTabSaveSuccess = (value) => {
        if (value.success) {
            networkCurrent.value = value.result.id;
            queryNetworkList(props.provider?.id, {
                include: networkCurrent.value || '',
            });
        }
    };
};
const addProcotol = () => {
    // const url = this.$store.state.permission.routes['Link/Protocol']
    const url = '/demo';
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
    queryNetworkList(
        props.provider.id,
        {
            include: networkCurrent.value || '',
        },
        {
            terms: [
                {
                    column: 'name$LIKE',
                    value: `%${value}%`,
                },
            ],
        },
    );
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
            let resp = undefined;
            let params = {
                ...props.data,
                ...values,
                protocol: procotolCurrent.value,
                channel: 'network', // 网络组件
                channelId: networkCurrent.value,
            };
            if (props.data && props.data.id) {
                resp = await update(params);
            } else {
                params = {
                    ...params,
                    provider: props.provider.id,
                    transport:
                        props.provider?.id === 'child-device'
                            ? 'Gateway'
                            : ProtocolMapping.get(props.provider.id),
                };
                resp = await save(params);
            }
            if (resp.status === 200) {
                message.success('操作成功！');
                // 回到列表页面
                if (window.onTabSaveSuccess) {
                    window.onTabSaveSuccess(resp);
                    setTimeout(() => window.close(), 300);
                } else {
                    // this.$store.dispatch('jumpPathByKey', { key: MenuKeys['Link/AccessConfig'] })
                }
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
            columnsMQTT = [
                {
                    title: '分组',
                    dataIndex: 'group',
                    key: 'group',
                    ellipsis: true,
                    align: 'center',
                    width: 100,
                    customRender: (value, row, index) => {
                        const obj = {
                            children: value,
                            attrs: {},
                        };
                        const list = (config && config.routes) || [];
                        const arr = list.filter((res) => {
                            return res.group == row.group;
                        });
                        if (index == 0 || list[index - 1].group !== row.group) {
                            obj.attrs.rowSpan = arr.length;
                        } else {
                            obj.attrs.rowSpan = 0;
                        }
                        return obj;
                    },
                },
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

            // const resp =
            //     props.provider.channel !== 'child-device'
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
            queryNetworkList(props.provider.id, {
                include: networkCurrent.value,
            });
            procotolCurrent.value = props.data.protocol;
            steps.value = ['网络组件', '消息协议', '完成'];
        } else {
            steps.value = ['消息协议', '完成'];
            current.value = 1;
            queryProcotolList(props.provider.id);
        }
    } else {
        if (props.provider?.id) {
            if (props.provider.channel !== 'child-device') {
                queryNetworkList(props.provider.id, {
                    include: '',
                });
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

watch(
    current,
    (v) => {
        if (props.provider.channel !== 'child-device') {
            stepCurrent.value = v;
        } else {
            stepCurrent.value = v - 1;
        }
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
        max-height: 580px;
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
