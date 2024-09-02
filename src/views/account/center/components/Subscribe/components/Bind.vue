<template>
  <a-modal
    :maskClosable="false"
    :width="'900px'"
    visible
    @cancel="emit('close')"
    :zIndex="1100"
  >
    <template v-if="getType === 'notifier-weixin'">
      <a-spin :spinning="loading">
        <div class="code" style="height: 450px">
          <!-- <iframe
                        id="notifier_iframe"
                        class="code-item"
                        width="100%"
                        height="100%"
                        :src="url"
                        v-if="!loading"
                    ></iframe> -->
          <Wechat :data="_current" @success="onSuccess" />
        </div>
      </a-spin>
    </template>
    <template v-else-if="getType === 'notifier-dingTalk'">
      <a-spin :spinning="loading">
        <div class="code" style="height: 600px">
          <iframe
            id="notifier_iframe"
            class="code-item"
            width="100%"
            height="100%"
            :src="url"
            v-if="!loading"
          ></iframe>
        </div>
      </a-spin>
    </template>

    <template #footer>
      <a-button @click="emit('close')">关闭</a-button>
      <!-- <a-button type="primary" @click="emit('close')">确定</a-button> -->
    </template>
  </a-modal>
</template>

<script lang="ts" setup>
import {
  bindThirdParty,
  getDingTalkOAuth2,
  getUserBind,
  getWechatOAuth2,
} from '@/api/account/notificationSubscription'
import { LocalStore } from '@jetlinks-web/utils'
import Wechat from './Wechat.vue'

const emit = defineEmits(['close', 'save'])
const props = defineProps({
  data: {
    // 外层数据
    type: Object,
    default: () => {},
  },
  current: {
    // 当前的通道
    type: Object,
    default: () => {},
  },
})

const url = ref<string>('')
const loading = ref<boolean>(false)

const getType = computed(() => {
  return props.current?.channelProvider
})

const _current = ref<any>({})

const onBindHandle = (
  type: 'notifier-weixin' | 'notifier-dingTalk',
  code: string,
) => {
  getUserBind(type === 'notifier-dingTalk' ? 'dingtalk' : 'wechat', {
    authCode: code,
    configId: props.current?.channelConfiguration.notifierId,
  })
    .then((resp) => {
      if (resp.status === 200) {
        const _bindCode = (resp?.result || '') as string
        if (_bindCode) {
          bindThirdParty(
            type,
            props.current?.channelConfiguration.notifierId,
            _bindCode,
          )
            .then((response) => {
              if (response.status === 200) {
                // 订阅
                emit('save', props.current)
              }
            })
            .finally(() => {
              loading.value = false
            })
        }
      }
    })
    .catch(() => {
      loading.value = false
    })
}

const updateIframeStyle = () => {
  const iframe = document.querySelector('#notifier_iframe') as HTMLIFrameElement
  iframe.onload = () => {
    const currentUrl = iframe?.contentWindow?.location?.search || ''
    const _url = new URLSearchParams(currentUrl)
    const params = Object.fromEntries(_url?.entries())
    let authCode = ''
    if (props.current?.channelProvider === 'notifier-dingTalk') {
      authCode = params?.authCode
    }
    // else {
    //     authCode = params?.code;
    // }

    if (authCode) {
      loading.value = true
      onBindHandle(props.current?.channelProvider, authCode)
    }
  }
}

const handleSearch = async () => {
  LocalStore.remove('wexin_code')
  if (props.current?.channelProvider === 'notifier-weixin') {
    loading.value = true
    const resp: any = await getWechatOAuth2(
      props.current?.channelConfiguration.notifierId,
      props.current?.channelConfiguration.templateId,
      location.href,
    ).finally(() => {
      loading.value = false
    })
    if (resp.status === 200) {
      const _url = new URLSearchParams(resp?.result)
      const params = Object.fromEntries(_url?.entries())
      _current.value = params
      url.value = resp.result as string
    }
  }
  if (props.current?.channelProvider === 'notifier-dingTalk') {
    loading.value = true
    const resp = await getDingTalkOAuth2(
      props.current?.channelConfiguration.notifierId,
      location.href,
    ).finally(() => {
      loading.value = false
    })
    if (resp.status === 200) {
      url.value = resp.result as string
      nextTick(() => {
        updateIframeStyle()
      })
    }
  }
}

const onSuccess = (code: string) => {
  onBindHandle(props.current?.channelProvider, code)
}

watch(
  () => props.current,
  () => {
    handleSearch()
  },
  {
    immediate: true,
    deep: true,
  },
)
</script>

<style lang="less" scoped>
.tip {
  width: 100%;
  margin: 80px 0;
  text-align: center;
  font-size: 14px;
  color: #7f7f7f;
}

.code {
  width: 100%;
  display: flex;
  margin-top: 30px;
  justify-content: center;

  .code-item {
    border: none;
  }
}
</style>
