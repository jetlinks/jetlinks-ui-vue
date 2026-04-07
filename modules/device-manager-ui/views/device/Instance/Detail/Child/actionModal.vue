<template>
  <a-modal open :title="title" width="600px" @cancel="emits('close')">
    <template v-if="result.length === 0 && !loading">
      <div style="margin-bottom: 12px">
        {{ batch ? typeMap.get(type).batchLabel : typeMap.get(type).label }}
      </div>

      <a-form v-if="isMap" layout="vertical" :model="form" ref="formRef">
        <a-form-item
          name="way"
          :rules="{ required: true, message: $t('Child.actionModal.664579-0') }"
        >
          <template #label>
            {{ title }}{{ $t("Child.actionModal.664579-1") }}
          </template>
          <j-card-select
            :showImage="false"
            v-model:value="form.way"
            :column="2"
            :options="options"
          >
            <!-- <template #image="{ image }">
                            <img :src="image" />
                        </template> -->
          </j-card-select>
        </a-form-item>
      </a-form>
    </template>
    <div v-else-if="loading">
      <div class="loading">
        <a-spin />
        {{ title }}{{ $t("Child.actionModal.664579-2") }}
      </div>
    </div>
    <template v-else>
      <div class="result">
        <div class="result-header">
          <img :src="diagnose.Success" alt="" />
          <div>{{ title }}{{ $t("Child.actionModal.664579-3") }}</div>
        </div>
        <a-space :size="24">
          <div>{{ $t("Child.actionModal.664579-4") }}</div>
          <div>
            {{ title }}{{ $t("Child.actionModal.664579-5")
            }}{{ cloud.successCount }} {{ $t("Child.actionModal.664579-6") }}
          </div>
          <div style="width: 200px">
            <span>
              {{ title }}{{ $t("Child.actionModal.664579-7")
              }}{{ cloud.errorMessage.length }}
              {{ $t("Child.actionModal.664579-6") }}</span
            >
            <span style="width: 50px">
              <a-tooltip v-if="cloud.errorMessage.length">
                <template #title>
                  <div v-for="item in cloud.errorMessage">
                    <div>{{ item }}</div>
                  </div>
                </template>
                <AIcon
                  type="ExclamationCircleOutlined"
                  style="color: red; font-size: 16px; margin-left: 12px"
                />
              </a-tooltip>
            </span>
          </div>
        </a-space>
        <a-space v-if="form.way === 'edge'" :size="24" style="margin-top: 6px">
          <div>{{ $t("Child.actionModal.664579-8") }}</div>
          <div>
            {{ title }}{{ $t("Child.actionModal.664579-5")
            }}{{ edge.successCount }} {{ $t("Child.actionModal.664579-6") }}
          </div>
          <div style="width: 200px">
            <span>
              {{ title }}{{ $t("Child.actionModal.664579-7")
              }}{{ edge.errorMessage.length }}
              {{ $t("Child.actionModal.664579-6") }}</span
            >
            <span style="width: 50px">
              <a-tooltip v-if="edge.errorMessage.length">
                <template #title>
                  <div v-for="item in edge.errorMessage">
                    <div>{{ item }}</div>
                  </div>
                </template>
                <AIcon
                  type="ExclamationCircleOutlined"
                  style="color: red; font-size: 16px; margin-left: 12px"
                />
              </a-tooltip>
            </span>
          </div>
        </a-space>
      </div>
    </template>

    <template #footer>
      <a-space v-if="result.length === 0">
        <a-button @click="emits('close')">{{
          $t("Child.actionModal.664579-9")
        }}</a-button>
        <a-button type="primary" :loading="loading" @click="onSave">{{
          title
        }}</a-button>
      </a-space>
      <a-button v-else type="primary" @click="emits('close')">{{
        $t("Child.actionModal.664579-3")
      }}</a-button>
    </template>
  </a-modal>
</template>

<script setup name="Save">
import {
  _undeployCloud,
  _deployCloud,
  _unbindCloud,
  _deleteCloud,
  _deploy,
  _undeploy,
} from "../../../../../api/instance";
import { useInstanceStore } from "../../../../../store/instance";
import { onlyMessage } from "@jetlinks-web/utils";
import { diagnose } from "../../../../../assets";
import { useI18n } from "vue-i18n";

const { t: $t } = useI18n();

