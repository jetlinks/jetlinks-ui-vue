<template>
    <a-input
        v-if="type === 'string'"
        v-model:value="myValue"
        :placeholder="$t('DeviceAccess.index.594346-13')"
        @change="change"
    />
    <a-input-number
        v-else-if="type === 'int'"
        v-model:value="myValue"
        :precision="0"
        :max="2147483647"
        :min="-2147483648"
        style="width: 100%"
        :placeholder="$t('DeviceAccess.index.594346-13')"
        @change="change"
    />
    <a-input-number
        v-else-if="type === 'long'"
        v-model:value="myValue"
        :max="999999999999999"
        :min="-999999999999999"
        :precision="0"
        :placeholder="$t('DeviceAccess.index.594346-13')"
        style="width: 100%"
        @change="change"
    />
    <a-input-number
        v-else-if="['float', 'double'].includes(type)"
        v-model:value="myValue"
        :max="999999999999999"
        :min="-999999999999999"
        :placeholder="$t('DeviceAccess.index.594346-13')"
        style="width: 100%"
        @change="change"
    />
    <a-select
        v-else-if="type === 'boolean'"
        :placeholder="$t('DeviceAccess.index.594346-12')"
        v-model:value="myValue"
        style="width: 100%"
        :dropdownStyle="{
          zIndex: 1071
        }"
        :options="options"
        :get-popup-container="(node) => tableWrapperRef || node"
        @change="change"
    />
    <a-date-picker
        v-else-if="type === 'date' "
        v-model:value="myValue"
        show-time
        format="YYYY-MM-DD HH:mm:ss"
        style="width: 100%;z-index: 1071"
        :popupStyle="{ zIndex: 1072}"
        :placeholder="$t('DeviceAccess.index.594346-12')"
        :get-popup-container="(node) => tableWrapperRef || node"
        valueFormat="YYYY-MM-DD HH:mm:ss"
        @change="change"
    />
</template>
<script setup name="MetricValueItem">
import { Form } from 'ant-design-vue'
import {useTableWrapper} from "../../../../../../../../components/Metadata/context";

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
