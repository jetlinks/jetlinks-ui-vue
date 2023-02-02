<template>
    <div style="margin-top: 10px">
        <a-steps :current="stepCurrent">
            <a-step v-for="item in steps" :key="item" :title="item" />
        </a-steps>
        <div class="steps-content">
            <div class="steps-box" v-if="current === 0">
                <div class="alert">
                    <info-circle-outlined />
                    配置设备信令参数
                </div>
                <div>
                    <a-form
                        :model="formState"
                        ref="formRef1"
                        name="basic"
                        autocomplete="off"
                        layout="vertical"
                    >
                        <a-row :gutter="[24, 24]">
                            <a-col :span="12">
                                <a-form-item
                                    label="SIP 域"
                                    name="domain"
                                    :rules="[
                                        {
                                            required: true,
                                            message: '请输入SIP 域',
                                        },
                                        {
                                            max: 64,
                                            message: '最大可输入64个字符',
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
                                            message: '请输入SIP ID',
                                        },
                                        {
                                            max: 64,
                                            message: '最大可输入64个字符',
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
                                    message: '请选择集群',
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
                        <div v-if="formState.shareCluster" class="form-item1">
                            <a-row :gutter="[24, 24]">
                                <a-col :span="6">
                                    <a-form-item
                                        label="SIP 地址"
                                        :name="['hostPort', 'host']"
                                        :rules="[
                                            {
                                                required: true,
                                                message: '请选择SIP地址',
                                            },
                                        ]"
                                    >
                                        <a-select
                                            v-model:value="
                                                formState.hostPort.host
                                            "
                                            style="width: 105%"
                                            :disabled="true"
                                            show-search
                                            :filter-option="filterOption"
                                        >
                                            <a-select-option value="0.0.0.0"
                                                >0.0.0.0</a-select-option
                                            >
                                        </a-select>
                                    </a-form-item>
                                </a-col>
                                <a-col :span="6">
                                    <a-form-item
                                        :name="['hostPort', 'port']"
                                        :rules="[
                                            {
                                                required: true,
                                                message: '请选择端口',
                                            },
                                        ]"
                                    >
                                        <div class="form-label"></div>

                                        <a-select
                                            v-model:value="
                                                formState.hostPort.port
                                            "
                                            :options="sipList"
                                            placeholder="请选择端口"
                                            allowClear
                                            show-search
                                            :filter-option="filterOption"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="6">
                                    <a-form-item
                                        label="公网 Host"
                                        :name="['hostPort', 'publicHost']"
                                        :rules="[
                                            {
                                                required: true,
                                                message: '请输入IP地址',
                                            },
                                            {
                                                pattern:
                                                    /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
                                                message: '请输入正确的IP地址',
                                            },
                                        ]"
                                    >
                                        <a-input
                                            style="width: 105%"
                                            v-model:value="
                                                formState.hostPort.publicHost
                                            "
                                            placeholder="请输入IP地址"
                                        />
                                    </a-form-item>
                                </a-col>
                                <a-col :span="6">
                                    <a-form-item
                                        :name="['hostPort', 'publicPort']"
                                        :rules="[
                                            {
                                                required: true,
                                                message: '输入端口',
                                            },
                                        ]"
                                    >
                                        <div class="form-label"></div>

                                        <a-input-number
                                            style="width: 100%"
                                            placeholder="请输入端口"
                                            v-model:value="
                                                formState.hostPort.publicPort
                                            "
                                            :min="1"
                                            :max="65535"
                                        />
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
                        >
                            <div
                                v-for="(
                                    cluster, index
                                ) in dynamicValidateForm.cluster"
                                :key="cluster.id"
                            >
                                <a-collapse v-model:activeKey="activeKey">
                                    <a-collapse-panel
                                        :key="cluster.id"
                                        :header="`#${index + 1}.节点`"
                                    >
                                        <template #extra>
                                            <delete-outlined
                                                @click="removeCluster(cluster)"
                                            />
                                        </template>
                                        <a-row :gutter="[24, 24]">
                                            <a-col :span="8">
                                                <a-form-item
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'clusterNodeId',
                                                    ]"
                                                >
                                                    <div class="form-label">
                                                        节点名称
                                                    </div>
                                                    <a-select
                                                        v-model:value="
                                                            cluster.clusterNodeId
                                                        "
                                                        :options="clustersList"
                                                        placeholder="请选择节点名称"
                                                        allowClear
                                                        show-search
                                                        :filter-option="
                                                            filterOption
                                                        "
                                                    >
                                                    </a-select>
                                                </a-form-item>
                                            </a-col>
                                            <a-col :span="4">
                                                <a-form-item
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'host',
                                                    ]"
                                                    :rules="{
                                                        required: true,
                                                        message:
                                                            '请选择SIP 地址',
                                                    }"
                                                >
                                                    <div class="form-label">
                                                        SIP 地址
                                                        <span
                                                            class="form-label-required"
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

                                                    <a-select
                                                        v-model:value="
                                                            cluster.host
                                                        "
                                                        :options="sipListOption"
                                                        placeholder="请选择IP地址"
                                                        allowClear
                                                        show-search
                                                        :filter-option="
                                                            filterOption
                                                        "
                                                        style="width: 110%"
                                                        @change="
                                                            handleChangeForm2Sip(
                                                                index,
                                                            )
                                                        "
                                                    >
                                                    </a-select>
                                                </a-form-item>
                                            </a-col>
                                            <a-col :span="4">
                                                <a-form-item
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'port',
                                                    ]"
                                                    :rules="{
                                                        required: true,
                                                        message: '请选择端口',
                                                    }"
                                                >
                                                    <div
                                                        class="form-label"
                                                    ></div>
                                                    <a-select
                                                        v-model:value="
                                                            cluster.port
                                                        "
                                                        :options="
                                                            sipListIndex[index]
                                                        "
                                                        placeholder="请选择端口"
                                                        allowClear
                                                        show-search
                                                        :filter-option="
                                                            filterOption
                                                        "
                                                    />
                                                </a-form-item>
                                            </a-col>
                                            <a-col :span="4">
                                                <a-form-item
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'publicHost',
                                                    ]"
                                                    :rules="[
                                                        {
                                                            required: true,
                                                            message:
                                                                '请输入公网 Host',
                                                        },
                                                        {
                                                            pattern:
                                                                /^([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.([0-9]|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])$/,
                                                            message:
                                                                '请输入正确的IP地址',
                                                        },
                                                    ]"
                                                >
                                                    <div class="form-label">
                                                        公网 Host
                                                        <span
                                                            class="form-label-required"
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
                                                    <a-input
                                                        style="width: 110%"
                                                        v-model:value="
                                                            cluster.publicHost
                                                        "
                                                        placeholder="请输入IP地址"
                                                        allowClear
                                                    />
                                                </a-form-item>
                                            </a-col>
                                            <a-col :span="4">
                                                <a-form-item
                                                    :name="[
                                                        'cluster',
                                                        index,
                                                        'publicPort',
                                                    ]"
                                                    :rules="[
                                                        {
                                                            required: true,
                                                            message:
                                                                '请输入端口',
                                                        },
                                                    ]"
                                                >
                                                    <div
                                                        class="form-label"
                                                    ></div>

                                                    <a-input-number
                                                        style="width: 100%"
                                                        placeholder="请输入端口"
                                                        v-model:value="
                                                            cluster.publicPort
                                                        "
                                                        :min="1"
                                                        :max="65535"
                                                    />
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
                                    @click="addCluster"
                                >
                                    <PlusOutlined />
                                    新增
                                </a-button>
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
                                <a-form :model="formData" layout="vertical">
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
                                    <div>
                                        {{
                                            provider?.id === 'fixed-media'
                                                ? 'URL'
                                                : 'SIP'
                                        }}
                                    </div>
                                </div>
                            </div>
                        </a-col>
                    </a-row>
                </div>
            </div>
        </div>
        <div class="steps-action">
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

