<template>
    <div>
        <img
            class="init-data-img"
            @click="showModal"
            :src="
                flag
                    ? getImage('/init-home/data-enabled.png')
                    : getImage('/init-home/data-disabled.png')
            "
        />
    </div>
    <!-- 初始数据提交表单 -->
    <a-modal
        v-model:visible="visible"
        ::title="$t('init-home.index.011072-2')"
        width="52vw"
        :maskClosable="false"
        @cancel="cancel"
        @ok="handelSave"
        :okText="$t('ave.index.551009-0')"
        :cancelText="$t('ave.index.551009-1')"
        class="modal-style"
    >
        <div class="data-content">
            <p class="data-p-style">
                <ExclamationCircleOutlined style="margin: 0 0 0 5px" />
                {{ $t('init-home.index.011072-3') }}
            </p>
        </div>
        <div style="margin-top: 20px">
            <a-form
                layout="vertical"
                :model="modalForm"
                ref="formRef"
                :rules="rulesModule"
            >
                <a-row :span="24" :gutter="24">
                    <a-col :span="12">
                        <a-form-item name="host">
                            <template #label>
                                <span>{{ $t('init-home.index.011072-4') }} </span>
                                <a-tooltip
                                    :title="$t('init-home.index.011072-14')"
                                >
                                    <img
                                        class="img-style"
                                        :src="getImage('/init-home/mark.png')"
                                    />
                                </a-tooltip>
                            </template>
                            <a-input
                                v-model:value="modalForm.host"
                                :disabled="true"
                            />
                        </a-form-item>
                        <a-form-item name="publicHost">
                            <template #label>
                                <span>{{$t('init-home.index.011072-5')}} </span>
                                <a-tooltip
                                    :title="$t('init-home.index.011072-6')"
                                >
                                    <img
                                        class="img-style"
                                        :src="getImage('/init-home/mark.png')"
                                    />
                                </a-tooltip>
                            </template>
                            <a-input v-model:value="modalForm.publicHost" :placeholder="$t('init-home.index.011072-7')">
                            </a-input>
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="port">
                            <template #label>
                                <span>{{ $t('init-home.index.011072-8') }} </span>
                                <a-tooltip :title="$t('init-home.index.011072-9')">
                                    <img
                                        class="img-style"
                                        :src="getImage('/init-home/mark.png')"
                                    />
                                </a-tooltip>
                            </template>
                            <a-select v-model:value="modalForm.port" :placeholder="$t('init-home.index.011072-10')" show-search>
                                <a-select-option
                                    v-for="item in optionPorts"
                                    :key="item"
                                    :value="item.value"
                                    :label="item.label"
                                    >{{ item.label }}</a-select-option
                                >
                            </a-select>
                        </a-form-item>
                        <a-form-item name="publicPort">
                            <template #label>
                                <span>{{ $t('init-home.index.011072-11') }} </span>
                                <a-tooltip :title="$t('init-home.index.011072-12')">
                                    <img
                                        class="img-style"
                                        :src="getImage('/init-home/mark.png')"
                                    />
                                </a-tooltip>
                            </template>
                            <a-input-number
                                v-model:value="modalForm.publicPort"
                                :placeholder="$t('init-home.index.011072-13')"
                                style="width: 100%"
                                :precision="0"
                            />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
    </a-modal>
</template>

<script lang="ts" setup>
import { getImage, regular, onlyMessage } from '@jetlinks-web/utils'
import {
    saveNetwork,
    getResourcesCurrent,
    saveProtocol,
    getProtocol,
    saveAccessConfig,
    saveProduct,
    saveDevice,
    changeDeploy,
    deployDevice,
} from '@/api/initHome';
import type { Rule } from 'ant-design-vue/es/form';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const formRef = ref();
/**
 * 初始化数据状态
 */
const flag = ref<boolean>(false);
const visible = ref<boolean>(false);
/**
 * 初始化弹窗表单数据
 */
const modalForm = reactive({
    host: '0.0.0.0',
});
const regDomain = new RegExp(
        // /^https?:\/\/(([a-zA-Z0-9_-])+(\.)?)*(:\d+)?(\/((\.)?(\?)?=?&?[a-zA-Z0-9_-](\?)?)*)*$/i,
      /^[a-zA-Z0-9]+([\-\.]{1}[a-zA-Z0-9]+)*\.[a-zA-Z]{2,}$/
    )
/**
 * 校验官网地址
 */
