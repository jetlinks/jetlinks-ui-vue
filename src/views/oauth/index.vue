<template>
  <div class='oauth-warp'>
    <a-spin :spinning='spinning'>
            <div class='oauth' v-if='!spinning'>
              <div class='oauth-header'>
                <div class='oauth-header-left'>
                  <img :src='logoImg' alt=''>
                </div>
              </div>

              <div class='oauth-content'>
                <!--     登录     -->
                <template v-if='isLogin'>
                  <div class='oauth-content-header'>
                    <img :src='headerImg' />
                  </div>
                  <h2>{{ $t("auth.index.559799-0") }}</h2>
                  <div class='oauth-content-content'>
                    <div class='oauth-content-content-text'>
                      {{ $t("auth.index.559799-1", [appName]) }}
                    </div>
                    <ul>
                      <li>{{ $t("auth.index.559799-2", [userName]) }}</li>
                      <li>{{ $t("auth.index.559799-3") }}</li>
                    </ul>
                    <div class='oauth-content-button'>
                      <a-button type='primary' @click='() => goOAuth2Fn()'> {{ $t("auth.index.559799-4") }} </a-button>
                      <a-button type='primary' @click='changeAccount'> {{ $t("auth.index.559799-5") }} </a-button>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class='oauth-content-header'>
                    <img :src='headerImg' />
                  </div>
                  <h2>{{ $t("auth.index.559799-0") }}</h2>
                  <div class='oauth-content-login'>
                    <a-form layout='vertical' :model='formModel' ref='formRef' >
                      <a-form-item :label='$t("EditInfo.index.557023-5")' name='username' required :rules='[{ required: true, message: $t("EditInfo.index.557023-6")}]'>
                        <a-input :placeholder='$t("EditInfo.index.557023-5")' v-model:value='formModel.username' />
                      </a-form-item>
                      <a-form-item :label='$t("login.right.419974-2")' name='password' required :rules='[{ required: true, message: $t("login.right.419974-3")}]'>
                        <a-input-password :placeholder='$t("login.right.419974-2")' v-model:value='formModel.password' />
                      </a-form-item>
                      <a-form-item name='verifyCode' v-if='captcha.base64' required :rules='[{ required: true, message: $t("login.right.419974-5")}]'>
                        <a-input :placeholder='$t("login.right.419974-4")' v-model:value='formModel.verifyCode' >
                          <template #addonAfter>
                            <img
                              :src='captcha.base64'
                              @click='getCode'
                              style='cursor: pointer'
                            />
                          </template>
                        </a-input>
                      </a-form-item>
                      <a-form-item>
                        <a-button
                          type='primary'
                          @click='doLogin'
                          style='width: 100%'
                        >
                          {{ $t('login.right.419974-6') }}
                        </a-button>
                      </a-form-item>
                    </a-form>
                  </div>
                </template>
              </div>
            </div>
    </a-spin>
  </div>
</template>

<script setup lang='ts' name='Oauth'>
import { TOKEN_KEY } from '@jetlinks-web/constants'
import { captchaConfig, codeUrl, getOAuth2, initApplication, authLogin, encryptionConfig } from '@/api/login'
import { settingDetail } from '@/api/system/basis'
import { getMe_api } from '@/api/auth'
import { getImage, getToken, encrypt } from '@jetlinks-web/utils'
import { ref, reactive } from 'vue'
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

const spinning = ref(true)
const isLogin = ref(false)
const logoImg = ref('')
const headerImg = ref('')
const appName = ref('-')
const userName = ref('-')
const internal = ref('false')
const params = ref()

document.title = $t('auth.index.559799-6', 'Jetlinks');
headerImg.value = getImage('/logo.png')

type LoginParam = {
  username: string;
  password: string;
  expires?: number;
  verifyCode?: string;
  verifyKey?: string;
};

const formModel = reactive({
  username: undefined,
  password: undefined,
  verifyCode: undefined
})

const captcha = reactive<{base64?: string, key?: string }>({
  base64: undefined,
  key: undefined
})

const formRef = ref()

const getApplication = async (clientId: string) => {
  const res = await initApplication(clientId)
  if (res.success && res.result) {
    appName.value = res.result.name
  }
}

/**
 * 获取验证码配置
 */
const getCode = async () => {
  const resp = await captchaConfig()
  if (resp.result?.enabled) {
    const codeResp = await codeUrl()
    if (codeResp.success) {
      captcha.base64 = codeResp.result?.base64
      captcha.key = codeResp.result?.key
    }
  }
}

const goOAuth2Fn = async (data?: any) => {
  const res = await getOAuth2(data || params.value)
  if (res.success) {
    window.location.href = res.result;
  } else {
    getCode()
  }
}

const changeAccount = () => {
  localStorage.removeItem(TOKEN_KEY);
  isLogin.value = false
}

