<!-- 第三方账户绑定 -->
<template>
  <div class='page-container'>
    <div class='content-bind'>
      <div class='title'>{{ $t('bind.index.350992-0') }}</div>
      <!-- 已登录-绑定三方账号 -->
      <template v-if='!!token'>
        <div class='info'>
          <div class='info-body'>
            <a-avatar
              :size="86"
              :src="
                    user?.avatar ||
                    getImage('/bind/jetlinksLogo.png')
                "
              style="margin-bottom: 16px;"
            />
            <div class="info-body-item"><span>{{ $t('bind.index.350992-1') }}</span>
              <j-ellipsis :lineClamp="2">{{ user?.username || '-' }}</j-ellipsis>
            </div>
            <div class="info-body-item"><span>{{ $t('bind.index.350992-2') }}</span>
              <j-ellipsis :lineClamp="2">{{ user?.name || "-" }}</j-ellipsis>
            </div>
          </div>
          <img :src="getImage('/bind/Vector.png')"/>
          <div class='info-body'>
            <a-avatar
              :size="86"
              :src="
                bindUser.result?.avatar ||
                    iconMap.get(
                        bindUser?.applicationProvider,
                    ) || getImage('/apply/internal-standalone.png')
                "
              shape="square"
              style="margin-bottom: 16px;"
            />
            <div class="info-body-item"><span>{{ $t('bind.index.350992-1') }}</span>
              <j-ellipsis :lineClamp="2">{{ bindUser?.result?.userId || '' }}</j-ellipsis>
            </div>
            <div class="info-body-item"><span>{{ $t('bind.index.350992-2') }}</span>
              <j-ellipsis :lineClamp="2">{{ bindUser?.result?.name || '' }}</j-ellipsis>
            </div>
          </div>
        </div>
        <div class='btn'>
          <a-button type='primary' @click='handleBind'
          >{{ $t('bind.index.350992-3') }}
          </a-button
          >
        </div>
      </template>
      <!-- 未登录-绑定三方账号 -->
      <template v-else>
        <div class='not-login'>
          <div class='logo'>
            <img :src="getImage('/bind/jetlinksLogo.png')"/>
            <img
              :src="getImage('/bind/Vector.png')"
              class='arrow'
            />
            <img
              :src='bindUser?.avatar || iconMap.get(bindUser?.applicationProvider)'
            />
          </div>
          <div class='desc'>
            {{ $t('bind.index.350992-4') }}
            {{ bindUser?.appName }}
            {{ $t('bind.index.350992-5') }}
          </div>
          <div class='login-form'>
            <a-form layout='vertical'>
              <a-form-item
                :label="$t('bind.index.350992-6')"
                v-bind='validateInfos.username'
              >
                <a-input
                  v-model:value='formData.username'
                  :placeholder="$t('bind.index.350992-7')"
                />
              </a-form-item>
              <a-form-item
                :label="$t('bind.index.350992-8')"
                v-bind='validateInfos.password'
              >
                <a-input-password
                  v-model:value='formData.password'
                  :placeholder="$t('bind.index.350992-9')"
                />
              </a-form-item>
              <template v-if='captcha.base64'>
                <a-form-item
                  :rules="[
                    {
                        required: true,
                        message: $t('bind.index.350992-10'),
                    },
                ]"
                  :label="$t('bind.index.350992-11')"
                  v-bind='validateInfos.verifyCode'
                >
                  <a-input
                    v-model:value='formData.verifyCode'
                    :placeholder="$t('bind.index.350992-10')"
                  >
                    <template #addonAfter>
                      <img
                        :src='captcha.base64'
                        style='cursor: pointer'
                        @click='getCode'
                      />
                    </template>
                  </a-input>
                </a-form-item>

              </template>
              <a-form-item>
                <a-button
                  style='width: 100%'
                  type='primary'
                  @click='handleLoginBind'
                >
                  {{ $t('bind.index.350992-12') }}
                </a-button>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang='ts' name='AccountBind' setup>
import { onlyMessage, LocalStore, getImage, encrypt } from "@jetlinks-web/utils";
import { TOKEN_KEY } from '@jetlinks-web/constants'
import { Form } from 'ant-design-vue'

import { applicationInfo, bindAccount } from '@/api/system/bind'
import { codeUrl, authLogin, userDetail, encryptionConfig } from '@/api/login'
import { useSystemStore } from '@/store/system'
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();

const useForm = Form.useForm;
const systemStore = useSystemStore();

interface formData {
  username: string;
  password: string;
  verifyCode: string;
}

const iconMap = new Map()
iconMap.set('dingtalk-ent-app', getImage('/notice/dingtalk.png'))
iconMap.set('wechat-webapp', getImage('/notice/wechat.png'))
iconMap.set('internal-standalone', getImage('/apply/internal-standalone.png'))
iconMap.set('third-party', getImage('/apply/third-party.png'))

const token = computed(() => LocalStore.get(TOKEN_KEY))

/**
 * 用户信息
 */