const validateUrl = async (_rule: Rule, value: string) => {
    if (!value) {
        return Promise.reject($t('init-home.index.011072-7'));
    } else {
        if (!(regular.isIpReg(value) || regular.isIpv6(value)) && !regDomain.test(value)) {
            return Promise.reject($t('init-home.index.011072-15'));
        }
        return Promise.resolve();
    }
};
/**
 * 校验数字
 */
const validateNumber = async (_rule: Rule, value: string) => {
    if (!value) {
        return Promise.reject($t('init-home.index.011072-13'));
    } else {
        if (Number(value) < 1 || Number(value) > 65535) {
            return Promise.reject($t('init-home.index.011072-16'));
        }
        return Promise.resolve();
    }
};
const rulesModule = ref({
    host: [
        {
            required: true,
            message: $t('init-home.index.011072-17'),
        },
    ],
    port: [
        {
            required: true,
            message: $t('init-home.index.011072-10'),
        },
    ],
    publicHost: [
        {
            required: true,
            validator: validateUrl,
            trigger: 'change',
        },
    ],
    publicPort: [
        {
            required: true,
            validator: validateNumber,
            trigger: 'change',
        },
    ],
});

/**
 * 初始数据弹窗点击事件
 */
const showModal = () => {
    if (flag.value) {
        flag.value = false;
    } else {
        visible.value = true;
    }
};
/**
 * 表单取消事件
 */
const cancel = () => {
    formRef.value.resetFields();
};
/**
 * 提交初始化数据
 */
const initialization = reactive({
    isSucessInit: 0,
    optionPorts: [],
    /**
     * 查询端口数据
     */
    getCurrentPort: async () => {
        const resp = await getResourcesCurrent();
        const current = resp?.result;
        const _host =
            current.find((item: any) => item.host === '0.0.0.0')?.ports[
                'TCP'
            ] || [];
        initialization.optionPorts = _host?.map((p: any) => ({
            label: p,
            value: p,
        }));
    },
});
/**
 * 提交初始数据表单
 */

const saveCurrentData = () => {
    return new Promise(async (resolve) => {
        if (!flag.value) {
            return resolve(true);
        }
        formRef.value
            .validate()
            .then(async () => {
                try {
                    // 新增网络组件
                    const network = await saveNetwork({
                        type: 'MQTT_SERVER',
                        shareCluster: true,
                        name: $t('init-home.index.011072-18'),
                        configuration: {
                            host: '0.0.0.0',
                            secure: false,
                            port: modalForm.port,
                            publicHost: modalForm.publicHost,
                            publicPort: modalForm.publicPort,
                            maxMessageSize:8192,
                        },
                    });
                    // 保存协议
                    const protocol = await saveProtocol();
                    let protocolItem: any = undefined;
                    if (protocol.status === 200) {
                        const proid = await getProtocol();
                        if (proid.status === 200) {
                            protocolItem = (proid?.result || []).find(
                                (it: any) => it.name === $t('init-home.index.011072-19'),
                            );
                        }
                    }
                    // 新增设备接入网关
                    const accessConfig = await saveAccessConfig({
                        name: $t('init-home.index.011072-20'),
                        provider: 'mqtt-server-gateway',
                        protocol: protocolItem?.id,
                        transport: 'MQTT',
                        channel: 'network',
                        channelId: network?.result?.id,
                    });
                    // 新增产品
                    const product = await saveProduct({
                        name: $t('init-home.index.011072-21'),
                        messageProtocol: protocolItem?.id,
                        protocolName: protocolItem?.name,
                        transportProtocol: 'MQTT',
                        deviceType: 'device',
                        accessId: accessConfig.result?.id,
                        accessName: accessConfig.result?.name,
                        accessProvider: 'mqtt-server-gateway',
                    });
                    // 新增设备
                    const device = await saveDevice({
                        name: $t('init-home.index.011072-22'),
                        productId: product?.result?.id,
                        productName: product?.result?.name,
                    });
                    if (device.status === 200) {
                        await changeDeploy(product.result.id);
                        await deployDevice(device.result.id);
                    }
                    resolve(device.status == 200);
                } catch (e) {
                    resolve(false);
                }
            })
            .catch(() => {
                resolve(false);
            });
    });
};
const { optionPorts } = toRefs(initialization);
const handelSave = () => {
    formRef.value.validate().then(() => {
        onlyMessage($t('init-home.index.011430-6'));
        flag.value = true;
        visible.value = false;
    });
};
/**
 * 初始化
 */
initialization.getCurrentPort();
defineExpose({
    save: saveCurrentData,
});
</script>
<style lang="less" scoped>
.init-data-img {
    width: 300px;
}
.modal-style {
    .data-content {
        background: rgb(236, 237, 238);
        .data-p-style {
            padding: 10px;
        }
    }
}
</style>
