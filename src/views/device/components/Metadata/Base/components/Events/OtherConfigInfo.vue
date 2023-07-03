<template>
    <div class="values-text" v-if="['float', 'double'].includes(value.type)">{{ value.scale }}</div>
    <div class="values-text" v-else-if="value.type == 'boolean'">{{ value.trueText }}-{{ value.trueValue }}; {{ value.falseText }}-{{ value.falseValue }}</div>
    <div class="values-text" v-else-if="['string', 'password'].includes(value.type)">{{ value.expands?.maxLength }}</div>
    <div class="values-text" v-else-if="value.type == 'date'">{{ value.date }}</div>
    <div class="values-text" v-else-if="value.type == 'enum'">{{ value.elements?.map((item) => item.text).join(',')   }}</div>
    <div class="values-text" v-else-if="['int', 'long'].includes(value.type)">无</div>
</template>

<script setup lang="ts" name="OtherConfigInfo">

const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    }
})

const test = computed(() => {
    const value = props.value
    const type = props.value?.type
    if (value.value) {
        
    }
    switch(type) {
        case 'float':
        case 'double':
            return value.scale;
        case 'boolean':
            return value?.trueText ? `${ value?.trueText }-${ value.trueValue }; ${ value.falseText }-${ value.falseValue }` : '';
        case 'string':
        case 'password':
            return value?.expands?.maxLength;
        case 'int':
        case 'long':
            return '无'
    }
})
</script>