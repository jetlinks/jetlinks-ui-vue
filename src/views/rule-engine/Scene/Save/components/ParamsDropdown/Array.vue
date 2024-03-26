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
                        <div v-for="(i, index) in myValue">
                            <ArrayItem
                                v-model:value="myValue[index]"
                                :valueName="valueName"
                                :labelName="labelName"
                                :options="options"
                                :component="item.component"
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
const myValue = ref<ValueType>([undefined, undefined] as any);
const mySource = ref<string>(props.source);
const label = ref<any>(props.placeholder);
const visible = ref(false);
const tabsChange = (e: string) => {
    mySource.value = e;
    myValue.value = undefined;
    emit('update:source', mySource.value);
    emit('update:value', undefined);
    emit('tabChange', e);
    emit('select', {}, '', { 0: undefined });
};

const onSelect = (v: any, _label: string, index: number) => {
    console.log(myValue.value,'test')
    // emit('update:value', myValue.value);
    // label.value[index] = _label;
    // emit('select', myValue.value, _label, label);
};

const visibleChange = (v: boolean) => {
    visible.value = v;
};

const addItem = () => {
    myValue.value?.push(null);
};

const deleteItem = () => {
    myValue.value?.pop();
};

watch(
    () => props.value,
    () => {
        myValue.value = cloneDeep(props.value);
        console.log(myValue.value)
    },
    {
        immediate: true,
    },
);
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
