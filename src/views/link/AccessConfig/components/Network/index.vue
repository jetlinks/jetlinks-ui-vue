<template>
    <div>
        <j-steps :current="stepCurrent">
            <j-step disabled v-for="item in steps" :key="item" :title="item" />
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
                <j-scrollbar height="480">
                    <j-row
                        :gutter="[24, 24]"
                        style="width: 100%"
                        v-if="networkList.length > 0"
                    >
                        <j-col
                            :span="8"
                            v-for="item in networkList"
                            :key="item.id"
                        >
                            <AccessCard
                                @checkedChange="checkedChange"
                                :checked="networkCurrent"
                                :data="{
                                    ...item,
                                    description: item.description
                                        ? item.description
                                        : descriptionList[provider.id],
                                    type: 'network',
                                }"
                            >
                                <template #other>
                                    <div class="other">
                                        <j-tooltip placement="top" :title="addressesTip(item.addresses)">
                                            <div
                                                v-for="i in (
                                                    item.addresses || []
                                                ).slice(0, 1)"
                                                :key="i.address"
                                                class="item"
                                            >
                                                <j-badge
                                                    :status="getColor(i)"
                                                    :text="i.address"
                                                />
                                                <span
                                                    v-if="
                                                        (item.addresses || [])
                                                            .length > 1
                                                    "
                                                    >等{{ item.addresses.length }}条</span
                                                >
                                            </div>
                                        </j-tooltip>
                                    </div>
                                </template>
                            </AccessCard>
                        </j-col>
                    </j-row>
                    <j-empty
                        style="margin-top: 10%"
                        v-else
                        description="暂无数据"
                    />
                </j-scrollbar>
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
                      v-if='showAddBtn'
                        type="primary"
                        @click="addProcotol"
                        hasPermission="link/Protocol:add"
                    >
                        <template #icon><AIcon type="PlusOutlined" /></template>
                        新增
                    </PermissionButton>
                </div>
                <j-scrollbar height="480">
                    <j-row
                        :gutter="[24, 24]"
                        style="width: 100%"
                        v-if="procotolList.length > 0"
                    >
                        <j-col
                            :span="8"
                            v-for="item in procotolList"
                            :key="item?.id"
                        >
                            <AccessCard
                                @checkedChange="procotolChange"
                                :checked="procotolCurrent"
                                :disabled='!showAddBtn'
                                :data="{ ...item, type: 'protocol' }"
                            >
                            </AccessCard>
                        </j-col>
                    </j-row>
                    <j-empty
                        style="margin-top: 10%"
                        v-else
                        description="暂无数据"
                    />
                </j-scrollbar>
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
                        </j-col>
                        <j-col :span="12">
                            <j-scrollbar height="580">
                                <div class="doc">
                                    <h1>接入方式</h1>
                                    <p>
                                        {{ provider.name }}
                                    </p>
                                    <p>
                                        {{ provider.description }}
                                    </p>
                                    <h1>消息协议</h1>
                                    <p>
                                        {{
                                            procotolList.find(
                                                (i: any) =>
                                                    i.id === procotolCurrent,
                                            ).name
                                        }}
                                    </p>
                                    <p v-if="config.document">
                                        <Markdown :source="config.document" />
                                    </p>
                                    <div v-if="getNetworkCurrent()">
                                        <h1>网络组件</h1>
                                        <p
                                            v-for="i in getNetworkCurrentData()"
                                            :key="i.address"
                                        >
                                            <j-badge
                                                :status="getColor(i)"
                                                :text="i.address"
                                            />
                                        </p>
                                    </div>
                                    <div
                                        v-if="
                                            config.routes &&
                                            config.routes.length > 0
                                        "
                                    >
                                        <h1>
                                            {{
                                                data.provider ===
                                                    'mqtt-server-gateway' ||
                                                data.provider ===
                                                    'mqtt-client-gateway'
                                                    ? 'topic'
                                                    : 'URL信息'
                                            }}
                                        </h1>
                                        <j-scrollbar height="400">
                                            <j-table
                                                :pagination="false"
                                                :rowKey="generateUUID()"
                                                :data-source="
                                                    config.routes || []
                                                "
                                                bordered
                                                :columns="
                                                    config.id === 'MQTT'
                                                        ? columnsMQTT
                                                        : columnsHTTP
                                                "
                                                :scroll="{ y: 400 }"
                                            >
                                                <template
                                                    #bodyCell="{
                                                        column,
                                                        text,
                                                        record,
                                                    }"
                                                >
                                                    <template
                                                        v-if="
                                                            column.dataIndex ===
                                                            'stream'
                                                        "
                                                    >
                                                        {{ getStream(record) }}
                                                    </template>
                                                </template>
                                            </j-table>
                                        </j-scrollbar>
                                    </div>
                                </div>
                            </j-scrollbar>
                        </j-col>
                    </j-row>
                </div>
            </div>
        </div>
        <div class="steps-action">
            <j-button
              v-if="type === 'child-device' ? current > 1 : current > 0"
              style="margin-right: 8px"
              @click="prev"
            >
              上一步
            </j-button>
            <PermissionButton
                v-if="current === 2 && view === 'false'"
                type="primary"
                style="margin-right: 8px"
                @click="saveData"
                :hasPermission="`link/AccessConfig:${
                    id === ':id' ? 'add' : 'update'
                }`"
                :loading='loading'
            >
                保存
            </PermissionButton>
            <j-button
              v-if="[0, 1].includes(current)"
              type="primary"
              @click="next"
            >
              下一步
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
import { Form } from 'ant-design-vue';
import type { FormInstance, TableColumnType } from 'ant-design-vue';
import { useMenuStore } from 'store/menu';
import { onlyMessage } from '@/utils/comm';

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
    bindProduct: {
      type: Boolean,
      default: false
    }
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
const procotolList: any = ref([]);
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
const loading = ref(false)

const { resetFields, validate, validateInfos } = useForm(
    formData,
    reactive({
        name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            {
                max: 64,
                message: '最多可输入64个字符',
                trigger: 'blur',
            },
        ],
        description: [{ max: 200, message: '最多可输入200个字符' }],
    }),
);

const showAddBtn = computed(() => {
  return route.query.view === 'false' && !props.bindProduct
})

const queryNetworkList = async (id: string, include: string, data = {}) => {
    const resp = await getNetworkList(
        NetworkTypeMapping.get(id),
        include,
        data,
    );
    if (resp.status === 200) {
        networkList.value = resp.result;
        allNetworkList.value = resp.result;
    }
};

const queryProcotolList = async (id: string, params = {}) => {
    const resp: any = await getProtocolList(ProtocolMapping.get(id), {
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
    const tab: any = window.open(
        `${window.location.origin + window.location.pathname}#${url}?type=${
            NetworkTypeMapping.get(props.provider?.id) || ''
        }`,
    );
    tab.onTabSaveSuccess = (value: any) => {
        if (value.success) {
            networkCurrent.value = value.result.id;
            queryNetworkList(props.provider?.id, networkCurrent.value || '');
        }
    };
};

const addProcotol = () => {
    const url = menuStory.menus['link/Protocol']?.path;
    const tab: any = window.open(
        `${window.location.origin + window.location.pathname}#${url}?save=true`,
    );
    tab.onTabSaveSuccess = (value: any) => {
        if (value.success) {
            procotolCurrent.value = value.result?.id;
            queryProcotolList(props.provider?.id);
        }
    };
};

