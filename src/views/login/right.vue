<template>
  <div class="content">
    <div class="top">
      <div class="header">
        <img alt="logo" class="logo" :src="logo || logoImage" />
        <p class="desc">{{ title }}</p>
      </div>
      <div class="main">
        <Form
          layout="vertical"
          :model="formData"
          :rules="rules"
          @finish="submit"
        >
          <form-item :label="$t('login.right.419974-0')" name="username">
            <Input
              v-model:value="formData.username"
              :placeholder="$t('login.right.419974-1')"
              :maxlength="64"
              autocomplete="off"
            />
          </form-item>
          <form-item :label="$t('login.right.419974-2')" name="password">
            <input-password
              v-model:value="formData.password"
              :placeholder="$t('login.right.419974-3')"
              :maxlength="64"
              autocomplete="off"
            />
          </form-item>
          <form-item
            v-if="showCode"
            :label="$t('login.right.419974-4')"
            name="verifyCode"
          >
            <Input
              v-model:value="formData.verifyCode"
              autocomplete="off"
              :maxlength="64"
              :placeholder="$t('login.right.419974-5')"
            >
              <template #addonAfter>
                <img :src="url.base64" @click="getCode" />
              </template>
            </Input>
          </form-item>
          <form-item>
            <Remember
              v-model:value="formData.remember"
              v-model:expires="formData.expires"
            />
          </form-item>
          <form-item>
            <Button
              :loading="loading"
              type="primary"
              html-type="submit"
              class="login-form-button"
              block
            >
              {{ $t("login.right.419974-6") }}
            </Button>
          </form-item>
        </Form>
        <div class="other" v-if="bindings.length">
          <Divider plain>
            <div class="other-text">
              {{ $t("login.right.419974-7") }}
            </div>
          </Divider>
          <div class="other-button">
            <div
              class="other-button-item"
              v-for="(item, index) in bindings.slice(0, 4)"
              :key="index"
              @click="handleClickOther(item)"
            >
              <img
                style="width: 32px; height: 32px"
                :alt="item.name"
                :src="item.logoUrl || iconMap.get(item.provider) || defaultImg"
              />
            </div>
            <Popover
              trigger="click"
              v-model:visible="moreVisible"
              placement="bottomRight"
            >
              <template #content>
                <j-scrollbar :max-height="120">
                  <div class="more-button">
                    <div
                      class="more-button-item"
                      v-for="(item, index) in bindings.slice(
                        4,
                        bindings.length - 1,
                      )"
                      :key="index"
                      @click="handleClickOther(item)"
                    >
                      <img
                        style="width: 32px; height: 32px"
                        :alt="item.name"
                        :src="
                          item.logoUrl ||
                          iconMap.get(item.provider) ||
                          defaultImg
                        "
                      />
                      <j-ellipsis style="width: calc(100%); margin: 5px auto">
                        {{ item.name }}
                      </j-ellipsis>
                    </div>
                  </div>
                </j-scrollbar>
              </template>
              <div v-if="bindings.length > 4" class="more">
                <AIcon
                  class="moreIcon"
                  type="MoreOutlined"
                  style="font-size: 20px"
                ></AIcon>
              </div>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup name="LoginRight">
import Remember from "./remember.vue";
import {encrypt, getImage, onlyMessage, setToken} from "@jetlinks-web/utils";
import { useRequest } from "@jetlinks-web/hooks";
import {
  captchaConfig,
  codeUrl,
  encryptionConfig,
  getInitSet,
  login,
} from "@/api/login";
import { rules } from "./util";
import {useUserStore} from "@/store";
import { LocalStore } from "@jetlinks-web/utils";
import { iconMap } from "./util";
import { Form, FormItem, Button, Divider, Popover, Input, InputPassword } from 'ant-design-vue'

import defaultImg from '@/assets/apply/internal-standalone.png'
import {initPackages} from "@/package";
import i18n from "@/locales";

const BASE_API_PATH = import.meta.env.VITE_APP_BASE_API

const logoImage = getImage("/login/logo.png");
const $t = i18n.global.t

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
  bindings: {
    type: Array,
    default: () => [],
  },
  type: {
    type: String,
    default: 'login' // 'login' 'relogin'
  }
});

const emit = defineEmits(["submit", "update:loading"]);
const moreVisible = ref(false);
const userStore = useUserStore();

const formData = reactive({
  username: "",
  password: "",
  expires: 3600000,
  remember: false,
  verifyCode: undefined,
  verifyKey: undefined,
  encryptId: undefined,
});

let timer = null;
const { data: encryption, run: reloadEncryption } = useRequest(
  encryptionConfig,
  {
    onSuccess() {
      if (timer) {
        window.clearTimeout(timer);
        timer = null;
      }

      timer = setTimeout(
        () => {
          reloadEncryption();
        },
        3 * 60 * 1000,
      );
    },
  },
);

const { data: config } = useRequest(captchaConfig, {
  onSuccess(resp) {
    if (resp.result?.enabled) {
      getCode();
    }
    return resp.result?.enabled;
  },
});

const { data: url, run: getCode } = useRequest(codeUrl, {
  immediate: false,
  onSuccess(resp) {
    if (config.value && resp.result?.key) {
      formData.verifyKey = resp.result?.key;
    }
  },
});

const { loading, run } = useRequest(login, {
  immediate: false,
  async onSuccess(res) {
    if (res.success) {
      setToken(res.result.token);
      // 登录成功后，直接关闭模态弹窗，停留在当前页面//若使用另外账号登录,直接跳转默认首页
      const flag = LocalStore.get('username') === res.result.user?.username
      if(props.type === 'relogin'){
        // 处理websocket
        initPackages()
        if(flag){
          emit('submit')
          return
        } else {
          onlyMessage($t("login.right.419974-8"))
        }
      }
      await userStore.getUserInfo();
      if (userStore.isAdmin) {
        const initResp = await getInitSet();
        if (initResp.success && !initResp.result?.length) {
          window.location.href = "/#/init-home";
          return;
        }
      }
      window.location.href = "/";
    }
  },
  onWarn: () => {
    formData.verifyCode = undefined;
    if (config.value) {
      getCode();
    }
    if (encryption.value?.encrypt?.enabled) {
      reloadEncryption();
    }
  },
});

const showCode = computed(() => {
  return !!url?.value?.base64;
});

const submit = (data) => {
  const _formData = { ...toRaw(formData) };
  if (encryption.value?.encrypt?.enabled) {
    const _encrypt = encryption.value?.encrypt;
    _formData.password = encrypt(data.password, _encrypt.publicKey);
    _formData.encryptId = _encrypt.id;
  }
  run(_formData);
};

const handleClickOther = (item) => {
  LocalStore.set("onLogin", "no");
  window.open(`${BASE_API_PATH}/application/sso/${item.id}/login`);
  window.onstorage = (e) => {
    if (e.newValue) {
      window.location.href = "/";
    }
  };
};

watch(
  () => loading.value,
  () => {
    emit("update:loading", loading.value);
  },
);
</script>
<style lang="less" scoped>
.content {
  padding: 0 70px;

  .top {
    //padding-top: 30%;

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
