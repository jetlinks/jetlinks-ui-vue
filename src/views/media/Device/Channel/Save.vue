<!-- Modal 弹窗，用于新增、修改数据 -->
<template>
    <j-modal
        v-model:visible="_vis"
        :title="!!formData.id ? '编辑' : '新增'"
        width="650px"
        cancelText="取消"
        okText="确定"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <j-form ref="formRef" :model="formData" layout="vertical">
            <j-row :gutter="10">
                <j-col :span="12">
                    <j-form-item
                        name="channelId"
                        :rules="[
                            {
                                max: 64,
                                message: '最多可输入64个字符',
                            },
                            {
                                validator: validateChannelId,
                            },
                        ]"
                    >
                        <template #label>
                            通道ID
                            <j-tooltip title="若不填写，系统将自动生成唯一ID">
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </j-tooltip>
                        </template>
                        <j-input
                            v-model:value="formData.channelId"
                            :disabled="!!formData.id"
                            placeholder="请输入通道ID"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        name="name"
                        label="通道名称"
                        :rules="[
                            { required: true, message: '请输入通道名称' },
                            { max: 64, message: '最多可输入64个字符' },
                        ]"
                    >
                        <j-input
                            v-model:value="formData.name"
                            placeholder="请输入通道名称"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="24">
                    <j-form-item
                        name="media_url"
                        :rules="[
                            { required: true, message: '请输入视频地址' },
                            { max: 128, message: '最多可输入128个字符' },
                        ]"
                    >
                        <template #label>
                            视频地址
                            <j-tooltip
                                title="不同厂家的RTSP固定地址规则不同，请按对应厂家的规则填写"
                            >
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </j-tooltip>
                        </template>
                        <j-input
                            v-model:value="formData.media_url"
                            placeholder="请输入视频地址"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        name="media_username"
                        label="用户名"
                        :rules="{ max: 64, message: '最多可输入64个字符' }"
                    >
                        <j-input
                            v-model:value="formData.media_username"
                            placeholder="请输入用户名"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="12">
                    <j-form-item
                        name="media_password"
                        label="密码"
                        :rules="{ max: 64, message: '最多可输入64个字符' }"
                    >
                        <j-input-password
                            v-model:value="formData.media_password"
                            placeholder="请输入密码"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="24">
                    <j-form-item name="address" label="安装地址">
                        <j-input
                            v-model:value="formData.address"
                            placeholder="请输入安装地址"
                        />
                    </j-form-item>
                </j-col>
                <j-col :span="24">
                    <j-form-item name="description" label="说明">
                        <j-textarea
                            v-model:value="formData.description"
                            :rows="4"
                            :maxlength="200"
                            showCount
                        />
                    </j-form-item>
                </j-col>
            </j-row>
        </j-form>
    </j-modal>
</template>

<script setup lang="ts">
import ChannelApi from '@/api/media/channel';
import { PropType } from 'vue';
import { message } from 'ant-design-vue';
import type { Rule } from 'ant-design-vue/es/form';

const route = useRoute();

type Emits = {
    (e: 'update:visible', data: boolean): void;
    (e: 'submit'): void;
};

const emit = defineEmits<Emits>();

const props = defineProps({
    visible: { type: Boolean, default: false },
    channelData: {
        type: Object as PropType<Partial<Record<string, any>>>,
        default: () => ({}),
    },
});

const _vis = computed({
    get: () => props.visible,
    set: (val) => emit('update:visible', val),
});

const formRef = ref();
const formData = ref({
    id: undefined,
    address: '',
    channelId: '',
    description: '',
    deviceId: route.query.id,
    name: '',
    // 以下三个字段, 提交时需提取到others字段当中
    media_password: '',
    media_url: '',
    media_username: '',
});

watch(
    () => props.channelData,
    (val: any) => {
        const {
            id,
            address,
            channelId,
            description,
            deviceId,
            name,
            others,
            ...extra
        } = val;
        formData.value = {
            id,
            address,
            channelId,
            description,
            deviceId,
            name,
            ...others,
        };
    },
    { deep: true },
);

/**
 * 通道ID字段验证是否存在
 * @param _rule
 * @param value
 */
let validateChannelId = async (_rule: Rule, value: string) => {
    const { result } = await ChannelApi.validateField({
        deviceId: route.query.id,
        channelId: value,
    });

    if (!result.passed) {
        return Promise.reject('该ID已存在');
    } else {
        return Promise.resolve();
    }
};

/**
 * 提交
 */
const btnLoading = ref<boolean>(false);
const handleSubmit = () => {
    formRef.value
        .validate()
        .then(async () => {
            const {
                media_url,
                media_password,
                media_username,
                ...extraFormData
            } = formData.value;
            if (media_url || media_password || media_username) {
                extraFormData.others = {
                    media_url,
                    media_password,
                    media_username,
                };
            }
            btnLoading.value = true;
            const res = formData.value.id
                ? await ChannelApi.update(formData.value.id, extraFormData)
                : await ChannelApi.save(extraFormData);
            btnLoading.value = false;
            if (res.success) {
                message.success('操作成功');
                _vis.value = false;
                emit('submit');
            } else {
                message.error('操作失败');
            }
        })
        .catch((err: any) => {
            console.log('err: ', err);
        });
};
const handleCancel = () => {
    _vis.value = false;
};
watch(
    () => _vis.value,
    (val) => {
        if (!val) {
            formRef.value.resetFields();
            // 以下字段非表单所填, 重置字段需手动置空
            formData.value.id = undefined;
        }
    },
);
</script>
