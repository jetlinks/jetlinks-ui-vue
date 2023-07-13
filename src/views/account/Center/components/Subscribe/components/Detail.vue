<template>
    <div style="width: 300px">
        <template v-if="getType === 'notifier-dingTalk'">
            <div class="tip"><j-ellipsis :lineClamp="2">绑定账号：{{ info }}</j-ellipsis></div>
        </template>
        <template v-else-if="getType === 'notifier-weixin'">
            <div class="tip"><j-ellipsis :lineClamp="2">绑定账号：{{ info }}</j-ellipsis></div>
        </template>
        <template v-else-if="getType === 'notifier-email'">
            <div class="tip"><j-ellipsis :lineClamp="2">绑定账号：{{ user.userInfos?.email }}</j-ellipsis></div>
        </template>
        <template v-else>
            <div class="tip"><j-ellipsis :lineClamp="2">绑定账号：{{ user.userInfos?.telephone }}</j-ellipsis></div>
        </template>
        <div class="btn">
            <j-button @click="emit('unsubscribe', current)">取消订阅</j-button>
            <j-button
                @click="onBind"
                type="primary"
                >更换绑定账号</j-button
            >
        </div>
    </div>
    <EditInfo
        v-if="editInfoVisible"
        :data="user.userInfos"
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
</template>

<script lang="ts" setup>
import { getIsBindThird } from '@/api/account/notificationSubscription';
import { useUserInfo } from '@/store/userInfo';
import EditInfo from '../../EditInfo/index.vue';
import Bind from './Bind.vue';

const user = useUserInfo();
const emit = defineEmits(['save', 'unsubscribe', 'close']);
const info = ref<any>(null);
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
const visible = ref<boolean>(false);

const getType = computed(() => {
    return props.current?.channelProvider;
});

const onBind = () => {
    if (
        ['notifier-voice', 'notifier-sms', 'notifier-email'].includes(
            props.current?.channelProvider,
        )
    ) {
        editInfoVisible.value = true;
    } else {
        visible.value = true
    }
    
};

const onSave = () => {
    editInfoVisible.value = false;
    user.getUserInfo();
    emit('save', props.current);
    emit('close')
};

const onBindSave = () => {
    visible.value = false
    emit('save', props.current);
    emit('close')
}

const handleSearch = async () => {
    if (
        !['notifier-voice', 'notifier-sms', 'notifier-email'].includes(
            props.current?.channelProvider,
        )
    ) {
        const resp: any = await getIsBindThird();
        const _item = (resp?.result || []).find((item: any) => {
            return (
                props.current?.channelConfiguration?.notifierId ===
                item?.provider
            );
        });
        if (_item) {
            info.value = _item?.providerName
        }
    }
};

onMounted(() => {
    handleSearch()
})

// watch(
//     () => props.current,
//     () => {
//         handleSearch();
//     },
//     {
//         immediate: true,
//         deep: true,
//     },
// );
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