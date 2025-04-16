<template>
    <div :class="{ 'select-no-value': !value }">
        <j-select
            v-bind="props"
            allow-clear
            :value="myValue"
            style="width: 100%"
            placeholder="请选择数据类型"
            :dropdownStyle="{
                zIndex: 1071,
            }"
            :options="options"
            :getPopupContainer="(node) => tableWrapperRef || node"
            @change="change"
        />
    </div>
</template>

<script setup name="ArrayTypeSelect">
import { selectProps } from 'ant-design-vue/lib/select';
import defaultOptions from '../Type/data';
import { useTableWrapper } from '../../context';
import { BooleanValueMap } from '../utils';

const props = defineProps({
    ...selectProps(),
    filter: {
        type: Array,
        default: () => [],
    },
    value: {
        type: String,
        default: ''
    },
    data:{
        type:Object,
        default:()=>{

        }
    }
});

const emit = defineEmits(['update:value', 'changeFormData']);

const myValue = ref(props.value);

const options = computed(() => {
    return defaultOptions.filter((item) => !props.filter.includes(item.value));
});

const tableWrapperRef = useTableWrapper();
const change = (key) => {
    myValue.value = key;
    emit('update:value', key);
};

watch(
    () => props.value,
    (newValue) => {
        myValue.value = newValue;
    },
);
</script>

<style scoped></style>
