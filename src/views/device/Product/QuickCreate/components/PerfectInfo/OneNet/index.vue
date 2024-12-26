<template>
    <div class="steps-box">
        <div class="alert">
            <AIcon type="InfoCircleOutlined" />
            通过OneNet平台的HTTP推送服务进行数据接入
        </div>
        <div style="margin-top: 42px">
            <a-form :model="formState" ref="formRef" name="basic" autocomplete="off" layout="vertical">
                <a-row :gutter="[24, 24]">
                    <a-col :span="24">
                        <a-form-item name="apiAddress" :rules="[
                            {
                                required: true,
                            },
                        ]">
                            <template #label>
                                接口地址
                                <a-tooltip title="同步物联网平台设备数据到OneNet">
                                    <AIcon type="QuestionCircleOutlined" style="margin-left: 2px" />
                                </a-tooltip>
                            </template>
                            <a-input v-model:value="formState.apiAddress
                                " />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="[24, 24]">
                    <a-col :span="24">
                        <a-form-item label="apiKey" name="apiKey" :rules="[
                            {
                                required: true,
                                message: '请输入apiKey',
                            },
                            {
                                max: 64,
                                message:
                                    '最多可输入64个字符',
                                trigger: 'blur',
                            },
                        ]">
                            <a-input v-model:value="formState.apiKey" placeholder="请输入apiKey" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="[24, 24]">
                    <a-col :span="12">
                        <a-form-item name="validateToken" :rules="[
                            {
                                required: true,
                                message: '请输入通知Token',
                            },
                            {
                                max: 64,
                                message:
                                    '最多可输入64个字符',
                                trigger: 'blur',
                            },
                        ]">
                            <template #label>
                                通知Token
                                <a-tooltip title="OneNet端HTTP推送配置中设置的Token">
                                    <AIcon type="QuestionCircleOutlined" style="margin-left: 2px" />
                                </a-tooltip>
                            </template>
                            <a-input v-model:value="formState.validateToken
                                " placeholder="请输入通知Token" />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item name="aesKey" :rules="[
                            {
                                max: 64,
                                message:
                                    '最多可输入64个字符',
                                trigger: 'blur',
                            },
                        ]">
                            <template #label>
                                aesKey
                                <a-tooltip title="OneNet端生成的消息加密key">
                                    <AIcon type="QuestionCircleOutlined" style="margin-left: 2px" />
                                </a-tooltip>
                            </template>
                            <a-input v-model:value="formState.aesKey" placeholder="请输入aesKey" />
                        </a-form-item></a-col>
                </a-row>
                <a-row :gutter="[24, 24]">
                    <a-col :span="24">
                        <a-form-item label="说明" name="description">
                            <a-textarea placeholder="请输入说明" :rows="4" v-model:value="formState.description
                                " show-count :maxlength="200" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
    </div>
</template>

<script setup>
import { defineExpose } from 'vue';
const formRef = ref()
const formState = ref({
    apiAddress: 'http://api.zj.cmcconenet.com/',
    apiKey: '',
    validateToken: '',
    aesKey: '',
});
const submitData = () => {
    return new Promise((res, rej) => {
        formRef.value.validate().then(() => {
            res(formState.value)
        }).catch((err) => {
            rej(err)
        })
    })
}
defineExpose({
    submitData
})
</script>
<style lang='less' scoped>
.alert {
    height: 40px;
    padding-left: 10px;
    color: rgba(0, 0, 0, 0.55);
    line-height: 40px;
    background-color: #f6f6f6;
}
</style>