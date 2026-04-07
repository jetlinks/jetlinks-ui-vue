<template>
  <a-modal
    open
    :title="$t('HandTrigger.index.0214513-0')"
    :okText="$t('HandTrigger.index.0214513-1')"
    :cancelText="$t('HandTrigger.index.0214513-2')"
    :width="1000"
    :maskClosable="false"
    @cancel="closeModal"
    @ok="saveCorrelation"
  >
    <pro-search :columns="columns"  type="simple" @search="handleSearch" />
    <div style="height: 500px; overflow-y: auto">
      <JProTable
        mode="CARD"
        :request="query"
        :rowSelection="{
          selectedRowKeys: _selectedRowKeys,
          onSelectNone: onSelectChange,
        }"
        :gridColumns="[1, 1, 1]"
        :defaultParams="{
          sorts: [
            {
              name: 'createTime',
              order: 'desc',
            },
          ],
          terms,
        }"
        :params="params"
      >
        <template #card="slotProps">
          <!-- <CardBox
                        :value="slotProps"
                        :status="slotProps.state?.value"
                        :statusText="slotProps.state?.text"
                        :active="_selectedRowKeys.includes(slotProps.id)"
                        @click="handleClick"
                        :statusNames="{
                            started: 'processing',
                            disable: 'error',
                        }"
                        :disabled="slotProps.state?.value === 'disable'"
                    >
                        <template #type>
                            <span
                                ><img
                                    :height="16"
                                    :src="
                                        typeMap.get(slotProps.triggerType)?.icon
                                    "
                                    style="margin-right: 5px"
                                />{{
                                    typeMap.get(slotProps.triggerType)?.text
                                }}</span
                            >
                        </template>
                        <template #img>
                            <img
                                :src="typeMap.get(slotProps.triggerType)?.img"
                            />
                        </template>
                        <template #content>
                            <j-ellipsis style="width: calc(100% - 100px)">
                                <span style="font-size: 16px; font-weight: 600">
                                    {{ slotProps.name }}
                                </span>
                            </j-ellipsis>
                            <j-ellipsis :lineClamp="2">
                                <div class="subTitle">
                                    说明：{{
                                        slotProps?.description ||
                                        typeMap.get(slotProps.triggerType)?.tip
                                    }}
                                </div>
                            </j-ellipsis>
                        </template>
                    </CardBox> -->
          <SceneCardBox
            :value="slotProps"
            :status="slotProps.state?.value"
            :statusText="slotProps.state?.text"
            :alarmId="props.data.id"
            :activeKeys="activeKeys[slotProps.id]"
            :selected="_selectedRowKeys.includes(slotProps.id)"
            @click="() => handleClick(slotProps)"
          ></SceneCardBox>
        </template>
      </JProTable>
    </div>
  </a-modal>
</template>

<script setup>
import { onlyMessage } from "@jetlinks-web/utils";
import { query } from "../../../../api/scene";
import { queryBindScene , _execute} from "../../../../api/configuration.ts";
import SceneCardBox from "./components/CardBox.vue";
import { useRequest } from "@jetlinks-web/hooks";
import { ConfigurationImages } from "../../../../assets/index";
import { useI18n } from 'vue-i18n';

const { t: $t } = useI18n();
const columns = [
  {
    title: $t('HandTrigger.index.0214513-3'),
    dataIndex: "id",
    key: "id",
    search: {
      type: "select",
      options: async () => {
        const res = await query({
          sorts: [
            {
              name: "createTime",
              order: "desc",
            },
          ],
          terms: [
            {
              column: "id",
              termType: "alarm-bind-rule",
              value: props.data?.id,
            },
            {
              column: "triggerType",
              termType: "eq",
              value: "manual",
            },
          ],
        });
        if (res.status === 200) {
          return res.result.data.map((item) => ({
            label: item.name,
            value: item.id,
          }));
        }
        return [];
      },
    },
  },
  {
    title: $t('HandTrigger.index.0214513-4'),
    dataIndex: "triggerType",
    key: "triggerType",
  },
  {
    title: $t('HandTrigger.index.0214513-5'),
    dataIndex: "state",
    key: "state",
    search: {
      type: "select",
      options: [
        {
          label: $t('HandTrigger.index.0214513-6'),
          value: "started",
        },
        {
          label: $t('HandTrigger.index.0214513-7'),
          value: "disable",
        },
      ],
    },
  },
];
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const terms = [
  {
    terms: [
      {
        column: "id",
        termType: "alarm-bind-rule",
        value: props.data?.id,
      },
      {
        column: "triggerType",
        termType: "eq",
        value: props.data?.sceneTriggerType,
      },
    ],
  },
  {
    terms: [
      {
        column: "features",
        termType: "in",
        value: ["alarmTrigger", "alarmReliever"],
      },
      {
        column: "features",
        termType: "isnull",
        value: 1,
        type: "or",
      },
    ],
    type: "and",
  },
];

const params = ref();

const typeMap = new Map();
typeMap.set("manual", {
  text: $t('HandTrigger.index.0214513-8'),
  img: ConfigurationImages.sceneHand,
  icon: ConfigurationImages.manualIcon,
  tip: $t('HandTrigger.index.0214513-9'),
});

const _selectedRowKeys = ref([]);

const handleClick = (dt) => {
  if (dt.state?.value === "disable") {
    onlyMessage($t('HandTrigger.index.0214513-10'), "error");
    return;
  }
  if (_selectedRowKeys.value.includes(dt.id)) {
    const _index = _selectedRowKeys.value.findIndex((i) => i === dt.id);
    _selectedRowKeys.value.splice(_index, 1);
  } else {
    _selectedRowKeys.value = [..._selectedRowKeys.value, dt.id];
  }
};
/**
 * 取消选择事件
 */
const onSelectChange = () => {
  _selectedRowKeys.value = [];
};

const handleSearch = (e) => {
  params.value = e
};
const emit = defineEmits(["close", "save"]);
/**
 * 保存选中关联场景
 */
const saveCorrelation = async () => {
  if (_selectedRowKeys.value.length > 0) {
    const scene = _selectedRowKeys.value.map((i) => {
      return { id: i };
    });
    _execute(scene).then((res) => {
      if (res.status === 200) {
        onlyMessage($t('HandTrigger.index.0214513-11'));
        emit("save");
      } else {
        onlyMessage($t('HandTrigger.index.0214513-12'), "error");
      }
    });
  } else {
    onlyMessage($t('HandTrigger.index.0214513-13'), "error");
  }
};
const closeModal = () => {
  emit("close");
};
const { data: activeKeys } = useRequest(queryBindScene, {
  defaultParams: { terms: [{ column: "alarmId", value: props.data?.id }] },
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
</script>
<style lang="less" scoped>
.subTitle {
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
  margin-top: 10px;
}
</style>
