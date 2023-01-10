<template>
    <div>
        <a-spin :spinning="loading" :delay="500">
            <div class="container">
                <div class="left">
                    <img
                        style="width: 100%; height: 100%"
                        :src="getImage('/login.png')"
                    />
                </div>
                <div class="right">
                    <div class="lang" data-lang=""></div>
                    <div class="content">
                        <div class="top">
                            <div class="header">
                                <!-- <link to="/"> -->
                                <img
                                    alt="logo"
                                    class="logo"
                                    :src="getImage('/logo.png')"
                                />
                                <!-- </link> -->
                            </div>
                            <div class="desc">物联网平台</div>
                            <div class="main">
                                <a-form
                                    layout="vertical"
                                    :model="form"
                                    class="login-form"
                                    @finish="onFinish"
                                >
                                    <a-form-item
                                        label="账号"
                                        name="username"
                                        :rules="[
                                            {
                                                required: true,
                                                message: '请输入账号!',
                                            },
                                        ]"
                                    >
                                        <a-input
                                            v-model:value="form.username"
                                            placeholder="请输入账号"
                                            :maxlength="64"
                                        ></a-input>
                                    </a-form-item>
                                    <a-form-item
                                        label="密码"
                                        name="password"
                                        :rules="[
                                            {
                                                required: true,
                                                message: '请输入密码!',
                                            },
                                        ]"
                                    >
                                        <a-input-password
                                            v-model:value="form.password"
                                            placeholder="请输入密码"
                                            :maxlength="64"
                                        ></a-input-password>
                                    </a-form-item>
                                    <a-form-item
                                        v-if="codeConfig"
                                        class="verifyCode"
                                        label="验证码"
                                        name="verifyCode"
                                        :rules="[
                                            {
                                                required: true,
                                                message: '请输入验证码!',
                                            },
                                        ]"
                                    >
                                        <a-input
                                            class="login-code-input"
                                            v-model:value="form.verifyCode"
                                            autocomplete="off"
                                            :maxlength="64"
                                            placeholder="请输入验证码"
                                        ></a-input>
                                        <div class="login-code">
                                            <img
                                                :src="codeUrl"
                                                @click="getCode()"
                                                class="login-code-img"
                                            />
                                        </div>
                                    </a-form-item>
                                    <a-form-item
                                        name="remember"
                                        style="text-align: left"
                                    >
                                        <a-checkbox
                                            v-model:checked="form.remember"
                                            >记住密码</a-checkbox
                                        >
                                    </a-form-item>
                                    <a-form-item>
                                        <a-button
                                            :loading="loading"
                                            type="primary"
                                            html-type="submit"
                                            class="login-form-button"
                                            block
                                        >
                                            登录
                                        </a-button>
                                    </a-form-item>
                                </a-form>
                                <div style="margin-top: 20">
                                    <a-divider plain style="height: 12">
                                        <div
                                            style="color: '#807676d9', fontSize: 12"
                                        >
                                            其他方式登录
                                        </div>
                                    </a-divider>
                                    <div
                                        style="position: 'relative', bottom: '10px'"
                                        v-for="(item, index) in bindings"
                                        :key="index"
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bottom">
                        <div class="view">
                            JETLINKS团队全新力作可视化大屏系统
                        </div>
                        <div class="url">
                            <div style="height: 33px">
                                <img :src="viewLogo" />
                            </div>
                            <a
                                href="https://view.jetlinks.cn/"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                体验DEMO
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </a-spin>
    </div>
</template>

<script setup lang="ts">
import { getImage } from '@/utils/comm';
import {
    config,
    code,
    authLogin,
    getInitSet,
    systemVersion,
    bindInfo,
} from '@/api/login';
import Cookies from 'js-cookie';
import { useUserInfo } from '@/store/userInfo';
import { LocalStore } from '@/utils/comm';
import { TOKEN_KEY, Version_Code } from '@/utils/variable';

const store = useUserInfo();
const router = useRouter();
const bgImage = getImage('/logo.png');
const viewLogo = getImage('/view-logo.png');

const LoginWarpStyle = reactive({
    backgroundImage: `url(${bgImage})`,
});

const screenWidth = ref(document.body.clientWidth);
const screenHeight = ref(document.body.clientHeight);

const form = reactive({
    username: '',
    password: '',
    remember: false,
    expires: 3600000,
    verifyCode: '',
    verifyKey: '',
});

const codeUrl = ref('');
const codeConfig = ref(false);

const loading = ref(false);
const bindings = ref<any[]>();

const onFinish = async () => {
    form.remember
        ? Cookies.set('user', encodeURIComponent(JSON.stringify(form)), {
              expires: 7,
          })
        : Cookies.remove('user');
    Cookies.set('username', form.username, { expires: 30 });
    try {
        loading.value = true;
        const res: any = await authLogin(form);
        if (res.status === 200) {
            store.$patch({
                ...res.result,
                username: form.username,
            });
            LocalStore.set(TOKEN_KEY, res?.result.token);
            const resp: any = await getInitSet();
            if (resp.status === 200) {
                router.push('/demo');
            }
        }
    } catch (error) {
        loading.value = false;
    }
};