const getNetworkCurrent = () =>
    networkList.value.find((i: any) => i.id === networkCurrent) &&
    (
        networkList.value.find((i: any) => i.id === networkCurrent).addresses ||
        []
    ).length > 0;
const getNetworkCurrentData = () =>
    getNetworkCurrent()
        ? networkList.value.find((i: any) => i.id === networkCurrent).addresses
        : [];

const getColor = (i: any) => (i.health === -1 ? 'error' : 'processing');

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
    networkList.value = value
        ? allNetworkList.value.filter(
              (i: any) =>
                  i.name &&
                  i.name
                      .toLocaleLowerCase()
                      .includes(value.toLocaleLowerCase()),
          )
        : allNetworkList.value;
};
const procotolChange = (id: string) => {
    if (!props.data.id) {
        procotolCurrent.value = id;
    }
};

const procotolSearch = (value: string) => {
    procotolList.value = value
        ? allProcotolList.value.filter(
              (i: any) =>
                  i.name &&
                  i.name
                      .toLocaleLowerCase()
                      .includes(value.toLocaleLowerCase()),
          )
        : allProcotolList.value;
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
                provider: props.provider.id,
                transport:
                    props.provider?.id === 'child-device'
                        ? 'Gateway'
                        : ProtocolMapping.get(props.provider.id),
            };
            loading.value = true
            const resp =
                id === ':id'
                    ? await save(params)
                    : await update({ ...params, id });
            loading.value = false
            if (resp.status === 200) {
                onlyMessage('操作成功', 'success');
                history.back();
                if ((window as any).onTabSaveSuccess) {
                    if (resp.result?.id) {
                        (window as any).onTabSaveSuccess(resp);
                        setTimeout(() => window.close(), 300);
                    }
                }
            }
        })
        .catch((err) => {});
};

const next = async () => {
    if (current.value === 0) {
        if (!networkCurrent.value) {
            onlyMessage('请选择网络组件！', 'error');
        } else {
            queryProcotolList(props.provider.id);
            current.value = current.value + 1;
        }
    } else if (current.value === 1) {
        if (!procotolCurrent.value) {
            onlyMessage('请选择消息协议！', 'error');
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
                columnsMQTT.value = [Group, ...ColumnsMQTT] as TableColumnType;
                columnsHTTP.value = [Group, ...ColumnsHTTP] as TableColumnType;
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

const addressesTip = (data:any)=>{
    let tip:any = ''
    data.forEach((item:any)=>{
        tip =  tip + " " +item.address 
    })
    return tip
} 
</script>

<style lang="less" scoped>
.steps-content {
    margin-top: 20px;
}
.steps-box {
    min-height: 400px;
    .card-last {
        padding-right: 5px;
        overflow-y: auto;
        overflow-x: hidden;
    }
}
.steps-action {
    width: 100%;
    margin-top: 24px;
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
</style>
