<template>
    <j-modal
        visible
        title="关联告警"
        :width="1000"
        :keyboard="false"
        :maskClosable="false"
        :footer="null"
        @cancel="emit('close')"
        @ok="emit('close')"
    >
      <div class="related-alarms-content">
        <div class="related-alarms-add-btn">
          <a-button type="link" @click="showAlarm">
            <template #icon>
              <AIcon type="PlusOutlined"/>
            </template>
            关联告警
          </a-button>
        </div>
        <div class="related-alarms-total" style="margin-bottom: 8px">关联告警数量：<span>{{ count }}</span></div>
        <div class="related-alarms-tip" >注意：关联的告警配置处于“禁用”状态时会导致场景联动无法完成执行动作</div>
        <JProTable
            ref="tableRef"
            model="TABLE"
            :columns="columns"
            :request="queryData"
            :bodyStyle="{ padding: 0 }"
            :defaultParams="{
                sorts: [{ name: 'createTime', order: 'desc' }],
                terms: [
                    {
                        terms: [
                            {
                                column: 'id$rule-bind-alarm',
                                value: `${id}:${actionId || branchId}`,
                            },
                            {
                              column: 'id$rule-bind-alarm',
                              value: `${id}:${-1}`,
                              type: 'or'
                            },
                        ],
                    },
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
            <template #action="slotProps">
              <PermissionButton
                danger
                type="link"
                style="padding: 0;"
                :popConfirm="{
                  title: '确认取消关联',
                  onConfirm: () => {
                    unBind(slotProps)
                  }
                }"
                :tooltip="{
                  title: '取消关联'
                }"
              >
                <AIcon type="DisconnectOutlined" />
              </PermissionButton>

            </template>
        </JProTable>
      </div>

    </j-modal>
  <AlarmModal
    v-if="visible"
    v-bind="props"
    @ok="onOk"
    @cancel="visible = false"
  />
</template>

<script setup lang="ts">
import { queryAlarmPage } from '@/api/rule-engine/scene';
import {
    getAlarmLevel,
    getAlarmConfigCount,
} from '@/api/rule-engine/dashboard';
import AlarmModal from "./AlarmModal.vue";
import {unBindAlarm} from "@/api/rule-engine/configuration";
import {onlyMessage} from "@/utils/comm";
import { EventEmitter } from '@/views/rule-engine/Scene/Save/util'

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
    targetType: {
      type: String
    }
});

const emit = defineEmits(['close']);

const count = ref<number>(0);
const levelList = ref<any[]>([]);

const visible = ref(false)
const tableRef = ref()

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
      dataIndex: 'action',
      title: '操作',
      width: 80,
      scopedSlots: true,
    }
];

/**
 * 发布订阅
 */
const eventEmit = () => {
  const _key = props.actionId || props.branchId
  EventEmitter.emit(`${_key}_alarm`, { updateTime: new Date().getTime()})
}

const onOk = () => {
  visible.value = false
  tableRef.value.reload()

  eventEmit()
}

const showAlarm = () => {
  visible.value = true
}

const unBind = async (record: any) => {
  const res = await unBindAlarm(props.id, record.id, [props.actionId])
  if (res.success) {
    tableRef.value.reload()
    onlyMessage('操作成功！')
    eventEmit()
  }
}

const queryData = async (terms: any) => {

  const resp = await queryAlarmPage(terms)

  count.value = resp.result.total

  return {
    code: resp.status,
    result: resp.result,
    status: resp.status,
  };
}

// watch(
//     () => props.id,
//     (newId) => {
//         if (newId) {
//             getAlarmConfigCount({
//                 terms: [
//                     {
//                         column: 'id$rule-bind-alarm',
//                         // value: newId,
//                         value: props.branchId ? `${newId}:${props.branchId}` : newId,
//                     },
//                 ],
//             }).then((resp) => {
//                 if (resp.status === 200) {
//                     count.value = (resp.result || 0) as number;
//                 }
//             });
//         }
//     },
//     { immediate: true },
// );

onMounted(() => {
    getAlarmLevel().then((resp) => {
        if (resp.status === 200) {
            levelList.value = resp.result?.levels || []
        }
    });
});
</script>
<style scoped lang="less">
.related-alarms-content {
  position: relative;

  .related-alarms-add-btn {
    position: absolute;
    top: 0;
    right: 0;
  }

  .related-alarms-total {
    font-size: 16px;
    color: #1a1a1a;

    >span {
      color: #1677FF;
    }
  }

  .related-alarms-tip {
    font-size: 12px;
    color: #777;
    margin-bottom: 12px
  }
}
</style>
