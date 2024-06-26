<template>
    <j-dropdown
        class="scene-select-value"
        trigger="click"
        v-model:visible="visible"
        :overlayStyle="{
            maxWidth: '300px',
        }"
        @visibleChange="visibleChange"
    >
        <div @click.prevent="visible = true">
            <slot :label="label">
                <div class="dropdown-button value">
                    <AIcon v-if="!!icon" :type="icon" />
                    <Ellipsis style="max-width: 220px">
                        {{ label }}
                    </Ellipsis>
                </div>
            </slot>
        </div>
        <template #overlay>
            <div class="scene-select-content">
                <j-tabs @change="tabsChange" v-model:activeKey="mySource">
                    <j-tab-pane
                        v-for="item in tabsOptions"
                        :tab="item.label"
                        :key="item.key"
                    >
                        <div v-for="(i, index) in myValue" class="scene-select-item">
                            <ArrayItem
                                v-model:value="myValue[index]"
                                :valueName="valueName"
                                :labelName="labelName"
                                :options="options"
                                :component="item.component"
                                :extra="props"
                                @select="(v, l) => onSelect(v, l, index)"
                            />
                        </div>
                        <j-button @click="addItem">+</j-button>
                        <j-button @click="deleteItem">-</j-button>
                    </j-tab-pane>
                </j-tabs>
            </div>
        </template>
    </j-dropdown>
</template>

<script lang="ts" setup name="ArrayParamsDropdown">
import type { ValueType } from './typings';
import { defaultSetting } from './typings';
import ArrayItem from './ArrayItem.vue';
import { cloneDeep } from 'lodash-es';
import { getOption } from '../DropdownButton/util';
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

const props = defineProps({
    ...defaultSetting,
});

const emit = defineEmits<Emit>();
const myValue = ref<ValueType>(cloneDeep(props.value) || [undefined, undefined] as any);
const mySource = ref<string>(props.source);
const label = ref<any>(props.placeholder);
const visible = ref(false);
const tabsChange = (e: string) => {
    mySource.value = e;
    emit('update:source', mySource.value);
};

const onSelect = (v: any, _label: string, index: number) => {
    emit('update:value', myValue.value);
    label.value[index] = _label;
    emit('select', myValue.value, _label, label.value);
};

const visibleChange = (v: boolean) => {
    visible.value = v;
};

const addItem = () => {
    myValue.value?.push(null);
    emit('update:value', myValue.value);
};

const deleteItem = () => {
    myValue.value?.pop();
    emit('update:value', myValue.value);
};

watchEffect(() => {
    const _options = props.options;
    const _value = props.value;
    const _valueName = props.valueName;
    if (Array.isArray(_value) && _value.length) {
        label.value = []
        _value?.filter(i => i).forEach((i: any, index: number) => {
            const option = getOption(_options, i as string, _valueName);
            if (option) {
                label.value.push(option[props.labelName] || option.name);
            } else {
                label.value.push(i);
            }
        });
    }
});

watch(()=>props.value,()=>{
    myValue.value = cloneDeep(props.value);
})
</script>

<style scoped lang="less">
@import '../DropdownButton/index.less';
.manual-time-picker {
    position: absolute;
    top: -2px;
    left: 0;
    border: none;
    visibility: hidden;
    :deep(.ant-picker-input) {
        display: none;
    }
}
</style>
