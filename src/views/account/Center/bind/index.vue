<!-- 第三方账户绑定 -->
<template>
    <div class="page-container">
        <div class="content">
            <div class="title">第三方账户绑定</div>
            <!-- 已登录-绑定三方账号 -->
            <template v-if="!token">
                <div class="info">
                    <a-card style="width: 280px">
                        <template #title>
                            <div class="info-head">
                                <img :src="getImage('/bind/Rectangle.png')" />
                                <span>个人信息</span>
                            </div>
                        </template>
                        <div class="info-body">
                            <img :src="getImage('/bind/jetlinksLogo.png')" />
                            <p>账号：admin</p>
                            <p>用户名：超级管理员</p>
                        </div>
                    </a-card>
                    <img :src="getImage('/bind/Vector.png')" />
                    <a-card style="width: 280px">
                        <template #title>
                            <div class="info-head">
                                <img :src="getImage('/bind/Rectangle.png')" />
                                <span>三方账户信息</span>
                            </div>
                        </template>
                        <div class="info-body">
                            <img
                                :src="
                                    accountInfo?.avatar ||
                                    getImage('/bind/wechat-webapp.png')
                                "
                            />
                            <p>用户名：-</p>
                            <p>名称：{{ accountInfo?.name || '-' }}</p>
                        </div>
                    </a-card>
                </div>
                <div class="btn">
                    <a-button type="primary" @click="handleBind"
                        >立即绑定</a-button
                    >
                </div>
            </template>
            <!-- 未登录-绑定三方账号 -->
            <template v-else>
                <div class="not-login">
                    <div class="logo">
                        <img :src="getImage('/bind/jetlinksLogo.png')" />
                        <img
                            class="arrow"
                            :src="getImage('/bind/Vector.png')"
                        />
                        <img :src="getImage('/bind/wechat-webapp.png')" />
                    </div>
                    <div class="desc">
                        你已通过微信授权,完善以下登录信息即可以完成绑定
                    </div>
                    <div class="login-form">
                        <a-form layout="vertical">
                            <a-form-item
                                label="账户"
                                v-bind="validateInfos.username"
                            >
                                <a-input
                                    v-model:value="formData.username"
                                    placeholder="请输入账户"
                                />
                            </a-form-item>
                            <a-form-item
                                label="密码"
                                v-bind="validateInfos.password"
                            >
                                <a-input-password
                                    v-model:value="formData.password"
                                    placeholder="请输入密码"
                                />
                            </a-form-item>
                            <a-form-item
                                label="验证码"
                                v-bind="validateInfos.verifyCode"
                            >
                                <a-input
                                    v-model:value="formData.verifyCode"
                                    placeholder="请输入验证码"
                                >
                                    <template #addonAfter>
                                        <img
                                            :src="captcha.base64"
                                            @click="getCode"
                                            style="cursor: pointer"
                                        />
                                    </template>
                                </a-input>
                            </a-form-item>
                            <a-form-item>
                                <a-button
                                    type="primary"
                                    @click="handleLoginBind"
                                    style="width: 100%"
                                >
                                    登录并绑定账户
                                </a-button>
                            </a-form-item>
                        </a-form>
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { getImage, LocalStore } from '@/utils/comm';
import { TOKEN_KEY } from '@/utils/variable';
import { Form } from 'ant-design-vue';
import { message } from 'ant-design-vue';

import { applicationInfo, bindAccount } from '@/api/bind';
import { code, authLogin } from '@/api/login';

const useForm = Form.useForm;

interface formData {
    username: string;
    password: string;
    verifyCode: string;
}

const token = computed(() => LocalStore.get(TOKEN_KEY));

// 已登录直接绑定
const getUrlCode = () => {
    const url = new URLSearchParams(window.location.href);
    return url.get('code') as string;
};
// 三方应用信息
const accountInfo = ref({
    avatar: '',
    name: '',
});
const getAppInfo = async () => {
    const code = getUrlCode();
    const res = await applicationInfo(code);
    accountInfo.value = res?.result?.result;
};
getAppInfo();

