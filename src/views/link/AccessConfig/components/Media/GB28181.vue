<template>
    <div style="margin-top: 10px">
        <a-steps :current="stepCurrent">
            <a-step v-for="item in steps" :key="item" :title="item" />
        </a-steps>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <question-circle-outlined />
                    配置设备信令参数
                </div>
                <div>
                    <a-form
                        :model="formState"
                        name="basic"
                        autocomplete="off"
                        layout="vertical"
                        @finish="onFinish"
                    >
                        <a-row :gutter="[24, 24]">
                            <a-col :span="12">
                                <a-form-item
                                    label="SIP 域"
                                    name="domain"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入SIP 域!',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="formState.domain"
                                        placeholder="请输入SIP 域"
                                    />
                                </a-form-item>
                            </a-col>
                            <a-col :span="12">
                                <a-form-item
                                    label="SIP ID"
                                    name="sipId"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入SIP ID!',
                                        },
                                    ]"
                                >
                                    <a-input
                                        v-model:value="formState.sipId"
                                        placeholder="请输入SIP ID"
                                    />
                                </a-form-item>
                            </a-col>
                        </a-row>

                        <a-form-item
                            name="shareCluster"
                            :rules="[
                                {
                                    required: true,
                                    message: '请选择集群!',
                                },
                            ]"
                        >
                            <div>
                                集群
                                <span style="color: red; margin: 0 4px 0 -2px"
                                    >*</span
                                >
                                <a-tooltip>
                                    <template #title>
                                        <p>
                                            共享配置:集群下所有节点共用同一配置
                                        </p>
                                        <p>
                                            独立配置:集群下不同节点使用不同配置
                                        </p>
                                    </template>
                                    <question-circle-outlined />
                                </a-tooltip>
                            </div>

                            <a-radio-group
                                v-model:value="formState.shareCluster"
                            >
                                <a-radio :value="true">共享配置</a-radio>
                                <a-radio :value="false">独立配置</a-radio>
                            </a-radio-group>
                        </a-form-item>
                        <div v-if="formState.shareCluster">
                            <a-row :gutter="[24, 24]">
                                <a-col :span="12">
                                    <a-form-item
                                        label="SIP 地址"
                                        name="sip"
                                        :rules="[
                                            {
                                                required: true,
                                                message: '请选择端口!',
                                            },
                                        ]"
                                    >
                                        <a-input-group compact>
                                            <a-select
                                                v-model:value="formState.sip1"
                                                style="width: 50%"
                                                :disabled="true"
                                            >
                                                <a-select-option value="0.0.0.0"
                                                    >0.0.0.0</a-select-option
                                                >
                                            </a-select>
                                            <a-select
                                                v-model:value="formState.sip"
                                                :options="sipList"
                                                style="width: 50%"
                                                placeholder="请选择端口"
                                            />
                                        </a-input-group>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="12">
                                    <a-form-item
                                        label="公网 Host"
                                        name="public"
                                        :rules="[
                                            {
                                                required: true,
                                                message: '请选择端口!',
                                            },
                                        ]"
                                    >
                                        <a-input-group compact>
                                            <a-input
                                                style="width: 50%"
                                                v-model:value="
                                                    formState.public1
                                                "
                                                placeholder="请输入IP地址"
                                            />
                                            <a-input-number
                                                style="width: 50%"
                                                placeholder="请输入端口"
                                                v-model:value="formState.public"
                                                :min="1"
                                                :max="65535"
                                            />
                                        </a-input-group>
                                    </a-form-item>
                                </a-col>
                            </a-row>
                        </div>
                    </a-form>
                    <div v-if="!formState.shareCluster">
                        <a-form
                            ref="formRef2"
                            layout="vertical"
                            name="dynamic_form_nest_item"
                            :model="dynamicValidateForm"
                            @finish="onFinish2"
                        >
                            <div
                                v-for="(
                                    user, index
                                ) in dynamicValidateForm.users"
                                :key="user.id"
                            >
                                <a-collapse v-model:activeKey="activeKey">
                                    <a-collapse-panel
                                        :key="user.id"
                                        :header="`#${index + 1}.节点`"
                                    >
                                        
                                        <template #extra>
                                            <delete-outlined
                                                @click="removeUser(user)"
                                            />
                                        </template>
                                        <a-row :gutter="[24, 24]">
                                            <a-col :span="8">
                                                <a-form-item
                                                    label="节点名称"
                                                    :name="[
                                                        'users',
                                                        index,
                                                        'first',
                                                    ]"
                                                >
                                                    <a-select
                                                        v-model:value="
                                                            user.first
                                                        "
                                                        :options="clustersList"
                                                    >
                                                    </a-select>
                                                </a-form-item>
                                            </a-col>
                                            <a-col :span="7">
                                                <a-form-item
                                                    :name="[
                                                        'users',
                                                        index,
                                                        'last',
                                                    ]"
                                                    :rules="{
                                                        required: true,
                                                        message:
                                                            '请选择SIP 地址',
                                                    }"
                                                >
                                                    <div>
                                                        SIP 地址
                                                        <span
                                                            style="
                                                                color: red;
                                                                margin: 0 4px 0 -2px;
                                                            "
                                                            >*</span
                                                        >
                                                        <a-tooltip>
                                                            <template #title>
                                                                <p>
                                                                    绑定到服务器上的网卡地址,绑定到所有网卡:0.0.0.0
                                                                </p>
                                                            </template>
                                                            <question-circle-outlined />
                                                        </a-tooltip>
                                                    </div>
                                                    <a-input-group compact>
                                                        <a-select
                                                            v-model:value="
                                                                user.last
                                                            "
                                                            style="width: 50%"
                                                            :options="sipList"
                                                        >
                                                        </a-select>
                                                        <a-select
                                                            v-model:value="
                                                                user.last1
                                                            "
                                                            :options="sipList"
                                                            style="width: 50%"
                                                            placeholder="请选择端口"
                                                        />
                                                    </a-input-group>
                                                </a-form-item>
                                            </a-col>
                                            <a-col :span="8">
                                                <a-form-item
                                                    :name="[
                                                        'users',
                                                        index,
                                                        'last2',
                                                    ]"
                                                    :rules="{
                                                        required: true,
                                                        message:
                                                            '请输入公网 Host',
                                                    }"
                                                >
                                                    <div>
                                                        公网 Host
                                                        <span
                                                            style="
                                                                color: red;
                                                                margin: 0 4px 0 -2px;
                                                            "
                                                            >*</span
                                                        >
                                                        <a-tooltip>
                                                            <template #title>
                                                                <p>
                                                                    监听指定端口的请求
                                                                </p>
                                                            </template>
                                                            <question-circle-outlined />
                                                        </a-tooltip>
                                                    </div>
                                                    <a-input-group compact>
                                                        <a-input
                                                            style="width: 50%"
                                                            v-model:value="
                                                                user.last2
                                                            "
                                                            placeholder="请输入IP地址"
                                                        />
                                                        <a-input-number
                                                            style="width: 50%"
                                                            placeholder="请输入端口"
                                                            v-model:value="
                                                                user.last3
                                                            "
                                                            :min="1"
                                                            :max="65535"
                                                        />
                                                    </a-input-group>
                                                </a-form-item>
                                            </a-col>
                                        </a-row>
                                    </a-collapse-panel>
                                </a-collapse>
                            </div>
                            <a-form-item>
                                <a-button
                                    style="margin-top: 10px"
                                    type="dashed"
                                    block
                                    @click="addUser"
                                >
                                    <PlusOutlined />
                                    新增
                                </a-button>
                            </a-form-item>
                            <a-form-item>
                                <a-button type="primary" html-type="submit"
                                    >Submit</a-button
                                >
                            </a-form-item>
                        </a-form>
                    </div>
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
import { message, Form } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import Markdown from 'vue3-markdown-it';
import { QuestionCircleOutlined } from '@ant-design/icons-vue';
import { getResourcesCurrent, getClusters } from '@/api/link/accessConfig';

