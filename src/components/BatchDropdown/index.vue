<template>
    <div>
        <a-space v-if="_item.key && visible">
            <j-permission-button
                :type="'primary'"
                :ghost="true"
                :hasPermission="_item.permission ? _item.permission : true"
                v-bind="{ ..._item, ..._item.selected }"
            >
                <template #icon><AIcon :type="_item.icon" /></template>
                {{ _item.text }}
            </j-permission-button>
            <a-button type="link" @click="reload"
                ><AIcon type="RedoOutlined" />重选</a-button
            >
        </a-space>
        <a-dropdown :overlayStyle="{ zIndex: 1000 }" v-else>
            <a-button>批量操作 <AIcon type="DownOutlined" /></a-button>
            <template #overlay>
                <a-menu @click="handleMenuClick">
                    <a-menu-item v-for="item in actions" :key="item.key">
                        <j-permission-button
                            :hasPermission="
                                item.permission ? item.permission : true
                            "
                            v-bind="omit(item, 'icon')"
                            :popConfirm="
                                item.popConfirm
                                    ? {
                                          ...item.popConfirm,
                                          onCancel: onPopCancel,
                                          onConfirm: (e) =>
                                              onPopConfirm(
                                                  e,
                                                  item?.popConfirm?.onConfirm,
                                              ),
                                      }
                                    : undefined
                            "
                        >
                            <template #icon
                                ><AIcon :type="item.icon"
                            /></template>
                            {{ item.text }}
                        </j-permission-button>
                    </a-menu-item>
                </a-menu>
            </template>
        </a-dropdown>
    </div>
</template>

<script lang="ts" setup name="BatchDropdown">
import { PropType } from 'vue';
import { BatchActionsType } from './types';
import { defineExpose } from 'vue';
import { AIcon } from '@jetlinks-web/components'
import {omit} from "lodash-es";

const props = defineProps({
    actions: {
        type: Array as PropType<BatchActionsType[]>,
        default: () => [],
    },
    isCheck: {
        type: Boolean,
        default: false,
    },
});

const emits = defineEmits(['update:isCheck', 'change']);

const visible = ref<boolean>(false);
const _item = ref<Partial<BatchActionsType>>({});

const handleMenuClick = (e: any) => {
    const val = props.actions.find((item) => item.key === e.key);
    if(!(val?.popConfirm || val?.onClick)){
        emits('update:isCheck', true);
        emits('change', true);
        visible.value = true;
    } else {
        visible.value = false;
    }
    _item.value = (val || {}) as any;
};

const reload = () => {
    _item.value = {};
    emits('update:isCheck', false);
    emits('change', false);
};

const onPopConfirm = (e: any, fun: any) => {
    if (fun) {
        onPopCancel();
        return fun(e);
    }
};

const onPopCancel = () => {
    visible.value = false;
};
defineExpose({
    reload
})
</script>

<style lang="less" scoped>
</style>
