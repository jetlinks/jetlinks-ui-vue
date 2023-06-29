<template>
    <j-modal visible @cancel="emit('close')">
        <template v-if="getType === 'notifier-dingTalk'">
            <!-- <div class="tip">请先绑定钉钉账号</div> -->
        </template>
        <template v-else-if="getType === 'notifier-weixin'">
            <!-- <div class="tip">请先绑定企业微信账号</div> -->
        </template>
        <template v-else-if="getType === 'notifier-email'">
           <div class="tip"> 绑定账号：{{ user.userInfos.email }}</div>
        </template>
        <template v-else>
            <div class="tip">绑定账号：{{ user.userInfos.telephone }}</div>
        </template>
        <template #footer>
            <j-button @click="emit('unsubscribe', )">取消订阅</j-button>
            <j-button
                @click="onBind"
                type="primary"
                v-if="
                    [
                        'notifier-email',
                        'notifier-voice',
                        'notifier-sms',
                    ].includes(getType)
                "
                >更换绑定账号</j-button
            >
            <j-button v-else @click="emit('close')">确定</j-button>
        </template>
    </j-modal>
    <EditInfo
        v-if="editInfoVisible"
        :data="user.userInfos"
        @close="editInfoVisible = false"
        @save="onSave"
    />
</template>

<script lang="ts" setup>
import { useUserInfo } from '@/store/userInfo';
import EditInfo from '../../EditInfo/index.vue';

const user = useUserInfo();
const emit = defineEmits(['close', 'save', 'unsubscribe']);
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
});

const editInfoVisible = ref<boolean>(false);

const getType = computed(() => {
    return props.current?.channelProvider;
});

const onBind = () => {
    editInfoVisible.value = true;
};

const onSave = () => {
    editInfoVisible.value = false;
    emit('save', props.current);
    emit('close');
};

// 更换绑定账号
const onAccountChange = (_data: any) => {
    // current.value = _data;
    // if (
    //     ['notifier-voice', 'notifier-sms', 'notifier-email'].includes(
    //         _data?.channelProvider,
    //     )
    // ) {
    //     editInfoVisible.value = true;
    // } else {
    //     visible.value = true;
    // }
};

watch(
    () => props.current,
    () => {
        // handleSearch();
    },
    {
        immediate: true,
        deep: true,
    },
);
</script>

<style lang="less" scoped>
.tip {
    width: 100%;
    margin-top: 30px;
    // font-size: 14px;
    // color: #7f7f7f;
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