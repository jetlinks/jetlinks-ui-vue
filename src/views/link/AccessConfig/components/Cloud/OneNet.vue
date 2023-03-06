<template>
    <div class="container">
        <j-steps class="steps-steps" :current="stepCurrent">
            <j-step v-for="item in steps" :key="item" :title="item" />
        </j-steps>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    通过OneNet平台的HTTP推送服务进行数据接入
                </div>
                <div style="margin-top: 15px">
                    <j-row :gutter="[24, 24]">
                        <j-col :span="16">
                            <j-form
                                :model="formState"
                                ref="formRef1"
                                name="basic"
                                autocomplete="off"
                                layout="vertical"
                            >
                                <j-row :gutter="[24, 24]">
                                    <j-col :span="24">
                                        <j-form-item
                                            name="apiAddress"
                                            :rules="[
                                                {
                                                    required: true,
                                                },
                                            ]"
                                        >
                                            <div class="form-label">
                                                接口地址
                                                <span
                                                    class="form-label-required"
                                                    >*</span
                                                >
                                                <j-tooltip>
                                                    <template #title>
                                                        <p>
                                                            同步物联网平台设备数据到OneNet
                                                        </p>
                                                    </template>
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                    />
                                                </j-tooltip>
                                            </div>
                                            <j-input
                                                disabled
                                                v-model:value="
                                                    formState.apiAddress
                                                "
                                            />
                                        </j-form-item>
                                    </j-col>
                                </j-row>
                                <j-row :gutter="[24, 24]">
                                    <j-col :span="24">
                                        <j-form-item
                                            label="apiKey"
                                            name="apiKey"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: '请输入apiKey',
                                                },
                                                {
                                                    max: 64,
                                                    message:
                                                        '最多可输入64个字符',
                                                },
                                            ]"
                                        >
                                            <j-input
                                                v-model:value="formState.apiKey"
                                                placeholder="请输入apiKey"
                                            />
                                        </j-form-item>
                                    </j-col>
                                </j-row>
                                <j-row :gutter="[24, 24]">
                                    <j-col :span="12">
                                        <j-form-item
                                            name="validateToken"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: '请输入通知Token',
                                                },
                                                {
                                                    max: 64,
                                                    message:
                                                        '最多可输入64个字符',
                                                },
                                            ]"
                                        >
                                            <div class="form-label">
                                                通知Token
                                                <span
                                                    class="form-label-required"
                                                    >*</span
                                                >
                                                <j-tooltip>
                                                    <template #title>
                                                        <p>
                                                            接收OneNet推送的Token地址
                                                        </p>
                                                    </template>
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                    />
                                                </j-tooltip>
                                            </div>
                                            <j-input
                                                v-model:value="
                                                    formState.validateToken
                                                "
                                                placeholder="请输入通知Token"
                                            />
                                        </j-form-item>
                                    </j-col>
                                    <j-col :span="12">
                                        <j-form-item
                                            name="aesKey"
                                            :rules="[
                                                {
                                                    max: 64,
                                                    message:
                                                        '最多可输入64个字符',
                                                },
                                            ]"
                                        >
                                            <div class="form-label">
                                                aesKey
                                                <j-tooltip>
                                                    <template #title>
                                                        <p>
                                                            OneNet
                                                            端生成的消息加密key
                                                        </p>
                                                    </template>
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                    />
                                                </j-tooltip>
                                            </div>
                                            <j-input
                                                v-model:value="formState.aesKey"
                                                placeholder="请输入aesKey"
                                            /> </j-form-item
                                    ></j-col>
                                </j-row>
                                <j-row :gutter="[24, 24]">
                                    <j-col :span="24">
                                        <j-form-item
                                            label="说明"
                                            name="description"
                                        >
                                            <j-textarea
                                                placeholder="请输入说明"
                                                :rows="4"
                                                v-model:value="
                                                    formState.description
                                                "
                                                show-count
                                                :maxlength="200"
                                            />
                                        </j-form-item>
                                    </j-col>
                                </j-row> </j-form
                        ></j-col>
                        <j-col :span="8">
                            <div class="doc">
                                <h1>操作指引：</h1>
                                <div>
                                    1、OneNet端创建产品、设备，并配置HTTP推送
                                </div>
                                <div>
                                    2、IOT端创建类型为OneNet的设备接入网关
                                </div>
                                <div>
                                    3、IOT端创建产品，选中接入方式为OneNet类型的设备接入网关，填写Master-APIkey（OneNet端的产品Key）
                                </div>
                                <div class="image">
                                    <j-image width="100%" :src="img5" />
                                </div>
                                <div>
                                    4、IOT端添加设备，在设备实例页面为每一台设备设置唯一的IMEI、IMSI码（需与OneNet平台中的值一致）
                                </div>
                                <div class="image">
                                    <j-image width="100%" :src="img6" />
                                </div>
                                <h1>HTTP推送配置说明</h1>
                                <div class="image">
                                    <j-image width="100%" :src="img" />
                                </div>
                                <div>
                                    HTTP推送配置路径：应用开发&gt;数据推送
                                </div>
                                <j-descriptions
                                    bordered
                                    size="small"
                                    :column="1"
                                    :labelStyle="{ width: '100px' }"
                                >
                                    <j-descriptions-item label="参数"
                                        >说明</j-descriptions-item
                                    >
                                    <j-descriptions-item label="实例名称"
                                        >推送实例的名称</j-descriptions-item
                                    >
                                    <j-descriptions-item label="推送地址">
                                        用于接收OneNet推送设备数据的地址物联网平台地址:
                                        <div style="word-wrap: break-word">
                                            {{
                                                `${origin}/api/one-net/${randomString()}/notify`
                                            }}
                                        </div>
                                    </j-descriptions-item>
                                    <j-descriptions-item label="Token">
                                        自定义token,可用于验证请求是否来自OneNet
                                    </j-descriptions-item>
                                    <j-descriptions-item label="消息加密">
                                        采用AES加密算法对推送的数据进行数据加密，AesKey为加密秘钥
                                    </j-descriptions-item>
                                </j-descriptions>

                                <h1>设备接入网关配置说明</h1>
                                <j-descriptions
                                    bordered
                                    size="small"
                                    :column="1"
                                    :labelStyle="{ width: '100px' }"
                                >
                                    <j-descriptions-item label="参数"
                                        >说明</j-descriptions-item
                                    >
                                    <j-descriptions-item label="apiKey"
                                        >OneNet平台中具体产品的Key</j-descriptions-item
                                    >
                                    <j-descriptions-item label="通知Token">
                                        填写OneNet数据推送配置中设置的Token
                                    </j-descriptions-item>
                                    <j-descriptions-item label="aesKey">
                                        若OneNet数据推送配置了消息加密，此处填写OneNet端数据推送配置中设置的aesKey
                                    </j-descriptions-item>
                                </j-descriptions>
                                <h1>其他说明</h1>
                                <div>
                                    1.在IOT端启用设备时，若OneNet平台没有与之对应的设备，则将在OneNet端自动创建新设备
                                </div>
                            </div>
                        </j-col>
                    </j-row>
                </div>
            </div>
        </div>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 1">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    只能选择HTTP通信方式的协议
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
                            :key="item.id"
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
        </div>
        <div v-if="current === 2" class="card-last">
            <j-row :gutter="[24, 24]">
                <j-col :span="12">
                    <title-component data="基本信息" />
                    <div>
                        <j-form
                            :model="formData"
                            name="basic"
                            autocomplete="off"
                            layout="vertical"
                            ref="formRef2"
                        >
                            <j-form-item
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
                                <j-input
                                    placeholder="请输入名称"
                                    v-model:value="formData.name"
                                />
                            </j-form-item>
                            <j-form-item label="说明" name="description">
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
                            <title-component data="配置概览" />
                            <div class="config-right-item-context">
                                接入方式：{{ provider.name }}
                            </div>
                            <div class="config-right-item-context">
                                {{ provider.description }}
                            </div>
                            <div class="config-right-item-context">
                                消息协议：{{ procotolCurrent }}
                            </div>
                        </div>
                        <div class="config-right-item">
                            <title-component data="设备接入指引" />
                            <div class="config-right-item-context">
                                1、创建类型为{{
                                    props?.provider?.id === 'OneNet'
                                        ? 'OneNet'
                                        : 'CTWing'
                                }}的设备接入网关
                            </div>
                            <div class="config-right-item-context">
                                2、创建产品，并选中接入方式为
                                {{
                                    props?.provider?.id === 'OneNet'
                                        ? 'OneNet'
                                        : 'CTWing,选中后需填写CTWing平台中的产品ID、Master-APIkey。'
                                }}
                            </div>
                            <div class="config-right-item-context">
                                3、添加设备，为每一台设备设置唯一的IMEI、SN、IMSI、PSK码（需与CTWingt平台中填写的值一致，若CTWing平台没有对应的设备，将会通过CTWing平台提供的LWM2M协议自动创建）
                            </div>
                        </div>
                    </div>
                </j-col>
            </j-row>
        </div>
        <div :class="current !== 2 ? 'steps-action' : 'steps-action-save'">
            <j-button
                v-if="[0, 1].includes(current)"
                type="primary"
                style="margin-right: 8px"
                @click="next"
            >
                下一步
            </j-button>
            <PermissionButton
                style="margin-right: 8px"
                v-if="current === 2 && view === 'false'"
                type="primary"
                @click="saveData"
                :hasPermission="`link/AccessConfig:${
                    id === ':id' ? 'add' : 'update'
                }`"
            >
                保存
            </PermissionButton>
            <j-button v-if="current > 0" @click="prev"> 上一步 </j-button>
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessCloudOneNet">
import { message } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { update, save, getProtocolList } from '@/api/link/accessConfig';
import AccessCard from '../AccessCard/index.vue';
import { randomString } from '@/utils/utils';
import { getImage } from '@/utils/comm';
import { ProtocolMapping } from '../../data';
import { useMenuStore } from 'store/menu';

const menuStory = useMenuStore();
const origin = window.location.origin;
const img5 = getImage('/network/05.jpg');
const img6 = getImage('/network/06.jpg');
const img = getImage('/network/OneNet.jpg');

interface FormState {
    apiAddress: string;
    apiKey: string;
    validateToken: string;
    aesKey: string;
    description: string;
}
interface Form {
    name: string;
    description: string;
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

const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const formRef1 = ref<FormInstance>();
const formRef2 = ref<FormInstance>();

const formState = ref<FormState>({
    apiAddress: 'https://api.heclouds.com/',
    apiKey: '',
    validateToken: '',
    aesKey: '',
    description: '',
});
const formData = ref<Form>({
    name: '',
    description: '',
});

const current = ref(0);
const stepCurrent = ref(0);
const steps = ref(['接入配置', '消息协议', '完成']);
const procotolList = ref([]);
const allProcotolList = ref([]);
const procotolCurrent = ref('');

const procotolChange = (id: string) => {
    procotolCurrent.value = id;
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

const saveData = async () => {
    const data: any = await formRef2.value?.validate();
    const params = {
        ...data,
        configuration: {
            ...formState.value,
            protocol: procotolCurrent.value,
        },
        protocol: procotolCurrent.value,
        provider: props.provider.id,
        transport: 'HTTP_SERVER',
    };
    const resp =
        id === ':id'
            ? await save(params)
            : await update({
                  ...props.data,
                  ...params,
                  id,
              });

    if (resp.status === 200) {
        message.success('操作成功！');
        history.back();
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

const next = async () => {
    if (current.value === 0) {
        let data1: any = await formRef1.value?.validate();
        queryProcotolList(props.provider.id);
        current.value = current.value + 1;
    } else if (current.value === 1) {
        if (!procotolCurrent.value) {
            message.error('请选择消息协议！');
        } else {
            current.value = current.value + 1;
        }
    }
};
const prev = () => {
    current.value = current.value - 1;
};

onMounted(() => {
    if (id !== ':id') {
        formState.value = props.data.configuration;
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

.doc {
    height: 550px;
    padding: 24px;
    overflow-x: hidden;
    overflow-y: auto;
    color: rgba(#000, 0.8);
    font-size: 14px;
    background-color: #fafafa;

    h1 {
        margin: 16px 0;
        color: rgba(#000, 0.85);
        font-weight: bold;
        font-size: 14px;

        &:first-child {
            margin-top: 0;
        }
    }

    .image {
        margin: 16px 0;
    }
}
.form-label {
    height: 30px;
    padding-bottom: 8px;
    .form-label-required {
        color: red;
        margin: 0 4px 0 -2px;
    }
}
</style>
