<template>
    <j-modal
        v-model:visible="_vis"
        title="快速添加"
        cancelText="取消"
        okText="确定"
        @ok="handleOk"
        @cancel="handleCancel"
        :confirmLoading="btnLoading"
        width="660px"
    >
        <j-form layout="vertical">
            <j-form-item label="产品名称" v-bind="validateInfos.name">
                <j-input
                    v-model:value="formData.name"
                    placeholder="请输入名称"
                />
            </j-form-item>
            <template v-if="channel === 'gb28181-2016' && formData.accessId">
                <j-form-item
                    label="接入密码"
                    v-bind="validateInfos['configuration.access_pwd']"
                >
                    <j-input-password
                        v-model:value="formData.configuration.access_pwd"
                        placeholder="请输入接入密码"
                    />
                </j-form-item>
                <j-form-item label="流传输模式">
                    <j-select
                        v-model:value="formData.configuration.stream_mode"
                        placeholder="请选择流传输模式"
                        :options="streamMode"
                    />
                </j-form-item>
            </template>
            <j-form-item label="接入网关" v-bind="validateInfos.accessId">
                <div class="gateway-box">
                    <div v-if="!gatewayList.length">
                        暂无数据，请先
                        <j-button type="link">
                            添加{{ providerType[props.channel] }} 接入网关
                        </j-button>
                    </div>
                    <div
                        class="gateway-item"
                        v-for="(item, index) in gatewayList"
                        :key="index"
                    >
                        <CardBox
                            @click="handleClick"
                            :active="_selectedRowKeys.includes(item.id)"
                            :value="item"
                            v-bind="item"
                            :status="item.state?.value"
                            :statusText="item.state?.text"
                            :statusNames="{
                                enabled: 'processing',
                                disabled: 'error',
                            }"
                        >
                            <template #img>
                                <slot name="img">
                                    <img
                                        :src="getImage('/device-access.png')"
                                    />
                                </slot>
                            </template>
                            <template #content>
                                <h3 class="card-item-content-title">
                                    {{ item.name }}
                                </h3>
                                <div class="desc">{{ item.description }}</div>
                                <j-row v-if="props.channel === 'gb28181-2016'">
                                    <j-col :span="12">
                                        {{ item.channelInfo?.name }}
                                    </j-col>
                                    <j-col :span="12">
                                        {{ item.protocolDetail.name }}
                                    </j-col>
                                    <j-col :span="12">
                                        <p
                                            v-for="(i, idx) in item.channelInfo
                                                ?.addresses"
                                            :key="`${i.address}_address${idx}`"
                                        >
                                            <Ellipsis>
                                                <j-badge
                                                    :text="i.address"
                                                    :color="
                                                        i.health === -1
                                                            ? 'red'
                                                            : 'green'
                                                    "
                                                />
                                            </Ellipsis>
                                        </p>
                                    </j-col>
                                </j-row>
                                <j-row v-else>
                                    <j-col :span="24">
                                        <div class="subtitle">
                                            {{ item.protocolDetail.name }}
                                        </div>
                                        <p>
                                            {{
                                                item.protocolDetail.description
                                            }}
                                        </p>
                                    </j-col>
                                </j-row>
                            </template>
                        </CardBox>
                    </div>
                </div>
            </j-form-item>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import { Form, message } from 'ant-design-vue';
import { PropType } from 'vue';
import { streamMode } from '@/views/media/Device/const';
import DeviceApi from '@/api/media/device';
import { getImage } from '@/utils/comm';
import { gatewayType } from '@/views/media/Device/typings';
import { providerType } from '../const';

const useForm = Form.useForm;

type Emits = {
    (e: 'update:visible', data: boolean): void;
    (e: 'update:productId', data: string): void;
    (e: 'close'): void;
    (e: 'save', ): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    productId: { type: String, default: '' },
    channel: { type: String, default: '' },
    deviceType: { type: String, default: 'device' }
});

const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

/**
 * 获取接入网关
 */
const gatewayList = ref<gatewayType[]>([]);
const getGatewayList = async () => {
    const params = {
        pageSize: 100,
        sorts: [{ name: 'createTime', order: 'desc' }],
        terms: [{ column: 'provider', value: props.channel }],
    };
    const { result } = await DeviceApi.queryProvider(params);
    gatewayList.value = result.data;
};

/**
 * 点击接入网关, 获取对应配置
 * @param e
 */
const _selectedRowKeys = ref<string[]>([]);
const handleClick = async (e: any) => {
    _selectedRowKeys.value = [e.id];
    formData.value.accessId = e.id;
    formData.value.accessName = e.name;
    formData.value.accessProvider = e.provider;
    formData.value.messageProtocol = e.protocolDetail.id;
    formData.value.protocolName = e.protocolDetail.name;
    formData.value.transportProtocol = e.transport;

    const { result } = await DeviceApi.getConfiguration(
        e.protocol,
        e.transport,
    );
    console.log('result: ', result);
};

watch(
    () => _vis.value,
    (val) => {
        if (val) {
            getGatewayList();

            formRules.value['configuration.access_pwd'][0].required =
                props.channel === 'gb28181-2016';
            validate();
        } else {
            emit('close');
        }
    },
);

// 表单数据
const formData = ref({
    accessId: '',
    accessName: '',
    accessProvider: '',
    configuration: {
        access_pwd: '',
        stream_mode: 'UDP',
    },
    deviceType: props.deviceType,
    messageProtocol: '',
    name: '',
    protocolName: '',
    transportProtocol: '',
});

// 验证规则
const formRules = ref({
    name: [{ required: true, message: '请输入产品名称' }],
    'configuration.access_pwd': [{ required: true, message: '请输入接入密码' }],
    accessId: [{ required: true, message: '请选择接入网关' }],
});

const { resetFields, validate, validateInfos, clearValidate } = useForm(
    formData.value,
    formRules.value,
);

/**
 * 提交
 */
const btnLoading = ref(false);
const handleOk = () => {
    // console.log('formData.value: ', formData.value);
    validate()
        .then(async () => {
            btnLoading.value = true;
            const res = await DeviceApi.saveProduct(formData.value);
            if (res.success) {
                emit('update:productId', res.result.id);
                const deployResp = await DeviceApi.deployProductById(
                    res.result.id,
                );
                if (deployResp.success) {
                    message.success('操作成功');
                    handleCancel();
                }
            }
            btnLoading.value = false;
        })
        .catch((err) => {
            console.log('err: ', err);
        });
};

const handleCancel = () => {
    _vis.value = false;
    resetFields();
};
</script>

<style lang="less" scoped>
.gateway-box {
    max-height: 450px;
    overflow-y: auto;
    text-align: center;
    .gateway-item {
        padding: 16px;
        text-align: left;
        .card-item-content-title,
        .desc,
        .subtitle {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
        }
        .desc,
        .subtitle {
            margin-top: 10px;
            color: #666;
            font-weight: 400;
            font-size: 12px;
        }
    }
}
</style>
