<template>
  <div>
    <a-steps :current="stepCurrent">
      <a-step disabled v-for="item in steps" :key="item" :title="item" />
    </a-steps>
    <div class="steps-content">
      <div class="steps-box" v-if="current === 0">
        <div class="alert">
          <AIcon type="InfoCircleOutlined" />
          {{ $t("Network.index.041705-0") }}
        </div>
        <div class="search">
          <a-input-search
            allowClear
            :placeholder="$t('Network.index.041705-1')"
            style="width: 300px"
            @search="networkSearch"
          />
          <j-permission-button
            type="primary"
            @click="addNetwork"
            hasPermission="link/Type:add"
          >
            <template #icon><AIcon type="PlusOutlined" /></template>
            {{ $t("Network.index.041705-2") }}
          </j-permission-button>
        </div>
        <j-scrollbar height="480">
          <a-row
            :gutter="[24, 24]"
            style="width: 100%"
            v-if="networkList.length > 0"
          >
            <a-col :span="8" v-for="item in networkList" :key="item.id">
              <AccessCard
                @checkedChange="checkedChange"
                :checked="networkCurrent"
                :data="{
                  ...item,
                  description: item.description
                    ? item.description
                    : descriptionList[provider.id],
                  type: 'network',
                }"
              >
                <template #other>
                  <div class="other">
                    <a-tooltip
                      placement="top"
                      :title="addressesTip(item.addresses)"
                    >
                      <div
                        v-for="i in (item.addresses || []).slice(0, 1)"
                        :key="i.address"
                        class="item"
                      >
                        <a-badge :status="getColor(i)" :text="i.address" />
                        <span v-if="(item.addresses || []).length > 1"
                          >{{ $t("Network.index.041705-3")
                          }}{{ item.addresses.length
                          }}{{ $t("Network.index.041705-4") }}</span
                        >
                      </div>
                    </a-tooltip>
                  </div>
                </template>
              </AccessCard>
            </a-col>
          </a-row>
          <j-empty
            style="margin-top: 10%"
            v-else
            :description="$t('Network.index.041705-5')"
          />
        </j-scrollbar>
      </div>
      <div class="steps-box" v-else-if="current === 1">
        <div class="alert">
          <AIcon type="InfoCircleOutlined" />
          {{ $t("Network.index.041705-6") }}
        </div>
        <div class="search">
          <a-input-search
            allowClear
            :placeholder="$t('Network.index.041705-1')"
            style="width: 300px"
            @search="procotolSearch"
          />
          <j-permission-button
            v-if="showAddBtn"
            type="primary"
            @click="addProcotol"
            hasPermission="link/Protocol:add"
            :disabled="id !== ':id'"
          >
            <template #icon><AIcon type="PlusOutlined" /></template>
            {{ $t("Network.index.041705-2") }}
          </j-permission-button>
        </div>
        <j-scrollbar height="480">
          <a-row
            :gutter="[24, 24]"
            style="width: 100%"
            v-if="procotolList.length > 0"
          >
            <a-col :span="8" v-for="item in procotolList" :key="item?.id">
              <AccessCard
                @checkedChange="procotolChange"
                :checked="procotolCurrent"
                :disabled="!showAddBtn || id !== ':id'"
                :data="{ ...item, type: 'protocol' }"
              >
              </AccessCard>
            </a-col>
          </a-row>
          <j-empty
            style="margin-top: 10%"
            v-else
            :description="$t('Network.index.041705-5')"
          />
        </j-scrollbar>
      </div>
      <div class="steps-box" v-else>
        <div
          class="card-last"
          :style="`max-height:${
            clientHeight > 900 ? 750 : clientHeight * 0.7
          }px`"
        >
          <a-row :gutter="[24, 24]">
            <a-col :span="12">
              <title-component :data="$t('Network.index.041705-7')" />
              <a-form ref="formRef" :model="formData" layout="vertical">
                <a-form-item
                  :label="$t('Network.index.041705-8')"
                  v-bind="validateInfos.name"
                >
                  <a-input
                    v-model:value="formData.name"
                    allowClear
                    :placeholder="$t('Network.index.041705-9')"
                  />
                </a-form-item>
                <a-form-item
                  :label="$t('Network.index.041705-10')"
                  v-bind="validateInfos.description"
                >
                  <a-textarea
                    :placeholder="$t('Network.index.041705-11')"
                    :rows="4"
                    v-model:value="formData.description"
                    show-count
                    :maxlength="200"
                  />
                </a-form-item>
              </a-form>
            </a-col>
            <a-col :span="12">
              <div style="height: 60vh; overflow: auto">
                <div>
                  <h1>{{ $t("Network.index.041705-12") }}</h1>
                  <p>
                    {{ provider.name }}
                  </p>
                  <p>
                    {{ provider.description }}
                  </p>
                  <div v-if="getNetworkCurrent.length">
                    <h1>{{ $t("Network.index.041705-13") }}</h1>
                    <p v-for="i in getNetworkCurrent" :key="i.address">
                      <a-badge :status="getColor(i)" :text="i.address" />
                    </p>
                  </div>
                  <template v-if="!isAgent">
                    <h1>{{ $t("Network.index.041705-14") }}</h1>
                    <p>
                      {{
                        procotolList.find((i: any) => i.id === procotolCurrent)
                          .name
                      }}
                    </p>
                    <p v-if="config.document">
                      <JMarkdown :source="config.document" />
                    </p>
                    <div v-if="config.routes && config.routes.length > 0">
                      <h1>
                        {{
                          data.provider === "mqtt-server-gateway" ||
                          data.provider === "mqtt-client-gateway"
                            ? "topic"
                            : $t("Network.index.041705-15")
                        }}
                      </h1>
                      <a-table
                        :pagination="false"
                        :rowKey="generateUUID()"
                        :data-source="config.routes || []"
                        bordered
                        :columns="
                          config.id === 'MQTT' ? columnsMQTT : columnsHTTP
                        "
                      >
                        <template #bodyCell="{ column, text, record }">
                          <template v-if="column.dataIndex === 'stream'">
                            {{ getStream(record) }}
                          </template>
                        </template>
                      </a-table>
                    </div>
                  </template>
                </div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
    <div class="steps-action">
      <a-button
        v-if="type === 'child-device' ? current > 1 : current > 0"
        style="margin-right: 8px"
        @click="prev"
      >
        {{ $t("Network.index.041705-16") }}
      </a-button>
      <j-permission-button
        v-if="current === 2 && view === 'false'"
        type="primary"
        style="margin-right: 8px"
        @click="saveData"
        :hasPermission="`link/AccessConfig:${id === ':id' ? 'add' : 'update'}`"
        :loading="loading"
      >
        {{ $t("Network.index.041705-17") }}
      </j-permission-button>
      <a-button v-if="[0, 1].includes(current)" type="primary" @click="next">
        {{ $t("Network.index.041705-18") }}
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup name="AccessNetwork">
import {
  getNetworkList,
  getProtocolList,
  getConfigView,
  save,
  update,
  getChildConfigView,
  getNetworkComponentList
} from "../../../../../api/link/accessConfig";
import {
  descriptionList,
  NetworkTypeMapping,
  ProtocolMapping,
  ColumnsMQTT,
  ColumnsHTTP,
} from "../../data";
import AccessCard from "../AccessCard/index.vue";
import { Form } from "ant-design-vue";
import type { FormInstance, TableColumnType } from "ant-design-vue";
import { useMenuStore } from "@jetlinks-web-core/store/menu";
import { onlyMessage, randomString } from "@jetlinks-web/utils";
import { useI18n } from "vue-i18n";
import { useTabSaveSuccess, useTabSaveSuccessBack } from '@jetlinks-web-core/hooks'

const { t: $t } = useI18n();
const menuStory = useMenuStore();
function generateUUID() {
  let d = new Date().getTime();
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const props = defineProps({
  provider: {
    type: Object,
    default: () => {},
  },
  data: {
    type: Object,
    default: () => {},
  },
  bindProduct: {
    type: Boolean,
    default: false,
  },
});

const clientHeight = document.body.clientHeight;
const type = props.provider.channel;
const route = useRoute();
const view = route.query.view as string;
const id = route.params.id as string;

const formRef = ref<FormInstance>();
const useForm = Form.useForm;
const isAgent = ["agent-device-gateway", "agent-media-device-gateway"].includes(
  props.provider.id,
);

const current = ref(0);
const stepCurrent = ref(0);
// const steps = computed(() => {
//     return !isAgent ? [$t('Network.index.041705-13'), $t('Network.index.041705-14'), $t('Network.index.041705-19')] : [$t('Network.index.041705-13'), $t('Network.index.041705-19')];
// });
const steps = ref();
const networkList: any = ref([]);
const allNetworkList: any = ref([]);
const procotolList: any = ref([]);
const allProcotolList = ref([]);
const networkCurrent: any = ref("");
const procotolCurrent: any = ref("");
const config: any = ref({});
const columnsMQTT = ref(<TableColumnType>[]);
const columnsHTTP = ref(<TableColumnType>[]);
const formData = ref({
  name: "",
  description: "",
});
const loading = ref(false);

const { onOpen: onTypeOpen } = useTabSaveSuccess('link/Type/Detail', {
  onSuccess(value) {
    if (value.success) {
      networkCurrent.value = value.result.id;
      queryNetworkList(props.provider?.id, networkCurrent.value || "");
    }
  }
})

const { onOpen: onProtocolOpen } = useTabSaveSuccess('link/Protocol', {
  onSuccess(value) {
    if (value.success) {
      procotolCurrent.value = value.result?.id;
      queryProcotolList(props.provider?.id);
    }
  }
})

const { resetFields, validate, validateInfos } = useForm(
  formData,
  reactive({
    name: [
      {
        required: true,
        message: $t("Network.index.041705-9"),
        trigger: "blur",
      },
      {
        max: 64,
        message: $t("Network.index.041705-20"),
        trigger: "blur",
      },
    ],
    description: [{ max: 200, message: $t("Network.index.041705-21") }],
  }),
);

const { onBack } = useTabSaveSuccessBack()

const showAddBtn = computed(() => {
  return route.query.view === "false" && !props.bindProduct;
});

const queryNetworkList = async (id: string, include: string, data = {}) => {
  const resp = NetworkTypeMapping.get(id) instanceof Array ? await getNetworkComponentList({
    networkTypes: NetworkTypeMapping.get(id),
  }, include) : await getNetworkList(NetworkTypeMapping.get(id), include, data);
  if (resp.status === 200) {
    networkList.value = resp.result;
    allNetworkList.value = resp.result;
  }
};

const queryProcotolList = async (id: string, params = {}) => {
  const resp: any = await getProtocolList(ProtocolMapping.get(id), {
    ...params,
    "sorts[0].name": "createTime",
    "sorts[0].order": "desc",
  });
  if (resp.status === 200) {
    procotolList.value = resp.result;
    allProcotolList.value = resp.result;
  }
};

const addNetwork = () => {
  onTypeOpen({
    type: NetworkTypeMapping.get(props.provider?.id) || "",
  })
};

const addProcotol = () => {
  onProtocolOpen({
    save: true
  })
};

const getNetworkCurrent = computed(() => {
  return (
    (networkList.value.find((i: any) => i.id === networkCurrent.value) &&
      networkList.value.find((i: any) => i.id === networkCurrent.value)
        ?.addresses) ||
    []
  );
});

const getColor = (i: any) => (i.health === -1 ? "error" : "processing");

const getStream = (record: any) => {
  let stream = "";
  if (record.upstream && record.downstream)
    stream = $t("Network.index.041705-22");
  else if (record.upstream) stream = $t("Network.index.041705-23");
  else if (record.downstream) stream = $t("Network.index.041705-24");
  return stream;
};

const checkedChange = (id: string) => {
  networkCurrent.value = id;
};

const networkSearch = (value: string) => {
  networkList.value = value
    ? allNetworkList.value.filter(
        (i: any) =>
          i.name &&
          i.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
      )
    : allNetworkList.value;
};
const procotolChange = (id: string) => {
  if (!props.data.id) {
    procotolCurrent.value = id;
  }
};

const procotolSearch = (value: string) => {
  procotolList.value = value
    ? allProcotolList.value.filter(
        (i: any) =>
          i.name &&
          i.name.toLocaleLowerCase().includes(value.toLocaleLowerCase()),
      )
    : allProcotolList.value;
};

const transport = computed(() => {
  if (props.provider?.id === "child-device") {
    return "Gateway";
  }
  if (['agent-device-gateway', 'agent-media-device-gateway'].includes(props.provider?.id)) {
    const network = allNetworkList.value.find((i: any) => i.id === networkCurrent.value);
    if(network?.type === 'HTTP_SERVER') {
      return 'HTTP';
    } else if(network?.type === 'MQTT_SERVER') {
      return 'MQTT';
    }
  }
  return ProtocolMapping.get(props.provider.id);
});

const saveData = () => {
  validate()
    .then(async (values) => {
      const params = {
        ...props.data,
        ...values,
        protocol: procotolCurrent.value,
        channel: "network", // 网络组件
        channelId: networkCurrent.value,
        provider: props.provider.id,
        transport: transport.value,
      };
      if(route.query.provider ) {
        onBack({
          ...params,
          channelInfo: networkList.value.find((i: any) => i.id === networkCurrent.value),
          protocolDetail: procotolList.value.find((i: any) => i.id === procotolCurrent.value),
        })
        return
      }
      loading.value = true;
      const resp =
        id === ":id" ? await save(params) : await update({ ...params, id });
      loading.value = false;
      if (resp.status === 200) {
        onlyMessage($t("Network.index.041705-25"), "success");
        history.back();
        onBack(resp)
      }
    })
    .catch((err) => {});
};

const next = async () => {
  if (current.value === 0) {
    if (!networkCurrent.value) {
      onlyMessage($t("Network.index.041705-26"), "error");
    } else if (isAgent) {
      current.value = 2;
      procotolCurrent.value = props.provider.id;
    } else {
      queryProcotolList(props.provider.id);
      current.value = current.value + 1;
    }
  } else if (current.value === 1) {
    if (!procotolCurrent.value) {
      onlyMessage($t("Network.index.041705-27"), "error");
    } else {
      const resp =
        type !== "child-device"
          ? await getConfigView(
              procotolCurrent.value,
              ProtocolMapping.get(props.provider.id),
            )
          : await getChildConfigView(procotolCurrent.value);
      if (resp.status === 200) {
        config.value = resp.result || {};
        current.value = current.value + 1;
        const Group = {
          title: $t("Network.index.041705-28"),
          dataIndex: "group",
          key: "group",
          ellipsis: true,
          align: "center",
          width: 100,
          customCell: (record: any, rowIndex: number) => {
            const obj = {
              children: record,
              rowSpan: 0,
            };
            const list = config.value?.routes || [];
            const arr = list.filter((res: any) => res.group === record.group);

            const isRowIndex =
              rowIndex === 0 || list[rowIndex - 1].group !== record.group;
            isRowIndex && (obj.rowSpan = arr.length);
            return obj;
          },
        };
        columnsMQTT.value = [Group, ...ColumnsMQTT] as TableColumnType;
        columnsHTTP.value = [Group, ...ColumnsHTTP] as TableColumnType;
      }
    }
  }
};

const prev = () => {
  if (isAgent) {
    current.value = 0;
  } else {
    current.value = current.value - 1;
  }
};

onMounted(() => {
  if (props.data && props.data.id) {
    if (
      ["agent-device-gateway", "agent-media-device-gateway"].includes(
        props.data.provider,
      )
    ) {
      steps.value = [
        $t("Network.index.041705-13"),
        $t("Network.index.041705-19"),
      ];
      current.value = 0;
      networkCurrent.value = props.data.channelId;
      queryNetworkList(props.provider.id, networkCurrent.value);
    } else if (props.data.provider !== "child-device") {
      procotolCurrent.value = props.data.protocol;
      current.value = 0;
      networkCurrent.value = props.data.channelId;
      queryNetworkList(props.provider.id, networkCurrent.value);
      procotolCurrent.value = props.data.protocol;
      steps.value = [
        $t("Network.index.041705-13"),
        $t("Network.index.041705-14"),
        $t("Network.index.041705-19"),
      ];
    } else {
      steps.value = [
        $t("Network.index.041705-14"),
        $t("Network.index.041705-19"),
      ];
      current.value = 1;
      queryProcotolList(props.provider.id);
    }
  } else {
    if (props.provider?.id) {
      if (
        // console.log('props.provider====',props.provider)
        ["agent-device-gateway", "agent-media-device-gateway"].includes(
          props.provider.id,
        )
      ) {
        queryNetworkList(props.provider.id, "");
        steps.value = [
          $t("Network.index.041705-13"),
          $t("Network.index.041705-19"),
        ];
        current.value = 0;
      } else if (type !== "child-device") {
        queryNetworkList(props.provider.id, "");
        steps.value = [
          $t("Network.index.041705-13"),
          $t("Network.index.041705-14"),
          $t("Network.index.041705-19"),
        ];
        current.value = 0;
      } else {
        steps.value = [
          $t("Network.index.041705-14"),
          $t("Network.index.041705-19"),
        ];
        current.value = 1;
        queryProcotolList(props.provider.id);
      }
    }
  }
});

onMounted(() => {
  if (id !== ":id") {
    procotolCurrent.value = props.data.protocol;
    formData.value = {
      name: props.data.name,
      description: props.data.description,
    };
  }
});

watch(
  current,
  (v) => {
    stepCurrent.value = type === "child-device" ? v - 1 : v;
  },
  {
    deep: true,
    immediate: true,
  },
);

const addressesTip = (data: any) => {
  let tip: any = "";
  data.forEach((item: any) => {
    tip = tip + " " + item.address;
  });
  return tip;
};
</script>

<style lang="less" scoped>
.steps-content {
  margin-top: 20px;
}
.steps-box {
  min-height: 400px;
  .card-last {
    padding-right: 5px;
    overflow-y: auto;
    overflow-x: hidden;
  }
}
.steps-action {
  width: 100%;
  margin-top: 24px;
}
.alert {
  height: 40px;
  padding-left: 10px;
  color: rgba(0, 0, 0, 0.55);
  line-height: 40px;
  background-color: #f6f6f6;
}
.search {
  display: flex;
  margin: 15px 0;
  justify-content: space-between;
}

.other {
  width: 100%;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  .item {
    width: 100%;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
}
</style>
