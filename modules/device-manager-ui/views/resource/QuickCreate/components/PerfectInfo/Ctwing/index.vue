<template>
    <div class="steps-box">
        <div class="alert">
            <AIcon type="InfoCircleOutlined" />
            通过CTWing平台的HTTP推送服务进行数据接入
        </div>
        <div style="margin-top: 42px">
            <a-form :model="formState" ref="formRef" name="basic" autocomplete="off" layout="vertical">
                <a-row :gutter="[24, 24]">
                    <a-col :span="12">
                        <a-form-item label="接口地址" name="apiAddress" :rules="[
                            {
                                required: true,
                            },
                        ]">
                            <a-input v-model:value="formState.apiAddress
                                " />
                        </a-form-item>
                    </a-col>
                    <a-col :span="12">
                        <a-form-item label="appKey" name="appKey" :rules="[
                            {
                                required: true,
                                message: '请输入appKey',
                            },
                            {
                                max: 64,
                                message:
                                    '最多可输入64个字符',
                                trigger: 'blur',
                            },
                        ]">
                            <a-input v-model:value="formState.appKey" placeholder="请输入appKey" />
                        </a-form-item>
                    </a-col>
                </a-row>
                <a-row :gutter="[24, 24]">
                    <a-col :span="12">
                        <a-form-item label="appSecret" name="appSecret" :rules="[
                            {
                                required: true,
                                message: '请输入appSecret',
                            },
                            {
                                max: 64,
                                message:
                                    '最多可输入64个字符',
                                trigger: 'blur',
                            },
                        ]">
                            <a-input v-model:value="formState.appSecret
                                " placeholder="请输入appSecret" />
                        </a-form-item>
                    </a-col>
                </a-row>
            </a-form>
        </div>
    </div>
</template>

<script setup>
import { defineExpose } from 'vue';
const formState = ref({
    apiAddress: 'https://ag-api.ctwing.cn/',
    appKey: '',
    appSecret: '',
});
const formRef = ref()
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