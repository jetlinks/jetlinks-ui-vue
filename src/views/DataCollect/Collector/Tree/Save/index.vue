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
            <j-form-item label="所属通道" v-bind="validateInfos.channelId">
                <j-select
                    style="width: 100%"
                    v-model:value="formData.channelId"
                    :options="channelList"
                    placeholder="请选择所属通道"
                    allowClear
                    show-search
                    :filter-option="filterOption"
                    :disabled="!!id"
                />
            </j-form-item>
            <j-form-item label="采集器名称" v-bind="validateInfos.name">
                <j-input
                    placeholder="请输入采集器名称"
                    v-model:value="formData.name"
                />
            </j-form-item>
            <j-form-item
                label="从机地址"
                v-bind="validateInfos['configuration.unitId']"
                v-if="visibleUnitId"
            >
                <j-input-number
                    style="width: 100%"
                    placeholder="请输入从机地址"
                    v-model:value="formData.configuration.unitId"
                    :min="0"
                    :max="255"
                />
            </j-form-item>

            <j-form-item v-bind="validateInfos['circuitBreaker.type']">
                <template #label>
                    <span>
                        故障处理
                        <j-tooltip
                            :title="
                                getTypeTooltip(formData.circuitBreaker.type)
                            "
                        >
                            <AIcon
                                type="QuestionCircleOutlined"
                                style="margin-left: 2px"
                            />
                        </j-tooltip>
                    </span>
                </template>
                <RadioCard
                    layout="horizontal"
                    :checkStyle="true"
                    :options="[
                        { label: '降频', value: 'LowerFrequency' },
                        { label: '熔断', value: 'Break' },
                        { label: '忽略', value: 'Ignore' },
                    ]"
                    v-model="formData.circuitBreaker.type"
                />
            </j-form-item>
            <j-form-item
                v-bind="validateInfos['configuration.endian']"
                v-if="visibleEndian"
            >
                <template #label>
                    <span>
                        高低位切换
                        <j-tooltip title="统一配置所有点位的高低位切换">
                            <AIcon
                                type="QuestionCircleOutlined"
                                style="margin-left: 2px"
                            />
                        </j-tooltip>
                    </span>
                </template>
                <RadioCard
                    layout="horizontal"
                    :checkStyle="true"
                    :options="[
                        { label: 'AB', value: 'BIG' },
                        { label: 'BA', value: 'LITTLE' },
                    ]"
                    v-model="formData.configuration.endian"
                />
            </j-form-item>
            <j-form-item label="说明" v-bind="validateInfos.description">
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
import { save, update } from '@/api/data-collect/collector';
import { Store } from 'jetlinks-store';

const loading = ref(false);
const useForm = Form.useForm;
const channelListAll = ref();
const channelList = ref();
const visibleEndian = ref(false);
const visibleUnitId = ref(false);

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['change']);

const id = props.data.id;

const formData = ref({
    channelId: undefined,
    name: '',
    configuration: {
        unitId: '',
        type: 'LowerFrequency',
        endian: 'BIG',
    },
    circuitBreaker: {
        type: 'LowerFrequency',
    },
    description: '',
});

const regOnlyNumber = new RegExp(/^\d+$/);

const { resetFields, validate, validateInfos } = useForm(
    formData,
    reactive({
        channelId: [
            { required: true, message: '请选择所属通道', trigger: 'blur' },
        ],
        name: [
            { required: true, message: '请输入采集器名称', trigger: 'blur' },
            { max: 64, message: '最多可输入64个字符' },
        ],
        'configuration.unitId': [
            { required: true, message: '请输入从机地址', trigger: 'blur' },
            {
                pattern: regOnlyNumber,
                message: '请输入0-255之间的正整数',
            },
        ],
        'circuitBreaker.type': [
            { required: true, message: '请选择处理方式', trigger: 'blur' },
        ],
        'configuration.endian': [
            { required: true, message: '请选择高低位切换', trigger: 'blur' },
        ],
        description: [{ max: 200, message: '最多可输入200个字符' }],
    }),
);
const onSubmit = () => {
    validate()
        .then(async (res) => {
            const { provider, name } = channelListAll.value.find(
                (item) => item.id === formData.value.channelId,
            );
            const params = {
                ...toRaw(formData.value),
                provider,
                channelName: name,
            };

            loading.value = true;
            const response = !id
                ? await save(params)
                : await update(id, { ...props.data, ...params });
            if (response.status === 200) {
                emit('change', true);
            }
            loading.value = false;
        })
        .catch((err) => {
            loading.value = false;
        });
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

const getChannelNoPaging = async () => {
    channelListAll.value = Store.get('channelListAll');
    channelList.value = channelListAll.value.map((item) => ({
        value: item.id,
        label: item.name,
    }));
};
getChannelNoPaging();

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

watch(
    () => formData.value.channelId,
    (value) => {
        const dt = channelListAll.value.find((item) => item.id === value);
        visibleUnitId.value = visibleEndian.value =
            dt?.provider && dt?.provider === 'MODBUS_TCP';
    },
    { deep: true },
);

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
