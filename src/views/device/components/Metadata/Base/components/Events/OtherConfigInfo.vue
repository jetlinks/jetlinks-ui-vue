<template>
    <div v-if="['float', 'double'].includes(value.type)">{{ value.scale }}</div>
    <div v-if="value.type == 'boolean'">{{ value.trueText }}-{{ value.trueValue }}; {{ value.falseText }}-{{ value.falseValue }}</div>
    <div v-if="['string', 'password'].includes(value.type)">{{ value.expands.maxLength }}</div>
    <div v-if="value.type == 'date'">{{ value.date }}</div>
    <div v-if="value.type == 'enum'">{{ value.elements.map((item) => item.text).join(',')   }}</div>
</template>

<script setup lang="ts" name="OtherConfigInfo">

const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    }
})

const text = computed(() => {
    
})
</script>