const emits = defineEmits(["close"]);
const props = defineProps({
  type: {
    type: String,
    default: "unbind",
  },

  rows: {
    type: Array,
    default: [],
  },
  batch: {
    type: Boolean,
    default: false,
  },
  isMap: {
    type: Boolean,
    default: false,
  },
});
const instanceStore = useInstanceStore();
const typeMap = new Map();
typeMap.set("unbind", {
  title: $t("Child.actionModal.664579-10"),
  label: $t("Child.actionModal.664579-11"),
  batchLabel: $t("Child.actionModal.664579-12"),
});
typeMap.set("undeploy", {
  title: $t("Child.actionModal.664579-13"),
  label: $t("Child.actionModal.664579-14"),
  batchLabel: $t("Child.actionModal.664579-15"),
});
typeMap.set("deploy", {
  title: $t("Child.actionModal.664579-16"),
  label: $t("Child.actionModal.664579-17"),
  batchLabel: $t("Child.actionModal.664579-18"),
});
typeMap.set("delete", {
  title: $t("Child.actionModal.664579-19"),
  label: $t("Child.actionModal.664579-20"),
  batchLabel: $t("Child.actionModal.664579-21"),
});

const title = computed(() =>
  props.batch
    ? $t("Child.actionModal.664579-22", [typeMap.get(props.type).title])
    : typeMap.get(props.type).title,
);

const options = computed(() => [
  {
    label: $t("Child.actionModal.664579-23", [title.value]),
    value: "cloud",
  },
  {
    label: $t("Child.actionModal.664579-24", [title.value]),
    value: "edge",
  },
]);

const isMap = computed(() => {
  return props.isMap;
});

const edgeId = instanceStore.detail.id;
const form = reactive({
  way: "cloud",
});
const formRef = ref();
const result = ref([]);
const loading = ref(false);
const cloud = reactive({
  successCount: 0,
  errorMessage: [],
});
const edge = reactive({
  successCount: 0,
  errorMessage: [],
});

const handleResult = (arr) => {
  arr.forEach((item) => {
    if (item.type === "cloud") {
      if (item.success) {
        cloud.successCount = item.successCount;
      } else {
        cloud.errorMessage.push(item.errorMessage);
      }
    } else {
      if (item.success) {
        edge.successCount = item.successCount;
      } else {
        edge.errorMessage.push(item.errorMessage);
      }
    }
  });
};

const _unbind = async () => {
  const res = await _unbindCloud(edgeId, props.rows).finally(() => {
    loading.value = false;
  });
  if (res.success) {
    if (props.batch) {
      result.value = res.result;
      handleResult(res.result);
    } else {
      onlyMessage($t("Child.actionModal.664579-25"));
      emits("close");
    }
  }
};

const onUndeploy = async () => {
  const res =
    form.way === "cloud"
      ? props.batch
        ? await _undeployCloud(edgeId, props.rows, {
            syncEdge: false,
          }).finally(() => {
            loading.value = false;
          })
        : await _undeploy(props.rows?.[0]).finally(() => {
            loading.value = false;
          })
      : await _undeployCloud(edgeId, props.rows).finally(() => {
          loading.value = false;
        });
  if (res.success) {
    if (props.batch) {
      result.value = res.result;
      handleResult(res.result);
    } else {
      onlyMessage($t("Child.actionModal.664579-25"));
      emits("close");
    }
  }
};
const onDelete = async () => {
  const res =
    form.way === "cloud"
      ? // ? props.batch
        //     ? await _deleteCloud(edgeId, props.rows, {
        //           syncEdge: false,
        //       }).finally(() => {
        //           loading.value = false;
        //       })
        //     : await _delete(props.rows?.[0]).finally(() => {
        //           loading.value = false;
        //       })
        await _deleteCloud(edgeId, props.rows, {
          syncEdge: false,
        }).finally(() => {
          loading.value = false;
        })
      : await _deleteCloud(edgeId, props.rows).finally(() => {
          loading.value = false;
        });
  if (res.success) {
    if (props.batch) {
      result.value = res.result;
      handleResult(res.result);
    } else {
      onlyMessage($t("Child.actionModal.664579-25"));
      emits("close");
    }
  }
};

const onDeploy = async () => {
  const res =
    form.way === "cloud"
      ? props.batch
        ? await _deployCloud(edgeId, props.rows, {
            syncEdge: false,
          }).finally(() => {
            loading.value = false;
          })
        : await _deploy(props.rows?.[0]).finally(() => {
            loading.value = false;
          })
      : await _deployCloud(edgeId, props.rows).finally(() => {
          loading.value = false;
        });
  if (res.success) {
    if (props.batch) {
      result.value = res.result;
      handleResult(res.result);
    } else {
      onlyMessage($t("Child.actionModal.664579-25"));
      emits("close");
    }
  }
};

const onSave = async () => {
  loading.value = true;
  if (props.type === "unbind") {
    _unbind();
  } else if (props.type === "undeploy") {
    onUndeploy();
  } else if (props.type === "deploy") {
    onDeploy();
  } else {
    onDelete();
  }
};

watch(
  () => form.way,
  () => {
    console.log("form.way====", form.way);
  },
);
</script>

<style lang="less" scoped>
.result {
  display: flex;
  flex-direction: column;
  align-items: center;
  .result-header {
    margin-bottom: 12px;
  }
}
.loading {
  height: 100px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
