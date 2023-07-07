<template>
    <div class="values">
        <div class="values-test">
            {{ text }}
        </div>
            <!-- <OtherConfigInfo :value="formData"></OtherConfigInfo> -->
            <DataTableEnum placement="topRight" v-if="formData.type === 'enum'" v-model:value="formData" />
            <DataTableBoolean placement="topRight" v-else-if="formData.type === 'boolean'" v-model:value="formData" />
            <DataTableDouble
                placement="topRight"
                v-else-if="['float', 'double'].includes(formData.type)"
                :options="options"
                v-model:value="formData"
            />
            <DataTableArray
                v-else-if="formData.type === 'array'"
                placement="topRight"
                v-model:value="formData.unit"
            />
            <DataTableFile v-else-if="formData.type === 'file'" v-model:value="formData.fileType" placement="topRight"/>
            <DataTableDate v-else-if="formData.type === 'date'" v-model:value="formData.date" placement="topRight"/>
            <DataTableString
                v-else-if="['string', 'password'].includes(formData.type)"
                v-model:value="formData.maxLength"
                placement="topRight"
            />
    </div>
</template>

<script setup lang="ts" name="DataTypeObjectChild">
import { getUnit } from '@/api/device/instance';
import { OtherConfigInfo } from '../components'
import {
    DataTableString,
    DataTableArray,
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
const formData = ref(props.value?.valueType);
const type = ref(props.value?.valueType?.type);



console.log('dataTypeObject1', formData.value);
const emit = defineEmits(['update:value', 'cancel']);

const options = ref<{ label: string; value: string }[]>([]);

const text = computed(() => {
    console.log('dataTypeObject2', formData.value);
    const value = props.value?.valueType
    if (value) {
        switch(type.value) {
            case 'float':
            case 'double':
                return value.scale;
            case 'boolean':
                return value?.trueText ? `${ value?.trueText }-${ value.trueValue }; ${ value.falseText }-${ value.falseValue }` : '';
            case 'string':
            case 'password':
                return value?.maxLength;
            case 'int':
            case 'long':
                return '无'
        }
    } else {
        return ''
    }
    
})

watch(
    () => formData.value?.type,
    () => {
        console.log('dataTypeObject3', formData.value);
        if (formData.value?.type && ['float', 'double', 'int', 'long'].includes(formData.value.type)) {
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

<style scoped lang="less">
.values {
    display: flex;
    gap: 12px;
    align-items: center;

    .values-test {
        flex: 1;
    }
}
</style>
