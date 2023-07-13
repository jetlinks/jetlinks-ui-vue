<template>
    <j-select
        :disabled="disabled"
        placeholder="请选择"
        :value="_value"
        show-search
        @change="productChange"
    >
        <j-select-option
            v-for="item in _options"
            :key="item?.id"
            :value="item.id"
            :label="item.name"
            >{{ item.name }}</j-select-option
        >
    </j-select>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { Form } from 'jetlinks-ui-components';

const props = defineProps({
    disabled: {
        type: Boolean,
        default: false
    },
    options: {
        type: Array as PropType<any[]>,
        default: () => []
    },
    value: {
        type: String,
        default: undefined
    },
    type: {
        type: String,
        default: 'product'
    }
})

const emits = defineEmits(['update:value', 'change']);

const formItemContext = Form.useInjectFormItemContext()

const _value = ref<any>(undefined)

const formTouchOff = () => {
  formItemContext.onFieldChange()
}

const _options = computed(() => {
    if(props.type === 'product') {
        return props.options.filter(i => i?.state || i.id === props.value)
    } else {
        return props.options
    }
})

watchEffect(() => {
    _value.value = props.value
    if(props.type !== 'product') {
        formTouchOff()
    } else {
        if(props.value){
            formTouchOff()
        }
    }
})

const productChange = (val: any) => {
    emits('update:value', val)
    emits('change', val)
}
</script>