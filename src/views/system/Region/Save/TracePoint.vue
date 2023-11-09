<template>
    <j-button @click="onClick" v-if="!_value.length" type="link"
        >请在地图上描点</j-button
    >
    <div v-else>已完成描点<j-button type="link" @click="onEdit">编辑</j-button></div>
</template>

<script lang="ts" setup>
import { ref, watch, inject } from 'vue';

const props = defineProps({
    value: {
        type: Array,
        default: () => [],
    },
});

const emits = defineEmits(['update:value', 'close']);

const _value = ref<any[]>([]);

const __data: any = inject('system-region')

const onClick = () => {
    console.log(__data)
    __data.type.value = 'edit'
    emits('close')
};

const onEdit = () => {
    // __data.type.value = 'edit'
    // emits('close')
}

watch(
    () => props.value,
    () => {
        console.log(props.value)
    },
    {
        deep: true,
        immediate: true,
    },
);
</script>