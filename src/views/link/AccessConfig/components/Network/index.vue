<template>
    <div>
        <j-steps :current="stepCurrent">
            <j-step v-for="item in steps" :key="item" :title="item" />
        </j-steps>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    选择与设备通信的网络组件
                </div>
                <div class="search">
                    <j-input-search
                        allowClear
                        placeholder="请输入"
                        style="width: 300px"
                        @search="networkSearch"
                    />
                    <PermissionButton
                        type="primary"
                        @click="addNetwork"
                        hasPermission="link/Type:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        新增
                    </PermissionButton>
                </div>
                <div class="card-item">
                    <j-row :gutter="[24, 24]" v-if="networkList.length > 0">
                        <j-col
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
                                        <j-tooltip placement="topLeft">
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
                                                    <j-badge
                                                        :color="getColor(i)"
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
                                                <j-badge
                                                    :color="getColor(i)"
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
                                        </j-tooltip>
                                    </div>
                                </template>
                            </access-card>
                        </j-col>
                    </j-row>
                    <j-empty v-else description="暂无数据" />
                </div>
            </div>
            <div class="steps-box" v-else-if="current === 1">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    使用选择的消息协议，对网络组件通信数据进行编解码、认证等操作
                </div>
                <div class="search">
                    <j-input-search
                        allowClear
                        placeholder="请输入"
                        style="width: 300px"
                        @search="procotolSearch"
                    />
                    <PermissionButton
                        type="primary"
                        @click="addProcotol"
                        hasPermission="link/Protocol:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        新增
                    </PermissionButton>
                </div>
                <div class="card-item">
                    <j-row :gutter="[24, 24]" v-if="procotolList.length > 0">
                        <j-col
                            :span="8"
                            v-for="item in procotolList"
                            :key="item?.id"
                        >
                            <access-card
                                @checkedChange="procotolChange"
                                :checked="procotolCurrent"
                                :data="item"
                            >
                            </access-card>
                        </j-col>
                    </j-row>
                    <j-empty v-else description="暂无数据" />
                </div>
            </div>
            <div class="steps-box" v-else>
                <div
                    class="card-last"
                    :style="`max-height:${
                        clientHeight > 900 ? 750 : clientHeight * 0.7
                    }px`"
                >
                    <j-row :gutter="[24, 24]">
                        <j-col :span="12">
                            <title-component data="基本信息" />
                            <div>
                                <j-form
                                    ref="formRef"
                                    :model="formData"
                                    layout="vertical"
                                >
                                    <j-form-item
                                        label="名称"
                                        v-bind="validateInfos.name"
                                    >
                                        <j-input
                                            v-model:value="formData.name"
                                            allowClear
                                            placeholder="请输入名称"
                                        />
                                    </j-form-item>
                                    <j-form-item
                                        label="说明"
                                        v-bind="validateInfos.description"
                                    >
                                        <j-textarea
                                            placeholder="请输入说明"
                                            :rows="4"
                                            v-model:value="formData.description"
                                            show-count
                                            :maxlength="200"
                                        />
                                    </j-form-item>
                                </j-form>
                            </div>
                        </j-col>
                        <j-col :span="12">
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
                                    v-if="getNetworkCurrent()"
                                >
                                    <div class="config-right-item-title">
                                        网络组件
                                    </div>
                                    <div
                                        v-for="i in getNetworkCurrentData()"
                                        :key="i.address"
                                    >
                                        <j-badge
                                            :color="getColor(i)"
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
                                    <j-table
                                        :pagination="false"
                                        :rowKey="generateUUID()"
                                        :datj-source="config.routes || []"
                                        bordered
                                        :columns="
                                            config.id === 'MQTT'
                                                ? columnsMQTT
                                                : columnsHTTP
                                        "
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
                                                <span>{{
                                                    getStream(record)
                                                }}</span>
                                            </template>
                                        </template>
                                    </j-table>
                                </div>
                            </div>
                        </j-col>
                    </j-row>
                </div>
            </div>
        </div>
        <div class="steps-action">
            <j-button
                v-if="[0, 1].includes(current)"
                type="primary"
                style="margin-right: 8px"
                @click="next"
            >
                下一步
            </j-button>
            <PermissionButton
                v-if="current === 2 && view === 'false'"
                type="primary"
                style="margin-right: 8px"
                @click="saveData"
                :hasPermission="`link/AccessConfig:${
                    id === ':id' ? 'add' : 'update'
                }`"
            >
                保存
            </PermissionButton>
            <j-button
                v-if="type === 'child-device' ? current > 1 : current > 0"
                @click="prev"
            >
                上一步
            </j-button>
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
    ColumnsMQTT,
    ColumnsHTTP,
} from '../../data';
import AccessCard from '../AccessCard/index.vue';
import { message, Form } from 'ant-design-vue';
import type { FormInstance, TableColumnType } from 'ant-design-vue';
import Markdown from 'vue3-markdown-it';
import { useMenuStore } from 'store/menu';

const menuStory = useMenuStore();
function generateUUID() {
    var d = new Date().getTime();
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
const networkList: any = ref([]);
const allNetworkList: any = ref([]);
const procotolList = ref([]);
const allProcotolList = ref([]);
const networkCurrent: any = ref('');
const procotolCurrent: any = ref('');
const config: any = ref({});
const columnsMQTT = ref(<TableColumnType>[]);
const columnsHTTP = ref(<TableColumnType>[]);
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
    const resp = await getNetworkList(
        NetworkTypeMapping.get(id),
        include,
        data,
    );
    if (resp.status === 200) {
        networkList.value = resp.result;
    }
};

const queryProcotolList = async (id: string, params = {}) => {
    const resp = await getProtocolList(ProtocolMapping.get(id), {
        ...params,
        'sorts[0].name': 'createTime',
        'sorts[0].order': 'desc',
    });
    if (resp.status === 200) {
        procotolList.value = resp.result;
        allProcotolList.value = resp.result;
    }
};

const addNetwork = () => {
    const url = menuStory.menus['link/Type/Detail']?.path;
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
    const url = menuStory.menus['link/Protocol']?.path;
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

const getNetworkCurrent = () =>
    networkList.value.find((i) => i.id === networkCurrent) &&
    (networkList.value.find((i) => i.id === networkCurrent).addresses || [])
        .length > 0;
const getNetworkCurrentData = () =>
    getNetworkCurrent()
        ? networkList.value.find((i) => i.id === networkCurrent).addresses
        : [];

const getColor = (i) => (i.health === -1 ? 'red' : 'green');

const getStream = (record: any) => {
    let stream = '';
    if (record.upstream && record.downstream) stream = '上行、下行';
    else if (record.upstream) stream = '上行';
    else if (record.downstream) stream = '下行';
    return stream;
};

const checkedChange = (id: string) => {
    networkCurrent.value = id;
};

const networkSearch = (value: string) => {
    if (value) {
        networkList.value = allNetworkList.value.filter(
            (i: any) =>
                i.name &&
                i.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
        );
    } else {
        networkList.value = allNetworkList.value;
    }
};
const procotolChange = (id: string) => {
    if (!props.data.id) {
        procotolCurrent.value = id;
    }
};

const procotolSearch = (value: string) => {
    if (value) {
        const list = allProcotolList.value.filter((i: any) => {
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
            const resp =
                type !== 'child-device'
                    ? await getConfigView(
                          procotolCurrent.value,
                          ProtocolMapping.get(props.provider.id),
                      )
                    : await getChildConfigView(procotolCurrent.value);
            if (resp.status === 200) {
                config.value = resp.result;
                console.log(222, config.value);

                current.value = current.value + 1;
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
            }
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
