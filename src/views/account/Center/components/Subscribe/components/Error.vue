<template>
    <j-modal visible @cancel="emit('close')">
        <template v-if="type === 'dingTalk'">
            <p>请先绑定钉钉账号</p>
        </template>
        <template v-else-if="type === 'weixin'">
            <p>请先绑定企业微信账号</p>
        </template>
        <template v-else-if="type === 'email'">
            <p>请先绑定邮箱</p>
        </template>
        <template v-else>
            <p>请先绑定手机号</p>
        </template>
        <template #footer>
            <j-button @click="emit('close')">确定</j-button>
            <j-button @click="onBind" type="primary" v-if="['voice', 'sms'].includes(type)">立即绑定</j-button>
        </template>
    </j-modal>
</template>

<script lang="ts" setup>
import { onlyMessage } from '@/utils/comm';
import { PropType } from 'vue';

type Type = 'dingTalk' | 'weixin' | 'email' | 'voice' | 'sms';

const emit = defineEmits(['close']);
const props = defineProps({
    type: {
        type: String as PropType<Type>,
        default: 'dingTalk',
    },
});

const onBind = () => {
    onlyMessage('打开详情编辑框')
}
</script>