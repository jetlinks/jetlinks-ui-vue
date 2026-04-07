<template>
  <a-modal
    open
    :title="$t('TriggerAlarm.AlarmModal.966772-0')"
    :width="1000"
    :keyboard="false"
    :mask="false"
    :maskClosable="false"
    :loading="loading"
    @cancel="onCancel"
    @ok="onOk"
  >
    <pro-search
      :columns="columns"
      type="simple"
      @search="handleSearch"
      style="padding: 0"
    />
    <div style="height: 400px">
      <JProTable
        mode="CARD"
        :columns="columns"
        :request="queryAlarmPage"
        :bodyStyle="{ padding: 0 }"
        :gridColumns="[1]"
        :defaultParams="{
          sorts: [{ name: 'createTime', order: 'desc' }],
          terms: [
            {
              terms: [
                {
                  column: 'id$rule-bind-alarm$not',
                  value: `${id}:${actionId || branchId}`,
                },
                {
                  column: 'branchIndex$rule-bind-alarm$not',
                  value: `${id}:${-1}`,
                  type: 'and',
                },
                {
                  column:
                    'targetType',
                    value: targetType === 'device' ? 'collector' : targetType === 'collector' ? ['collector', 'scene'] : 'scene',
                    type: 'and',
                    termType: targetType === 'device' ? 'neq' : targetType === 'collector' ? 'in' : 'eq',
                },
              ],
            },
          ],
        }"
        :rowSelection="{
          selectedRowKeys: selectKeys,
          onSelectNone: cancelSelect,
        }"
        :params="params"
      >
        <template #card="slotProps">
          <CardBox
            :value="slotProps"
            :active="selectKeys.includes(slotProps.id)"
            :status="slotProps.state?.value"
            :statusText="slotProps.state?.text"
            :statusNames="{
              enabled: 'processing',
              disabled: 'error',
            }"
            @click="handleClick"
            :imgUrl="ConfigurationImages.alarmConfig"
          >
            <template #content>
              <div
                style="
                  margin-top: 36px;
                  display: flex;
                  gap: 6px;
                  line-height: 1;
                "
              >
                <LevelIcon :level="slotProps.level" />
                <div style="flex: 1 1 0; min-width: 0;line-height: 1.15">
                  <j-ellipsis>
                    {{ slotProps.name }}
                  </j-ellipsis>
                </div>
              </div>
            </template>
          </CardBox>
        </template>
      </JProTable>
    </div>
  </a-modal>
</template>

<script setup name="AlarmModal">
import { queryAlarmPage } from "@rule-engine-manager-ui/api/scene";
import { useRequest } from "@jetlinks-web/hooks";
import { useAlarmLevel } from "@rule-engine-manager-ui/hook";
import { bindScene, getTargetTypes } from "@rule-engine-manager-ui/api/configuration";
import { onlyMessage } from "@jetlinks-web/utils";
import { ConfigurationImages } from "@rule-engine-manager-ui/assets";
import LevelIcon from '@rule-engine-manager-ui/components/AlarmLevelIcon/index.vue'
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();
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

const emit = defineEmits(["cancel", "ok"]);

const params = ref({});
const selectKeys = ref([]);

const { run, loading } = useRequest(bindScene, {
  immediate: false,
  onSuccess() {
    emit("ok");
    onlyMessage($t("TriggerAlarm.AlarmModal.966772-1"));
  },
});

const { levelMap, levelList } = useAlarmLevel();

const columns = [
  {
    title: $t("TriggerAlarm.AlarmModal.966772-2"),
    dataIndex: "targetType",
    search: {
      type: "select",
      options: async () => {
        const resp = await getTargetTypes();
        if (resp.success) {
          return resp.result
            .filter((item) => {
              if (item.id === 'networkCardPool') {
                return false
              }
              return (item.id === props.targetType || item.id === "scene") || (props.targetType === 'device' && item.id !== 'collector');
            })
            .map((item) => ({ label: item.name, value: item.id }))
        } else {
          return [];
        }
      },
    },
  },
  {
    title: $t("TriggerAlarm.AlarmModal.966772-3"),
    dataIndex: "name",
    key: "name",
    search: {
      type: "string",
    },
    width: 220,
    ellipsis: true,
  },
  {
    title: $t("TriggerAlarm.AlarmModal.966772-4"),
    dataIndex: "state",
    key: "state",
    scopedSlots: true,
    search: {
      type: "select",
      options: [
        {
          label: $t("TriggerAlarm.AlarmModal.966772-5"),
          value: "enabled",
        },
        {
          label: $t("TriggerAlarm.AlarmModal.966772-6"),
          value: "disabled",
        },
      ],
    },
    width: 90,
  },
  {
    title: $t("TriggerAlarm.AlarmModal.966772-7"),
    dataIndex: "level",
    key: "level",
    scopedSlots: true,
    search: {
      type: "select",
      options: async () => {
        return levelList.value;
      },
    },
    width: 200,
  },
];

const handleSearch = (e) => {
  params.value = e;
};

const handleClick = (record) => {
  const selectSet = new Set(selectKeys.value);

  if (selectSet.has(record.id)) {
    selectSet.delete(record.id);
  } else {
    selectSet.add(record.id);
  }

  selectKeys.value = [...selectSet.values()];
};

const cancelSelect = () => {
  selectKeys.value = [];
};

const onCancel = () => {
  emit("cancel");
};

const onOk = async () => {
  if (selectKeys.value.length) {
    run(
      selectKeys.value.map((key) => {
        return {
          alarmId: key,
          ruleId: props.id,
          branchIndex: props.actionId,
        };
      })
    );
  } else {
    onlyMessage($t("TriggerAlarm.AlarmModal.966772-8"), "warning");
  }
};
</script>

<style scoped></style>
