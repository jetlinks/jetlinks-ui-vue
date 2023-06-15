<template>
    <div>
        <j-spin :spinning="loading" :delay="500">
            <div class="container">
                <div class="left">
                    <img
                        style="width: 100%; height: 100%"
                        :src="basis.backgroud || getImage('/login.png')"
                    />
                    <a
                        href="https://beian.miit.gov.cn/#/Integrated/index"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="records"
                    >
                        备案：渝ICP备19017719号-1
                    </a>
                </div>
                <div class="right">
                    <div class="content">
                        <div class="top">
                            <div class="header">
                                <!-- <link to="/"> -->
                                <img
                                    alt="logo"
                                    class="logo"
                                    :src="basis.logo || getImage('/logo.png')"
                                />
                                <!-- </link> -->
                            </div>
                            <div class="desc">
                                {{ basis.title || SystemConst.SYSTEM_NAME }}
                            </div>
                            <div class="main">
                                <j-form
                                    layout="vertical"
                                    :model="form"
                                    class="login-form"
                                    @finish="onFinish"
                                    :rules='rules'
                                >
                                    <j-form-item
                                        label="账号"
                                        name="username"
                                    >
                                        <j-input
                                            v-model:value="form.username"
                                            placeholder="请输入账号"
                                            :maxlength="64"
                                        ></j-input>
                                    </j-form-item>
                                    <j-form-item
                                        label="密码"
                                        name="password"
                                    >
                                        <j-input-password
                                            v-model:value="form.password"
                                            placeholder="请输入密码"
                                            :maxlength="64"
                                        ></j-input-password>
                                    </j-form-item>
                                    <j-form-item
                                        v-if="codeConfig"
                                        class="verifyCode"
                                        label="验证码"
                                        name="verifyCode"
                                    >
                                        <j-input
                                            v-model:value="form.verifyCode"
                                            autocomplete="off"
                                            :maxlength="64"
                                            placeholder="请输入验证码"
                                        >
                                            <template #addonAfter>
                                                <div>
                                                    <img
                                                        :src="codeUrl"
                                                        @click="getCode()"
                                                    />
                                                </div>
                                            </template>
                                        </j-input>
                                    </j-form-item>
                                    <j-form-item
                                        name="remember"
                                        style="text-align: left"
                                    >
                                        <j-checkbox
                                            v-model:checked="form.remember"
                                            @change="
                                                () =>
                                                    (form.expires =
                                                        form.remember
                                                            ? -1
                                                            : 3600000)
                                            "
                                            >记住我</j-checkbox
                                        >
                                    </j-form-item>
                                    <j-form-item>
                                        <j-button
                                            :loading="loading"
                                            type="primary"
                                            html-type="submit"
                                            class="login-form-button"
                                            block
                                        >
                                            登录
                                        </j-button>
                                    </j-form-item>
                                </j-form>
                                <div class="other">
                                    <j-divider plain>
                                        <div class="other-text">
                                            其他登录方式
                                        </div>
                                    </j-divider>
                                    <div class="other-button">
                                        <div
                                          class='other-button-item'
                                          v-for="(item, index) in bindings"
                                          :key="index"
                                          @click="handleClickOther(item)"
                                        >
                                          <img
                                            style="width: 32px; height: 32px"
                                            :alt="item.name"
                                            :src="
                                                    item.logoUrl || iconMap.get(
                                                        item.provider,
                                                    ) || defaultImg
                                                "
                                          />
                                        </div>
                                    </div>
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
        </j-spin>
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
  settingDetail, userDetail
} from '@/api/login'
import { useUserInfo } from '@/store/userInfo';
import { useSystem } from '@/store/system'
import { LocalStore } from '@/utils/comm';
import { BASE_API_PATH, TOKEN_KEY, Version_Code } from '@/utils/variable';
import { SystemConst } from '@/utils/consts';

const store = useUserInfo();
const systemStore = useSystem();
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