const user = ref()
const getDetail = () => {
  if (!token.value) return
  userDetail().then((res: any) => {
    user.value = res?.result
  })
}


/**
 * 获取url参数
 */
const getUrlCode = () => {
  const url = new URLSearchParams(window.location.href)
  return url.get('code') as string
}

/**
 * 三方应用信息
 */
const bindUser = ref<any>({appName: ''})
const getAppInfo = async () => {
  const code = getUrlCode()
  const {result, success} = await applicationInfo(code)
  bindUser.value = result || {}

  if (success) {
    if (result?.applicationProvider === 'dingtalk-ent-app') {
      bindUser.value.appName = $t('bind.index.350992-13')
    } else if (result?.applicationProvider === 'wechat-webapp') {
      bindUser.value.appName = $t('bind.index.350992-14')
    } else {
      bindUser.value.appName = result?.applicationName
    }
  }
}


/**
 * 立即绑定
 */
const handleBind = async () => {
  const code = getUrlCode()
  const res = await bindAccount(code)
  console.log('bindAccount: ', res)
  onlyMessage($t('bind.index.350992-15'))
  goRedirect()
  setTimeout(() => window.close(), 1000)
}

// 未登录-先登录再绑定
const formData = ref<formData>({
  username: '',
  password: '',
  verifyCode: ''
})
const formRules = ref({
  username: [
    {
      required: true,
      message: $t('bind.index.350992-7')
    }
  ],
  password: [
    {
      required: true,
      message: $t('bind.index.350992-9')
    }
  ]
})

const {resetFields, validate, validateInfos} = useForm(
  formData.value,
  formRules.value
)

/**
 * 获取图形验证码
 */
const captcha = ref({
  base64: '',
  key: ''
})
const getCode = async () => {
  const res: any = await codeUrl()
  captcha.value.base64 = res.result?.base64
  captcha.value.key = res.result?.key
}

const RsaConfig = reactive<any>({
  enabled: false, //是否加密
  publicKey: '', //rsa公钥,使用此公钥对密码进行加密
  id: '' //密钥ID
})
/**
 * 登录并绑定账户
 */
const handleLoginBind = () => {
  validate()
    .then(async () => {
      const code = getUrlCode()
      const params: any = {
        ...formData.value,
        bindCode: code,
        expires: 3600000
      }
      const resq: any = await encryptionConfig()
      if (resq.status === 200) {
        if (resq.result?.encrypt) {
          RsaConfig.enabled = resq.result?.encrypt.enabled
          RsaConfig.publicKey = resq.result?.encrypt.publicKey
          RsaConfig.id = resq.result?.encrypt.id
        }
      }
      if (captcha.value.base64) {
        params.verifyKey = captcha.value.key
      } else {
        delete params.verifyCode
      }
      const data = {
        ...params,
        password: RsaConfig.enabled ? encrypt(params.password, RsaConfig.publicKey) : params.password,
        encryptId: RsaConfig.enabled ? RsaConfig.id : undefined
      }
      const res = await authLogin(data)
      console.log('res: ', res)
      if (res.success) {
        onlyMessage($t('bind.index.350992-16'))
        LocalStore.set(TOKEN_KEY, res.result!.token as string)
        goRedirect()
      }
    })
    .catch((err) => {
      console.log(err)
      getCode()
    })
}


const getQueryVariable = (): Map<string, string> => {
  const index = window.location.href.indexOf('?')
  const paramsUrl = window.location.href.substr(index + 1)
  const paramsArr = paramsUrl.split('#')?.[0] || ''

  const vars = paramsArr.split('&');
  const maps = new Map()
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    const [key, value] = pair
    maps.set(key, value)
  }
  return maps;
}
/**
 * 绑定成功跳转至页面url的: redirect
 */
const goRedirect = () => {
  const urlParams = getQueryVariable();
  const redirectUrl =
    urlParams.get('redirect') ||
    window.location.href.split('redirect=')?.[1]
  console.log('redirectUrl: ', redirectUrl)
  //内部集成需要跳回它们页面
  if (redirectUrl && redirectUrl.indexOf('account/center/bind') === -1) {
    window.location.href = decodeURIComponent(redirectUrl)
  } else {
    window.location.href = '/'
    setTimeout(() => window.close(), 1000)
  }
}

onMounted(() => {
  getAppInfo()
  getCode()
  getDetail()
  systemStore.getFront()
})

</script>

<style lang='less' scoped>
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

  .content-bind {
    box-sizing: border-box;
    width: 928px;
    min-height: 510px;
    background: #fff;
    border-radius: 22px;
    padding: 40px;

    .title {
      margin-bottom: 30px;
      color: #333333;
      font-weight: 400;
      font-size: 22px;
      font-family: 'PingFang SC';
      font-style: normal;
      line-height: 25px;
      text-align: center;
    }

    // 已登录-绑定三方账号
    .info {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 86px 0;

      img {
        width: 69px;
      }

      &-body {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 8px;
        width: 317px;

        &-item {
          display: flex;
          color: #333333;

          span {
            color: #666666;
            white-space: nowrap;
          }
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
