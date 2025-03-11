<template>
  <div class="child-item">
    <div class="child-item-left">
      <div style="color: #333333">
        {{ data?.name }}
      </div>
      <div class="child-item-left-auth" v-if="data?.description">
        <a-tooltip :title="data.description">
          <AIcon
            style="font-size: 16px; color: rgba(0, 0, 0, 0.3)"
            type="ExclamationCircleOutlined"
          />
        </a-tooltip>
      </div>
    </div>
    <div class="child-item-right">
      <MCarousel :data="data?.channels">
        <template #card="slotProps">
          <Card
            @save="onCheckChange"
            @unsubscribe="onUnSubscribe"
            :notifyChannels="notifyChannels"
            :data="props.data"
            :current="slotProps"
          />
        </template>
      </MCarousel>
    </div>
  </div>
  <Unsubscribe
    @save="onSubscribe"
    v-if="visible"
    :data="props.data"
    :current="current"
    @close="visible = false"
  />
</template>

<script lang="ts" setup>
import { onlyMessage } from '@jetlinks-web/utils'
import MCarousel from '@/components/MCarousel/index.vue'
import Unsubscribe from './Unsubscribe.vue'
import Card from './Card.vue'
import {
  getIsBindThird,
  save_api,
} from '@/api/account/notificationSubscription'
import { useUserStore } from '@/store/user'
import { useI18n } from 'vue-i18n';
import {useSystemStore} from "@/store";

const systemStore = useSystemStore()
const { t: $t } = useI18n();
const current = ref<any>({})
const visible = ref<boolean>(false)
const _visible = ref<boolean>(false)

const user = useUserStore()

const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
  subscribe: {
    type: Object,
    default: () => {},
  },
})

const emits = defineEmits(['refresh'])

const notifyChannels = computed(() => {
  return props.subscribe?.notifyChannels || []
})

const onSubscribe = async (obj: any) => {
  const _obj = {
    subscribeName: obj.name,
    topicProvider: props.data?.provider,
    providerId: obj.providerId,
    ...props.subscribe,
    locale: systemStore.language,
    notifyChannels: [...(props.subscribe?.notifyChannels || []), obj?.id],
  }
  const resp = await save_api(_obj)
  if (resp.status === 200) {
    onlyMessage($t('components.Item.641816-0'))
    emits('refresh')
    _visible.value = false
  } else {
    onlyMessage($t('components.Item.641816-1'), 'error')
  }
}

const onUnSubscribe = async (obj: any) => {
  const _set = new Set(props.subscribe?.notifyChannels || [])
  _set.delete(obj?.id)
  const _obj = {
    subscribeName: obj.name,
    topicProvider: props.data?.provider,
    providerId: obj.providerId,
    ...props.subscribe,
    notifyChannels: [..._set.values()],
  }
  const resp = await save_api(_obj)
  if (resp.status === 200) {
    _visible.value = false
    onlyMessage($t('components.Item.641816-0'))
    emits('refresh')
  } else {
    onlyMessage($t('components.Item.641816-1'), 'error')
  }
}

const onCheckChange = async (_data: any) => {
  let _bind: boolean = false
  if (_data?.channelProvider !== 'inside-mail') {
    // 判断是否绑定
    if (['notifier-voice', 'notifier-sms'].includes(_data?.channelProvider)) {
      if (user.userInfo?.telephone) {
        _bind = true
      }
    } else if (_data?.channelProvider === 'notifier-email') {
      if (user.userInfo?.email) {
        _bind = true
      }
    } else {
      // 钉钉和微信
      const resp: any = await getIsBindThird()
      if (resp.status === 200) {
        const _item = (resp?.result || []).find((item: any) => {
          return _data?.channelConfiguration?.notifierId === item?.provider
        })
        if (_item) {
          _bind = true
        }
      }
    }
  }
  if (_data?.channelProvider === 'inside-mail' || _bind) {
    onSubscribe(_data)
  } else {
    visible.value = true
    current.value = _data
  }
}

const onSave = (dt: any) => {
  onSubscribe(dt)
}
</script>

<style lang="less" scoped>
.child-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 68px;
  background: linear-gradient(270deg, #ffffff 0%, #f1f6ff 99%);
  border-radius: 4px;
  border: 1px solid #ebeef3;
  margin-bottom: 10px;

  .child-item-left {
    display: flex;
    align-items: center;
    margin-left: 24px;

    div {
      display: flex;
      margin-right: 8px;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }

    .child-item-left-auth {
      cursor: pointer;
    }
  }

  .child-item-right {
    display: flex;
    margin-right: 16px;
  }
}
</style>