/**
 * 立即绑定
 */
const handleBind = async () => {
    const code = getUrlCode();
    const res = await bindAccount(code);
    console.log('bindAccount: ', res);
    message.success('绑定成功');
    goRedirect();
    setTimeout(() => window.close(), 1000);
};

// 未登录-先登录再绑定
const formData = ref<formData>({
    username: '',
    password: '',
    verifyCode: '',
});
const formRules = ref({
    username: [
        {
            required: true,
            message: '请输入账户',
        },
    ],
    password: [
        {
            required: true,
            message: '请输入密码',
        },
    ],
    verifyCode: [
        {
            required: true,
            message: '请输入验证码',
        },
    ],
});

const { resetFields, validate, validateInfos } = useForm(
    formData.value,
    formRules.value,
);

/**
 * 获取图形验证码
 */
const captcha = ref({
    base64: '',
    key: '',
});
const getCode = async () => {
    const res: any = await code();
    captcha.value = res.result;
};
getCode();

/**
 * 登录并绑定账户
 */
const handleLoginBind = () => {
    validate()
        .then(async () => {
            const code = getUrlCode();
            const params = {
                ...formData.value,
                verifyKey: captcha.value.key,
                bindCode: code,
                expires: 3600000,
            };
            const res = await authLogin(params);
            console.log('res: ', res);
            message.success('登录成功');
            goRedirect();
            setTimeout(() => window.close(), 1000);
        })
        .catch((err) => {
            getCode();
        });
};

/**
 * 绑定成功跳转至页面url的: redirect
 */
const goRedirect = () => {
    const urlParams = new URLSearchParams(window.location.hash);
    const redirectUrl =
        urlParams.get('redirect') ||
        window.location.href.split('redirect=')?.[1];
    console.log('redirectUrl: ', redirectUrl);
    //内部集成需要跳回它们页面
    if (redirectUrl && redirectUrl.indexOf('account/center/bind') === -1) {
        window.location.href = decodeURIComponent(redirectUrl);
    }
};
</script>

<style lang="less" scoped>
:deep(
        .ant-form-item-label
            > label.ant-form-item-required:not(
                .ant-form-item-required-mark-optional
            )::before
    ) {
    display: none;
}
:deep(.ant-form-item-label > label) {
    font-weight: bold;
}
.page-container {
    width: 100%;
    height: 100vh;
    background: url(/images/bind/bindPage.png) 0% 0% / 100% 100% no-repeat;
    display: flex;
    align-items: center;
    justify-content: center;
    .content {
        box-sizing: border-box;
        width: 850px;
        min-height: 510px;
        background: #fff;
        border: 1px solid #e0e4e8;
        border-radius: 2px;
        .title {
            margin: 30px 0;
            color: #0f1222;
            font-weight: 400;
            font-size: 20px;
            font-family: 'PingFang SC';
            font-style: normal;
            line-height: 25px;
            text-align: center;
        }
        // 已登录-绑定三方账号
        .info {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            &-head {
                display: flex;
                align-items: baseline;
                gap: 10px;
            }
            &-body {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 10px;
                img {
                    width: 70px;
                    height: 70px;
                }
            }
        }
        .btn {
            display: flex;
            justify-content: center;
            margin-top: 30px;
        }

        // 未登录
        .not-login {
            display: flex;
            flex-direction: column;
            align-items: center;
            .logo {
                display: flex;
                align-items: center;
                gap: 20px;
                img {
                    width: 50px;
                    height: 50px;
                }
                .arrow {
                    width: 15px;
                    height: 15px;
                }
            }
            .desc {
                margin-top: 30px;
                margin-bottom: 30px;
                font-size: 14px;
                font-family: 'PingFang SC';
                font-style: normal;
                line-height: 14px;
                opacity: 0.75;
                mix-blend-mode: normal;
            }
        }
    }
}
</style>
