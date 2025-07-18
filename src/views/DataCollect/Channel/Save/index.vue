<template>
    <j-modal
        :title="data.id ? '编辑' : '新增'"
        :visible="true"
        width="700px"
        @cancel="handleCancel"
    >
        <j-form
            class="form"
            layout="vertical"
            :model="formData"
            name="basic"
            autocomplete="off"
            :rules="FormValidate"
            ref="formRef"
        >
            <j-form-item label="通道名称" name="name">
                <j-input
                    placeholder="请输入通道名称"
                    v-model:value="formData.name"
                />
            </j-form-item>
            <j-form-item label="通讯协议" name="provider">
                <j-select
                    style="width: 100%"
                    v-model:value="formData.provider"
                    :options="providersList"
                    placeholder="请选择通讯协议"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                    :disabled="!!id"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'MODBUS_TCP'"
                :name="['configuration', 'host']"
                :rules="FormValidate.host"
            >
                <template #label>
                    Modbus主机IP
                    <j-tooltip title="支持ipv4、ipv6、域名">
                        <AIcon
                            type="QuestionCircleOutlined"
                            style="margin-left: 2px"
                        />
                    </j-tooltip>
                </template>
                <j-input
                    placeholder="请输入Modbus主机IP"
                    v-model:value="formData.configuration.host"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'MODBUS_TCP'"
                label="端口"
                :name="['configuration', 'port']"
                :rules="FormValidate.port"
            >
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入端口"
                    v-model:value="formData.configuration.port"
                    :min="0"
                    :max="65535"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'OPC_UA'"
                label="端点url"
                :name="['configuration', 'endpoint']"
                :rules="FormValidate.endpoint"
            >
                <j-input
                    placeholder="请输入端点url"
                    v-model:value="formData.configuration.endpoint"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'OPC_UA'"
                label="安全策略"
                :name="['configuration', 'securityPolicy']"
                :rules="FormValidate.securityPolicy"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.configuration.securityPolicy"
                    :options="Options['security-policies']"
                    placeholder="请选择安全策略"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'COLLECTOR_GATEWAY'"
                :name="['configuration', 'deviceId']"
                :rules="[{ required: true, message: '请选择网关设备' }]"
                label="选择网关设备"
            >
                <GateWayFormItem
                    v-model:name="formData.configuration.deviceName"
                    v-model:value="formData.configuration.deviceId"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'OPC_UA'"
                label="安全模式"
                :name="['configuration', 'securityMode']"
                :rules="FormValidate.securityMode"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.configuration.securityMode"
                    :options="Options['security-modes']"
                    placeholder="请选择安全模式"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
            </j-form-item>
            <j-form-item
                v-if="isSecurityMode"
                label="证书"
                :name="['configuration', 'certId']"
                :rules="FormValidate.certId"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.configuration.certId"
                    :options="certificateList"
                    placeholder="请选择证书"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'OPC_UA'"
                label="权限认证"
                :name="['configuration', 'authType']"
                :rules="FormValidate.authType"
            >
                <j-card-select
                    :showImage="false"
                    v-model:value="formData.configuration.authType"
                    :options="Options['auth-types']"
                    @change="changeAuthType"
                    :column="2"
                />
            </j-form-item>
            <j-form-item
                v-if="isAuthType"
                label="用户名"
                :name="['configuration', 'username']"
                :rules="FormValidate.username"
            >
                <j-input
                    placeholder="请输入用户名"
                    v-model:value="formData.configuration.username"
                />
            </j-form-item>
            <j-form-item
                v-if="isAuthType"
                label="密码"
                :name="['configuration', 'password']"
                :rules="FormValidate.password"
            >
                <j-input-password
                    placeholder="请输入密码"
                    v-model:value="formData.configuration.password"
                />
            </j-form-item>
            <template v-if="formData.provider === 'BACNetIp'">
                <j-form-item label="BACNet实例号" :name="['configuration', 'instanceNumber']" :rules="{
                    required: true,
                    trigger:'blur',
                    validator: validate,
                }">
                    <j-input-number
                        style="width: 100%"
                        v-model:value="formData.configuration.instanceNumber"
                        :min="0"
                        :precision="0"
                        :max="999999999999"
                        placeholder="请输入BACNet实例号"
                    ></j-input-number>
                </j-form-item>
                <j-form-item
                    label="网卡"
                    :name="['configuration', 'overIp', 'localBindAddress']"
                    :rules="{
                        required: true,
                        trigger:'blur',
                        message: '请选择网卡'
                    }"
                >
                    <j-input
                        v-model:value="formData.configuration.overIp.localBindAddress"
                    >
                    </j-input>
                </j-form-item>
                <j-form-item label="广播端口" :name="['configuration', 'overIp', 'port']" :rules="{
                    required: true,
                    trigger: 'blur',
                    message: '请输入广播端口'
                }">
                    <j-input-number
                        v-model:value="formData.configuration.overIp.port"
                        style="width: 100%"
                        :min="1"
                        :max="65535"
                        :precision="0"
                        placeholder="请输入广播端口"
                    ></j-input-number>
                </j-form-item>
                <a-form-item
                    label="子网地址"
                    :name="['configuration', 'overIp', 'subnetAddress']"
                    :rules="[
                        {
                            validator: validateSubnetAddress
                        }
                    ]"
                >
                    <a-input
                        v-model:value="formData.configuration.overIp.subnetAddress"
                        style="width: 100%"
                        placeholder="请输入子网地址"
                    />
                </a-form-item>
                <a-form-item
                    label="网络前缀长度"
                    :name="['configuration', 'overIp', 'networkPrefixLength']"
                >
                    <a-input-number
                        v-model:value="formData.configuration.overIp.networkPrefixLength"
                        style="width: 100%"
                        :min="1"
                        :max="65535"
                        :precision="0"
                        placeholder="请输入网络前缀长度"
                    />
                </a-form-item>
            </template>
            <!-- <j-form-item
                v-if="formData.provider === 'snap7'"
                :name="['configuration', 'connect']"
            >
                <j-input v-model:value="formData.configuration.connect"/>
            </j-form-item> -->
            <j-form-item label="说明" name="description">
                <j-textarea
                    placeholder="请输入说明"
                    v-model:value="formData.description"
                    :maxlength="200"
                    :rows="3"
                    showCount
                />
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="handleCancel">取消</j-button>
            <PermissionButton
                key="submit"
                type="primary"
                :loading="loading"
                @click="handleOk"
                style="margin-left: 8px"
                :hasPermission="`DataCollect/Channel:${id ? 'update' : 'add'}`"
            >
                确认
            </PermissionButton>
        </template>
    </j-modal>
