<template>
  <a-modal
    :maskClosable="false"
    :width="'384px'"
    visible
    @cancel="emit('close')"
    :footer="null"
  >
    <template v-if="getType === 'notifier-dingTalk'">
      <div class="tip">请先绑定钉钉账号</div>
    </template>
    <template v-else-if="getType === 'notifier-weixin'">
      <div class="tip">请先绑定企业微信账号</div>
    </template>
    <template v-else-if="getType === 'notifier-email'">
      <div class="tip">请先绑定邮箱</div>
    </template>
    <template v-else>
      <div class="tip">请先绑定手机号</div>
    </template>
    <div class="btn">
      <a-space>
        <a-button @click="emit('close')">取消</a-button>
        <a-button @click="onBind" type="primary">立即绑定</a-button>
      </a-space>
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
      :data="props.data"
      :current="current"
      @save="onBindSave"
    />
  </a-modal>
</template>

<script lang="ts" setup>
import { useUserStore } from '@/store/user'
import EditInfo from '../../EditInfo/index.vue'
import Bind from './Bind.vue'

const user = useUserStore()
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

const editInfoVisible = ref<boolean>(false)
const visible = ref<boolean>(false)

const getType = computed(() => {
  return props.current?.channelProvider
})

const onBind = () => {
  if (!['notifier-dingTalk', 'notifier-weixin'].includes(getType.value)) {
    editInfoVisible.value = true
  } else {
    visible.value = true
  }
}

const onSave = (info: any) => {
  editInfoVisible.value = false
  user.getUserInfo()
  if (
    (getType.value === 'notifier-email' && info.email) ||
    (['notifier-voice', 'notifier-sms'].includes(getType.value) &&
      info.telephone)
  ) {
    emit('save', props.current)
    emit('close')
  }
}

const onBindSave = (cur: any) => {
  visible.value = false
  emit('save', cur)
  emit('close')
}
</script>

<style lang="less" scoped>
.tip {
  width: 100%;
  margin: 30px 0;
  font-size: 16px;
  color: #333333;
}

.code {
  width: 100%;
  display: flex;
  margin-top: 30px;
  justify-content: center;
}

.btn {
  display: flex;
  justify-content: flex-end;
}
</style>
