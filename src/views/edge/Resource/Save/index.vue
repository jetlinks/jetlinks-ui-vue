<template>
    <j-modal visible title="编辑" :width="700" @ok="onSave" @cancel="onCancel">
        <MonacoEditor
            style="width: 100%; height: 370px"
            theme="vs"
            v-model="monacoValue"
            language="json"
        />
    </j-modal>
</template>

<script setup lang="ts">
import MonacoEditor from '@/components/MonacoEditor/index.vue';
import { modify } from '@/api/edge/resource';
import { onlyMessage } from '@/utils/comm';

const props = defineProps({
    data: {
        type: Object,
        default: () => {},
    },
});
const emit = defineEmits(['close', 'save']);

const monacoValue = ref<string>('{}');

watchEffect(() => {
    monacoValue.value = props.data?.metadata || '{}';
});

const onSave = async () => {
    const resp = await modify(props.data.id, { metadata: unref(monacoValue) });
    if (resp.status === 200) {
        emit('save');
        onlyMessage('操作成功', 'success');
    }
};

const onCancel = () => {
    emit('close');
};
</script>

<style lang="less" scoped>
</style>