import { DeleteOutlined, PlusOutlined } from '@ant-design/icons-vue';

interface User {
    first: string;
    last1: string;
    last: string;
    last2: string;
    last3: string;
    id: number;
}

const activeKey = ref([]);

const formRef2 = ref<FormInstance>();
const dynamicValidateForm = reactive<{ users: User[] }>({
    users: [],
});
const removeUser = (item: User) => {
    let index = dynamicValidateForm.users.indexOf(item);
    if (index !== -1) {
        dynamicValidateForm.users.splice(index, 1);
    }
};
const addUser = () => {
    dynamicValidateForm.users.push({
        first: '',
        last1: '',
        last: '',
        last2: '',
        last3: '',
        id: Date.now(),
    });
};
const onFinish2 = (values) => {
    console.log('Received values of form:', values);
    console.log('dynamicValidateForm.users:', dynamicValidateForm.users);
};

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

const formRef = ref<FormInstance>();
const useForm = Form.useForm;

const current = ref(0);
const stepCurrent = ref(0);
const steps = ref(['信令配置', '完成']);
const form = reactive({
    name: '',
    description: '',
});

const sipList = ref([]);
const clustersList = ref([]);

const { resetFields, validate, validateInfos } = useForm(
    form,
    reactive({
        name: [
            { required: true, message: '请输入名称', trigger: 'blur' },
            { max: 64, message: '最多可输入64个字符' },
        ],
    }),
);

const saveData = () => {
    validate()
        .then(async (values) => {
            console.log(333, values);
        })
        .catch((err) => {});
};

const next = async () => {
    console.log(22, current.value);
};
const prev = () => {
    current.value = current.value - 1;
};

interface FormState {
    domain: string;
    sipId: string;
    shareCluster: boolean;
    sip1: string;
    sip: string;
    public1: string;
    public: string;
}
const formState = reactive<FormState>({
    domain: '',
    sipId: '',
    shareCluster: true,
    sip1: '0.0.0.0',
    sip: '',
    public1: '',
    public: '',
});
const onFinish = (values: any) => {
    console.log('Success:', values);
};

onMounted(() => {
    getResourcesCurrent().then((resp) => {
        if (resp.status === 200) {
            const data: any = resp.result.find((i) => i.host === '0.0.0.0');
            const list = data.portList.map((i) => {
                const label = `${i.transports.join('/')} (${i.port})`;
                const value = {
                    host: '0.0.0.0',
                    port: i.port,
                };
                return {
                    value: JSON.stringify(value),
                    label,
                };
            });
            sipList.value = list;
        }
    });
    console.log(1);

    getClusters().then((resp) => {
        if (resp.status === 200) {
            const list = resp.result.map((i) => ({
                value: i.id,
                label: i.name,
            }));
            clustersList.value = list;
        }
    });
});

watch(
    current,
    (v) => {
        // if (props.provider.channel !== 'child-device') {
        //     stepCurrent.value = v;
        // } else {
        //     stepCurrent.value = v - 1;
        // }
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