</template>
<script lang="ts" setup>
import {
    save,
    update,
    queryOptionsList,
    queryCertificateList,
    getProviders,
} from '@/api/data-collect/channel';
import { FormValidate, FormState } from '../data';
import type { FormInstance } from 'ant-design-vue';
import type { FormDataType } from '../type.d';
import { cloneDeep, isArray } from 'lodash-es';
import { protocolList } from '@/utils/consts';
import GateWayFormItem from '@/views/DataCollect/Channel/Save/GateWayFormItem.vue';
import { testIpv4_6 } from '@/utils/validate';

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['change']);
const loading = ref(false);
const id = props.data.id;
const formRef = ref<FormInstance>();

const certificateList = ref([]);
const providersList = ref([]);
const Options = ref({
    'auth-types': [],
    'security-modes': [],
    'security-policies': [],
});

const formData = ref<FormDataType>(cloneDeep(FormState));

const handleOk = async () => {
    const params: any = await formRef.value?.validate();
    if (params?.provider === 'COLLECTOR_GATEWAY') {
        params.configuration.deviceName =
            formData.value.configuration.deviceName;
    }
    if (params?.provider === 'snap7') {
        params.configuration = {
            connect: false,
        };
    } else if (params?.provider === 'iec104') {
        params.configuration = {};
    }

    params.circuitBreaker = {
        type: 'Ignore',
    };

    loading.value = true;
    const response = !id
        ? await save(params).catch(() => {})
        : await update(id, { ...props.data, ...params }).catch(() => {});
    emit('change', response?.status === 200);
    loading.value = false;
    formRef.value?.resetFields();
};

const validate = async (_rule: any, value: string) => {
  if (!value) {
    return Promise.reject('请输入BACnet实例号');
  } else {
    const reg = new RegExp(/^[0-9]*$/)
    if(!reg.test(value) || parseInt(value) < 0) {
      return Promise.reject('请输入正确的BACnet实例号');
    }
    return Promise.resolve()
  }
}

const validateSubnetAddress = async (_rule: any, value: string) => { 
    if (value && !testIpv4_6(value)) {
        return Promise.reject('请输入正确的子网地址');
    }
    return Promise.resolve();
}

const handleCancel = () => {
    emit('change', false);
    formRef.value?.resetFields();
};

const changeAuthType = (value: Array<string>) => {
    formData.value.configuration.authType = value[0];
};

const isAuthType = computed(() => {
    const { authType } = formData.value.configuration;
    return isArray(authType)
        ? authType[0] === 'username' && formData.value.provider === 'OPC_UA'
        : authType === 'username' && formData.value.provider === 'OPC_UA';
});
const isSecurityMode = computed(() => {
    const { securityMode } = formData.value.configuration;
    return securityMode === 'SignAndEncrypt' || securityMode === 'Sign'
        ? true
        : false;
});

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const getOptionsList = async () => {
    for (let key in Options.value) {
        const res: any = await queryOptionsList(key);
        if (res.status === 200) {
            Options.value[key] = res.result.map((item: any) => ({
                label: item?.text || item,
                value: item?.value || item,
            }));
        }
    }
};
const getCertificateList = async () => {
    const res: any = await queryCertificateList();
    if (res.status === 200) {
        certificateList.value = res.result.map((item: any) => ({
            label: item.name,
            value: item.id,
        }));
    }
};

const getProvidersList = async () => {
    const resp: any = await getProviders();
    if (resp.status === 200) {
        const arr = resp.result
            .filter((item: any) =>
                [
                    'GATEWAY',
                    'Modbus/TCP',
                    'opc-ua',
                    'snap7',
                    'IEC104',
                    'BACNet/IP',
                ].includes(item.name),
            )
            .map((it: any) => it.name);
        const providers: any = protocolList.filter((item: any) =>
            arr.includes(item.alias),
        );
        providersList.value = providers;
        if (arr.includes('opc-ua')) {
            getOptionsList();
        }
    }
};
getProvidersList();
getCertificateList();

watch(
    () => props.data,
    (value) => {
        if (value.id) {
            formData.value = value as FormDataType;
        }
    },
    { immediate: true, deep: true },
);
</script>

<style lang="less" scoped></style>
