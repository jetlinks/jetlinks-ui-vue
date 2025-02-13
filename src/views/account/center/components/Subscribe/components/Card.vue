<template>
  <div class="box-item">
    <div class="box-item-img">
      <a-popover
        v-model:visible="popoverVisible"
        placement="top"
        :trigger="['click']"
      >
        <div
          :class="{
            disabled: !notifyChannels?.includes(current?.id),
          }"
        >
          <img
            :src="iconMap.get(current?.channelProvider)"
            style="width: 32px"
          />
        </div>
        <template #content>
          <j-permission-button
            v-if="!notifyChannels?.includes(current?.id)"
            type="link"
            :hasPermission="true"
            @click="onCheckChange(current)"
          >
            {{ $t('components.Card.812844-0') }}
          </j-permission-button>
          <template v-else>
            <Detail
              @unsubscribe="onUnSubscribe"
              v-if="
                current?.channelProvider !== 'inside-mail' && popoverVisible
              "
              :current="current"
              :data="data"
              @bindChange="onChange('bind')"
              @infoChange="onChange('info')"
            />
            <j-permission-button
              v-else
              type="link"
              :hasPermission="true"
              @click="onUnSubscribe(current)"
            >
              {{ $t('components.Card.812844-1') }}
            </j-permission-button>
          </template>
        </template>
      </a-popover>
    </div>
    <div class="box-item-text">
      <j-ellipsis style="width: 50px">
<!--        {{ current?.name }}-->
        {{ current?.i18nName || current.name }}
      </j-ellipsis>
    </div>
    <EditInfo
      v-if="editInfoVisible"
      :data="user.userInfo"
      @close="editInfoVisible = false"
      @save="onSave"
    />
    <Bind
      @close="visible = false"
      v-if="visible"
      :data="data"
      :current="current"
      @save="onBindSave"
    />
  </div>
</template>

<script lang="ts" setup>
import { getImage } from '@jetlinks-web/utils'
import Detail from './Detail.vue'
import { useUserStore } from '@/store/user'
import EditInfo from '../../EditInfo/index.vue'
import Bind from './Bind.vue'

const iconMap = new Map()
iconMap.set('notifier-dingTalk', getImage('/notice-rule/dingtalk.png'))
iconMap.set('notifier-weixin', getImage('/notice-rule/wechat.png'))
iconMap.set('notifier-email', getImage('/notice-rule/email.png'))
iconMap.set('notifier-voice', getImage('/notice-rule/voice.png'))
iconMap.set('notifier-sms', getImage('/notice-rule/sms.png'))
iconMap.set('inside-mail', getImage('/notice-rule/inside-mail.png'))

const emit = defineEmits(['save', 'unsubscribe'])

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
  notifyChannels: {
    type: Array,
    default: () => [],
  },
})
const user = useUserStore()
const popoverVisible = ref<boolean>(false)

const editInfoVisible = ref<boolean>(false)
const visible = ref<boolean>(false)

const onChange = (type: 'bind' | 'info') => {
  if (type === 'bind') {
    editInfoVisible.value = true
  } else {
    visible.value = true
  }
}

const onSave = () => {
  editInfoVisible.value = false
  user.getUserInfo()
  emit('save', props.current)
  popoverVisible.value = false
}

const onBindSave = () => {
  visible.value = false
  emit('save', props.current)
  popoverVisible.value = false
}

const onUnSubscribe = (dt: any) => {
  emit('unsubscribe', dt)
  popoverVisible.value = false
}

const onCheckChange = (dt: any) => {
  emit('save', dt)
  popoverVisible.value = false
}
</script>

<style lang="less" scoped>
.box-item {
  // margin: 0 5px;
  .box-item-img {
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    img {
      z-index: 1;
      cursor: pointer;
    }

    .disabled {
      filter: grayscale(100%);
      // filter: brightness(0);
      // opacity: 50%;
    }
  }

  .box-item-text {
    width: 100%;
    text-align: center;
    color: #666666;
    font-size: 12px;
  }
}
</style>
