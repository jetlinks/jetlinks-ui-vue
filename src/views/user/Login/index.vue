<template>
    <div>
        <j-spin :spinning="loading" :delay="500">
            <div class="container">
                <div class="left">
                    <img
                        style="width: 100%; height: 100%"
                        :src="basis.background || getImage('/login.png')"
                    />
                    <a
                        v-if="basis.showRecordNumber"
                        href="https://beian.miit.gov.cn/#/Integrated/index"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="records"
                    >
                        {{ $t('Login.index.265048-0') }}{{ basis.recordNumber }}
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
                                    :rules="rules"
                                >
                                    <j-form-item
                                        :label="$t('Login.index.265048-2')"
                                        name="username"
                                    >
                                        <j-input
                                            v-model:value="form.username"
                                            :placeholder="
                                                $t('Login.index.265048-3')
                                            "
                                            :maxlength="64"
                                        ></j-input>
                                    </j-form-item>
                                    <j-form-item
                                        :label="$t('Login.index.265048-4')"
                                        name="password"
                                    >
                                        <j-input-password
                                            v-model:value="form.password"
                                            :placeholder="
                                                $t('Login.index.265048-5')
                                            "
                                            :maxlength="64"
                                        ></j-input-password>
                                    </j-form-item>
                                    <j-form-item
                                        v-if="codeConfig"
                                        class="verifyCode"
                                        :label="$t('Login.index.265048-6')"
                                        name="verifyCode"
                                    >
                                        <j-input
                                            v-model:value="form.verifyCode"
                                            autocomplete="off"
                                            :maxlength="64"
                                            :placeholder="
                                                $t('Login.index.265048-7')
                                            "
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
                                            >{{ $t('Login.index.265048-8') }}
                                        </j-checkbox>
                                    </j-form-item>
                                    <j-form-item>
                                        <j-button
                                            :loading="loading"
                                            type="primary"
                                            html-type="submit"
                                            class="login-form-button"
                                            block
                                        >
                                            {{ $t('Login.index.265048-9') }}
                                        </j-button>
                                    </j-form-item>
                                </j-form>
                                <div class="other" v-if="bindings.length">
                                    <j-divider plain>
                                        <div class="other-text">
                                            {{ $t('Login.index.265048-10') }}
                                        </div>
                                    </j-divider>
                                    <div class="other-button">
                                        <div
                                            class="other-button-item"
                                            v-for="(
                                                item, index
                                            ) in bindings.slice(0, 4)"
                                            :key="index"
                                            @click="handleClickOther(item)"
                                        >
                                            <img
                                                style="
                                                    width: 32px;
                                                    height: 32px;
                                                "
                                                :alt="item.name"
                                                :src="
                                                    item.logoUrl ||
                                                    iconMap.get(
                                                        item.provider,
                                                    ) ||
                                                    defaultImg
                                                "
                                            />
                                        </div>
                                        <j-popover
                                            trigger="click"
                                            v-model:visible="moreVisible"
                                            placement="bottomRight"
                                        >
                                            <template #content>
                                                <j-scrollbar :max-height="120">
                                                    <div class="more-button">
                                                        <div
                                                            class="more-button-item"
                                                            v-for="(
                                                                item, index
                                                            ) in bindings.slice(
                                                                4,
                                                                bindings.length -
                                                                    1,
                                                            )"
                                                            :key="index"
                                                            @click="
                                                                handleClickOther(
                                                                    item,
                                                                )
                                                            "
                                                        >
                                                            <img
                                                                style="
                                                                    width: 32px;
                                                                    height: 32px;
                                                                "
                                                                :alt="item.name"
                                                                :src="
                                                                    item.logoUrl
                                                                "
                                                            />
                                                            <Ellipsis
                                                                style="
                                                                    margin-top: 5px;
                                                                    width: calc(
                                                                        100%
                                                                    );
                                                                    margin: 0
                                                                        auto;
                                                                "
                                                            >
                                                                {{ item.name }}
                                                            </Ellipsis>
                                                        </div>
                                                    </div>
                                                </j-scrollbar>
                                            </template>
                                            <div
                                                v-if="bindings.length > 4"
                                                class="more"
                                            >
                                                <AIcon
                                                    class="moreIcon"
                                                    type="MoreOutlined"
                                                    style="font-size: 20px"
                                                ></AIcon>
                                            </div>
                                        </j-popover>
                                    </div>
                                    <!-- <div class="more" v-if="bindings.length > 4" @click="moreVisible = true">
                      查看更多
                  </div> -->
                                </div>
                            </div>
                        </div>
                    </div>
                    <div v-if="basis.recommend === 'true'" class="bottom">
                        <div class="view">
                            {{ $t('Login.index.265048-11') }}
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
                                {{ $t('Login.index.265048-12') }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </j-spin>
    </div>
    <!-- <j-modal
      title="更多登录"
      :visible="moreVisible"
      @cancel="() => (moreVisible = false)"
      :footer="null"
      :width="800"
  >
      <div class="more-button">
          <div
              class="more-button-item"
              v-for="(item, index) in bindings"
              :key="index"
              @click="handleClickOther(item)"
          >
              <img
                  style="width: 100px; height: 100px"
                  :alt="item.name"
                  :src="item.logoUrl"
              />
              <Ellipsis
                  style="
                      margin-top: 5px;
                      width: calc(100% - 40px);
                      margin: 0 auto;
                  "
              >
                  {{ item.name }}
              </Ellipsis>
          </div>
      </div>
  </j-modal> -->
</template>

<script setup lang="ts">
import { getImage, LocalStore } from '@/utils/comm';
import {
    authLogin,
    authLoginConfig,
    bindInfo,
    code,
    config,
    getInitSet,
    systemVersion,
    userDetail,
} from '@/api/login';
import { useUserInfo } from '@/store/userInfo';
import { useSystem } from '@/store/system';
import { BASE_API_PATH, TOKEN_KEY, Version_Code } from '@/utils/variable';
import { SystemConst } from '@/utils/consts';
import { encrypt } from '@/utils/encrypt';
import { closeWs } from '@/utils/websocket';
import { defaultImg, iconMap } from './utils';
import { useRequest } from '@/hook';
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const store = useUserInfo();
const systemStore = useSystem();
const router = useRouter();
const bgImage = getImage('/logo.png');
const viewLogo = getImage('/view-logo.png');

const LoginWarpStyle = reactive({
    backgroundImage: `url(${bgImage})`,
});
const moreVisible = ref(false);
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

const RsaConfig = reactive<any>({
    enabled: false, //是否加密
    publicKey: '', //rsa公钥,使用此公钥对密码进行加密
    id: '', //密钥ID
});

const codeUrl = ref('');
const codeConfig = ref(false);

const bindings = ref<any[]>([]);

let timer: any = null;
let encryptionTimer: any = null;

const rules = {
    username: [
        {
            validator(_: any, value: string) {
                if (!value) {
                    return Promise.reject($t('Login.index.265048-13'));
                }
                return Promise.resolve();
            },
        },
    ],
    password: [
        {
            validator(_: any, value: string) {
                if (!value) {
                    return Promise.reject($t('Login.index.265048-14'));
                }
                return Promise.resolve();
            },
        },
    ],
    verifyCode: [
        {
            validator(_: any, value: string) {
                if (!value) {
                    return Promise.reject($t('Login.index.265048-15'));
                }
                return Promise.resolve();
            },
        },
    ],
};

const { loading, run: loginFn } = useRequest(authLogin, {
    immediate: false,
    onSuccess: async (resp) => {
        LocalStore.set(TOKEN_KEY, resp.result.token);
        const userResp = await userDetail();

        removeTimer();
        if (userResp.success) {
            const isAdmin = userResp.result.username === 'admin';
            store.$patch({
                userInfos: {
                    ...userResp.result,
                    token: resp.result.token,
                    isAdmin: userResp.result.username === 'admin',
                },
            });
            if (isAdmin) {
                const initResp = await getInitSet();
                if (initResp.success && !initResp.result?.length) {
                    window.location.href = '/#/init-home';
                    return;
                }
            }
        } else {
            store.$patch({
                ...resp.result,
            });
        }
        window.location.href = '/';
    },
    onError() {
        form.verifyCode = '';
        getCode();
        getRsa();
    },
});
// const basis = ref<any>({});

const onFinish = async () => {
    let passwordConfig = {};

    if (RsaConfig.enabled) {
        passwordConfig = {
            password: encrypt(form.password, RsaConfig.publicKey),
            encryptId: RsaConfig.id,
        };
    }

    loginFn({
        ...form,
        ...passwordConfig,
    });
};

const removeTimer = () => {
    if (timer) {
        window.clearTimeout(timer);
        timer = null;
    }
};

const removeEncryptionTimer = () =>{
  if (encryptionTimer) {
        window.clearTimeout(encryptionTimer);
        encryptionTimer = null;
    }
}

const getCode = async () => {
    const configRes: any = await config();
    if (!configRes.success || (configRes.success && !configRes.result.enabled))
        return;

    codeConfig.value = true;
    const res: any = await code();
    if (res.success) {
        codeUrl.value = res.result.base64;
        form.verifyKey = res.result.key;

        removeTimer();
        timer = setTimeout(() => {
            getCode();
        }, 5 * 60 * 1000);
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
    systemStore.getFront();
};

//获取加密信息
const getRsa = async () => {
    const res: any = await authLoginConfig();
    if (res.status === 200) {
        if (res.result?.encrypt) {
            RsaConfig.enabled = res.result?.encrypt.enabled;
            RsaConfig.publicKey = res.result?.encrypt.publicKey;
            RsaConfig.id = res.result?.encrypt.id;
            removeEncryptionTimer();
            encryptionTimer = setTimeout(() => {
              getRsa();
            }, 5 * 60 * 1000);
        }
    }
};

const basis: any = computed(() => {
    return systemStore.configInfo['front'] || {};
});
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

closeWs();
onMounted(() => {
    getRsa();
});
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

                        .more {
                            cursor: pointer;

                            .moreIcon {
                                transform: translateY(50%);
                            }
                        }

                        .more {
                            text-align: center;
                            cursor: pointer;
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

.more-button {
    display: flex;
    flex-wrap: wrap;
    cursor: pointer;
    overflow: auto;
    width: 300px;

    .more-button-item {
        width: 62px;
        text-align: center;
        margin-bottom: 10px;
        margin-left: 12px;
    }
}
</style>
