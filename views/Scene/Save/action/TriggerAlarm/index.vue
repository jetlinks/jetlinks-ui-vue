<template>
  <a-modal
    open
    :title="$t('TriggerAlarm.index.966773-0')"
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
            <AIcon type="PlusOutlined" />
          </template>
          {{ $t('TriggerAlarm.index.966773-0') }}
        </a-button>
      </div>
      <div class="related-alarms-total" style="margin-bottom: 8px">
        {{ $t('TriggerAlarm.index.966773-1') }}<span>{{ count }}</span>
      </div>
      <div class="related-alarms-tip">
        {{ $t('TriggerAlarm.index.966773-2') }}
      </div>
      <JProTable
        ref="tableRef"
        mode="TABLE"
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
                  type: 'or',
                },
              ],
            },
          ],
        }"
      >
        <template #level="slotProps">
          <div style="display: flex">
            <LevelIcon :level="slotProps.level"></LevelIcon>
            <j-ellipsis>
              {{ levelMap[slotProps.level] }}
            </j-ellipsis>
          </div>
        </template>
        <template #targetType="slotProps">
          {{ supports?.find(item => item.value === slotProps.targetType)?.label }}
        </template>
        <template #state="slotProps">
          <a-badge
            :text="slotProps.state?.text"
            :status="
              slotProps.state?.value === 'disabled' ? 'error' : 'success'
            "
          />
        </template>
        <template #action="slotProps">
          <j-permission-button
            danger
            type="link"
            style="padding: 0"
            :popConfirm="{
              title: $t('TriggerAlarm.index.966773-3'),
              onConfirm: () => {
                unBind(slotProps);
              },
            }"
            :tooltip="{
              title: $t('TriggerAlarm.index.966773-4'),
            }"
          >
            <AIcon type="DisconnectOutlined" />
          </j-permission-button>
        </template>
      </JProTable>
    </div>
  </a-modal>
  <AlarmModal
    v-if="visible"
    v-bind="props"
    @ok="onOk"
    @cancel="visible = false"
  />
</template>

<script setup lang="ts">
import { queryAlarmPage } from "@rule-engine-manager-ui/api/scene";
import AlarmModal from "./AlarmModal.vue";
import {
  queryBindScene,
  unBindAlarm,
  unbindScene,
} from "@rule-engine-manager-ui/api/configuration";
import { onlyMessage } from "@jetlinks-web/utils";
import { EventEmitter } from "../../util";
import { useRequest } from '@jetlinks-web/hooks';
import { useAlarmLevel } from "@rule-engine-manager-ui/hook";
import LevelIcon from '@rule-engine-manager-ui/components/AlarmLevelIcon/index.vue'
import { useI18n } from 'vue-i18n'
import {useAlarmConfigType} from "@rule-engine-manager-ui/hook/useAlarmConfigType";

const { t: $t } = useI18n()

const props = defineProps({
  id: {
    type: String,
    default: "",
  },
  actionId: {
    type: String,
    default: undefined,
  },
  branchId: {
    type: String,
    default: "",
  },
  targetType: {
    type: String,
  },
});

const emit = defineEmits(["close"]);

const count = ref<number>(0);

const visible = ref(false);
const tableRef = ref();
const { levelMap } = useAlarmLevel();

const { data: activeKeys } = useRequest<any, Record<string, any>>(
  queryBindScene,
  {
    defaultParams: { terms: [{ column: "ruleId", value: props.id }] },
    onSuccess(res) {
      const _result = res.result.data || [];
      return _result.reduce(
        (
          prev: Record<string, any>,
          next: { branchIndex: string; ruleId: string }
        ) => {
          prev[next.ruleId] = next.branchIndex;
          return prev;
        },
        {}
      );
    },
    defaultValue: [],
  }
);


const { supports } = useAlarmConfigType();

const columns = [
  {
    dataIndex: "name",
    fixed: "left",
    ellipsis: true,
    title: $t('TriggerAlarm.index.966773-9'),
  },
  {
    dataIndex: "targetType",
    title: $t('TriggerAlarm.index.966773-10'),
    scopedSlots: true,
  },
  {
    dataIndex: "level",
    title: $t('TriggerAlarm.index.966773-11'),
    scopedSlots: true,
  },
  {
    dataIndex: "state",
    title: $t('TriggerAlarm.index.966773-12'),
    scopedSlots: true,
  },
  {
    dataIndex: "description",
    title: $t('TriggerAlarm.index.966773-13'),
    ellipsis: true,
  },
  {
    dataIndex: "action",
    title: $t('TriggerAlarm.index.966773-14'),
    width: 80,
    scopedSlots: true,
  },
];

/**
 * 发布订阅
 */
const eventEmit = () => {
  const _key = props.actionId || props.branchId;
  EventEmitter.emit(`${_key}_alarm`, { updateTime: new Date().getTime() });
};

const onOk = () => {
  visible.value = false;
  tableRef.value.reload();

  eventEmit();
};

const showAlarm = () => {
  visible.value = true;
};

const unBind = async (record: any) => {
  const branchId = activeKeys.value![props.id];
  const res =
    branchId === -1
      ? await unbindScene(record.id, [props.id])
      : await unBindAlarm(props.id, record.id, [
          props.actionId || props.branchId,
        ]);
  if (res.success) {
    tableRef.value.reload();
    onlyMessage($t('TriggerAlarm.index.966773-15'));
    eventEmit();
  }
};

const queryData = async (terms: any) => {
  const resp:any = await queryAlarmPage(terms);

  count.value = resp.result.total;

  return {
    ...resp
  };
};
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

    > span {
      color: #1677ff;
    }
  }

  .related-alarms-tip {
    font-size: 12px;
    color: #777;
    margin-bottom: 12px;
  }
}
</style>
