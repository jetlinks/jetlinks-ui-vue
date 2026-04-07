<template>
    <div :class="{ 'select-no-value': !value }">
        <a-select
            v-bind="props"
            allow-clear
            :value="myValue"
            style="width: 100%"
            :placeholder="$t('Array.ArrayTypeSelect.363831-0')"
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
    const extra = {};
    let newValueType = { type: key };

    if (key === 'boolean') {
        const BooleanDefaultValue = BooleanValueMap();
        Object.keys(BooleanDefaultValue).forEach((key) => {
            if (!props.data[key]) {
                extra[key] = BooleanDefaultValue[key];
            }
        });
        newValueType = Object.assign(newValueType, extra);
    }
    emit('update:value', key);
    emit('changeFormData', extra);
};

watch(
    () => props.value,
    (newValue) => {
        myValue.value = newValue;
    },
);
</script>

<style scoped></style>
