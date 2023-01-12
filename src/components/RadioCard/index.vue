<!-- 单选卡片 -->
<template>
    <div class="m-radio">
        <div
            class="m-radio-item"
            :class="{ active: myValue === item.value }"
            v-for="(item, index) in options"
            :key="index"
            @click="myValue = item.value"
        >
            <img class="img" :src="item.logo" alt="" />
            <span>{{ item.label }}</span>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';

interface IOption {
    label: string;
    value: string;
    logo: string;
}

type Emits = {
    (e: 'update:modelValue', data: string): void;
};
const emit = defineEmits<Emits>();

const props = defineProps({
    options: {
        type: Array as PropType<IOption[]>,
        default: () => [],
    },
    modelValue: {
        type: String,
        default: '',
    },
});

const myValue = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val),
});
</script>

<style lang="less" scoped>
.m-radio {
    display: flex;
    &-item {
        padding: 10px 15px;
        margin-right: 15px;
        border: 1px solid #d9d9d9;
        border-radius: 2px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        .img {
            width: 100px;
            height: 100px;
        }
        &.active {
            color: #1d39c4;
            border-color: #1d39c4;
        }
    }
}
</style>