const getCode = async () => {
    const configRes: any = await config();
    if (!configRes.success || (configRes.success && !configRes.result.enabled))
        return;

    codeConfig.value = true;
    const res: any = await code();
    if (res.success) {
        codeUrl.value = res.result.base64;
        form.verifyKey = res.result.key;
    }
};

const getCookie = () => {
    // form.username = Cookies.get('username');
    if (!Cookies.get('user')) return;
    const user = JSON.parse(decodeURIComponent(Cookies.get('user')));
    form.username = user.username;
    form.password = user.password;
    form.remember = user.remember || false;
};

const getOpen = () => {
    systemVersion().then((res: any) => {
        if (res.status === 200 && res.result) {
            LocalStore.set(Version_Code, res.result.edition);
            if (res.result.edition !== 'community') {
                bindInfo().then((res: any) => {
                    if (res.status === 200) {
                        bindings.value = res.result;
                    }
                });
            }
        }
    });
};

const screenRotation = (width: number, height: number) => {
    LoginWarpStyle.backgroundImage = `url(${bgImage})`;
};

window.onresize = () => {
    return (() => {
        screenWidth.value = document.body.clientWidth;
        screenHeight.value = document.body.clientHeight;
    })();
};

watch(
    [() => screenWidth.value, () => screenHeight.value],
    (value) => {
        screenRotation(value[0], value[1]);
    },
    { deep: true },
);

getOpen();
getCode();
getCookie();
screenRotation(screenWidth.value, screenHeight.value);
</script>

<style scoped lang="less">
@import 'ant-design-vue/es/style/themes/default.less';

.container {
    display: flex;
    height: 100vh;
    overflow: auto;
    background: @layout-body-background;

    .left {
        width: 73%;
        height: 100%;
    }

    .right {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 27%;
        background: #fff;

        :deep(.ant-layout-footer) {
            background: #fff;
        }

        .lang {
            width: 100%;
            height: 40px;
            line-height: 44px;
            text-align: right;

            :global(.ant-dropdown-trigger) {
                margin-right: 24px;
            }
        }

        .content {
            display: flex;
            flex-direction: row-reverse;
            justify-content: center;
            padding: 0 0 15% 0;

            .top {
                width: 100%;
                text-align: center;

                .header {
                    height: 44px;
                    line-height: 44px;

                    a {
                        text-decoration: none;
                    }

                    .logo {
                        height: 44px;
                        margin-right: 16px;
                        vertical-align: top;
                    }

                    .title {
                        position: relative;
                        top: 2px;
                        color: @heading-color;
                        font-weight: 600;
                        font-size: 33px;
                        font-family: Avenir, 'Helvetica Neue', Arial, Helvetica,
                            sans-serif;
                    }
                }

                .desc {
                    margin-top: 12px;
                    margin-bottom: 40px;
                    // color: @heading-color;
                    color: rgb(0 0 0 / 70%);
                    font-weight: 600;
                    font-size: 22px;
                    font-family: Avenir, 'Helvetica Neue', Arial, Helvetica,
                        sans-serif;
                }

                .main {
                    width: 70%;
                    margin: 60px auto 0;

                    @media screen and (max-width: @screen-sm) {
                        width: 95%;
                        max-width: 328px;
                    }

                    // ::v-deep {
                    //     .@{ant-prefix}-tabs-nav-list {
                    //         margin: auto;
                    //         font-size: 16px;
                    //     }

                    //     // .ant-formily-item-size-large .ant-formily-item-help {
                    //     //     text-align: left;
                    //     // }
                    // }

                    .icon {
                        margin-left: 16px;
                        color: rgba(0, 0, 0, 0.2);
                        font-size: 24px;
                        vertical-align: middle;
                        cursor: pointer;
                        transition: color 0.3s;

                        &:hover {
                            color: @primary-color;
                        }
                    }

                    .other {
                        margin-top: 24px;
                        line-height: 22px;
                        text-align: left;

                        .register {
                            float: right;
                        }
                    }

                    .prefixIcon {
                        color: @primary-color;
                        font-size: @font-size-base;
                    }

                    .remember {
                        display: flex;
                        flex-direction: row;
                        margin-bottom: 30px;
                    }
                }
            }
        }
    }

    .bottom {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 11%;
        border-top: 1px solid #e0e4e8;

        .view {
            width: 247px;
            height: 20px;
            margin-right: 10%;
            margin-bottom: 10px;
            padding-top: 2px;
            color: rgba(0, 0, 0, 0.65);
            font-size: 14px;
            font-family: 'PingFang SC';
        }

        .url {
            display: flex;
            align-items: center;
            margin-right: 10%;

            img {
                width: 100%;
                height: 100%;
            }

            a {
                position: relative;
                left: 60px;
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: center;
                padding: 2px 7px;
                line-height: 20px;
                border: 1px solid #2f54eb;
                border-radius: 2px;
            }
        }
    }
}

@media (min-width: @screen-md-min) {
    .container {
        //background-image: url('https://gw.alipayobjects.com/zos/rmsportal/TVYTbAXWheQpRcWDaDMu.svg');
        background-repeat: no-repeat;
        background-position: center 110px;
        background-size: 100%;
    }

    .content {
        padding: 32px 0 24px;
    }
}
</style>
