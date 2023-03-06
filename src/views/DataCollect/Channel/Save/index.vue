<template lang="">
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
                <div class="form-label">
                    Modbus主机IP
                    <span class="form-label-required">*</span>
                    <j-tooltip>
                        <template #title>
                            <p>支持ipv4、ipv6、域名</p>
                        </template>
                        <AIcon type="QuestionCircleOutlined" />
                    </j-tooltip>
                </div>
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
                    :min="1"
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
                :name="['configuration.securityPolicy']"
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
                v-if="formData.provider === 'OPC_UA'"
                label="安全模式"
                :name="['configuration.securityMode']"
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
                v-if="
                    formData.configuration.securityMode === 'SignAndEncrypt' ||
                    formData.configuration.securityMode === 'Sign'
                "
                label="证书"
                :name="['configuration.certificate']"
                :rules="FormValidate.certificate"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.configuration.certificate"
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
                :name="['configuration.authType']"
                :rules="FormValidate.authType"
            >
                <RadioCard
                    layout="horizontal"
                    :checkStyle="true"
                    :options="Options['auth-types']"
                    v-model="formData.configuration.authType"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.configuration.authType === 'username'"
                label="用户名"
                :name="['configuration.username']"
                :rules="FormValidate.username"
            >
                <j-input
                    placeholder="请输入用户名"
                    v-model:value="formData.configuration.username"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.configuration.authType === 'username'"
                label="密码"
                :name="['configuration.password']"
                :rules="FormValidate.password"
            >
                <j-input-password
                    placeholder="请输入密码"
                    v-model:value="formData.configuration.password"
                />
            </j-form-item>
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

const formData = ref<FormDataType>(FormState);

const handleOk = async () => {
    const params = await formRef.value?.validate();
    loading.value = true;
    const response = !id
        ? await save(params)
        : await update(id, { ...props.data, ...params });
    if (response.status === 200) {
        emit('change', true);
    }
    loading.value = false;
    formRef.value?.resetFields();
};

const handleCancel = () => {
    emit('change', false);
    formRef.value?.resetFields();
};

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const getOptionsList = async () => {
    for (let key in Options.value) {
        const res = await queryOptionsList(key);
        Options.value[key] = res.result.map((item) => ({
            label: item?.text || item,
            value: item?.value || item,
        }));
    }
};
const getCertificateList = async () => {
    const res = await queryCertificateList();
    certificateList.value = res.result.map((item) => ({
        value: item.id,
        label: item.name,
    }));
};

const getProvidersList = async () => {
    const resp = await getProviders();
    if (resp.status === 200) {
        const list = [
            { label: 'OPC UA', value: 'OPC_UA' },
            { label: 'Modbus TCP', value: 'MODBUS_TCP' },
        ];
        const arr = resp.result
            .filter(
                (item: any) => item.id === 'modbus-tcp' || item.id === 'opc-ua',
            )
            .map((it: any) => (it?.id === 'opc-ua' ? 'OPC_UA' : 'MODBUS_TCP'));
        const providers = list.filter((item: any) => arr.includes(item.value));
        providersList.value = providers;
        if (arr.includes('OPC_UA')) {
            getOptionsList();
        }
    }
};
getProvidersList();
getCertificateList();

watch(
    () => props.data,
    (value) => {
        if (value.id) formData.value = value;
    },
    { immediate: true, deep: true },
);
</script>

<style lang="less" scoped>
.form {
    .form-radio-button {
        width: 148px;
        height: 80px;
        padding: 0;
        img {
            width: 100%;
            height: 100%;
        }
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
