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
    <j-modal
        v-model:visible="visible"
        :title="$t('InitData.index.633471-0')"
        width="52vw"
        :maskClosable="false"
        @cancel="cancel"
        @ok="handelSave"
        :okText="$t('InitData.index.633471-1')"
        :cancelText="$t('InitData.index.633471-2')"
        class="modal-style"
        v-bind="layout"
    >
        <div class="data-content">
            <p class="data-p-style">
                <ExclamationCircleOutlined style="margin: 0 0 0 5px" />
                {{ $t('InitData.index.633471-3') }}
            </p>
        </div>
        <div style="margin-top: 20px">
            <j-form
                layout="vertical"
                :model="modalForm"
                ref="formRef"
                :rules="rulesModle"
            >
                <j-row :span="24" :gutter="24">
                    <j-col :span="12">
                        <j-form-item name="host">
                            <template #label>
                                <span>{{ $t('InitData.index.633471-5') }} </span>
                                <j-tooltip
                                    :title="$t('InitData.index.633471-6')"
                                >
                                    <img
                                        class="img-style"
                                        :src="getImage('/init-home/mark.png')"
                                    />
                                </j-tooltip>
                            </template>
                            <j-input
                                v-model:value="modalForm.host"
                                :disabled="true"
                            />
                        </j-form-item>
                        <j-form-item name="publicHost">
                            <template #label>
                                <span>{{ $t('InitData.index.633471-7') }} </span>
                                <j-tooltip
                                    :title="$t('InitData.index.633471-8')"
                                >
                                    <img
                                        class="img-style"
                                        :src="getImage('/init-home/mark.png')"
                                    />
                                </j-tooltip>
                            </template>
                            <j-input v-model:value="modalForm.publicHost" :placeholder="$t('InitData.index.633471-9')">
                            </j-input>
                        </j-form-item>
                    </j-col>
                    <j-col :span="12">
                        <j-form-item name="port">
                            <template #label>
                                <span>{{ $t('InitData.index.633471-10') }} </span>
                                <j-tooltip :title="$t('InitData.index.633471-11')">
                                    <img
                                        class="img-style"
                                        :src="getImage('/init-home/mark.png')"
                                    />
                                </j-tooltip>
                            </template>
                            <j-select v-model:value="modalForm.port" :placeholder="$t('InitData.index.633471-12')" show-search>
                                <j-select-option
                                    v-for="item in optionPorts"
                                    :key="item"
                                    :value="item.value"
                                    :label="item.label"
                                    >{{ item.label }}</j-select-option
                                >
                            </j-select>
                        </j-form-item>
                        <j-form-item name="publicPort">
                            <template #label>
                                <span>{{ $t('InitData.index.633471-13') }} </span>
                                <j-tooltip :title="$t('InitData.index.633471-14')">
                                    <img
                                        class="img-style"
                                        :src="getImage('/init-home/mark.png')"
                                    />
                                </j-tooltip>
                            </template>
                            <j-input-number
                                v-model:value="modalForm.publicPort"
                                :placeholder="$t('InitData.index.633471-15')"
                                style="width: 100%"
                                :precision="0"
                            />
                        </j-form-item>
                    </j-col>
                </j-row>
            </j-form>
        </div>
    </j-modal>
</template>

<script lang="ts" setup>
import { getImage, onlyMessage } from '@/utils/comm';
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
import { modalState } from '../data/interface';
import type { Rule } from 'ant-design-vue/es/form';
import { testIpv4_6 } from '@/utils/validate';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const formRef = ref();
/**
 * 初始化数据状态
 */
const flag = ref<boolean>(false);
const visible = ref<boolean>(false);
/**
 * 初始化弹窗表单数据
 */
const modalForm = reactive<modalState>({
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
        return Promise.reject($t('InitData.index.633471-9'));
    } else {
        if (!testIpv4_6(value) && !regDomain.test(value)) {
            return Promise.reject($t('InitData.index.633471-16'));
        }
        return Promise.resolve();
    }
};
/**
 * 校验数字
 */
const validateNumber = async (_rule: Rule, value: string) => {
    if (!value) {
        return Promise.reject($t('InitData.index.633471-15'));
    } else {
        if (Number(value) < 1 || Number(value) > 65535) {
            return Promise.reject($t('InitData.index.633471-17'));
        }
        return Promise.resolve();
    }
};
const rulesModle = ref({
    host: [
        {
            required: true,
            message: $t('InitData.index.633471-18'),
        },
    ],
    port: [
        {
            required: true,
            message: $t('InitData.index.633471-12'),
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
                        name: $t('InitData.index.633471-19'),
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
                                (it: any) => it.name === $t('InitData.index.633471-20'),
                            );
                        }
                    }
                    // 新增设备接入网关
                    const accessConfig = await saveAccessConfig({
                        name: $t('InitData.index.633471-21'),
                        provider: 'mqtt-server-gateway',
                        protocol: protocolItem?.id,
                        transport: 'MQTT',
                        channel: 'network',
                        channelId: network?.result?.id,
                    });
                    // 新增产品
                    const product = await saveProduct({
                        name: $t('InitData.index.633471-22'),
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
                        name: $t('InitData.index.633471-23'),
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
const { optionPorts, isSucessInit } = toRefs(initialization);
const handelSave = () => {
    formRef.value.validate().then(() => {
        onlyMessage($t('InitData.index.633471-24'));
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