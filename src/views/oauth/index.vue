<template>
  <div class='oauth-warp'>
    <j-spin :spinning='spinning'>
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
                  <h2>授权登录</h2>
                  <div class='oauth-content-content'>
                    <div class='oauth-content-content-text'>
                      您正在授权登录, {{ appName }} 将获得以下权限:
                    </div>
                    <ul>
                      <li>关联{{userName}}账号</li>
                      <li>获取您的个人信息</li>
                    </ul>
                    <div class='oauth-content-button'>
                      <j-button type='primary' @click='() => goOAuth2Fn()'> 同意授权 </j-button>
                      <j-button type='primary' @click='changeAccount'> 切换账号 </j-button>
                    </div>
                  </div>
                </template>
                <template v-else>
                  <div class='oauth-content-header'>
                    <img :src='headerImg' />
                  </div>
                  <h2>授权登录</h2>
                  <div class='oauth-content-login'>
                    <j-form layout='vertical' :model='formModel' ref='formRef' >
                      <j-form-item label='用户名' name='username' required :rules='[{ required: true, message: "请输入用户名"}]'>
                        <j-input placeholder='用户名' v-model:value='formModel.username' />
                      </j-form-item>
                      <j-form-item label='密码' name='password' required :rules='[{ required: true, message: "请输入密码"}]'>
                        <j-input-password placeholder='密码' v-model:value='formModel.password' />
                      </j-form-item>
                      <j-form-item name='verifyCode' v-if='captcha.base64' required :rules='[{ required: true, message: "请输入验证码"}]'>
                        <j-input placeholder='请输入验证码' v-model:value='formModel.verifyCode' >
                          <template #addonAfter>
                            <img
                              :src='captcha.base64'
                              @click='getCode'
                              style='cursor: pointer'
                            />
                          </template>
                        </j-input>
                      </j-form-item>
                      <j-form-item>
                        <j-button
                          type='primary'
                          @click='doLogin'
                          style='width: 100%'
                        >
                          登录
                        </j-button>
                      </j-form-item>
                    </j-form>
                  </div>
                </template>
              </div>
            </div>
    </j-spin>

  </div>
</template>

<script setup lang='ts' name='Oauth'>
import { TOKEN_KEY } from '@/utils/variable'
import { config, code, getOAuth2, initApplication, authLogin, settingDetail } from '@/api/login'
import { getMe_api } from '@/api/home'
import { getImage, getToken } from '@/utils/comm'
import Config from '../../../config/config'

const spinning = ref(true)
const isLogin = ref(false)
const logoImg = ref('')
const headerImg = ref('')
const appName = ref('-')
const userName = ref('-')
const internal = ref('false')
const params = ref()

document.title = `OAuth授权-${Config.title}`;
headerImg.value = getImage(Config.layout.logo)

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
  const resp = await config()
  if (resp.result?.enabled) {
    const codeResp = await code()
    if (codeResp.success) {
      captcha.base64 = codeResp.result?.base64
      captcha.key = codeResp.result?.key
    }
  }
}

const goOAuth2Fn = async (data?: any) => {
  console.log(data, params.value)
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
    if (res.success) {
      userName.value = res.result?.user.name
      isLogin.value = true
      getApplication(data.client_id || params.value.client_id)
      if (data.internal === 'true' || internal.value === 'true') { // 是否走oauth2
        goOAuth2Fn(data)
      }
    } else if (res.status === 401) {
      setTimeout(() => {
        spinning.value = false
      })
      getCode()
      getApplication(data.client_id || params.value.client_id)
    } else {
      setTimeout(() => {
        spinning.value = false
      })
    }
  } else {
    getApplication(data.client_id || params.value.client_id)
    setTimeout(() => {
      spinning.value = false
    })
  }
}

const getQueryVariable = (variable: any) => {
  const query = window.location.search.substring(1);
  const vars = query.split('&');
  for (let i = 0; i < vars.length; i++) {
    const pair = vars[i].split('=');
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return '';
}

const doLogin = () => {
  formRef.value.validate().then( async data => {
    const res = await authLogin({
      verifyKey: captcha.key,
      ...formModel
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
  const items = {
    client_id: getQueryVariable('client_id'),
    state: getQueryVariable('state'),
    redirect_uri: decodeURIComponent(getQueryVariable('redirect_uri')),
    response_type: getQueryVariable('response_type'),
    scope: getQueryVariable('scope'),
  }
  const item = getQueryVariable('internal');
  if (items.redirect_uri) {
    const origin = items.redirect_uri.split('/').slice(0, 3)
    const url = `${origin.join('/')}${items.redirect_uri?.split('redirect=')[1]}`
    // redirectUrl = `${items.redirect_uri?.split('redirect_uri=')[0]}?redirect=${url}`
    redirectUrl = items.redirect_uri
  }
  // 获取用户信息
  getLoginUser({
    ...items,
    internal: getQueryVariable('internal'),
    redirect_uri: redirectUrl,
  })

  internal.value = item
  params.value = {
    ...items,
    redirect_uri: redirectUrl,
  }
}

const getSettingDetail = () => {
  settingDetail('front').then((res: any) => {
    if (res.status === 200) {
      const ico: any = document.querySelector('link[rel="icon"]');
      ico.href = res.result.ico;
      headerImg.value = res.result.logo
      if (res.result.title) {
        document.title = `OAuth授权-${res.result.title}`;
      } else {
        document.title = 'OAuth授权';
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