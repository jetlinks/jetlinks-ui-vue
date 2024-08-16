<template>
    <div>
        <j-space v-if="_item.key && visible">
            <PermissionButton
                :type="'primary'"
                :ghost="true"
                :hasPermission="_item.permission ? _item.permission : true"
                v-bind="{ ..._item, ..._item.selected }"
            >
                <template #icon><AIcon :type="_item.icon" /></template>
                {{ _item.text }}
            </PermissionButton>
            <j-button type="link" @click="reload"
                ><AIcon type="RedoOutlined" />{{ $t('BatchDropdown.index.298336-0') }}</j-button
            >
        </j-space>
        <j-dropdown :overlayStyle="{ zIndex: 1000 }" v-else>
            <j-button>{{ $t('BatchDropdown.index.298336-1') }} <AIcon type="DownOutlined" /></j-button>
            <template #overlay>
                <j-menu @click="handleMenuClick">
                    <j-menu-item v-for="item in actions" :key="item.key">
                        <PermissionButton
                            :hasPermission="
                                item.permission ? item.permission : true
                            "
                            v-bind="item"
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
                        </PermissionButton>
                    </j-menu-item>
                </j-menu>
            </template>
        </j-dropdown>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import { BatchActionsType } from './types';
import { defineExpose } from 'vue';
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()

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