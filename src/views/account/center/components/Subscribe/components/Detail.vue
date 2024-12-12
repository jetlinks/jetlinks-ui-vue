<template>
  <div style="width: 300px">
    <template v-if="getType === 'notifier-dingTalk'">
      <div class="tip">
        <j-ellipsis :lineClamp="2">{{ $t('components.Detail.044328-0') }}{{ info }}</j-ellipsis>
      </div>
    </template>
    <template v-else-if="getType === 'notifier-weixin'">
      <div class="tip">
        <j-ellipsis :lineClamp="2">{{ $t('components.Detail.044328-0') }}{{ info }}</j-ellipsis>
      </div>
    </template>
    <template v-else-if="getType === 'notifier-email'">
      <div class="tip">
        <j-ellipsis :lineClamp="2"
          >{{ $t('components.Detail.044328-0') }}{{ user.userInfo?.email }}
        </j-ellipsis>
      </div>
    </template>
    <template v-else>
      <div class="tip">
        <j-ellipsis :lineClamp="2"
          >{{ $t('components.Detail.044328-0') }}{{ user.userInfo?.telephone }}
        </j-ellipsis>
      </div>
    </template>
    <div class="btn">
      <a-button @click="emit('unsubscribe', current)">{{ $t('components.Detail.044328-1') }}</a-button>
      <a-button type="primary" @click="onBind">{{ $t('components.Detail.044328-2') }}</a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { getIsBindThird } from '@/api/account/notificationSubscription'
import { useUserStore } from '@/store/user'

const user = useUserStore()
const emit = defineEmits(['infoChange', 'unsubscribe', 'bindChange'])
const info = ref<any>(null)
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

const getType = computed(() => {
  return props.current?.channelProvider
})

const onBind = () => {
  if (
    !['notifier-voice', 'notifier-sms', 'notifier-email'].includes(
      props.current?.channelProvider,
    )
  ) {
    emit('infoChange')
  } else {
    emit('bindChange')
  }
}

const handleSearch = async () => {
  if (
    !['notifier-voice', 'notifier-sms', 'notifier-email'].includes(
      props.current?.channelProvider,
    )
  ) {
    const resp: any = await getIsBindThird()
    const _item = (resp?.result || []).find((item: any) => {
      return props.current?.channelConfiguration?.notifierId === item?.provider
    })
    if (_item) {
      info.value = _item?.providerName || _item?.thirdPartyUserId
    }
  }
}

onMounted(() => {
  handleSearch()
})
</script>

<style lang="less" scoped>
.tip {
  width: 100%;
  margin: 20px 0;
}

.btn {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}
</style>
