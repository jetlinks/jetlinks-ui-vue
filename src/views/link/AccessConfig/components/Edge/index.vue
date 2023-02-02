<template>
    <div v-if="type === 'edge'" class="container">
        <a-steps
            v-if="channel !== 'edge-child-device'"
            class="steps-steps"
            :current="stepCurrent"
        >
            <a-step v-for="item in steps" :key="item" :title="item" />
        </a-steps>
        <div v-if="channel !== 'edge-child-device'" class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <question-circle-outlined />
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
        </div>
        <div
            v-if="channel === 'edge-child-device' || current === 1"
            class="card-last"
        >
            <a-row :gutter="[24, 24]">
                <a-col :span="12">
                    <title-component data="基本信息" />
                    <div>
                        <a-form
                            :model="formState"
                            name="basic"
                            autocomplete="off"
                            layout="vertical"
                            @finish="onFinish"
                            ref="formRef"
                        >
                            <a-form-item
                                label="名称"
                                name="name"
                                :rules="[
                                    {
                                        required: true,
                                        message: '请输入名称',
                                        trigger: 'blur',
                                    },
                                    { max: 64, message: '最多可输入64个字符' },
                                ]"
                            >
                                <a-input
                                    placeholder="请输入名称"
                                    v-model:value="formState.name"
                                />
                            </a-form-item>
                            <a-form-item label="说明" name="description">
                                <a-textarea
                                    placeholder="请输入说明"
                                    :rows="4"
                                    v-model:value="formState.description"
                                    show-count
                                    :maxlength="200"
                                />
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                    v-if="current !== 1 && view === 'false'"
                                    type="primary"
                                    html-type="submit"
                                    >保存</a-button
                                >
                            </a-form-item>
                        </a-form>
                    </div>
                </a-col>
                <a-col :span="12">
                    <div class="config-right">
                        <div class="config-right-item">
                            <title-component data="配置概览" />
                            <div class="config-right-item-context">
                                接入方式：{{ provider.name }}
                            </div>
                            <div class="config-right-item-context">
                                {{ provider.description }}
                            </div>
                            <div class="config-right-item-context">
                                消息协议：{{ provider.id }}
                            </div>
                        </div>
                    </div>
                </a-col>
            </a-row>
        </div>
        <div
            v-if="channel !== 'edge-child-device'"
            :class="current !== 1 ? 'steps-action' : 'steps-action-save'"
        >
            <a-button
                v-if="[0].includes(current)"
                style="margin-right: 8px"
                @click="next"
            >
                下一步
            </a-button>
            <a-button
                v-if="current === 1 && view === 'false'"
                type="primary"
                style="margin-right: 8px"
                @click="saveData"
            >
                保存
            </a-button>
            <a-button v-if="current > 0" @click="prev"> 上一步 </a-button>
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessEdge">
import { message, Form } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { update, save, getNetworkList } from '@/api/link/accessConfig';
import {
    descriptionList,
    ProtocolMapping,
    NetworkTypeMapping,
} from '../../Detail/data';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import AccessCard from '../AccessCard/index.vue';

//测试数据1
const networkListTest = {
    message: 'success',
    result: [
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
    status: 200,
    timestamp: 1674960624150,
};

interface FormState {
    name: string;
    description: string;
}
const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

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

const type = props.provider.type;

const channel = ref(props.provider.channel);

const formState = ref<FormState>({
    name: '',
    description: '',
});

const formRef = ref<FormInstance>();

const current = ref(0);
const stepCurrent = ref(0);
const steps = ref(['网络组件', '完成']);
const networkCurrent = ref('');
const networkList = ref([]);

const onFinish = async (values: any) => {
    const providerId = props.provider.id;
    const params = {
        ...values,
        protocol: 'official-edge-protocol',
        provider: providerId,
        transport: ProtocolMapping.get(providerId),
    };
    if (networkCurrent.value) params.channelId = networkCurrent.value;
    const resp =
        id === ':id' ? await save(params) : await update({ ...params, id });
    if (resp.status === 200) {
        message.success('操作成功！');
        // if (params.get('save')) {
        // if ((window as any).onTabSaveSuccess) {
        //   if (resp.result) {
        //     (window as any).onTabSaveSuccess(resp.result);
        //     setTimeout(() => window.close(), 300);
        //   }
        // }
        //   } else {
        history.back();
        //   }
    }
};

const checkedChange = (id: string) => {
    networkCurrent.value = id;
};

const queryNetworkList = async (id: string, include: string, data = {}) => {
    // const resp = await getNetworkList(
    //     NetworkTypeMapping.get(id),
    //     include,
    //     data,
    // );
    // if (resp.status === 200) {
    //     networkList.value = resp.result;
    // }

    //使用测试数据1
    networkList.value = networkListTest.result;
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

const saveData = async () => {
    const data: any = await formRef.value?.validate();
    onFinish(data);
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

const next = async () => {
    if (!networkCurrent.value) {
        message.error('请选择网络组件！');
    } else {
        current.value = current.value + 1;
    }
};
const prev = () => {
    current.value = current.value - 1;
};

onMounted(() => {
    if (props.provider.id === 'official-edge-gateway') {
        queryNetworkList(props.provider.id, '');
    }
    if (id !== ':id') {
        formState.value = {
            name: props.data.name,
            description: props.data?.description || '',
        };
        networkCurrent.value = props.data.channelId;
    }
}),
    watch(
        current,
        (v) => {
            stepCurrent.value = v;
        },
        {
            deep: true,
            immediate: true,
        },
    );
</script>

<style lang="less" scoped>
.container {
    margin: 20px;
}

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
.steps-action-save {
    margin-left: 0;
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

.card-last {
    padding-right: 5px;
    overflow-y: auto;
    overflow-x: hidden;
}
.config-right {
    padding: 20px;
    // color: rgba(0, 0, 0, 0.8);
    // background: rgba(0, 0, 0, 0.04);

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
