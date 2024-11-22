<template>
    <j-input
        v-if="type === 'string'"
        v-model:value="myValue"
        placeholder="请输入"
        @change="change"
    />
    <j-input-number
        v-else-if="type === 'int'"
        v-model:value="myValue"
        :precision="0"
        :max="2147483647"
        :min="-2147483648"
        style="width: 100%"
        placeholder="请输入"
        @change="change"
    />
    <j-input-number
        v-else-if="type === 'long'"
        v-model:value="myValue"
        :max="999999999999999"
        :min="-999999999999999"
        :precision="0"
        placeholder="请输入"
        style="width: 100%"
        @change="change"
    />
    <j-input-number
        v-else-if="['float', 'double'].includes(type)"
        v-model:value="myValue"
        :max="999999999999999"
        :min="-999999999999999"
        placeholder="请输入"
        style="width: 100%"
        @change="change"
    />
    <j-select
        v-else-if="type === 'boolean'"
        placeholder="请选择"
        v-model:value="myValue"
        style="width: 100%"
        :dropdownStyle="{
          zIndex: 1071
        }"
        :options="options"
        :get-popup-container="(node) => tableWrapperRef || node"
        @change="change"
    />
    <j-date-picker
        v-else-if="type === 'date' "
        v-model:value="myValue"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
        style="width: 100%;z-index: 1071"
        :popupStyle="{ zIndex: 1072}"
        placeholder="请选择"
        :get-popup-container="(node) => tableWrapperRef || node"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        @change="change"
    />
</template>
<script setup name="MetricValueItem">
import { Form } from 'ant-design-vue'
import {useTableWrapper} from "@/components/Metadata/Table/context";

const props = defineProps({
    value: {
        type: [String, Number, Array],
        default: undefined
    },
    options: {
      type: Array,
      default: () => []
    }
})

const emit = defineEmits(['update:value'])
const formItemContext = Form.useInjectFormItemContext();

const type = inject('metricsType')
const myValue = ref(props.value)
const tableWrapperRef = useTableWrapper()

const change = () => {
    emit('update:value', myValue.value)
    formItemContext.onFieldChange()
}

watch(() => props.value, () => {
    myValue.value = props.value
})

</script>
