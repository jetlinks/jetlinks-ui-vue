<template>
    <a-modal
        v-model:visible="dialog.visible"
        title="菜单图标"
        width="800px"
        @ok="dialog.handleOk"
    >
        <a-radio-group v-model:value="selected" class="radio">
            <a-radio-button
                v-for="typeStr in iconKeys"
                :value="typeStr"
                :class="{ active: selected === typeStr }"
            >
                <a-icon :type="typeStr" />
            </a-radio-button>
        </a-radio-group>
    </a-modal>
</template>

<script setup lang="ts">
const emits = defineEmits(['confirm']);
const iconKeys = [
    'EyeOutlined',
    'EditOutlined',
    'PlusOutlined',
    'DeleteOutlined',
    'CheckCircleOutlined',
    'StopOutlined',
    'CheckOutlined',
    'CloseOutlined',
    'DownOutlined',
    'ImportOutlined',
    'ExportOutlined',
    'SyncOutlined',
    'ExclamationCircleOutlined',
    'UploadOutlined',
    'LoadingOutlined',
    'PlusCircleOutlined',
    'QuestionCircleOutlined',
    'DisconnectOutlined',
    'LinkOutlined',
    'PoweroffOutlined',
    'SwapOutlined',
    'BugOutlined',
    'BarsOutlined',
    'ArrowDownOutlined',
    'SmallDashOutlined',
    'TeamOutlined',
    'MenuUnfoldOutlined',
    'MenuFoldOutlined',
    'QuestionCircleOutlined',
    'InfoCircleOutlined',
    'SearchOutlined',
];

const dialog = reactive({
    visible: false,
    handleOk: () => {
        emits('confirm', selected.value);
        dialog.changeVisible();
        selected.value = '';
    },
    changeVisible: (show?: boolean) => {
        dialog.visible = show === undefined ? !dialog.visible : show;
    },
});

const selected = ref<string>('');

// 将打开弹窗的操作暴露给父组件
defineExpose({
    openDialog: dialog.changeVisible,
});
</script>

<style lang="less" scoped>
.radio {
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(6, 1fr);
    max-height: 500px;
    overflow-y: auto;

    .ant-radio-button-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100px;
        font-size: 40px;
        border: 2px solid #efefef;
        border-radius: 2px;
        cursor: pointer;

        &.active {
            color: #415ed1;
            border-color: #415ed1;
        }
    }
}
</style>
