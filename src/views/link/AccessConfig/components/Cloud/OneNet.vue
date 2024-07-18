<template>
    <div>
        <j-steps class="steps-steps" :current="stepCurrent">
            <j-step disabled v-for="item in steps" :key="item" :title="item" />
        </j-steps>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    通过OneNet平台的HTTP推送服务进行数据接入
                </div>
                <div style="margin-top: 42px">
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
                                            <template #label>
                                                接口地址
                                                <j-tooltip
                                                    title="同步物联网平台设备数据到OneNet"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </j-tooltip>
                                            </template>
                                            <j-input
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
                                                    trigger: 'blur',
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
                                                    trigger: 'blur',
                                                },
                                            ]"
                                        >
                                            <template #label>
                                                通知Token
                                                <j-tooltip
                                                    title="OneNet端HTTP推送配置中设置的Token"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </j-tooltip>
                                            </template>
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
                                                    trigger: 'blur',
                                                },
                                            ]"
                                        >
                                            <template #label>
                                                aesKey
                                                <j-tooltip
                                                    title="OneNet端生成的消息加密key"
                                                >
                                                    <AIcon
                                                        type="QuestionCircleOutlined"
                                                        style="margin-left: 2px"
                                                    />
                                                </j-tooltip>
                                            </template>
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
                            <j-scrollbar height="500">
                                <div class="doc">
                                    <h1>操作指引：</h1>
                                    <div>
                                        1、登录OneNet平台创建产品、设备，并配置HTTP的全局推送
                                    </div>
                                    <div>
                                        2、获取OneNet平台的产品Key
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img5" />
                                    </div>
                                    <div>
                                        3、IOT端创建类型为OneNet的设备接入网关
                                    </div>
                                    <div>
                                        4、IOT端创建产品，选中接入方式为OneNet类型的设备接入网关，填写Master-APIkey（OneNet端的产品Key）
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img6" />
                                        <div class="desc">填写OneNet网关相关参数</div>
                                    </div>
                                    <div>
                                        5、IOT端添加设备，在设备实例页面为每一台设备设置唯一的IMEI、IMSI码（需与OneNet平台中的值一致）
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img7" />
                                    </div>
                                    <h1>HTTP推送配置说明</h1>
                                    <div>
                                        1、点击<b>数据推送&gt;HTTP推送&gt;添加全局推送</b>
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img8" />
                                    </div>
                                    <div>
                                        2、填写全局推送相关参数
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img9" />
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
                                        <j-descriptions-item label="推送地址url">
                                            用于接收OneNet推送设备数据的物联网平台地址:
                                            <div style="word-wrap: break-word">
                                                {{
                                                    `${origin}/api/one-net/${randomString()}/notify`
                                                }}
                                            </div>
                                        </j-descriptions-item>
                                        <j-descriptions-item label="Token">
                                            自定义token,可用于验证请求是否来自OneNet
                                        </j-descriptions-item>
                                        <j-descriptions-item label="AESKey">
                                            采用AES加密算法对推送的数据进行数据加密，AesKey为加密秘钥
                                        </j-descriptions-item>
                                    </j-descriptions>

                                    <j-alert
                                        message="注意："
                                        style="margin-top: 15px;"
                                        type="warning"
                                    >
                                    <template #description>
                                        <span>
                                            开发者在OneNet物联网平台添加全局推送参数前，需要在JetLinks物联网平台添加OneNet接入网关且OneNet接入网关中的通知Token参数需要和OneNet物联网平台全局推送参数中的Token保持一致，否则OneNet物联网平台添加全局推送检验不通过，提示
                                            <span style="color: red">validate fail: validate token fail.</span>
                                        </span>
                                    </template>
                                    </j-alert>

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
                                            >OneNet平台中具体产品的Master-APIkey</j-descriptions-item
                                        >
                                        <j-descriptions-item label="通知Token">
                                            填写OneNet数据推送配置中设置的Token
                                        </j-descriptions-item>
                                        <j-descriptions-item label="aesKey">
                                            若OneNet数据推送配置了消息加密，此处填写OneNet端数据推送配置中设置的AESkey
                                        </j-descriptions-item>
                                    </j-descriptions>
                                    <h1>其他说明</h1>
                                    <div>
                                        1.在IOT端启用设备时，若OneNet平台没有与之对应的设备，则将在OneNet端自动创建新设备
                                    </div>
                                </div>
                            </j-scrollbar>
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
                            :key="item.id"
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
                                    {
                                        max: 64,
                                        message: '最多可输入64个字符',
                                        trigger: 'blur',
                                    },
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
                    <div class="doc" style="height: 606px">
                        <TitleComponent data="配置概览" />
                        <p>接入方式：{{ provider.name }}</p>
                        <p>
                            {{ provider.description }}
                        </p>
                        <p>消息协议：{{ procotolCurrent }}</p>
                        <TitleComponent data="设备接入指引" />
                        <p>
                            1、创建类型为{{
                                props?.provider?.id === 'OneNet'
                                    ? 'OneNet'
                                    : 'CTWing'
                            }}的设备接入网关
                        </p>
                        <p>
                            2、创建产品，并选中接入方式为
                            {{
                                props?.provider?.id === 'OneNet'
                                    ? 'OneNet'
                                    : 'CTWing,选中后需填写CTWing平台中的产品ID、Master-APIkey。'
                            }}
                        </p>
                        <p>
                            3、添加设备，为每一台设备设置唯一的IMEI、SN、IMSI、PSK码（需与CTWingt平台中填写的值一致，若CTWing平台没有对应的设备，将会通过CTWing平台提供的LWM2M协议自动创建）
                        </p>
                    </div>
                </j-col>
            </j-row>
        </div>
        <div :class="current !== 2 ? 'steps-action' : 'steps-action-save'">
          <j-button v-if="current > 0" @click="prev" style="margin-right: 8px"> 上一步 </j-button>
            <PermissionButton
                style="margin-right: 8px"
                v-if="current === 2 && view === 'false'"
                type="primary"
                @click="saveData"
                :hasPermission="`link/AccessConfig:${
                    id === ':id' ? 'add' : 'update'
                }`"
                :loading="loading"
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

<script lang="ts" setup name="AccessCloudOneNet">
import { onlyMessage } from '@/utils/comm';
import type { FormInstance } from 'ant-design-vue';
import { update, save, getProtocolList } from '@/api/link/accessConfig';
import AccessCard from '../AccessCard/index.vue';
import { randomString } from '@/utils/utils';
import { getImage } from '@/utils/comm';
import { ProtocolMapping } from '../../data';
import { useMenuStore } from 'store/menu';

const menuStory = useMenuStore();
const origin = window.location.origin;
const img5 = getImage('/network/05.jpeg');
const img6 = getImage('/network/06.png');
const img7 = getImage('/network/07.jpeg');
const img8 = getImage('/network/08.png');
const img9 = getImage('/network/09.png');

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
    bindProduct: {
      type: Boolean,
      default: false
    }
});

const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const formRef1 = ref<FormInstance>();
const formRef2 = ref<FormInstance>();

const formState = ref<FormState>({
    apiAddress: 'http://api.zj.cmcconenet.com/',
    apiKey: '',
    validateToken: '',
    aesKey: '',
    description: '',
});
const formData = ref<Form>({
    name: '',
    description: '',
});

const loading = ref(false)
const current = ref(0);
const stepCurrent = ref(0);
const steps = ref(['接入配置', '消息协议', '完成']);
const procotolList: any = ref([]);
const allProcotolList = ref([]);
const procotolCurrent: any = ref('');

const showAddBtn = computed(() => {
  return route.query.view === 'false' && !props.bindProduct
})

const procotolChange = (id: string) => {
    procotolCurrent.value = id;
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

const saveData = async () => {
    const data: any = await formRef2.value?.validate();
    loading.value = true
    const params = {
        ...data,
        configuration: {
            ...formState.value,
            protocol: procotolCurrent.value,
        },
        protocol: procotolCurrent.value,
        provider: props.provider.id,
        transport: 'HTTP',
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
        onlyMessage('操作成功', 'success');
        history.back();
        if ((window as any).onTabSaveSuccess) {
            (window as any).onTabSaveSuccess(resp);
            setTimeout(() => window.close(), 300);
        }
    }
    loading.value =false
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

const next = async () => {
    if (current.value === 0) {
        let data1: any = await formRef1.value?.validate();
        queryProcotolList(props.provider.id);
        current.value = current.value + 1;
    } else if (current.value === 1) {
        if (!procotolCurrent.value) {
            onlyMessage('请选择消息协议！', 'error');
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

.form-label {
    height: 30px;
    padding-bottom: 8px;
}

.desc {
    width: 100%;
    text-align: center;
    color: rgb(138, 143, 141);
    margin-top: 10px;
}
</style>
