<template>
  <a-drawer
    :open="true"
    width="1000"
    :destroyInactiveTabPane="true"
    @close="closeDrawer"
  >
    <template #title>
      <div class="alarmInfo">
        <div>
          <div class="alarmTitle">
            <span class="alarmType">{{
              typeMap.get(AlarmData?.targetType)
            }}</span>
            <div>
              <j-ellipsis style="max-width: 200px">{{
                AlarmData?.alarmName
              }}</j-ellipsis>
            </div>
            <LevelIcon :level="AlarmData.level"></LevelIcon>
          </div>
<!--          <div-->
<!--            style="-->
<!--              font-size: 12px;-->
<!--              margin-left: 10px;-->
<!--              margin-top: 5px;-->
<!--            "-->
<!--          >-->
<!--            {{ AlarmData?.description || $t('components.DetailDrawer.488913-0') }}-->
<!--          </div>-->
        </div>
        <div class="alarmInfoRight">
          <div>
            <JBadgeStatus
              :status="AlarmData?.state.value"
              :statusNames="{
                warning: 'error',
                normal: 'default',
              }"
            >
            </JBadgeStatus
            ><span>
              {{ AlarmData?.state.text }}
            </span>
            <j-permission-button
              v-if="AlarmData?.state.value === 'warning'"
              hasPermission="rule-engine/Alarm/Log:action"
              type="link"
              @click="dealAlarm"
              >{{ $t('components.DetailDrawer.488913-1') }}</j-permission-button
            >
          </div>
        </div>
      </div>
    </template>

    <a-radio-group
      v-model:value="activeKey"
      button-style="solid"
      style="margin-bottom: 20px"
    >
      <a-radio-button value="record">{{ $t('components.DetailDrawer.488913-2') }}</a-radio-button>
      <a-radio-button value="logs">{{ $t('components.DetailDrawer.488913-3') }}</a-radio-button>
    </a-radio-group>
    <Record
      v-if="activeKey === 'record'"
      :currentId="AlarmData.id"
      ref="RecordRef"
    ></Record>
    <Log
      v-else
      :currentId="AlarmData.id"
      :configId="AlarmData.alarmConfigId"
    />
  </a-drawer>
  <SolveComponent
    v-if="solveVisible"
    @closeSolve="closeSolve"
    @refresh="refresh"
    :data="AlarmData"
  />
</template>

<script setup name="LogDrawer">
import { query } from "@rule-engine-manager-ui/api/log";
import Record from "./Record.vue";
import Log from "./Log.vue";
import SolveComponent from "../../SolveComponent/index.vue";
import LevelIcon from "@rule-engine-manager-ui/components/AlarmLevelIcon/index.vue";
import { useI18n } from 'vue-i18n'

const { t: $t } = useI18n()
const props = defineProps({
  logData: {
    type: Object,
    default: {},
  },
  typeMap: {
    type: Object,
    default: {},
  },
  levelMap: {
    type: Object,
    default: {},
  },
});
const emit = defineEmits(["closeDrawer", "refreshTable"]);
const solveVisible = ref(false);
const RecordRef = ref();
const AlarmData = ref(props.logData);
const activeKey = ref("record");
const closeDrawer = () => {
  emit("closeDrawer");
};
const dealAlarm = () => {
  solveVisible.value = true;
};
const closeSolve = () => {
  solveVisible.value = false;
};

const refresh = async () => {
  solveVisible.value = false;
  const res = await query({
    terms: [
      {
        column: "id",
        value: props.logData.id,
        type: "and",
      },
    ],
  });
  if (res.success) {
    AlarmData.value = res.result.data[0];
    if (activeKey.value === "record") {
      RecordRef?.value.refreshRecord();
    }
  }
  emit("refreshTable");
};
</script>
<style lang="less" scoped>
.alarmInfo {
  display: flex;
  justify-content: space-between;
  .alarmType {
    background-color: #e6f4ff;
    padding: 2px 8px;
    margin-right: 10px;
    color: #1677ff;
  }
  .alarmTitle {
    display: flex;
  }
  .alarmInfoRight {
    text-align: right;
  }
}
</style>
