<template>
    <div class="select-box-content">
        <DropdownTimePicker
            v-if="['time', 'date'].includes(props.component)"
            type="time"
            v-model:value="myValue"
            @change="timeChange"
        />
        <template
            v-else-if="['select', 'enum', 'boolean'].includes(props.component)"
        >
            <DropdownMenus
                v-if="options.length"
                :options="options"
                :value="myValue"
                :valueName="valueName"
                @click="onSelect"
            />
            <div class="scene-select-empty" v-else>
                <j-empty />
            </div>
        </template>
        <ValueItem
            v-else
            v-model:modelValue="myValue"
            :itemType="props.component"
            :options="options"
            @change="valueItemChange"
        />
    </div>
</template>

<script lang="ts" setup name="ParamsDropdownArrayItem">
import ValueItem from '@/components/ValueItem/index.vue';
import type { ValueType } from './typings';
import { DropdownMenus, DropdownTimePicker } from '../DropdownButton';
import { getOption } from '../DropdownButton/util';
import { defaultSetting } from './typings';
const props = defineProps({
    ...defaultSetting,
    component: {
        type: String,
        default: '',
    },
});
type Emit = {
    (e: 'update:value', data: ValueType): void;
    (e: 'update:source', data: string): void;
    (
        e: 'select',
        data: any,
        label?: string,
        labelObj?: Record<number, any>,
        option?: any,
    ): void;
    (e: 'tabChange', data: any): void;
};
const emit = defineEmits<Emit>();
const label = ref();
const myValue = ref<ValueType>(props.value);
const valueItemChange = (e: string) => {
    label.value = e;
    emit('update:value', e);
    emit('select', e, label.value, { 0: label.value });
};

const onSelect = (e: string, option: any, index: number) => {
    label.value = option[props.labelName];
    emit('update:value', e);
    emit('select', e, label.value, { 0: label.value }, option);
};

const timeChange = (e: any) => {
    label.value = e;
    emit('update:value', e);
    emit('select', e, label.value, { 0: label.value });
};

</script>
<style lang="less" scoped>
@import '../DropdownButton/index.less';
</style>
