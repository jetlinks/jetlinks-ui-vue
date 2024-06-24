<template>
    <a-modal visible title="提醒" @cancel="$emit('close')" @ok="deleteConfig">
        {{
            `删除告警配置将同步删除相关联的${alarmRecordNumber}条告警记录确认删除？`
        }}
    </a-modal>
</template>

<script setup>
import { query } from '@/api/rule-engine/log';
import { remove } from '@/api/rule-engine/configuration';
import { onlyMessage } from '@/utils/comm';
const props = defineProps({
    id: {
        type: String,
        default: '',
    },
});
const emit = defineEmits(['close']);
const alarmRecordNumber = ref(0);
const deleteConfig = async () => {
    const resp = await remove(props.id);
    if (resp.status === 200) {
        onlyMessage('操作成功！');
        emit('refreshTable');
    } else {
        onlyMessage('操作失败！', 'error');
    }
};
const queryRecord = () => {
    const params = {
        paging: false,
        terms: [
            {
                termType: 'eq',
                column: 'alarmConfigId',
                value: props.id,
                type: 'and',
            },
        ],
    };
    query(params).then((res) => {
        if (res.success) {
            alarmRecordNumber.value = res.result?.total || 0;
        }
    });
};
onMounted(() => {
    queryRecord();
});
</script>
<style lang="less" scoped></style>
