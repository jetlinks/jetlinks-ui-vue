<template>
    <j-modal width="350px" visible @cancel="emit('close')" :footer="null">
        <template v-if="getType === 'notifier-dingTalk'">
            <div class="tip">暂未开发</div>
        </template>
        <template v-else-if="getType === 'notifier-weixin'">
            <div class="tip">暂未开发</div>
        </template>
        <template v-else-if="getType === 'notifier-email'">
           <div class="tip"> 绑定账号：{{ user.userInfos?.email }}</div>
        </template>
        <template v-else>
            <div class="tip">绑定账号：{{ user.userInfos?.telephone }}</div>
        </template>
        <div class="btn">
            <j-button @click="emit('unsubscribe', current)">取消订阅</j-button>
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
        </div>
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
    user.getUserInfo();
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
    margin: 30px 0;
}

.btn {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
}
</style>