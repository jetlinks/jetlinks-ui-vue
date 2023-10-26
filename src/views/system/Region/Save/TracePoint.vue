<template>
    <j-button v-if="!_value.length" type="link">请在地图上描点</j-button>
    <div v-else>
        已完成描点<j-button type="link">编辑</j-button>
    </div>
</template>

<script lang="ts" setup>
import { ref } from "vue"

const props = defineProps({
    value: {
        type: Array,
        default: () => []
    }
})

const emits = defineEmits(['update:value'])

const _value = ref<any[]>([])
</script>