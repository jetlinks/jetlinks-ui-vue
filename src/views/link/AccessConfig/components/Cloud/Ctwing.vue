<template>
    <div>
        <j-steps class="steps-steps" :current="stepCurrent">
            <j-step disabled v-for="item in steps" :key="item" :title="item" />
        </j-steps>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <AIcon type="InfoCircleOutlined" />
                    通过CTWing平台的HTTP推送服务进行数据接入
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
                                    <j-col :span="12">
                                        <j-form-item
                                            label="接口地址"
                                            name="apiAddress"
                                            :rules="[
                                                {
                                                    required: true,
                                                },
                                            ]"
                                        >
                                            <j-input
                                                disabled
                                                v-model:value="
                                                    formState.apiAddress
                                                "
                                            />
                                        </j-form-item>
                                    </j-col>
                                    <j-col :span="12">
                                        <j-form-item
                                            label="appKey"
                                            name="appKey"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: '请输入appKey',
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
                                                v-model:value="formState.appKey"
                                                placeholder="请输入appKey"
                                            />
                                        </j-form-item>
                                    </j-col>
                                </j-row>
                                <j-row :gutter="[24, 24]">
                                    <j-col :span="12">
                                        <j-form-item
                                            label="appSecret"
                                            name="appSecret"
                                            :rules="[
                                                {
                                                    required: true,
                                                    message: '请输入appSecret',
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
                                                v-model:value="
                                                    formState.appSecret
                                                "
                                                placeholder="请输入appSecret"
                                            />
                                        </j-form-item>
                                    </j-col>
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
                                        1、CTWing端创建产品、设备，以及一个第三方应用
                                    </div>
                                    <div>
                                        2、CTWing端配置产品/设备/分组级订阅，订阅方URL地址请填写:
                                        <div
                                            class="url"
                                            style="word-wrap: break-word"
                                        >
                                            {{
                                                `${origin}/api/ctwing/${randomString()}/notify`
                                            }}
                                        </div>
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img1" />
                                    </div>
                                    <div>
                                        3、IOT端创建类型为CTWing的设备接入网关
                                    </div>
                                    <div>
                                        4、IOT端创建产品，选中接入方式为CTWing,填写CTWing平台中的产品ID、Master-APIkey。
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img2" />
                                    </div>
                                    <div>
                                        5、IOT端添加设备，为每一台设备设置唯一的IMEI（需与CTWing平台中填写的值一致）
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img3" />
                                    </div>
                                    <h1>设备接入网关配置说明</h1>
                                    <div>
                                        1.请将CTWing的AEP平台-应用管理中的App
                                        Key和App Secret复制到当前页面
                                    </div>
                                    <div class="image">
                                        <j-image width="100%" :src="img4" />
                                    </div>
                                    <h1>其他说明</h1>
                                    <div>
                                        1.在IOT端启用设备时，若CTWing平台没有与之对应的设备，则将在CTWing端自动创建新设备
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
                    <TitleComponent data="基本信息" />
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
                            3、添加设备，为每一台设备设置唯一的IMEI、IMSI码（需与OneNet平台中填写的值一致，若OneNet平台没有对应的设备，将会通过OneNet平台提供的LWM2M协议自动创建）
                        </p>
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
            <j-button v-if="current > 0" @click="prev"> 上一步 </j-button>
        </div>
    </div>
</template>

<script lang="ts" setup name="AccessCloudCtwing">
import { onlyMessage } from '@/utils/comm';
import type { FormInstance } from 'ant-design-vue';
import { update, save, getProtocolList } from '@/api/link/accessConfig';
import { ProtocolMapping } from '../../data';
import AccessCard from '../AccessCard/index.vue';
import { randomString } from '@/utils/utils';
import { getImage } from '@/utils/comm';
import { useMenuStore } from 'store/menu';

const menuStory = useMenuStore();
const origin = window.location.origin;
const img1 = getImage('/network/01.png');
const img2 = getImage('/network/02.jpg');
const img3 = getImage('/network/03.png');
const img4 = getImage('/network/04.jpg');

interface FormState {
    apiAddress: string;
    appKey: string;
    appSecret: string;
    description: string;
}
interface Form {
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

const formRef1 = ref<FormInstance>();
const formRef2 = ref<FormInstance>();

const formState = ref<FormState>({
    apiAddress: 'https://ag-api.ctwing.cn/',
    appKey: '',
    appSecret: '',
    description: '',
});
const formData = ref<Form>({
    name: '',
    description: '',
});

const current = ref(0);
const stepCurrent = ref(0);
const steps = ref(['接入配置', '消息协议', '完成']);
const procotolList: any = ref([]);
const allProcotolList = ref([]);
const procotolCurrent: any = ref('');

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
        onlyMessage('操作成功', 'success');
        history.back();
        if ((window as any).onTabSaveSuccess) {
            (window as any).onTabSaveSuccess(resp);
            setTimeout(() => window.close(), 300);
        }
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
        await formRef1.value?.validate();
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
</style>