const getLoginUser = async (data?: any) => {
  if (getToken()) { // 未登录
    const res = await getMe_api()
    console.log(params.value, data)
    if (res.success) {
      userName.value = res.result?.user?.name
      isLogin.value = true
      getApplication(data?.client_id || params.value.client_id)
      // if (data?.internal === 'true' || internal.value === 'true') { // 是否走oauth2
        goOAuth2Fn(data)
      // }
    } else if (res.status === 401) {
      setTimeout(() => {
        spinning.value = false
      })
      getCode()
      getApplication(data?.client_id || params.value.client_id)
    } else {
      setTimeout(() => {
        spinning.value = false
      })
    }
  } else {
    getApplication(data?.client_id || params.value.client_id)
    setTimeout(() => {
      spinning.value = false
    })
  }
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

const RsaConfig = reactive<any>({
    enabled:false, //是否加密
    publicKey:'', //rsa公钥,使用此公钥对密码进行加密
    id:'' //密钥ID
})

const doLogin = () => {
  formRef.value.validate().then( async data => {
    const resq:any = await encryptionConfig()
      if(resq.status === 200){
          if(resq.result?.encrypt){
              RsaConfig.enabled = resq.result?.encrypt.enabled
              RsaConfig.publicKey = resq.result?.encrypt.publicKey
              RsaConfig.id = resq.result?.encrypt.id
          }
      }
    const res:any = await authLogin({
      verifyKey: captcha.key,
      ...formModel,
      password:RsaConfig.enabled?encrypt(formModel.password,RsaConfig.publicKey):formModel.password,
      encryptId:RsaConfig.enabled?RsaConfig.id:undefined
    })
    if (res.success) {
      const token = res.result.token
      localStorage.setItem(TOKEN_KEY, token)
      getLoginUser()
      // goOAuth2Fn()
    } else {
      getCode()
    }
  })
}

const initPage = async () => {
  let redirectUrl
  // 获取url中的配置信息
  const paramsIndex = location.hash.indexOf('?')
  const _params = getQueryVariable()
  const items = {
    client_id: _params.get('client_id'),
    state: _params.get('state'),
    redirect_uri: decodeURIComponent(_params.get('redirect_uri')!),
    response_type: _params.get('response_type'),
    scope: _params.get('scope'),
  }
  const item = _params.get('internal');
  if (items.redirect_uri) {
    const origin = items.redirect_uri.split('/').slice(0, 3)
    const url = `${origin.join('/')}${items.redirect_uri?.split('redirect=')[1]}`
    // redirectUrl = `${items.redirect_uri?.split('redirect_uri=')[0]}?redirect=${url}`
    redirectUrl = items.redirect_uri
  }

  internal.value = item
  params.value = {
    ...items,
    redirect_uri: redirectUrl,
  }
  // 获取用户信息
  getLoginUser({
    ...items,
    internal: _params.get('internal'),
    redirect_uri: redirectUrl,
  })
}

const getSettingDetail = () => {
  settingDetail('front').then((res: any) => {
    if (res.success) {
      const ico: any = document.querySelector('link[rel="icon"]');
      ico.href = res.result.ico;
      headerImg.value = res.result.logo
      if (res.result.title) {
        document.title = $t('auth.index.559799-6', [res.result.title]);
      } else {
        document.title = $t('auth.index.559799-7');
      }
    }
  });
}

getSettingDetail()
getCode()
initPage()

</script>

<style scoped lang='less'>
.oauth-warp {
  height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.oauth {
  .oauth-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
    font-size: 26px;
    background-color: #fff;

    .oauth-header-left {
      margin-left: 10%;
    }

    .oauth-header-right {
      display: flex;
      width: 200px;
      margin-right: 10%;
      font-size: 14px;

      .oauth-header-right-text {
        color: rgb(0 0 0 / 70%);
      }

      // .oauth-header-right-connect {
      //     padding: 0 10px;
      // }
    }
  }

  .oauth-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    width: 370px;
    height: 380px;
    margin: 0 auto;
    margin-top: 5%;
    background: #fff;
    box-shadow: 0 5px 5px #d4d4d4;

    .oauth-content-header {
      width: 60px;
      height: 60px;

      img {
        width: 100%;
        height: 100%;
      }
    }

    .oauth-content-content {
      height: 150px;
      .oauth-content-content-text {
        margin: 15px 15px;
        font-size: 16px;
        line-height: 22px;
      }

      ul {
        color: #00000085;
        list-style: inherit;
        li {
          padding-top: 10px;
        }
      }
    }

    .oauth-content-button {
      display: flex;
      justify-content: center;
      width: 100%;
      gap: 24px;
    }
    .oauth-content-login {
      width: 100%;
      padding: 0 24px;
    }
  }
}

</style>
