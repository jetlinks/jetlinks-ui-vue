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
        <j-form ref="formRef" :model="formData" layout="vertical">
            <j-form-item
                label="产品名称"
                name="name"
                :rules="[
                    { required: true, message: '请输入产品名称' },
                    {
                        max: 64,
                        message: '最多输入64个字符',
                    },
                ]"
            >
                <j-input
                    v-model:value="formData.name"
                    placeholder="请输入名称"
                />
            </j-form-item>
            <template v-if="deviceType !== 'gateway'">
                <template v-for="(item, index) in extendFormItem" :key="index">
                    <j-form-item
                        :name="item.name"
                        :label="item.label"
                        :rules="[
                            {
                                required: item.required,
                                message: item.message,
                                trigger: 'change',
                            },
                            {
                                max: 64,
                                message: '最多输入64个字符',
                            },
                        ]"
                    >
                        <j-select
                            v-if="item.type === 'enum'"
                            v-model:value="formData[item.name[0]][item.name[1]]"
                            :options="item.options"
                            :placeholder="item.message"
                        />
                        <j-input-password
                            v-else-if="item.type === 'password'"
                            v-model:value="formData[item.name[0]][item.name[1]]"
                            :placeholder="item.message"
                        />
                        <j-input
                            v-else
                            v-model:value="formData[item.name[0]][item.name[1]]"
                            :placeholder="item.message"
                        />
                    </j-form-item>
                </template>
            </template>
            <j-form-item
                label="接入网关"
                name="accessId"
                :rules="{ required: true, message: '请选择接入网关' }"
            >
                <div class="gateway-box">
                    <j-empty
                        v-if="!gatewayList.length"
                        style="margin-top: 50px"
                    >
                        <template #description>
                            <template v-if="!isPermission"
                                >暂无权限, 请联系管理员</template
                            >
                            <template v-else>
                                暂无数据，请先
                                <j-button
                                    type="link"
                                    style="padding: 0"
                                    @click="handleAdd"
                                >
                                    添加{{
                                        providerType[props.channel]
                                    }}接入网关
                                </j-button>
                            </template>
                        </template>
                    </j-empty>
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
import DeviceApi from '@/api/media/device';
import { getImage, onlyMessage } from '@/utils/comm';
import { gatewayType } from '@/views/media/Device/typings';
import { providerType } from '../const';
import { usePermissionStore } from '@/store/permission';

const isPermission = usePermissionStore().hasPermission(
    'link/AccessConfig:add',
);

type Emits = {
    (e: 'update:visible', data: boolean): void;
    (e: 'update:productId', data: string): void;
    (e: 'close'): void;
    (e: 'save', data: Record<string, any>): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    productId: { type: String, default: '' },
    channel: { type: String, default: '' },
    deviceType: { type: String, default: 'device' },
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
const extendFormItem = ref<any[]>();
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

    extendFormItem.value = result.properties.map((item: any) => ({
        name: ['configuration', item.property],
        label: item.name,
        type: item.type?.type,
        value: item.type.expands?.defaultValue,
        options: item.type.elements?.map((e: any) => ({
            label: e.text,
            value: e.value,
        })),
        required: !!item.type.expands?.required,
        message:
            item.type?.type === 'enum'
                ? `请选择${item.name}`
                : `请输入${item.name}`,
    }));
};

watch(
    () => _vis.value,
    (val) => {
        if (val) {
            getGatewayList();
        } else {
            _selectedRowKeys.value = [];
            extendFormItem.value = [];
            emit('close');
        }
    },
);

// 表单数据
const formRef = ref();
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

/**
 * 提交
 */
const btnLoading = ref(false);
const handleOk = () => {
    formRef.value
        ?.validate()
        .then(async () => {
            btnLoading.value = true;
            const res = await DeviceApi.saveProduct(formData.value);
            if (res.success) {
                emit('update:productId', res.result.id);
                const deployResp = await DeviceApi.deployProductById(
                    res.result.id,
                );
                if (deployResp.success) {
                    emit('save', { ...res.result });
                    onlyMessage('操作成功');
                    handleCancel();
                }
            }
            btnLoading.value = false;
        })
        .catch((err: any) => {
            console.log('err: ', err);
        });
};

const handleCancel = () => {
    _vis.value = false;
    formRef.value.resetFields();
};

/**
 * 添加接入网关
 */
const handleAdd = () => {
    const tab: any = window.open(
        `${origin}/#/iot/link/accessConfig/detail/:id?save=true&view=false&type=${props.channel}`,
    );
    tab.onTabSaveSuccess = async (value: any) => {
        await getGatewayList();
        handleClick(value?.result);
    };
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
