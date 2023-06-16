<template>
    <j-modal visible @cancel="emit('close')">
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
        <template #footer>
            <j-button @click="emit('close')">取消</j-button>
            <j-button @click="onBind" type="primary" v-if="['notifier-email', 'notifier-voice', 'notifier-sms'].includes(getType)">立即绑定</j-button>
            <j-button v-else @click="emit('close')">确定</j-button>
        </template>
        <EditInfo v-if="editInfoVisible" :data="user.userInfos" @close="editInfoVisible = false" @save="onSave" />
    </j-modal>
</template>

<script lang="ts" setup>
import { useUserInfo } from '@/store/userInfo';
import EditInfo from '../../EditInfo/index.vue'

const user = useUserInfo();
const emit = defineEmits(['close', 'save']);
const props = defineProps({
    data: { // 外层数据
        type: Object,
        default: () => {},
    },
    current: { // 当前的通道
        type: Object,
        default: () => {},
    },
});

const editInfoVisible = ref<boolean>(false)

const getType = computed(() => {
    return props.current?.channelProvider
})

const onBind = () => {
    editInfoVisible.value = true
}

const onSave = () => {
    editInfoVisible.value = false
    emit('save', props.current)
    emit('close')
}
</script>

<style lang="less" scoped>
.tip {
    width: 100%;
    margin: 80px 0;
    text-align: center;
    font-size: 14px;
    color: #7F7F7F;
}
</style>