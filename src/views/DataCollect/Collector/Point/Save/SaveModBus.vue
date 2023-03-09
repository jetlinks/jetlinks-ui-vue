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
        >
            <j-form-item
                label="点位名称"
                name="name"
                :rules="[
                    {
                        required: true,
                        message: '请输入点位名称',
                    },
                    {
                        max: 64,
                        message: '最多可输入64个字符',
                    },
                ]"
            >
                <j-input
                    placeholder="请输入点位名称"
                    v-model:value="formData.name"
                />
            </j-form-item>
            <j-form-item
                label="功能码"
                :name="['configuration', 'function']"
                :rules="[
                    {
                        required: true,
                        message: '请选择功能码',
                    },
                ]"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.configuration.function"
                    :options="[
                        { label: '01线圈寄存器', value: 'Coils' },
                        { label: '03保存寄存器', value: 'HoldingRegisters' },
                        { label: '04输入寄存器', value: 'DiscreteInputs' },
                    ]"
                    placeholder="请选择所功能码"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
            </j-form-item>
            <j-form-item
                label="地址"
                :name="['configuration', 'parameter', 'address']"
                :rules="[
                    {
                        required: true,
                        message: '请输入地址',
                    },
                    {
                        pattern: regOnlyNumber,
                        message: '请输入0-255之间的正整数',
                    },
                    {
                        validator: checkAddress,
                        trigger: 'blur',
                    },
                ]"
            >
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入地址"
                    v-model:value="formData.configuration.parameter.address"
                    :min="0"
                    :max="255"
                />
            </j-form-item>
            <j-form-item
                label="寄存器数量"
                :name="['configuration', 'parameter', 'quantity']"
                :rules="[
                    {
                        required: true,
                        message: '请输入寄存器数量',
                    },
                    {
                        pattern: regOnlyNumber,
                        message: '请输入1-255之间的正整数',
                    },
                ]"
            >
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入寄存器数量"
                    v-model:value="formData.configuration.parameter.quantity"
                    :min="1"
                    :max="255"
                />
            </j-form-item>
            <j-form-item
                label="数据类型"
                :name="['configuration', 'codec', 'provider']"
                :rules="[
                    {
                        required: true,
                        message: '请选择数据类型',
                    },
                ]"
            >
                <j-select
                    style="width: 100%"
                    v-model:value="formData.configuration.codec.provider"
                    :options="providerList"
                    placeholder="请选择数据类型"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                />
            </j-form-item>
            <j-form-item
                label="缩放因子"
                :name="[
                    'configuration',
                    'codec',
                    'configuration',
                    'scaleFactor',
                ]"
                :rules="[
                    {
                        required: true,
                        message: '请输入缩放因子',
                    },
                ]"
            >
                <j-input
                    placeholder="请输入缩放因子"
                    v-model:value="
                        formData.configuration.codec.configuration.scaleFactor
                    "
                />
            </j-form-item>
            <j-form-item
                label="访问类型"
                :name="['accessModes']"
                :rules="[
                    {
                        required: true,
                        message: '请选择访问类型',
                    },
                ]"
            >
                <RadioCard
                    layout="horizontal"
                    :checkStyle="true"
                    :options="[
                        { label: '读', value: 'read' },
                        { label: '写', value: 'write' },
                    ]"
                    v-model="formData.accessModes"
                />
                <!-- <j-card-select
                    v-model:value="formData.accessModes"
                    :options="[
                        {
                            label: '读',
                            value: 'read',
                            iconUrl:
                                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                        },
                        {
                            label: '写',
                            value: 'write',
                            iconUrl:
                                'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg',
                        },
                    ]"
                    multiple
                /> -->
            </j-form-item>

            <!-- <j-form-item label="非标准协议写入配置" :name="['nspwc']"> -->
            <j-form-item :name="['nspwc']">
                <span>非标准协议写入配置</span>
                <j-switch v-model:checked="formData.nspwc" />
            </j-form-item>

            <j-form-item
                label="是否写入数据区长度"
                :name="['configuration', 'parameter', 'writeByteCount']"
                :rules="[
                    {
                        required: true,
                        message: '请选择是否写入数据区长度',
                    },
                ]"
            >
                <RadioCard
                    layout="horizontal"
                    :checkStyle="true"
                    :options="[
                        { label: '是', value: true },
                        { label: '否', value: false },
                    ]"
                    v-model="formData.configuration.parameter.writeByteCount"
                />
            </j-form-item>
            <j-form-item
                label="自定义数据区长度（byte）"
                :name="['configuration', 'parameter', 'byteCount']"
                :rules="[
                    {
                        required: true,
                        message: '请输入自定义数据区长度（byte）',
                    },
                ]"
            >
                <j-input
                    placeholder="请输入自定义数据区长度（byte）"
                    v-model:value="formData.configuration.parameter.byteCount"
                />
            </j-form-item>
            <j-form-item
                label="采集频率"
                :name="['configuration', 'interval']"
                :rules="[
                    {
                        required: true,
                        message: '请输入采集频率',
                    },
                ]"
            >
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入采集频率"
                    v-model:value="formData.configuration.interval"
                    :min="1"
                />
            </j-form-item>

            <a-form-item label="" :name="['features']">
                <a-checkbox-group v-model:value="formData.features">
                    <a-checkbox value="changedOnly" name="type"
                        >只推送变化的数据</a-checkbox
                    >
                </a-checkbox-group>
            </a-form-item>

            <j-form-item label="说明" :name="['description']">
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
                :hasPermission="`DataCollect/Collector:${
                    id ? 'update' : 'add'
                }`"
            >
                确认
            </PermissionButton>
        </template>
    </j-modal>
</template>
<script lang="ts" setup>
import { Form } from 'ant-design-vue';
import {
    save,
    update,
    _validateField,
    queryCodecProvider,
} from '@/api/data-collect/collector';
import { Store } from 'jetlinks-store';

const loading = ref(false);
const useForm = Form.useForm;
const channelListAll = ref();
const channelList = ref();
const visibleEndian = ref(false);
const visibleUnitId = ref(false);
const providerList = ref([]);

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['change']);

const id = props.data.id;
const treeId = props.data.treeId;

const formData = ref({
    name: '',
    configuration: {
        function: undefined,
        interval: '',
        parameter: {
            address: '',
            quantity: '',
            writeByteCount: '',
            byteCount: '',
        },
        codec: {
            provider: '',
            configuration: {
                scaleFactor: '',
            },
        },
    },
    accessModes: undefined,
    nspwc: '',
    byte: '',
    features: '',
    description: '',
});

const regOnlyNumber = new RegExp(/^\d+$/);

const checkAddress = (_rule: Rule, value: string): Promise<any> =>
    new Promise(async (resolve, reject) => {
        if (value) {
            const res = await _validateField(props.data.treeId, {
                pointKey: value,
            });
            return res.result.passed ? resolve('') : reject(res.result.reason);
        }
    });

// const { resetFields, validate, validateInfos } = useForm(
//     formData,
//     reactive({
//         channelId: [
//             { required: true, message: '请选择所属通道', trigger: 'blur' },
//         ],
//         name: [
//             { required: true, message: '请输入采集器名称', trigger: 'blur' },
//             { max: 64, message: '最多可输入64个字符' },
//         ],
//         'configuration.unitId': [
//             { required: true, message: '请输入从机地址', trigger: 'blur' },
//             {
//                 pattern: regOnlyNumber,
//                 message: '请输入0-255之间的正整数',
//             },
//         ],
//         'circuitBreaker.type': [
//             { required: true, message: '请选择处理方式', trigger: 'blur' },
//         ],
//         'configuration.endian': [
//             { required: true, message: '请选择高低位切换', trigger: 'blur' },
//         ],
//         description: [{ max: 200, message: '最多可输入200个字符' }],
//     }),
// );
const onSubmit = () => {
    // validate()
    //     .then(async (res) => {
    //         const { provider, name } = channelListAll.value.find(
    //             (item) => item.id === formData.value.channelId,
    //         );
    //         const params = {
    //             ...toRaw(formData.value),
    //             provider,
    //             channelName: name,
    //         };
    //         loading.value = true;
    //         const response = !id
    //             ? await save(params)
    //             : await update(id, { ...props.data, ...params });
    //         if (response.status === 200) {
    //             emit('change', true);
    //         }
    //         loading.value = false;
    //     })
    //     .catch((err) => {
    //         loading.value = false;
    //     });
};

const getTypeTooltip = (value: string) =>
    value === 'LowerFrequency'
        ? '连续20次异常，降低连接频率至原有频率的1/10（重试间隔不超过1分钟），故障处理后自动恢复至设定连接频率'
        : value === 'Break'
        ? '连续10分钟异常，停止采集数据进入熔断状态，设备重新启用后恢复采集状态'
        : '忽略异常，保持原采集频率超时时间为5s';

const handleOk = () => {
    onSubmit();
};
const handleCancel = () => {
    emit('change', false);
};

// const getChannelNoPaging = async () => {
//     channelListAll.value = Store.get('channelListAll');
//     channelList.value = channelListAll.value.map((item) => ({
//         value: item.id,
//         label: item.name,
//     }));
// };
// getChannelNoPaging();

const getProviderList = async () => {
    const res = await queryCodecProvider();
    console.log(222, res.result);

    providerList.value = res.result
        .filter((i) => i.id !== 'property')
        .map((item) => ({
            value: item.id,
            label: item.name,
        }));
};
getProviderList();

// watch(
//     () => formData.value.channelId,
//     (value) => {
//         const dt = channelListAll.value.find((item) => item.id === value);
//         visibleUnitId.value = visibleEndian.value =
//             dt?.provider && dt?.provider === 'MODBUS_TCP';
//     },
//     { deep: true },
// );

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
    .form-upload-button {
        margin-top: 10px;
    }
    .form-submit {
        background-color: @primary-color !important;
    }
}
</style>
