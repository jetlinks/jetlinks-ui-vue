<template>
    <j-modal
        :width="1000"
        @cancel="emit('close')"
        @ok="emit('close')"
        visible
        title="关联告警"
    >
        <a-button type="primary">
          添加告警
        </a-button>
        <div style="margin-bottom: 8px">关联告警数量：{{ count }}</div>
        <div style="margin-bottom: 12px">注意：关联的告警配置处于“禁用”状态时会导致场景联动无法完成执行动作</div>
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
                                column: 'id$rule-bind-alarm',
                                value: `${id}:${actionId}`,
                            },
{
                          column: 'branchIndex$rule-bind-alarm',
                          value: `${id}:${-1}`,
                        },
                        ],
                    },
                    // {
                    //   type: 'and',
                    //   terms: [
                    //     {
                    //       column: 'features',
                    //       termType: 'in',
                    //       value: [
                    //         'alarmTrigger', 'alarmReliever'
                    //       ]
                    //     },
                    //     {
                    //       column: 'features',
                    //       termType: 'in',
                    //       value: 1,
                    //       type: 'or'
                    //     }
                    //   ]
                    // }
                ],
            }"
        >
            <template #level="slotProps">
              <j-ellipsis>
                {{ levelList.find(i => slotProps.level === i.level)?.title || '' }}
              </j-ellipsis>
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
          <template #actions>
            <a-button type="link" danger>
              取消关联
            </a-button>

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
    actionId: {
      type: String,
      default: undefined
    },
    branchId: {
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
    {
      dataIndex: 'actions',
      title: '操作',
      width: 120
    }
];
watch(
    () => props.id,
    (newId) => {
        if (newId) {
            getAlarmConfigCount({
                terms: [
                    {
                        column: 'id$rule-bind-alarm',
                        // value: newId,
                        value: props.branchId ? `${newId}:${props.branchId}` : newId,
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
