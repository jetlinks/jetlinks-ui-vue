<!-- Modal 弹窗，用于新增、修改数据 -->
<template>
    <a-modal
        v-model:visible="_vis"
        :title="!!formData.id ? '编辑' : '新增'"
        width="650px"
        cancelText="取消"
        okText="确定"
        @ok="handleSubmit"
        @cancel="handleCancel"
    >
        <a-form ref="formRef" :model="formData" layout="vertical">
            <a-row :gutter="10">
                <a-col :span="12">
                    <a-form-item name="channelId">
                        <template #label>
                            通道ID
                            <a-tooltip title="若不填写，系统将自动生成唯一ID">
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </a-tooltip>
                        </template>
                        <a-input v-model:value="formData.channelId" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item
                        name="name"
                        label="通道名称"
                        :rules="{ required: true, message: '请输入通道名称' }"
                    >
                        <a-input v-model:value="formData.name" />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item
                        name="media_url"
                        :rules="{ required: true, message: '请输入视频地址' }"
                    >
                        <template #label>
                            视频地址
                            <a-tooltip
                                title="不同厂家的RTSP固定地址规则不同，请按对应厂家的规则填写"
                            >
                                <AIcon
                                    type="QuestionCircleOutlined"
                                    style="margin-left: 2px"
                                />
                            </a-tooltip>
                        </template>
                        <a-input v-model:value="formData.others.media_url" />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item name="media_username" label="用户名">
                        <a-input
                            v-model:value="formData.others.media_username"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="12">
                    <a-form-item name="media_password" label="密码">
                        <a-input-password
                            v-model:value="formData.others.media_password"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item name="address" label="安装地址">
                        <a-input v-model:value="formData.address" />
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item name="description" label="说明">
                        <a-textarea
                            v-model:value="formData.description"
                            :rows="4"
                            :maxlength="200"
                            showCount
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import templateApi from '@/api/notice/template';
import { PropType } from 'vue';

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
    id: '',
    address: '',
    channelId: '',
    description: '',
    deviceId: '',
    name: '',
    others: {
        media_password: '',
        media_url: '',
        media_username: '',
    },
});
// const formRules = ref({});

/**
 * 提交
 */
const handleSubmit = () => {
    formRef.value
        .validate()
        .then(async () => {
            emit('submit');
        })
        .catch((err: any) => {
            console.log('err: ', err);
        });
};
const handleCancel = () => {
    _vis.value = false;
};
</script>

<style lang="less" scoped></style>
