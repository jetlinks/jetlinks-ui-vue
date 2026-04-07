<template>
  <a-modal
    open
    :title="$t('Save.index.021458-0')"
    :okText="$t('Save.index.021458-1')"
    :cancelText="$t('Save.index.021458-2')"
    :maskClosable="false"
    :width="1000"
    :loading="loading"
    @cancel="closeModal"
    @ok="saveCorrelation"
  >
    <pro-search :columns="columns" type="simple" @search="handleSearch" />
    <div style="height: 500px; overflow-y: auto">
      <JProTable
        mode="CARD"
        ref="tableRef"
        :request="query"
        :gridColumns="[1, 1, 1]"
        :defaultParams="{
          sorts: [
            {
              name: 'createTime',
              order: 'desc',
            },
          ],
          terms: [
            {
              column: 'triggerType',
              value: props.type === 'scene' ? null : props.type === 'collector' ? 'collector' : 'device',
            },
            {
              terms: [
                {
                  column: 'features',
                  termType: 'in',
                  value: ['alarmTrigger', 'alarmReliever'],
                },
                {
                  column: 'features',
                  termType: 'isnull',
                  value: 1,
                  type: 'or',
                },
              ],
              type: 'and',
            },
          ],
        }"
        :params="params"
      >
        <template #card="slotProps">
          <SceneCardBox
            :value="slotProps"
            :status="slotProps.state?.value"
            :statusText="slotProps.state?.text"
            :alarmId="id"
            :activeKeys="activeKeys[slotProps.id]"
            :selectedKeys="selectedKeysMap[slotProps.id]"
            :showMask="true"
            @change="(key, selected) => onAlarmChange(key, selected, slotProps)"
            @reload="reload"
          />
        </template>
      </JProTable>
    </div>
  </a-modal>
</template>

<script lang="ts" setup name="SceneSave">
import { query, queryType } from "../../../../../../api/scene";
import { bindScene, queryBindScene } from "../../../../../../api/configuration";
import { onlyMessage } from "@jetlinks-web/utils";
import SceneCardBox from "./CardBox.vue";
import { useRequest } from "@jetlinks-web/hooks";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const columns = [
  {
    title: $t('Save.index.021458-3'),
    dataIndex: "name",
    key: "name",
    search: {
      type: "string",
    },
  },
  {
    title: $t('Save.index.021458-4'),
    dataIndex: "triggerType",
    key: "triggerType",
    search: {
      type: "select",
      options: async () => {
        const res = await queryType();
        return res.result.filter(item => {
          if (props.type === 'collector') {
            return item.provider === props.type
          }

          if (['device', 'product', 'organization'].includes(props.type)) {
            return item.provider === 'device'
          }

          return true
        }).map((item) => {
          return {
            label: item.name,
            value: item.provider,
          };
        })
      },
    },
  },
  {
    title: $t('Save.index.021458-8'),
    dataIndex: "state",
    key: "state",
    search: {
      type: "select",
      options: [
        {
          label: $t('Save.index.021458-9'),
          value: "started",
        },
        {
          label: $t('Save.index.021458-10'),
          value: "disable",
        },
      ],
    },
  },
];
const props = defineProps({
  id: {
    type: String,
  },
  type: {
    type: String,
  },
});

const terms = [
  {
    terms: [
      {
        column: "id",
        termType: "alarm-bind-rule$not",
        value: props.id,
        type: "and",
      },
      {
        column: "triggerType",
        termType: "eq",
        value: props.type === "other" ? undefined : "device",
      },
    ],
    type: "and",
  },
];

const params = ref();
const tableRef = ref();

const selectedKeysMap = reactive({});
const loading = ref(false);

const { data: activeKeys } = useRequest(queryBindScene, {
  defaultParams: { terms: [{ column: "alarmId", value: props.id }] },
  onSuccess(res) {
    const activeMap = res.result.data.reduce((prev, next) => {
      if (prev[next.ruleId]) {
        prev[next.ruleId].push(next.branchIndex);
      } else {
        prev[next.ruleId] = [next.branchIndex];
      }
      return prev;
    }, {});
    return activeMap || {};
  },
  defaultValue: {},
});

const handleSearch = (e: any) => {
  params.value = e;
};
const emit = defineEmits(["closeSave", "saveScene"]);

const saveCorrelation = async () => {
  if (Object.keys(selectedKeysMap).length > 0 && Object.keys(selectedKeysMap).some(i => selectedKeysMap[i].length > 0)) {
    const list = Object.keys(selectedKeysMap).reduce((prev, next) => {
      const branches = selectedKeysMap[next].map((key) => {
        return {
          alarmId: props.id,
          ruleId: next,
          branchIndex: key,
        };
      });
      prev.push(...branches);
      return prev;
    }, []);

    loading.value = true;
    const res = await bindScene(list).finally(() => {
      loading.value = false;
    });
    if (res.success) {
      onlyMessage($t('Save.index.021458-11'));
      emit("saveScene");
    }
  } else {
    onlyMessage($t('Save.index.021458-12'), "error");
  }
};
const closeModal = () => {
  emit("closeSave");
};

const reload = () => {
  tableRef.value?.reload();
};

const onAlarmChange = (
  key: string,
  selected: boolean,
  record: Record<string, any>
) => {
  const keys = selectedKeysMap[record.id];

  const keySet = new Set(keys);
  if (selected) {
    keySet.add(key);
  } else {
    keySet.delete(key);
  }

  if (keySet.size === 0) {
    delete selectedKeysMap[record.id];
  }

  selectedKeysMap[record.id] = [...keySet.values()];
};
</script>
<style lang="less" scoped>
.subTitle {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  margin-top: 10px;
}

.condition-name {
  font-size: 16px;
  font-weight: bold;
}

.branch-terms-items {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 12px;
}
</style>
