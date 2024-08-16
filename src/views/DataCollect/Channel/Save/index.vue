<template>
    <j-modal
        :title="data.id ? $t('Save.index.098161-0') : $t('Save.index.098161-1')"
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
            <j-form-item :label="$t('Save.index.098161-2')" name="name">
                <j-input
                    :placeholder="$t('Save.index.098161-3')"
                    v-model:value="formData.name"
                />
            </j-form-item>
            <j-form-item :label="$t('Save.index.098161-4')" name="provider">
                <j-select
                    style="width: 100%"
                    v-model:value="formData.provider"
                    :options="providersList"
                    :placeholder="$t('Save.index.098161-5')"
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
                    {{ $t('Save.index.098161-6') }}
                    <j-tooltip :title="$t('Save.index.098161-7')">
                        <AIcon
                            type="QuestionCircleOutlined"
                            style="margin-left: 2px"
                        />
                    </j-tooltip>
                </template>
                <j-input
                    :placeholder="$t('Save.index.098161-8')"
                    v-model:value="formData.configuration.host"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'MODBUS_TCP'"
                :label="$t('Save.index.098161-9')"
                :name="['configuration', 'port']"
                :rules="FormValidate.port"
            >
                <j-input-number
                    style="width: 100%"
                    :placeholder="$t('Save.index.098161-10')"
                    v-model:value="formData.configuration.port"
                    :min="0"
                    :max="65535"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'OPC_UA'"
                :label="$t('Save.index.098161-11')"
                :name="['configuration', 'endpoint']"
                :rules="FormValidate.endpoint"
            >
                <j-input
                    :placeholder="$t('Save.index.098161-12')"
                    v-model:value="formData.configuration.endpoint"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'OPC_UA'"
                :label="$t('Save.index.098161-13')"
                :name="['configuration', 'securityPolicy']"
                :rules="FormValidate.securityPolicy"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.configuration.securityPolicy"
                    :options="Options['security-policies']"
                    :placeholder="$t('Save.index.098161-14')"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'COLLECTOR_GATEWAY'"
                :name="['configuration', 'deviceId']"
                :rules="[{ required: true, message: $t('Save.index.098161-15') }]"
                :label="$t('Save.index.098161-16')"
            >
                <GateWayFormItem
                    v-model:name="formData.configuration.deviceName"
                    v-model:value="formData.configuration.deviceId"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'OPC_UA'"
                :label="$t('Save.index.098161-17')"
                :name="['configuration', 'securityMode']"
                :rules="FormValidate.securityMode"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.configuration.securityMode"
                    :options="Options['security-modes']"
                    :placeholder="$t('Save.index.098161-18')"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
            </j-form-item>
            <j-form-item
                v-if="isSecurityMode"
                :label="$t('Save.index.098161-19')"
                :name="['configuration', 'certId']"
                :rules="FormValidate.certId"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.configuration.certId"
                    :options="certificateList"
                    :placeholder="$t('Save.index.098161-20')"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
            </j-form-item>
            <j-form-item
                v-if="formData.provider === 'OPC_UA'"
                :label="$t('Save.index.098161-21')"
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
                :label="$t('Save.index.098161-22')"
                :name="['configuration', 'username']"
                :rules="FormValidate.username"
            >
                <j-input
                    :placeholder="$t('Save.index.098161-23')"
                    v-model:value="formData.configuration.username"
                />
            </j-form-item>
            <j-form-item
                v-if="isAuthType"
                :label="$t('Save.index.098161-24')"
                :name="['configuration', 'password']"
                :rules="FormValidate.password"
            >
                <j-input-password
                    :placeholder="$t('Save.index.098161-25')"
                    v-model:value="formData.configuration.password"
                />
            </j-form-item>
            <template v-if="formData.provider === 'BACNetIp'">
                <j-form-item :label="$t('Save.index.098161-26')" :name="['configuration', 'instanceNumber']" :rules="{
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
                        :placeholder="$t('Save.index.098161-27')"
                    ></j-input-number>
                </j-form-item>
                <j-form-item
                    :label="$t('Save.index.098161-28')"
                    :name="['configuration', 'overIp', 'localBindAddress']"
                    :rules="{
                        required: true,
                        trigger:'blur',
                        message: $t('Save.index.098161-29')
                    }"
                >
                    <j-input
                        v-model:value="formData.configuration.overIp.localBindAddress"
                    >
                    </j-input>
                </j-form-item>
                <j-form-item :label="$t('Save.index.098161-30')" :name="['configuration', 'overIp', 'port']" :rules="{
                    required: true,
                    trigger: 'blur',
                    message: $t('Save.index.098161-31')
                }">
                    <j-input-number
                        v-model:value="formData.configuration.overIp.port"
                        style="width: 100%"
                        :min="1"
                        :max="65535"
                        :precision="0"
                        :placeholder="$t('Save.index.098161-31')"
                    ></j-input-number>
                </j-form-item>
            </template>
            <!-- <j-form-item
                v-if="formData.provider === 'snap7'"
                :name="['configuration', 'connect']"
            >
                <j-input v-model:value="formData.configuration.connect"/>
            </j-form-item> -->
            <j-form-item :label="$t('Save.index.098161-32')" name="description">
                <j-textarea
                    :placeholder="$t('Save.index.098161-33')"
                    v-model:value="formData.description"
                    :maxlength="200"
                    :rows="3"
                    showCount
                />
            </j-form-item>
        </j-form>
        <template #footer>
            <j-button key="back" @click="handleCancel">{{ $t('Save.index.098161-34') }}</j-button>
            <PermissionButton
                key="submit"
                type="primary"
                :loading="loading"
                @click="handleOk"
                style="margin-left: 8px"
                :hasPermission="`DataCollect/Channel:${id ? 'update' : 'add'}`"
            >
                {{ $t('Save.index.098161-35') }}
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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
    return Promise.reject($t('Save.index.098161-36'));
  } else {
    const reg = new RegExp(/^[0-9]*$/)
    if(!reg.test(value) || parseInt(value) < 0) {
      return Promise.reject($t('Save.index.098161-37'));
    }
    return Promise.resolve()
  }
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
