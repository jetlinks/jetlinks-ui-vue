<template>
    <j-modal
        :width="1000"
        @cancel="emit('close')"
        @ok="emit('close')"
        visible
        title="关联此场景的告警"
    >
        <div style="margin-bottom: 24px">关联告警数量：{{ count }}</div>
        <JProTable
            :columns="columns"
            :request="queryAlarmList"
            model="TABLE"
            :bodyStyle="{ padding: 0 }"
            :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms: [
                    {
                        terms: [
                            {
                                column: 'id',
                                value: id,
                                termType: 'rule-bind-alarm',
                            },
                        ],
                    },
                ],
            }"
        >
            <template #level="slotProps">
                {{ levelList.find(i => slotProps.level === i.level)?.title || '' }}
            </template>
            <template #targetType="slotProps">
                {{ map[slotProps.targetType] }}
            </template>
            <template #state="slotProps">
                <j-badge
                    :text="slotProps.state?.text"
                    :status="
                        slotProps.state?.value === 'disabled'
                            ? 'error'
                            : 'success'
                    "
                />
            </template>
        </JProTable>
    </j-modal>
</template>

<script setup lang="ts">
import { queryAlarmList } from '@/api/rule-engine/scene';
import {
    getAlarmLevel,
    getAlarmConfigCount,
} from '@/api/rule-engine/dashboard';

const props = defineProps({
    id: {
        type: String,
        default: '',
    },
});
const emit = defineEmits(['close']);

const count = ref<number>(0);
const levelList = ref<any[]>([]);

const map = {
    product: '产品',
    device: '设备',
    org: '组织',
    other: '其他',
};

const columns = [
    {
        dataIndex: 'name',
        fixed: 'left',
        ellipsis: true,
        title: '名称',
    },
    {
        dataIndex: 'targetType',
        title: '类型',
        scopedSlots: true,
    },
    {
        dataIndex: 'level',
        title: '告警级别',
        scopedSlots: true,
    },
    {
        dataIndex: 'state',
        title: '状态',
        scopedSlots: true,
    },
    {
        dataIndex: 'description',
        title: '说明',
        ellipsis: true,
    },
];
watch(
    () => props.id,
    (newId) => {
        if (newId) {
            getAlarmConfigCount({
                terms: [
                    {
                        column: 'id$rule-bind-alarm',
                        value: newId,
                    },
                ],
            }).then((resp) => {
                if (resp.status === 200) {
                    count.value = (resp.result || 0) as number;
                }
            });
        }
    },
    { immediate: true },
);

onMounted(() => {
    getAlarmLevel().then((resp) => {
        if (resp.status === 200) {
            levelList.value = resp.result?.levels || []
        }
    });
});
</script>