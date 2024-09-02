<template>
  <div class="content">
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" :src="logo || logoImage" />
        <p class="desc">{{ title }}</p>
      </div>
      <div class="main">
        <a-form
          layout="vertical"
          :model="formData"
          :rules="rules"
          @finish="submit"
        >
          <a-form-item label="账号" name="username">
            <a-input
              v-model:value="formData.username"
              placeholder="请输入账号"
              :maxlength="64"
              autocomplete="off"
            />
          </a-form-item>
          <a-form-item label="密码" name="password">
            <a-input-password
              v-model:value="formData.password"
              placeholder="请输入密码"
              :maxlength="64"
              autocomplete="off"
            />
          </a-form-item>
          <a-form-item v-if="showCode" label="验证码" name="verifyCode">
            <a-input
              v-model:value="formData.verifyCode"
              autocomplete="off"
              :maxlength="64"
              placeholder="请输入验证码"
            >
              <template #addonAfter>
                <img :src="url.base64" @click="getCode" />
              </template>
            </a-input>
          </a-form-item>
          <a-form-item>
            <Remember
              v-model:value="formData.remember"
              v-model:expires="formData.expires"
            />
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
      </div>
    </div>
  </div>
</template>
<script setup name="LoginRight">
import Remember from "./remember.vue";
import {encrypt, getImage, setToken} from "@jetlinks-web/utils";
import { useRequest } from "@jetlinks-web/hooks";
import {captchaConfig, codeUrl, encryptionConfig, getInitSet, login} from "@/api/login";
import { rules } from "./util";
import {useUserStore} from "@/store";

const logoImage = getImage("/login/logo.png");

const props = defineProps({
  loading: {
    type: Boolean,
    default: false,
  },
  logo: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["submit", 'update:loading']);

const userStore = useUserStore()

const formData = reactive({
  username: "",
  password: "",
  expires: 3600000,
  remember: false,
  verifyCode: undefined,
  verifyKey: undefined,
  encryptId: undefined
});

let timer = null

const { data: encryption, run: reloadEncryption } = useRequest(encryptionConfig, {
  onSuccess() {
    if (timer) {
      window.clearTimeout(timer)
      timer = null
    }

    timer = setTimeout(() => {
      reloadEncryption()
    }, 3 * 60 * 1000)
  }
})

const { data: config } = useRequest(captchaConfig, {
  onSuccess(resp) {
    if (resp.result?.enabled) {
      getCode();
    }
    return resp.result?.enabled
  },
});

const { data: url, run: getCode } = useRequest(codeUrl, {
  immediate: false,
  onSuccess(resp) {
    if (config.value && resp.result?.key) {
      formData.verifyKey = resp.result?.key
    }
  },
});

const { loading, run } = useRequest(login, {
  immediate: false,
  async onSuccess(res) {
    if (res.success) {
      setToken(res.result.token)
      await userStore.getUserInfo()
      if(userStore.isAdmin){
        const initResp = await getInitSet()
        if (initResp.success && !initResp.result?.length) {
          window.location.href = '/#/init-home';
          return;
        }
      }
      window.location.href = '/'
    }
  },
  onError: () => {
    form.verifyCode = undefined;
    getCode()
    reloadEncryption()
  }
})

const showCode = computed(() => {
  return !!url?.value?.base64;
});

const submit = (data) => {
  const _formData = {...toRaw(formData)}
  if (encryption.value?.encrypt?.enabled) {
    const _encrypt = encryption.value?.encrypt
    _formData.password = encrypt(data.password, _encrypt.publicKey)
    _formData.encryptId = _encrypt.id
  }
  run(_formData)
}

watch(() => loading.value, () => {
  emit('update:loading', loading.value)
})

</script>
<style lang="less" scoped>
.content {
  padding: 0 70px;

  .top {
    padding-top: 30%;

    .header {
      text-align: center;

      .desc {
        margin-top: 24px;
        margin-bottom: 40px;
        color: #000000b3;
        font-weight: 600;
        font-size: 22px;
        text-align: center;
      }
    }
  }

  .logo {
    display: block;
    height: 44px;
    margin: 0 auto;
    vertical-align: top;
  }
}
</style>
