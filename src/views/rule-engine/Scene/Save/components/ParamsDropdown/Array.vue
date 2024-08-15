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
                      <a-input :placeholder="$t('ParamsDropdown.Array.5425856-0')" v-model:value="myValue" @change="onSelect"/>
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
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
type Emit = {
    (e: 'update:value', data: Array<ValueType>): void;
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
const myValue = ref<string>();
const mySource = ref<string>(props.source);
const label = ref<any>('[]');
const visible = ref(false);
const tabsChange = (e: string) => {
    mySource.value = e;
    emit('update:source', mySource.value);
};

const onSelect = () => {
    const _value = myValue.value.split(',')
    emit('update:value', _value);
    label.value = JSON.stringify(_value)
    emit('select', _value, myValue.value, label.value);
};

const visibleChange = (v: boolean) => {
    visible.value = v;
};

watch(()=>props.value,() => {
    if (props.value?.every(item => !item)) {
      myValue.value = undefined
      label.value = '[]'
    } else {
      myValue.value = props.value.toString()
      label.value = JSON.stringify(props.value)
    }
}, { immediate: true })
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
