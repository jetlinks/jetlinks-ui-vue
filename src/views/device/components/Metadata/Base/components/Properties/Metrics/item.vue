<template>
    <j-input
        v-if="type === 'string'"
        v-model:value="myValue"
        :maxLength="64"
        @change="change"
    />
    <j-input-number
        v-else-if="['int', 'long', 'float', 'double'].includes(type)"
        v-model:value="myValue"
        :precision="0"
        style="width: 100%"
        @change="change"
    />
    <j-date-picker
        v-else-if="type === 'date' "
        v-model:value="myValue"
        show-time
        @change="change"
    />
</template>
<script setup name="MetricValueItem">

const props = defineProps({
    value: {
        type: [String, Number, Array],
        default: undefined
    }
})

const emit = defineEmits(['update:value'])

const type = inject('metricsType')
const myValue = ref(props.value)

const change = () => {
    emit('update:value', myValue.value)
}

watch(() => props.value, () => {
    myValue.value = props.value
})

</script>