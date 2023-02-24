<template lang="">
    <a-modal
        :title="data.id ? '查看' : '新增' + '任务'"
        ok-text="确认"
        cancel-text="取消"
        :visible="true"
        width="700px"
        :confirm-loading="loading"
        @cancel="handleCancel"
        @ok="handleOk"
    >
        <a-form
            class="form"
            layout="vertical"
            :model="formData"
            name="basic"
            autocomplete="off"
        >
            <a-row :gutter="[24, 0]">
                <a-col :span="24">
                    <a-form-item label="任务名称" v-bind="validateInfos.name">
                        <a-input
                            placeholder="请输入任务名称"
                            v-model:value="formData.name"
                    /></a-form-item>
                </a-col>
                <a-col :span="24"
                    ><a-form-item label="推送方式" v-bind="validateInfos.mode">
                        <a-select
                            v-model:value="formData.mode"
                            :options="[
                                { label: '平台推送', value: 'push' },
                                { label: '设备拉取', value: 'pull' },
                            ]"
                            placeholder="请选择推送方式"
                            allowClear
                            show-search
                            :filter-option="filterOption"
                            @change="changeMode"
                        /> </a-form-item
                ></a-col>
                <a-col :span="12" v-if="formData.mode === 'push'"
                    ><a-form-item
                        label="响应超时时间"
                        v-bind="validateInfos.responseTimeoutSeconds"
                    >
                        <a-input-number
                            placeholder="请输入响应超时时间(秒)"
                            style="width: 100%"
                            :min="1"
                            :max="99999"
                            v-model:value="
                                formData.responseTimeoutSeconds
                            " /></a-form-item
                ></a-col>
                <a-col
                    :span="formData.mode === 'push' ? 12 : 24"
                    v-if="formData.mode === 'push' || formData.mode === 'pull'"
                    ><a-form-item
                        label="升级超时时间"
                        v-bind="validateInfos.timeoutSeconds"
                    >
                        <a-input-number
                            placeholder="请输入升级超时时间(秒)"
                            style="width: 100%"
                            :min="1"
                            :max="99999"
                            v-model:value="
                                formData.timeoutSeconds
                            " /></a-form-item
                ></a-col>
                <a-col :span="12" v-if="!!formData.mode"
                    ><a-form-item
                        label="升级设备"
                        v-bind="validateInfos.releaseType"
                    >
                        <a-radio-group
                            v-model:value="formData.releaseType"
                            button-style="solid"
                            @change="changeShareCluster"
                        >
                            <a-radio value="all">所有设备</a-radio>
                            <a-radio value="part">选择设备</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
                <a-col :span="12" v-if="formData.releaseType === 'part'"
                    ><a-form-item
                        label="选择设备"
                        v-bind="validateInfos.deviceId"
                    >
                        <SelectDevices
                            v-model:modelValue="formData.deviceId"
                            :data="devicesData"
                        ></SelectDevices> </a-form-item
                ></a-col>

                <a-col :span="24">
                    <a-form-item
                        label="说明"
                        v-bind="validateInfos.description"
                    >
                        <a-textarea
                            placeholder="请输入说明"
                            v-model:value="formData.description"
                            :maxlength="200"
                            :rows="3"
                            showCount
                        /> </a-form-item
                ></a-col>
            </a-row>
        </a-form>
    </a-modal>
    <!-- <SelectDevices v-if="visible" @change="saveChange"></SelectDevices> -->
</template>
<script lang="ts" setup name="TaskPage">
import { message, Form } from 'ant-design-vue';
import { getImage } from '@/utils/comm';
import { save, update, queryProduct } from '@/api/device/firmware';
import type { FormInstance } from 'ant-design-vue';
import type { Properties } from '../../type';
import SelectDevices from './SelectDevices.vue';

const route = useRoute();
console.log(111, route.query);

const loading = ref(false);
const useForm = Form.useForm;
const productOptions = ref([]);
const visible = ref(false);
const devicesData = ref()
const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});

const emit = defineEmits(['change']);

const id = props.data.id;

const formData = ref({
    name: '',
    mode: undefined,
    responseTimeoutSeconds: '',
    timeoutSeconds: '',
    releaseType: 'all',
    deviceId: [],
    description: '',
});

const extraValue = ref({});

const validatorSign = async (_: Record<string, any>, value: string) => {
    // const { releaseType, url } = formData.value;
    // if (value && !!releaseType && !!url && !extraValue.value) {
    //     return extraValue.value[releaseType] !== value
    //         ? Promise.reject('选择设备不一致，请检查文件是否上传正确')
    //         : Promise.resolve();
    // } else {
    //     return Promise.resolve();
    // }
};

const { resetFields, validate, validateInfos } = useForm(
    formData,
    reactive({
        name: [
            { required: true, message: '请输入任务名称' },
            { max: 64, message: '最多可输入64个字符' },
        ],
        mode: [{ required: true, message: '请选择推送方式' }],
        responseTimeoutSeconds: [
            { required: true, message: '请输入响应超时时间' },
        ],
        timeoutSeconds: [{ required: true, message: '请输入升级超时时间' }],
        releaseType: [{ required: true }],
        deviceId: [
            { required: true, message: '请选择设备' },
            { validator: validatorSign },
        ],
        description: [{ max: 200, message: '最多可输入200个字符' }],
    }),
);

const filterOption = (input: string, option: any) => {
    return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0;
};

const changeMode = (value) => {
    console.log(111, value, formData.value);
};

const onChange = () => {
    visible.value = true;
};
const saveChange = () => {
    visible.value = false;
};

const onSubmit = async () => {
    validate()
        .then(async (res) => {
            // const product = productOptions.value.find(
            //     (item) => item.value === res.mode,
            // );
            // const productName = product.label || props.data?.url;
            // const size = extraValue.value.length || props.data?.size;
            // const params = {
            //     ...toRaw(formData.value),
            //     properties: !!properties ? properties : [],
            //     productName,
            //     size,
            // };
            // loading.value = true;
            // const response = !id
            //     ? await save(params)
            //     : await update({ ...props.data, ...params });
            // if (response.status === 200) {
            //     message.success('操作成功');
            //     emit('change', true);
            // }
            // loading.value = false;
        })
        .catch((err) => {
            loading.value = false;
        });
};

const handleOk = () => {
    onSubmit();
};
const handleCancel = () => {
    emit('change', false);
};

const changeSignMethod = () => {
    formData.value.deviceId = '';
    formData.value.url = '';
};

onMounted(() => {
    queryProduct({
        paging: false,
        terms: [{ column: 'state', value: 1 }],
        sorts: [{ name: 'createTime', order: 'desc' }],
    }).then((resp) => {
        productOptions.value = resp.result.map((item) => ({
            value: item.id,
            label: item.name,
        }));
    });
});
watch(
    () => props.data,
    (value) => {
        if (value.id) {
            formData.value = value;
        }
    },
    { immediate: true, deep: true },
);
watch(
    () => extraValue.value,
    () => validate('deviceId'),
    { deep: true },
);
</script>

<style lang="less" scoped>
.form {
    .form-submit {
        background-color: @primary-color !important;
    }
}
</style>
