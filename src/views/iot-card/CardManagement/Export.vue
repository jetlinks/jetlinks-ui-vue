<template>
    <!-- 导入 -->
    <j-modal
        :maskClosable="false"
        :visible="true"
        title="导出"
        okText="确定"
        cancelText="取消"
        @ok="handleOk"
        @cancel="handleCancel"
    >
        <div style="margin-top: 10px">
            <j-space>
                <span>文件格式：</span>
                <j-radio-group
                    v-model:value="type"
                    placeholder="请选择文件格式"
                    button-style="solid"
                >
                    <j-radio-button value="xlsx">xlsx</j-radio-button>
                    <j-radio-button value="csv">csv</j-radio-button>
                </j-radio-group>
            </j-space>
        </div>
    </j-modal>
</template>

<script setup lang="ts">
import moment from 'moment';
import { _export } from '@/api/iot-card/cardManagement';
import { downloadFileByUrl } from '@/utils/utils';

const emit = defineEmits(['close']);

const props = defineProps({
    data: {
        type: Object,
        default: undefined,
    },
});

const type = ref<string>('xlsx');

const handleOk = () => {
    _export(type.value, props.data).then((res: any) => {
        if (res) {
            const blob = new Blob([res.data], { type: type.value });
            const url = URL.createObjectURL(blob);
            downloadFileByUrl(
                url,
                `物联卡管理-${moment(new Date()).format(
                    'YYYY/MM/DD HH:mm:ss',
                )}`,
                type.value,
            );
            emit('close');
        }
    });
};

const handleCancel = () => {
    emit('close');
};
</script>

<style scoped lang="less"></style>