<script lang="ts" setup name="AccessNetwork">
import { message, Form } from 'ant-design-vue';
import type { FormInstance } from 'ant-design-vue';
import { getResourcesCurrent, getClusters } from '@/api/link/accessConfig';
import {
    DeleteOutlined,
    PlusOutlined,
    QuestionCircleOutlined,
    InfoCircleOutlined,
} from '@ant-design/icons-vue';
import { update, save } from '@/api/link/accessConfig';

interface Form2 {
    clusterNodeId: string;
    port: string;
    host: string;
    publicPort: string;
    publicHost: string;
    id: number;
}
interface FormState {
    domain: string;
    sipId: string;
    shareCluster: boolean;
    hostPort: {
        port: string;
        host: string;
        publicPort: string;
        publicHost: string;
    };
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

const activeKey: any = ref([]);
const clientHeight = document.body.clientHeight;

const formRef1 = ref<FormInstance>();
const formRef2 = ref<FormInstance>();
const useForm = Form.useForm;

const current = ref(0);
const stepCurrent = ref(0);
const steps = ref(['信令配置', '完成']);
const formData = ref({
    name: '',
    description: '',
});
let formState = ref<FormState>({
    domain: '',
    sipId: '',
    shareCluster: true,
    hostPort: {
        port: '',
        host: '0.0.0.0',
        publicPort: '',
        publicHost: '',
    },
});

let params = {
    configuration: {},
};
let sipListConst: any = [];
const sipListOption = ref([]);
const sipList = ref([]);
const sipListIndex: any = ref([]);
const clustersList = ref([]);

const dynamicValidateForm = reactive<{ cluster: Form2[] }>({
    cluster: [],
});

const removeCluster = (item: Form2) => {
    let index = dynamicValidateForm.cluster.indexOf(item);
    if (index !== -1) {
        dynamicValidateForm.cluster.splice(index, 1);
    }
};

const addCluster = () => {
    const id = Date.now();
    dynamicValidateForm.cluster.push({
        clusterNodeId: '',
        port: '',
        host: '',
        publicPort: '',
        publicHost: '',
        id,
    });
    activeKey.value = [...activeKey.value, id.toString()];
};

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const handleChangeForm2Sip = (index: number) => {
    dynamicValidateForm.cluster[index].port = '';
    const value = dynamicValidateForm.cluster[index].host;
    sipListIndex.value[index] = sipListConst
        .find((i: any) => i.host === value)
        ?.portList.map((i: any) => {
            return {
                value: JSON.stringify({
                    host: value,
                    port: i.port,
                }),
                label: `${i.transports.join('/')} (${i.port})`,
            };
        });
};

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

const saveData = () => {
    validate().then(async (values) => {
        params = {
            ...params,
            ...values,
            provider: 'gb28181-2016',
            transport: 'SIP',
            channel: 'gb28181',
        };

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
    });
};

const next = async () => {
    let data1: any = await formRef1.value?.validate();
    if (data1.hostPort?.port) {
        const port = JSON.parse(data1.hostPort.port).port;
        data1.hostPort.port = port;
    }
    if (!data1?.shareCluster) {
        let data2 = await formRef2.value?.validate();
        if (data2 && data2?.cluster) {
            data2.cluster.forEach((i: any) => {
                i.enabled = true;
                i.port = JSON.parse(i.port).port;
            });
            data1 = {
                ...data1,
                ...data2,
            };
        }
    }
    current.value = current.value + 1;
    params.configuration = data1;
};
const prev = () => {
    current.value = current.value - 1;
};

onMounted(() => {
    getResourcesCurrent().then((resp) => {
        if (resp.status === 200) {
            sipListConst = resp.result;
            sipListOption.value = sipListConst.map((i) => ({
                value: i.host,
                label: i.host,
            }));

            sipList.value = sipListConst
                .find((i) => i.host === '0.0.0.0')
                ?.portList.map((i) => {
                    return {
                        value: JSON.stringify({
                            host: '0.0.0.0',
                            port: i.port,
                        }),
                        label: `${i.transports.join('/')} (${i.port})`,
                    };
                });
        }
    });

    getClusters().then((resp) => {
        if (resp.status === 200) {
            const list = resp.result.map((i) => ({
                value: i.id,
                label: i.name,
            }));
            clustersList.value = list;
        }
    });

    if (id !== ':id') {
        formState.value = props.data.configuration;
        formData.value = {
            name: props.data.name,
            description: props.data?.description || '',
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

.form-item1 {
    background-color: #f6f6f6;
    padding: 10px;
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
