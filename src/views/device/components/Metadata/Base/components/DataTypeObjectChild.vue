<template>
    <j-space>
        <OtherConfigInfo :value="formData"></OtherConfigInfo>
        <DataTableEnum v-if="formData.type === 'enum'" v-model:value="formData" />
        <DataTableBoolean v-else-if="formData.type === 'boolean'" v-model:value="formData" />
        <DataTableDouble
            v-else-if="['float', 'double'].includes(formData.type)"
            :options="options"
            v-model:value="formData"
        />
        <DataTableInteger
            v-else-if="['int', 'long'].includes(formData.type)"
            :options="options"
            v-model:value="formData.unit"
        />
        <DataTableFile v-else-if="formData.type === 'file'" v-model:value="formData.fileType"/>
        <DataTableDate v-else-if="formData.type === 'date'" v-model:value="formData.date"/>
        <DataTableString
            v-else-if="['string', 'password'].includes(formData.type)"
            v-model:value="formData.expands.maxLength"
        />
    </j-space>
</template>

<script setup lang="ts" name="DataTypeObjectChild">
import { getUnit } from '@/api/device/instance';
import { OtherConfigInfo } from '../components'
import {
    DataTableString,
    DataTableInteger,
    DataTableDouble,
    DataTableBoolean,
    DataTableEnum,
    DataTableFile,
    DataTableDate,
} from 'jetlinks-ui-components';
const props = defineProps({
    value: {
        type: Object,
        default: () => ({}),
    },
});

// const formData = computed({
//     get() {
//         let result:any = {type: props.value.valueType?.type};
//         switch(true) {
//             case ['float', 'double'].includes(props.value?.valueType?.type):
//                 result.scale = props.value?.valueType?.scale;
//                 result.unit = props.value?.valueType?.unit;
//             break;
//             case ['int', 'long'].includes(props.value?.valueType?.type):
//                 result.unit = props.value?.valueType?.unit;
//             break;
//             case props.value.valueType?.type === 'boolean':
//                 result.trueText = props.value?.valueType?.trueText;
//                 result.trueValue = props.value?.valueType?.trueValue;
//                 result.falseText = props.value?.valueType?.falseText;
//                 result.falseValue = props.value?.valueType?.falseValue;
//             break;
//             case ['string', 'password'].includes(props.value?.valueType?.type):
//                 result.maxLength = props.value?.valueType?.maxLength;
//             break;
//             case ['date'].includes(props.value?.valueType?.type):
//                 result.date = props.value?.valueType?.date;
//             break;
//             case ['enum'].includes(props.value?.valueType?.type):
//                 result.elements = props.value?.valueType?.elements;
//             break;
                
//         }
//         return result;
//     },
//     set() {

//     }

// });
const formData = ref(props.value.valueType);
const type = ref(props.value.valueType?.type);



console.log(props.value);
const emit = defineEmits(['update:value', 'cancel']);

const options = ref<{ label: string; value: string }[]>([]);
watch(
    () => formData.value.type,
    () => {
        if (['float', 'double', 'int', 'long'].includes(formData.value.type)) {
            const res = getUnit().then((res) => {
                if (res.success) {
                    options.value = res.result.map((item) => ({
                        label: item.description,
                        value: item.id,
                    }));
                }
            });
        }
    },
    { immediate: true, deep: true },
);

watch(() => formData.value, () => {
    emit('update:value', { ...props.value, valueType: { ...formData.value, type: type.value } });
}, {deep: true})

</script>

<style scoped>
.metadata-type {
    display: flex;
    gap: 12px;
    align-items: center;
}
</style>
