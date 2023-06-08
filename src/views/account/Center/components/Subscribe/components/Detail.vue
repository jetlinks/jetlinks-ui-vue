<template>
    <div>
        <div><j-button type="link">取消订阅</j-button></div>
        <template v-if="['dingTalk', 'weixin'].includes(type)">
            <div><j-button type="link">更换接收账号</j-button></div>
            <p>当前绑定的账号名称</p>
        </template>
        <template v-else>
            <div><j-button type="link">更换接收账号</j-button></div>
        </template>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
type Type = 'dingTalk' | 'weixin' | 'email' | 'voice' | 'sms';
const props = defineProps({
    type: {
        type: String as PropType<Type>,
        default: 'dingTalk',
    },
});
</script>