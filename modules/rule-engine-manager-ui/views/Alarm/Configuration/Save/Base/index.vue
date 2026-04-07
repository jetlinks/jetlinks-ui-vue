<template>
  <FullPage>
    <div>
      <a-form layout="vertical" :rules="rule" :model="form" ref="formRef">
        <a-row :gutter="24">
          <a-col :span="12">
            <a-form-item :label="$t('Base.index.021452-0')" name="name">
              <a-input
                :placeholder="$t('Base.index.021452-1')"
                v-model:value="form.name"
              ></a-input> </a-form-item
          ></a-col>
          <a-col :span="12">
            <a-form-item name="targetType">
              <template #label>
                <a-space>
                  {{ $t("Base.index.021452-2") }}
                  <a-tooltip>
                    <template #title>
                      <div>
                        {{ $t("Base.index.021452-3") }}
                      </div>
                      <div>
                        {{ $t("Base.index.021452-4") }}
                      </div>
                      <div v-if="isNoCommunity">
                        {{ $t("Base.index.021452-5") }}
                      </div>
                      <div>
                        {{ $t("Base.index.021452-6") }}
                      </div>
                      <div v-if="isNoCommunity">
                        {{ $t("Base.index.021452-15") }}
                      </div>
                    </template>
                    <AIcon
                      type="QuestionCircleOutlined"
                      style="color: rgb(136, 136, 136); font-size: 12px"
                    />
                  </a-tooltip>
                </a-space>
              </template>
              <a-select
                :options="options"
                v-model:value="form.targetType"
                :disabled="selectDisable"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-form-item :label="$t('Base.index.021452-7')" name="level">
          <a-radio-group v-model:value="form.level" class="levelSelect">
            <a-radio-button
              v-for="(item, index) in levelOption"
              :key="index"
              :value="item.value"
            >
              <j-ellipsis
                style="
                  text-align: center;
                  margin-top: 10px;
                  font-size: 15px;
                  width: 90%;
                "
              >
                <img
                  :src="configImages.alarm[index]"
                  style="height: 40px"
                  alt=""
                />{{ item.label }}
              </j-ellipsis>
            </a-radio-button>
          </a-radio-group>
        </a-form-item>
        <a-form-item :label="$t('Base.index.021452-8')" name="description">
          <a-textarea
            v-model:value="form.description"
            showCount
            :maxlength="200"
          ></a-textarea>
        </a-form-item>
        <j-permission-button
          type="primary"
          v-if="!route.query?.id"
          :loading="loading"
          @click="handleSave"
          :hasPermission="`${permissionKey}:add`"
          >{{ $t("Base.index.021452-9") }}</j-permission-button
        >
        <j-permission-button
          type="primary"
          v-else
          :loading="loading"
          @click="handleSave"
          :hasPermission="`${permissionKey}:update`"
          >{{ $t("Base.index.021452-9") }}</j-permission-button
        >
      </a-form>
    </div>
  </FullPage>
</template>

<script lang="ts" setup>
import {
  save,
  detail,
  update,
} from "@rule-engine-manager-ui/api/configuration";
import { queryLevel } from "@rule-engine-manager-ui/api/config";
import { query } from "@rule-engine-manager-ui/api/scene";
import { onlyMessage } from "@jetlinks-web/utils";
import { useMenuStore } from "@jetlinks-web-core/store/menu";
import { useRoute } from "vue-router";
import { useAlarmConfigurationStore } from "@rule-engine-manager-ui/store/alarm";
import { storeToRefs } from "pinia";
import { configImages } from "@rule-engine-manager-ui/assets";
import { isNoCommunity } from "@jetlinks-web-core/utils/utils";
import { useI18n } from "vue-i18n";
import { useAlarmConfigType } from "@rule-engine-manager-ui/hook/useAlarmConfigType";
import { cloneDeep } from "lodash-es";

const { t: $t } = useI18n();
const route = useRoute();
let selectDisable = ref(false);
const alarmConfigurationStore = useAlarmConfigurationStore();
let { configurationData } = storeToRefs(alarmConfigurationStore);

const permissionKey = inject('alarmConfigurationPermissionKey', 'rule-engine/Alarm/Configuration')


const emit = defineEmits(["change"]);

const queryData = () => {
  if (route.query?.id) {
    detail(route.query?.id).then((res) => {
      if (res.status === 200) {
        emit("change", res?.result?.targetType);
        form.value = cloneDeep(res?.result);
        configurationData.value.current = res.result;
        query({
          terms: [
            {
              terms: [
                {
                  column: "id",
                  termType: "alarm-bind-rule",
                  value: route.query?.id,
                },
              ],
              type: "and",
            },
          ],
          sorts: [
            {
              name: "createTime",
              order: "desc",
            },
          ],
        }).then((resq) => {
          if (resq.status === 200) {
            selectDisable.value = !!resq.result.data?.length;
          }
        });
      }
    });
  }
};
const rule = {
  name: [
    {
      required: true,
      message: $t("Base.index.021452-1"),
    },
    {
      max: 64,
      message: $t("Base.index.021452-10"),
    },
  ],
  targetType: [
    {
      required: true,
      message: $t("Base.index.021452-11"),
    },
  ],
  level: [
    {
      required: true,
      message: $t("Base.index.021452-12"),
    },
  ],
  description: [
    {
      max: 200,
      message: $t("Base.index.021452-13"),
    },
  ],
};
let form = ref({
  level: "",
  targetType: "",
  name: "",
  description: "",
});
const { supports: options } = useAlarmConfigType(['networkCardPool']);
let levelOption = ref();
let loading = ref(false);
const formRef = ref();
const menuStory = useMenuStore();
const getLevel = () => {
  queryLevel().then((res) => {
    if (res.status === 200) {
      levelOption.value = res.result?.levels
        ?.filter((i: any) => i?.level && i?.title)
        .map((item: { level: number; title: string }) => ({
          label: item.title,
          value: item.level,
        }));
    }
  });
};
getLevel();
const handleSave = async () => {
  loading.value = true;
  formRef.value
    .validate()
    .then(async () => {
      const res = route.query?.id
        ? await update(form.value)
        : await save(form.value);
      if (res.status === 200) {
        onlyMessage($t("Base.index.021452-14"));
        loading.value = false;
        emit("change", form.value.targetType);
        if (res.result?.id) {
          menuStory.jumpPage("rule-engine/Alarm/Configuration/Save", {
            query: { id: res.result?.id },
          });
        }
        configurationData.value.current = cloneDeep(form.value);
      }
    })
    .catch((error) => {
      loading.value = false;
      console.log(error);
    });
};
queryData();
watch(
  () => route.query?.id,
  () => {
    queryData();
  }
);

defineExpose({
  data: () => form.value
})
</script>
<style lang="less" scoped>
.ant-radio-button-wrapper {
  margin: 10px 15px 0 0;
  width: 20%;
  height: 100%;
}
.levelSelect {
  display: flex;
  width: 100%;
}
</style>
