<template>
    <j-badge
        :status="statusNames ? statusNames[status] : 'default'"
        :text="text"
    ></j-badge>
</template>

<script setup lang="ts">
// import { StatusColorEnum } from '@/utils/consts.ts';
const props = defineProps({
    text: {
        type: String,
    },
    status: {
        type: String || Number,
        default: 'default',
        // validator: (value) => {
        //     // 这个值必须匹配下列字符串中的一个
        //     return Object.keys(StatusColorEnum).includes(value);
        // },
    },
    /**
     * 自定义status值颜色
     * @example {
     *   1: 'success',
     *   0: 'error'
     * }
     */
    statusNames: { type: Object },
});
</script>