const rules = {
  username: [
    {
      validator(_: any, value: string) {
        if (!value) {
          return Promise.reject('请输入账号!')
        }
        return Promise.resolve()
      }
    }
  ],
  password: [
    {
      validator(_: any, value: string) {
        if (!value) {
          return Promise.reject('请输入密码!')
        }
        return Promise.resolve()
      }
    }
  ],
  verifyCode: [
    {
      validator(_: any, value: string) {
        if (!value) {
          return Promise.reject('请输入验证码!')
        }
        return Promise.resolve()
      }
    }
  ]
}

const codeUrl = ref('');
const codeConfig = ref(false);

const loading = ref(false);
const bindings = ref<any[]>();
// const basis = ref<any>({});

const defaultImg = getImage('/apply/provider1.png');
const iconMap = new Map();
iconMap.set('dingtalk-ent-app', getImage('/bind/dingtalk.png'));
iconMap.set('wechat-webapp', getImage('/bind/wechat-webapp.png'));
iconMap.set('internal-standalone', getImage('/apply/provider1.png'));
iconMap.set('third-party', getImage('/apply/provider5.png'));

const onFinish = async () => {
    try {
        loading.value = true;
        const res: any = await authLogin(form);
        loading.value = false;
        if (res.success) {
          LocalStore.set(TOKEN_KEY, res?.result.token);
          const userResp = await userDetail()
          if (userResp.success) {
            store.$patch({
              userInfos: {
                ...userResp.result,
                token: res?.result.token,
              },
              isAdmin: userResp.username === "admin",
            });

            if (userResp.result?.username === 'admin') {
              const resp: any = await getInitSet();
              if (resp.status === 200 && !resp.result.length) {
                // window.location.href = '/#/init-home';
                router.push('/init-home')
                return;
              }
            }
          } else {
            store.$patch({
              ...res.result
            });
          }
            // window.location.href = '/';
          router.push('/')
        }
    } catch (error) {
        form.verifyCode = '';
        getCode();
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


const getOpen = () => {
    LocalStore.removeAll();
    systemVersion().then((res: any) => {
        if (res.success && res.result) {
            LocalStore.set(Version_Code, res.result.edition);
            if (res.result.edition !== 'community') {
                bindInfo().then((res: any) => {
                    if (res.success) {
                        bindings.value = res.result;
                    }
                });
            }
        }
    });
    systemStore.getFront()
};

const basis = computed(() => {
  return systemStore.configInfo['front'] || {}
})
const handleClickOther = (item: any) => {
    LocalStore.set('onLogin', 'no');
    window.open(`${BASE_API_PATH}/application/sso/${item.id}/login`);
    window.onstorage = (e) => {
        if (e.newValue) {
            window.location.href = '/';
        }
    };
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
screenRotation(screenWidth.value, screenHeight.value);
</script>

<style scoped lang="less">
.container {
    display: flex;
    height: 100vh;
    overflow: auto;
    background: @layout-body-background;

    .left {
        width: 73%;
        height: 100%;

        .records {
            position: absolute;
            top: 96%;
            left: 35%;
            color: rgba(0, 0, 0, 0.35);
            font-size: 14px;
        }
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

        .content {
            display: flex;
            flex-direction: row-reverse;
            justify-content: center;
            padding: 0 0 15% 0;
            margin-top: 20%;

            .top {
                width: 100%;
                // text-align: center;

                .header {
                    height: 44px;
                    line-height: 44px;
                    text-align: center;

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
                    text-align: center;
                }

                .main {
                    width: 70%;
                    margin: 60px auto 0;

                    @media screen and (max-width: @screen-sm) {
                        width: 95%;
                        max-width: 328px;
                    }

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
                        margin-top: 20px;

                        .other-text {
                            color: #807676d9;
                            font-size: 12px;
                        }

                        .other-button {
                            position: relative;
                            bottom: 10px;
                            text-align: center;
                            display: flex;
                            gap: 24px;
                            justify-content: center;
                            flex-wrap: wrap;

                            .other-button-item {
                              cursor: pointer;
                              padding: 4px;
                            }

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

                    .verifyCode {
                        img {
                            cursor: pointer;
                            // vertical-align: middle;
                        }
                    }

                  .login-form-button {
                    width: 100%;
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
        padding: 32px 0 24px !important;
        margin-top: 12% !important;
    }
}
</style>
